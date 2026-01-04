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

# -------------------------------------------------
# ENV / DB
# -------------------------------------------------
load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")
DB_NAME = "pointcloud"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
jobs = db.jobs

# -------------------------------------------------
# PATHS
# -------------------------------------------------
DATA_ROOT = Path("/data/jobs")

PIPELINE_ROOT = Path("/app/PointCloudv2")

VIDEOS_DIR  = PIPELINE_ROOT / "02 VIDEOS"
SCENES_DIR  = PIPELINE_ROOT / "04 SCENES"
SCRIPTS_DIR = PIPELINE_ROOT / "05 SCRIPTS"

VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
SCENES_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------
# CLEANUP
# -------------------------------------------------
def cleanup_job(job_id: str):
    log(f"Cleanup started for job {job_id}")

    job_dir = DATA_ROOT / job_id
    pipeline_video = VIDEOS_DIR / f"{job_id}.mp4"
    scene_dir = SCENES_DIR / job_id

    for path in [job_dir, pipeline_video, scene_dir]:
        try:
            if path.exists():
                if path.is_dir():
                    shutil.rmtree(path)
                else:
                    path.unlink()
                log(f"Deleted: {path}")
        except Exception as e:
            log(f"Cleanup warning ({path}): {e}")

    log(f"Cleanup completed for job {job_id}")

# -------------------------------------------------
# HELPERS
# -------------------------------------------------
async def download_video(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("GET", url) as response:
            response.raise_for_status()
            with open(dest, "wb") as f:
                async for chunk in response.aiter_bytes():
                    f.write(chunk)

# -------------------------------------------------
# MAIN JOB
# -------------------------------------------------
async def process_job(job: dict):
    job_id = job["job_id"]
    video_url = job["video_url"]

    try:
        # ------------------------------
        # Job workspace
        # ------------------------------
        job_dir = DATA_ROOT / job_id
        input_dir = job_dir / "input"
        video_path = input_dir / "video.mp4"

        input_dir.mkdir(parents=True, exist_ok=True)

        # ------------------------------
        # Status: downloading
        # ------------------------------
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

        # ------------------------------
        # Copy video into pipeline
        # ------------------------------
        pipeline_video_path = VIDEOS_DIR / f"{job_id}.mp4"
        scene_out_dir = SCENES_DIR / job_id

        scene_out_dir.mkdir(parents=True, exist_ok=True)

        shutil.copy(video_path, pipeline_video_path)

        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "progress": 30,
                "message": "Video prepared for pipeline",
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        # ------------------------------------------------
        # RUN PIPELINE SCRIPT
        # ------------------------------------------------
        pipeline_script = SCRIPTS_DIR / "run_photogrammetry.sh"

        log(f"Running pipeline script: {pipeline_script}")
        log(f"Script exists: {pipeline_script.exists()}")

        if not pipeline_script.exists():
            raise RuntimeError("Pipeline script not found")

        subprocess.run(
            ["bash", str(pipeline_script)],
            cwd=SCRIPTS_DIR,
            check=True
        )

        # ------------------------------
        # Completed
        # ------------------------------
        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": "completed",
                "progress": 100,
                "scene_path": str(scene_out_dir),
                "updated_at": datetime.datetime.utcnow()
            }}
        )

        log(f"Job {job_id} completed successfully")

    except Exception as e:
        log(f"Job {job_id} failed: {e}")
        await jobs.update_one(
            {"job_id": job_id},
            {"$set": {
                "status": "failed",
                "message": str(e),
                "updated_at": datetime.datetime.utcnow()
            }}
        )
        raise

    finally:
        cleanup_job(job_id)

# -------------------------------------------------
# WORKER LOOP
# -------------------------------------------------
async def worker_loop():
    log("Worker started. Waiting for jobs...")

    while True:
        job = await jobs.find_one_and_update(
            {"status": "queued"},
            {"$set": {"status": "claimed"}},
        )

        if job:
            await process_job(job)
        else:
            await asyncio.sleep(3)

# -------------------------------------------------
if __name__ == "__main__":
    asyncio.run(worker_loop())
