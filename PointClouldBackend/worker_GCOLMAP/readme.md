# in the VPS server terminal,

working dir - root@srv859620:~/workers/Hipex/PointClouldBackend/worker# 

steps for setting up the worker which checks mongo for jobs with status "qued" and picks them to build pointcloud:

PART 1 — Get your pipeline code onto the VPS
## 1️⃣ Go to a clean directory
cd ~
mkdir workers
cd workers

## 2️⃣ Clone your GitHub repo (make repo public first)
git clone https://github.com/Betavoid-nuke/TwinxPointClouldPipeline.git

cd TwinxPointClouldPipeline

Verify:
ls
You should see your folders + Dockerfile.


PART 2 — Environment variables (VERY IMPORTANT)
Never hardcode secrets.

## 3️⃣ Create .env file
nano .env

Paste (example – adjust keys to your code) (make sure there are no spaces like - MONGO_URI = mongodb+s):

MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
POLL_INTERVAL=10
WORKER_NAME=worker-1


Save:
CTRL + O
ENTER
CTRL + X

PART 3 — Build the Docker image
## 4️⃣ Build the worker image
docker build -t twinx-pointcloud-worker .

Confirm:
docker images

PART 4 — Run the worker (FOREVER)
This is where most people mess up.
You want detached + restart always.

## 5️⃣ Create data directory on VPS
mkdir -p /data/jobs

## 6️⃣ Run the worker container
docker run -d \
  --name twinx_pointcloud_worker \
  --env-file .env \
  -v /data:/data \
  --restart unless-stopped \
  twinx-pointcloud-worker


What this does:
-d → runs in background
--restart unless-stopped → survives reboot
-v /data:/data → persistent storage

Worker runs forever

## 7️⃣ Verify it’s running
docker ps

Logs:
docker logs -f twinx_pointcloud_worker

You should see:
Mongo connected
Polling loop running
Waiting for jobs




PART 6 — Make sure it survives VPS reboot
## 8️⃣ Reboot test (IMPORTANT)
reboot


SSH back in, then:

docker ps

If container is running → ✅ production-ready.











# PART 7 — Updating code later (safe flow)

When you push new code to GitHub:

cd ~/workers/TwinxPointClouldPipeline
git pull
docker build -t twinx-pointcloud-worker .
docker stop twinx_pointcloud_worker
docker rm twinx_pointcloud_worker
docker run -d \
  --name twinx_pointcloud_worker \
  --env-file .env \
  -v /data:/data \
  --restart unless-stopped \
  twinx-pointcloud-worker