import os
import asyncio
import datetime
from pathlib import Path

import shutil
import subprocess

import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

import sys
sys.stdout.reconfigure(line_buffering=True)

def log(msg: str):
    print(f"[PIPELINE] {msg}", flush=True)

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")
DB_NAME = "pointcloud"

DATA_ROOT = Path("/data/jobs")

PIPELINE_ROOT = Path("/app/PointCloudv1")

VIDEOS_DIR = PIPELINE_ROOT / "02_VIDEOS"
SCENES_DIR = PIPELINE_ROOT / "04_SCENES"
SCRIPTS_DIR = PIPELINE_ROOT / "05_SCRIPT"

VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
SCENES_DIR.mkdir(parents=True, exist_ok=True)

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
jobs = db.jobs

def cleanup_job(job_id: str):
    log(f"Cleanup started for job {job_id}")

    try:
        jobs.sync_update_one(
            {"job_id": job_id},
            {"$set": {
                "cleanup_status": "in_progress",
                "cleanup_started_at": datetime.datetime.utcnow()
            }}
        )
    except Exception:
        pass  # cleanup should never fail because of DB

    # job workspace
    job_dir = DATA_ROOT / job_id

    # pipeline artifacts
    pipeline_video = VIDEOS_DIR / f"{job_id}.mp4"
    scene_dir = SCENES_DIR / job_id

    for path in [job_dir, pipeline_video, scene_dir]:
        try:
            if path.exists():
                if path.is_dir():
                    shutil.rmtree(path)
                    log(f"Deleted directory: {path}")
                else:
                    path.unlink()
                    log(f"Deleted file: {path}")
        except Exception as e:
            log(f"Cleanup warning ({path}): {e}")

    try:
        jobs.sync_update_one(
            {"job_id": job_id},
            {"$set": {
                "cleanup_status": "completed",
                "cleanup_completed_at": datetime.datetime.utcnow()
            }}
        )
    except Exception:
        pass

    log(f"Cleanup completed for job {job_id}")

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





# fix this step, make the AutoTracker_v1.4.bat execute and not this made up .py file 

# [PIPELINE] Scene dir before: [PosixPath('/app/PointCloudv1/04_SCENES/live_test_001/frames')]
# python: can't open file '/app/PointCloudv1/05_SCRIPT/run_pipeline.py': [Errno 2] No such file or directory
# Command '['python', 'run_pipeline.py', '/app/PointCloudv1/04_SCENES/live_test_001/frames', '/app/PointCloudv1/04_SCENES/live_test_001']' returned non-zero exit status 2.






async def process_job(job: dict):
    job_id = job["job_id"]
    video_url = job["video_url"]

    try:
        # ---- job workspace ----
        job_dir = DATA_ROOT / job_id
        input_dir = job_dir / "input"
        video_path = input_dir / "video.mp4"

        # ---- pipeline dirs ----
        PIPELINE_ROOT = Path("/app/PointCloudv1")
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

        log(f"Job {job_id}: entering pipeline")
        log(f"Job dir: {job_dir}")
        log(f"Video path: {video_path}")

        log(f"Video exists: {video_path.exists()}")
        log(f"Video size: {video_path.stat().st_size if video_path.exists() else 'N/A'}")

        log(f"Pipeline root contents: {list(PIPELINE_ROOT.iterdir())}")
        log(f"Scripts dir contents: {list(SCRIPTS_DIR.iterdir())}")

        pipeline_video_path = VIDEOS_DIR / f"{job_id}.mp4"
        scene_out_dir = SCENES_DIR / job_id
        frames_dir = scene_out_dir / "frames"

        scene_out_dir.mkdir(parents=True, exist_ok=True)
        frames_dir.mkdir(parents=True, exist_ok=True)

        # ---- copy video ----
        log(f"Copying video → {pipeline_video_path}")
        shutil.copy(video_path, pipeline_video_path)

        log(f"Copied video exists: {pipeline_video_path.exists()}")
        log(f"Copied video size: {pipeline_video_path.stat().st_size}")

        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "progress": 40,
                "message": "Video prepared for pipeline",
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        # ---- ffmpeg ----
        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-i", str(pipeline_video_path),
            "-qscale:v", "2",
            str(frames_dir / "frame_%04d.jpg")
        ]

        log(f"Running FFmpeg: {' '.join(ffmpeg_cmd)}")
        log(f"Frames dir before: {list(frames_dir.iterdir())}")

        subprocess.run(ffmpeg_cmd, check=True)

        log(f"Frames dir after: {list(frames_dir.iterdir())}")

        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "progress": 55,
                "message": "Frames extracted",
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        # ---- reconstruction ----
        bat_path = SCRIPTS_DIR / "AutoTracker_v1.4.sh"

        log(f"Running AutoTracker script: {bat_path}")
        log(f"Script exists: {bat_path.exists()}")

        subprocess.run(
            ["bash", str(bat_path)],
            cwd=SCRIPTS_DIR,
            check=True
        )

        log(f"Scene dir before: {list(scene_out_dir.iterdir())}")
        log(f"Scene dir after: {list(scene_out_dir.iterdir())}")

        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "progress": 90,
                "message": "Point cloud generated",
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": "completed",
                "progress": 100,
                "scene_path": str(scene_out_dir),
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        log(f"Job {job_id}: completed")

    except Exception as e:
        log(f"Job {job_id} failed: {e}")
        raise

    finally:
        cleanup_job(job_id)

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
                print(str(e), flush=True)
        else:
            await asyncio.sleep(3)


if __name__ == "__main__":
    asyncio.run(worker_loop())































