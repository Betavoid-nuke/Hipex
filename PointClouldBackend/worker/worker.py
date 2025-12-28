import os
import asyncio
import datetime
from pathlib import Path

import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URL")
DB_NAME = "pointcloud"

DATA_ROOT = Path("/data/jobs")

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


async def process_job(job: dict):
    job_id = job["job_id"]
    video_url = job["video_url"]

    job_dir = DATA_ROOT / job_id
    input_dir = job_dir / "input"
    video_path = input_dir / "video.mp4"

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

    await jobs.update_one(
        {"job_id": job_id},
        {"$set": {
            "progress": 30,
            "message": "Video downloaded",
            "updated_at": datetime.datetime.utcnow(),
            "local_video_path": str(video_path)
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
