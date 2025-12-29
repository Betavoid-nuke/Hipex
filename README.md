This is the repo for the platform builder npm package, that web developers can use to quickly setup a production-ready platform with build in clerk authentication, mongoose database, and uploadthing package with mordern ui design build with shadcn. users will get a base and after initializing the platform, developers can start to design their pages

# Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.




_______________________________________________________


# HIPEX APIs:
Hipex APIs are within this project file, the root/backend folder has the code for python backend.
main.py is the main python file where the initial apis are defined.

_______________________________________________________

# Point Cloud Backend:
Hipex Point Cloud Backend are within this project file, the root/PointClouldBackend folder has the code for python backend.
main.py is the main python file where the initial apis are defined.

An asynchronous, job-based backend for generating 3D point clouds from video using COLMAP.
This service is designed for production use, with a clean separation between:
1. API orchestration
2. Job state management
3. Heavy 3D reconstruction workloads

## What This API Does
1. Accepts a video URL
2. Creates a job in MongoDB
3. Processes the job asynchronously
4. Tracks progress and status
5. Returns a point cloud output URL when complete
6. The API never blocks and never runs heavy computation directly.

## How to run locally:
1. cd backend
2. if you are on Windows, run the following command to activate the virtual environment:
   - For PowerShell: `.venv\Scripts\Activate.ps1`
   - For Command Prompt: `.venv\Scripts\activate.bat`
3. install dependencies: `pip install -r requirements.txt`
4. run the server: `uvicorn main:app --reload`


## Testing API:
1. go to - http://pointcloud.hipexapp.com/docs

2. copy this json in POST - 
    {
      "job_id": "live_test_003",
      "video_url": "https://example.com/test-video.mp4"
    }

3. click Execute

to check status of a job:
1. go to - http://pointcloud.hipexapp.com/job/*job_id*


## How TwinX API works:
Frontend calls the TwinX API and it creates a job in DB, then the TwinX point cloud backend automatically picks up on a new model in DB with status "qued" and proccess it and when done, sets the status as "compeleted". when status is compeleted, it is pickedup by the API backend and it populates the frontend by sending a webhook.

DB acts as a bridge between API backend and Point Cloud backend. Both backends run a infinite loop which keeps checking DB for updates.

```bash
┌───────────────────────────────┐
│          FRONTEND             │
│  (Web / App / Client)         │
└───────────────┬───────────────┘
                │
                │ 1. POST /createPointCloud
                │    - job_id
                │    - video_url
                ▼
┌───────────────────────────────┐
│         API (FastAPI)         │
│                               │
│  - validates request          │
│  - creates job in MongoDB     │
│  - sets status = "queued"     │
│  - returns job_id immediately │
│                               │
│  ❌ no video download         │
│  ❌ no COLMAP execution       │
└───────────────┬───────────────┘
                │
                │ 2. INSERT JOB DOCUMENT
                ▼
┌───────────────────────────────┐
│            MONGODB            │
│                               │
│  jobs collection              │
│                               │
│  {                            │
│    job_id: "abc123",          │
│    status: "queued",          │
│    progress: 0,               │
│    video_url: "...",          │
│  }                            │
└───────────────┬───────────────┘
                │
                │ 3. Worker polls for queued jobs
                ▼
┌───────────────────────────────┐
│        WORKER (Docker)        │
│                               │
│  while true:                  │
│    find job where             │
│      status = "queued"        │
│    set status = "claimed"     │
│                               │
│  (atomic operation)           │
└───────────────┬───────────────┘
                │
                │ 4. Processing pipeline
                ▼
┌──────────────────────────────────────────────────────────┐
│                    WORKER PIPELINE                       │
│                                                          │
│  /data/jobs/<job_id>/                                    │
│                                                          │
│  ├── input/                                              │
│  │    └── video.mp4   ← download from video_url          │
│  │                                                       │
│  ├── frames/         ← FFmpeg extracts frames            │
│  │                                                       │
│  ├── colmap/         ← COLMAP reconstruction             │
│  │                                                       │
│  ├── output/                                             │
│  │    └── pointcloud.ply                                 │
│  │                                                       │
│  └── logs/                                               │
│                                                          │
│  MongoDB updates during pipeline:                        │
│    status   : processing → completed                     │
│    progress : 10 → 30 → 60 → 100                         │
│    message  : "Downloading video", ...                   │
└───────────────┬──────────────────────────────────────────┘
                │
                │ 5. Job completion
                ▼
┌───────────────────────────────┐
│            MONGODB            │
│                               │
│  {                            │
│    job_id: "abc123",          │
│    status: "completed",       │
│    progress: 100,             │
│    result: {                  │
│      pointcloud_url: "..."    │
│    }                          │
│  }                            │
└───────────────┬───────────────┘
                │
                │ 6. Frontend polls job status
                ▼
┌───────────────────────────────┐
│          FRONTEND             │
│                               │
│  GET /job/<job_id>            │
│                               │
│  - shows progress bar         │
│  - displays result when done  │
└───────────────────────────────┘

```

## Job Lifecycle (Step-by-Step)
```bash
POST /createPointCloud
        |
        v
MongoDB: insert job (status=queued)
        |
        v
Background task starts
        |
        v
Worker pipeline:
  - Download video
  - Extract frames
  - Run COLMAP
  - Upload outputs
        |
        v
MongoDB updated (status=completed)

```

## API Endpoints

### A) Health Check
```bash
GET /health
```

Response:
```bash
{ "status": "healthy" }
```

### B) Service Info:
```bash
GET /info
```

Response:
```bash
{
  "status": "ok",
  "service": "Twinx Point Cloud Backend",
  "version": "1.0.0"
}
```

### C) Create Point Cloud Job:
```bash
POST /createPointCloud/
```

Request body:
```bash
{
  "job_id": "job_001",
  "video_url": "https://cdn.example.com/video.mp4"
}
```

Response:
```bash
{
  "job_id": "job_001",
  "status": "queued",
  "message": "Point cloud job queued successfully"
}
```

### D) Get Job Status:
```bash
GET /job/{job_id}
```

Example response (processing):
```bash
{
  "status": "processing",
  "progress": 60,
  "message": "Running point cloud reconstruction"
}
```

Example response (completed):
```bash
{
  "status": "completed",
  "progress": 100,
  "result": {
    "pointcloud_url": "https://cdn.example.com/results/job_001/pointcloud.ply"
  }
}
```

### E) List All Users (Admin Only)
```bash
GET /users
```

Authentication:
(This endpoint requires a secret password passed as a query parameter.)
```bash
?secret=YOUR_ADMIN_SECRET
```

Example Request:
```bash
GET /users?secret=super-secret-password
```

Example Response (success):
```bash
[
  {
    "id": "user_001",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "country": "Earth",
    "onboarded": true,
    "twinxprojects": [],
    "socialhandles": [
      {
        "platform": "twitter",
        "url": "https://x.com/johndoe"
      }
    ]
  }...
]
```

Example Response (unauthorized):
```bash
{
  "detail": "Unauthorized"
}
```

_______________________________________________________

# CUETRACK:
root/cuetrack has the code for the cuetrack app for snooker.