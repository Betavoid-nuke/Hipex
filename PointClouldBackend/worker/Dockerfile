FROM python:3.11-slim

WORKDIR /app

# ---- system dependencies ----
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ---- python deps ----
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- project code ----
COPY worker.py .
COPY PointCloudV1 ./PointCloudV1

# ---- persistent data root ----
RUN mkdir -p /data/jobs

# ---- environment ----
ENV PYTHONUNBUFFERED=1

CMD ["python", "worker.py"]
