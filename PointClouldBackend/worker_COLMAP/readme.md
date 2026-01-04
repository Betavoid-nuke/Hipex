## Pull Latest Changes from Git
  ```bash
  git status
  git pull
  ```

## If you want to force-sync (⚠️ deletes local changes):
  ```bash
  git fetch origin
  git reset --hard origin/main
  ```

## Stop Running Docker Container
  docker ps

  You’ll see something like:
  ```bash
  CONTAINER ID   IMAGE             NAMES
  a1b2c3d4e5f6   colmap-pipeline   pointcloud_worker
  ```

## Stop it
  ```bash
  docker stop pointcloud_worker
  ```

## Remove Old Container
  ```bash
  docker rm pointcloud_worker
  ```

## Rebuild Docker Image (With Latest Code)
  ```bash
  docker build -t colmap-pipeline .
  ```

## Restart the Container
  ```bash
  docker run -d \
  --name pointcloud_worker \
  --restart unless-stopped \
  -v $(pwd)/PointCloudv2:/app/PointCloudv2 \
  colmap-pipeline \
  python worker.py

  ```

## for logs
  ```bash
  docker logs -f pointcloud_worker
  ```

## for logs
  ```bash
  docker exec -it pointcloud_worker bash
  ```
  
  Inside container:
  ```bash
  which colmap
  colmap -h
  ls /app/PointCloudv2/05\ SCRIPTS
  ```

## 🔥 ONE-COMMAND QUICK RESET
  ```bash
  git pull && \
  docker stop pointcloud_worker && \
  docker rm pointcloud_worker && \
  docker build -t colmap-pipeline . && \
  docker run -d \
    --name pointcloud_worker \
    --restart unless-stopped \
    -v $(pwd)/PointCloudv2:/app/PointCloudv2 \
    colmap-pipeline \
    python worker.py
  ```