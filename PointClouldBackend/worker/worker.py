import os
import asyncio
import datetime
from pathlib import Path

import shutil
import subprocess

import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")
DB_NAME = "pointcloud"

DATA_ROOT = Path("/data/jobs")

PIPELINE_ROOT = Path("/app/PointCloudV1")

VIDEOS_DIR = PIPELINE_ROOT / "02_VIDEOS"
SCENES_DIR = PIPELINE_ROOT / "04_SCENES"
SCRIPTS_DIR = PIPELINE_ROOT / "05_SCRIPT"

VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
SCENES_DIR.mkdir(parents=True, exist_ok=True)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
jobs = db.jobs


async def download_video(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("GET", url) as response:
            response.raise_for_status()
            with open(dest, "wb") as f:
                async for chunk in response.aiter_bytes():
                    f.write(chunk)

def run_cmd(cmd: list, cwd: Path | None = None):
    print("▶ RUN:", " ".join(cmd), flush=True)
    subprocess.check_call(cmd, cwd=cwd)

async def process_job(job: dict):
    job_id = job["job_id"]
    video_url = job["video_url"]

    # ---- job workspace ----
    job_dir = DATA_ROOT / job_id
    input_dir = job_dir / "input"
    video_path = input_dir / "video.mp4"

    # ---- pipeline dirs ----
    PIPELINE_ROOT = Path("/app/PointCloudV1")
    VIDEOS_DIR = PIPELINE_ROOT / "02_VIDEOS"
    SCENES_DIR = PIPELINE_ROOT / "04_SCENES"
    SCRIPTS_DIR = PIPELINE_ROOT / "05_SCRIPT"

    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    SCENES_DIR.mkdir(parents=True, exist_ok=True)

    # ---- status: downloading ----
    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "status": "processing",
            "progress": 10,
            "message": "Downloading video",
            "updated_at": datetime.datetime.utcnow()
        }}
    )

    await download_video(video_url, video_path)

    # ---- status: downloaded ----
    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "progress": 30,
            "message": "Video downloaded",
            "updated_at": datetime.datetime.utcnow(),
            "local_video_path": str(video_path)
        }}
    )

    # ------------------------------------------------
    # PIPELINE STARTS HERE
    # ------------------------------------------------

    import shutil
    import subprocess

    pipeline_video_path = VIDEOS_DIR / f"{job_id}.mp4"
    scene_out_dir = SCENES_DIR / job_id
    frames_dir = scene_out_dir / "frames"

    scene_out_dir.mkdir(parents=True, exist_ok=True)
    frames_dir.mkdir(parents=True, exist_ok=True)

    # ---- copy video into pipeline ----
    shutil.copy(video_path, pipeline_video_path)

    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "progress": 40,
            "message": "Video prepared for pipeline",
            "updated_at": datetime.datetime.utcnow()
        }}
    )

    # ---- extract frames (ffmpeg) ----
    subprocess.check_call([
        "ffmpeg",
        "-i", str(pipeline_video_path),
        "-qscale:v", "2",
        str(frames_dir / "frame_%04d.jpg")
    ])

    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "progress": 55,
            "message": "Frames extracted",
            "updated_at": datetime.datetime.utcnow()
        }}
    )

    # ---- run reconstruction script ----
    # ⚠️ adjust script name if needed
    subprocess.check_call(
        [
            "python",
            "run_pipeline.py",
            str(frames_dir),
            str(scene_out_dir)
        ],
        cwd=SCRIPTS_DIR
    )

    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "progress": 90,
            "message": "Point cloud generated",
            "updated_at": datetime.datetime.utcnow()
        }}
    )

    # ---- done ----
    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "status": "completed",
            "progress": 100,
            "scene_path": str(scene_out_dir),
            "updated_at": datetime.datetime.utcnow()
        }}
    )

async def worker_loop():
    print("Worker started. Waiting for jobs...")

    while True:
        job = await jobs.find_one_and_update(
            {"status": "queued"},
            {"$set": {"status": "claimed"}},
        )

        if job:
            try:
                await process_job(job)
            except Exception as e:
                await jobs.update_one(
                    {"job_id": job["job_id"]},
                    {"$set": {
                        "status": "failed",
                        "message": str(e),
                        "updated_at": datetime.datetime.utcnow()
                    }}
                )
        else:
            await asyncio.sleep(3)


if __name__ == "__main__":
    asyncio.run(worker_loop())































