# ===============================
# COLMAP + FFMPEG PIPELINE IMAGE
# ===============================

FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# -------------------------------
# 1. System update
# -------------------------------
RUN apt-get update && apt-get upgrade -y

# -------------------------------
# 2. Core build tools
# -------------------------------
RUN apt-get install -y \
    git \
    cmake \
    ninja-build \
    build-essential \
    wget \
    unzip \
    pkg-config \
    software-properties-common

# -------------------------------
# 3. COLMAP dependencies
# -------------------------------
RUN apt-get install -y \
    libboost-program-options-dev \
    libboost-graph-dev \
    libboost-system-dev \
    libeigen3-dev \
    libfreeimage-dev \
    libmetis-dev \
    libgoogle-glog-dev \
    libgflags-dev \
    libsqlite3-dev \
    libglew-dev \
    qtbase5-dev \
    libqt5opengl5-dev \
    libcgal-dev \
    libceres-dev \
    libssl-dev \
    libcurl4-openssl-dev \
    libopenimageio-dev \
    openimageio-tools \
    libopenexr-dev \
    libopencv-dev

# -------------------------------
# 4. FFMPEG (system default)
# -------------------------------
RUN apt-get install -y ffmpeg

# -------------------------------
# 5. Copy COLMAP source (01 COLMAP)
# -------------------------------
WORKDIR /opt
COPY "PointCloudv2/01_COLMAP" /opt/colmap

# -------------------------------
# 6. Build COLMAP
# -------------------------------
WORKDIR /opt/colmap
RUN mkdir build

WORKDIR /opt/colmap/build
RUN cmake .. -GNinja
RUN ninja
RUN ninja install

# -------------------------------
# 7. Verify COLMAP install
# -------------------------------
RUN colmap -h

# -------------------------------
# 8. App workspace
# -------------------------------
WORKDIR /app/PointCloudv2

# -------------------------------
# 9. Copy full pipeline structure
# -------------------------------
COPY PointCloudv2 /app/PointCloudv2

# -------------------------------
# 10. Script permissions
# -------------------------------
RUN chmod +x /app/PointCloudv2/05\ SCRIPTS/*.sh

# -------------------------------
# 11. Default shell
# -------------------------------
CMD ["/bin/bash"]
