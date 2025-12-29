
import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import User
import logging as logger
from fastapi import HTTPException
from fastapi import Query

load_dotenv()  # loads .env in backend/ if you want

app = FastAPI(title="My Next + FastAPI backend")

# Configure CORS (in dev allow localhost:3000)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],  # dev: set to specific domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    price: float









# to start -

# 0. cd backend
# 1. if you are on Windows, run the following command to activate the virtual environment:
#    - For PowerShell: `.venv\Scripts\Activate.ps1`
#    - For Command Prompt: `.venv\Scripts\activate.bat`
# 2. install dependencies: `pip install -r requirements.txt`
# 3. run the server: `uvicorn main:app --reload`

# TODO
# change this code for creating api in which there will be video for the pipline to create pointcloud, then api will use the pipeline to create pointcloud and return the pointcloud file link
# the api will also take parameters like video file link, pointcloud file format etc.
# also create another api to get the status of the pointcloud creation process
# also create another api to get the list of pointcloud files created by the user# also create another api to delete the pointcloud files created by the user
# also create another api to update the pointcloud files created by the user





















import os
import asyncio
import datetime
from enum import Enum
from uuid import uuid4
from typing import Optional

import httpx
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# ---------------------------------------------------------------------
# ENV + APP
# ---------------------------------------------------------------------

load_dotenv()

app = FastAPI(
    title="Twinx Point Cloud Backend",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# MONGODB SETUP
# ---------------------------------------------------------------------
# Uses existing env var: MONGODB_URL
# Example: mongodb://user:pass@host:27017/twinx
# ---------------------------------------------------------------------

mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
db = mongo_client["pointcloud"]
jobs_collection = db.jobs

# ---------------------------------------------------------------------
# ENUMS
# ---------------------------------------------------------------------

class JobStatus(str, Enum):
    queued = "queued"
    processing = "processing"
    completed = "completed"
    failed = "failed"

# ---------------------------------------------------------------------
# MODELS
# ---------------------------------------------------------------------

class PointCloudRequest(BaseModel):
    job_id: str
    video_url: HttpUrl
    fps: int = 2
    max_frames: int = 300
    webhook_url: Optional[HttpUrl] = None
    metadata: Optional[dict] = None


class PointCloudResponse(BaseModel):
    job_id: str
    status: JobStatus
    created_at: str
    message: str

# ---------------------------------------------------------------------
# WEBHOOK UTILITY (OPTIONAL)
# ---------------------------------------------------------------------

async def send_webhook(webhook_url: str, payload: dict):
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(webhook_url, json=payload)
    except Exception as e:
        print("Webhook error:", e)





# ---------------------------------------------------------------------
# BACKGROUND JOB WORKER - PROCESS POINT CLOUD REQUEST 
# ---------------------------------------------------------------------

async def process_point_cloud_job(job_id: str):
    job = await jobs_collection.find_one({"job_id": job_id})
    webhook = job.get("webhook_url")

    async def update(status: JobStatus, progress: int, message: str):
        await jobs_collection.update_one(
            {"job_id": job_id},
            {
                "$set": {
                    "status": status,
                    "progress": progress,
                    "message": message,
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )

        if webhook:
            await send_webhook(webhook, {
                "job_id": job_id,
                "status": status,
                "progress": progress,
                "message": message
            })













    # SIMULATED POINT CLOUD PROCESSING PIPELINE _________________________________________________________________ UPDATE THIS WITH REAL LOGIC FOR POINT CLOUD GENERATION
    try:
        
        # STEP 1 — JOB ORCHESTRATION ONLY (NO PROCESSING HERE)
        try:
            # Mark job as queued and ready for worker pickup
            await jobs_collection.update_one(
                {"job_id": job_id},
                {
                    "$set": {
                        "status": JobStatus.queued,
                        "progress": 0,
                        "message": "Job queued for worker",
                        "updated_at": datetime.datetime.utcnow()
                    }
                }
            )
        
        except Exception as e:
            await jobs_collection.update_one(
                {"job_id": job_id},
                {
                    "$set": {
                        "status": JobStatus.failed,
                        "progress": 0,
                        "message": f"Job orchestration failed: {str(e)}",
                        "updated_at": datetime.datetime.utcnow()
                    }
                }
            )
        

        await update(JobStatus.processing, 30, "Extracting frames")
        await asyncio.sleep(2)

        await update(JobStatus.processing, 60, "Running point cloud reconstruction")
        await asyncio.sleep(4)

        await update(JobStatus.processing, 85, "Uploading point cloud outputs")
        await asyncio.sleep(2)

        await jobs_collection.update_one(
            {"job_id": job_id},
            {
                "$set": {
                    "status": JobStatus.completed,
                    "progress": 100,
                    "message": "Point cloud generation completed",
                    "updated_at": datetime.datetime.utcnow(),
                    "result": {
                        "pointcloud_url": f"https://cdn.example.com/results/{job_id}/pointcloud.ply"
                    }
                }
            }
        )

    except Exception as e:
        await update(JobStatus.failed, 0, f"Job failed: {str(e)}")


















# ---------------------------------------------------------------------
# ROUTES
# ---------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/whatsup")
async def whatsup():
    return {"Hipex": "whatsup"}

@app.get("/info")
async def info():
    return {
        "status": "ok",
        "service": "Twinx Point Cloud Backend",
        "version": "1.0.0"
    }

from fastapi import Header

@app.get("/users", response_model=list[User])
async def list_all_users(secret: str = Query(...)):

    try:
        # 🔒 AUTH CHECK
        expected_secret = os.getenv("ADMIN_SECRET")

        if not expected_secret:
            raise HTTPException(
                status_code=500,
                detail="Admin secret not configured"
            )

        if secret != expected_secret:
            raise HTTPException(
                status_code=401,
                detail="Unauthorized"
            )

        users: list[User] = []

        mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        db = mongo_client["test"]
        users_collection = db.users

        cursor = users_collection.find({})
        async for doc in cursor:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])

            users.append(User(**doc))

        return users

    except HTTPException:
        raise  # rethrow auth errors cleanly

    except Exception as e:
        logger.error(f"❌ Error fetching users: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")



@app.post("/createPointCloud/", response_model=PointCloudResponse)
async def create_point_cloud(
    payload: PointCloudRequest,
    background_tasks: BackgroundTasks
):
    existing = await jobs_collection.find_one({"job_id": payload.job_id})
    if existing:
        return {
            "job_id": payload.job_id,
            "status": JobStatus.failed,
            "created_at": existing["created_at"].isoformat(),
            "message": "Job ID already exists"
        }

    created_at = datetime.datetime.utcnow()

    # 🔹 JOB IS CREATED HERE (MongoDB)
    await jobs_collection.insert_one({
        "job_id": payload.job_id,
        "internal_id": uuid4().hex,
        "status": JobStatus.queued,
        "progress": 0,
        "video_url": str(payload.video_url),
        "webhook_url": str(payload.webhook_url) if payload.webhook_url else None,
        "metadata": payload.metadata,
        "created_at": created_at,
        "updated_at": None,
        "message": "Job queued"
    })

    background_tasks.add_task(process_point_cloud_job, payload.job_id)

    return {
        "job_id": payload.job_id,
        "status": JobStatus.queued,
        "created_at": created_at.isoformat(),
        "message": "Point cloud job queued successfully"
    }

@app.get("/job/{job_id}")
async def get_job_status(job_id: str):
    job = await jobs_collection.find_one({"job_id": job_id}, {"_id": 0})
    if not job:
        return {"error": "Job not found"}

    # Convert datetime fields to ISO for JSON
    if job.get("created_at"):
        job["created_at"] = job["created_at"].isoformat()
    if job.get("updated_at"):
        job["updated_at"] = job["updated_at"].isoformat()

    return job
