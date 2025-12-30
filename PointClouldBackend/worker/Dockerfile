FROM python:3.11-slim

WORKDIR /app

# ---------------- SYSTEM DEPENDENCIES ----------------
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# ---------------- PYTHON DEPENDENCIES ----------------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------- PROJECT FILES ----------------
COPY worker.py .
COPY PointCloudv1 ./PointCloudv1

# ---------------- DATA DIR ----------------
RUN mkdir -p /data/jobs

# ---------------- LOGGING ----------------
ENV PYTHONUNBUFFERED=1

CMD ["python", "worker.py"]
