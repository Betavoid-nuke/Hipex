#!/usr/bin/env bash
set -e

# ================================================================
#  LINUX SCRIPT FOR AUTOMATED PHOTOGRAMMETRY TRACKING WORKFLOW
#  Converted from AutoTracker_v1.4.bat
#  GLOMAP mapping + COLMAP features/matching + TXT export
# ================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOP="$(cd "$SCRIPT_DIR/.." && pwd)"

SFM_DIR="$TOP/01_GLOMAP"
VIDEOS_DIR="$TOP/02_VIDEOS"
SCENES_DIR="$TOP/04_SCENES"

# ---------- locate binaries ----------
FFMPEG="$(command -v ffmpeg || true)"
COLMAP="$(command -v colmap || true)"
GLOMAP="$(command -v glomap || true)"

if [[ -z "$FFMPEG" ]]; then
  echo "[ERROR] ffmpeg not found"
  exit 1
fi

if [[ -z "$COLMAP" ]]; then
  echo "[ERROR] colmap not found"
  exit 1
fi

if [[ -z "$GLOMAP" ]]; then
  echo "[ERROR] glomap not found"
  exit 1
fi

mkdir -p "$SCENES_DIR"

TOTAL=$(ls -1 "$VIDEOS_DIR" | wc -l)
if [[ "$TOTAL" -eq 0 ]]; then
  echo "[INFO] No videos found"
  exit 0
fi

echo "=============================================================="
echo " Starting GLOMAP pipeline on $TOTAL video(s)"
echo "=============================================================="

IDX=0

for VIDEO in "$VIDEOS_DIR"/*; do
  IDX=$((IDX+1))
  BASE="$(basename "$VIDEO")"
  NAME="${BASE%.*}"

  SCENE="$SCENES_DIR/$NAME"
  IMG_DIR="$SCENE/images"
  SPARSE_DIR="$SCENE/sparse"

  echo
  echo "[$IDX/$TOTAL] === Processing $BASE ==="

  if [[ -d "$SCENE" ]]; then
    echo "  • Skipping $BASE – already reconstructed"
    continue
  fi

  mkdir -p "$IMG_DIR" "$SPARSE_DIR"

  # -------- 1) Extract frames ----------
  echo "  [1/4] Extracting frames"
  "$FFMPEG" -y -i "$VIDEO" -qscale:v 2 "$IMG_DIR/frame_%06d.jpg"

  if [[ ! "$(ls -A "$IMG_DIR")" ]]; then
    echo "  × No frames extracted"
    continue
  fi

  # -------- 2) Feature extraction ----------
  echo "  [2/4] COLMAP feature_extractor"
  "$COLMAP" feature_extractor \
    --database_path "$SCENE/database.db" \
    --image_path "$IMG_DIR" \
    --ImageReader.single_camera 1 \
    --SiftExtraction.use_gpu 1 \
    --SiftExtraction.max_image_size 4096

  # -------- 3) Sequential matcher ----------
  echo "  [3/4] COLMAP sequential_matcher"
  "$COLMAP" sequential_matcher \
    --database_path "$SCENE/database.db" \
    --SequentialMatching.overlap 15

  # -------- 4) GLOMAP mapper ----------
  echo "  [4/4] GLOMAP mapper"
  "$GLOMAP" mapper \
    --database_path "$SCENE/database.db" \
    --image_path "$IMG_DIR" \
    --output_path "$SPARSE_DIR"

  # -------- Export TXT ----------
  if [[ -d "$SPARSE_DIR/0" ]]; then
    "$COLMAP" model_converter \
      --input_path "$SPARSE_DIR/0" \
      --output_path "$SPARSE_DIR/0" \
      --output_type TXT

    "$COLMAP" model_converter \
      --input_path "$SPARSE_DIR/0" \
      --output_path "$SPARSE_DIR" \
      --output_type TXT
  fi

  echo "  ✓ Finished $BASE ($IDX/$TOTAL)"
done

echo "--------------------------------------------------------------"
echo " All jobs finished – results in $SCENES_DIR"
echo "--------------------------------------------------------------"
