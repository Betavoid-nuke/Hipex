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
0. cd backend
1. if you are on Windows, run the following command to activate the virtual environment:
   - For PowerShell: `.venv\Scripts\Activate.ps1`
   - For Command Prompt: `.venv\Scripts\activate.bat`
2. install dependencies: `pip install -r requirements.txt`
3. run the server: `uvicorn main:app --reload`


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
```bash
Client (Web / App)
        |
        v
+----------------------+
| FastAPI Backend      |
| - Creates jobs       |
| - Stores state       |
| - Updates progress   |
+----------+-----------+
           |
           v
+----------------------+
| MongoDB              |
| - Job documents      |
| - Status tracking    |
+----------+-----------+
           |
           v
+----------------------+
| Worker (Docker)      |
| - Downloads video    |
| - Runs COLMAP        |
| - Uploads outputs    |
+----------------------+
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
_______________________________________________________

# CUETRACK:
root/cuetrack has the code for the cuetrack app for snooker.