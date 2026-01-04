#!/bin/bash
# ================================================================
#  BASH SCRIPT FOR AUTOMATED PHOTOGRAMMETRY TRACKING WORKFLOW
#  v6 - Final version with corrected automatic detection logic
# ================================================================

# --- Stop script on any error ---
set -e

# --- Resolve top-level folder (one up from this script) ---
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TOP="$(dirname "$SCRIPT_DIR")"

# --- Key paths ---
COLMAP_DIR="$TOP/01_COLMAP"
VIDEOS_DIR="$TOP/02_VIDEOS"
FFMPEG_DIR="$TOP/03_FFMPEG"
SCENES_DIR="$TOP/04_SCENES"

# --- Locate ffmpeg (checks system path first) ---
if command -v ffmpeg &> /dev/null; then
    FFMPEG="ffmpeg"
elif [ -f "$FFMPEG_DIR/ffmpeg" ]; then
    FFMPEG="$FFMPEG_DIR/ffmpeg"
elif [ -f "$FFMPEG_DIR/bin/ffmpeg" ]; then
    FFMPEG="$FFMPEG_DIR/bin/ffmpeg"
else
    echo "[ERROR] ffmpeg not found." >&2
    echo "Please install it or place the binary in '$FFMPEG_DIR'." >&2
    exit 1
fi

# --- Automatically find the best COLMAP executable ---
COLMAP=""
echo "🔎 Searching for the best COLMAP version..."

# Define the correct option string to search for
CUDA_OPTION="FeatureExtraction.use_gpu"

# 1. Prioritize a local copy in the project folder
if [ -f "$COLMAP_DIR/bin/colmap" ]; then
    COLMAP_CANDIDATE="$COLMAP_DIR/bin/colmap"
    if "$COLMAP_CANDIDATE" feature_extractor --help 2>&1 | grep -q "$CUDA_OPTION"; then
        COLMAP="$COLMAP_CANDIDATE"
        echo "   ✔ Found CUDA-enabled COLMAP in project folder: $COLMAP"
    fi
fi

# 2. If no local copy, check the standard custom-build location
if [ -z "$COLMAP" ] && [ -f "/usr/local/bin/colmap" ]; then
    COLMAP_CANDIDATE="/usr/local/bin/colmap"
    if "$COLMAP_CANDIDATE" feature_extractor --help 2>&1 | grep -q "$CUDA_OPTION"; then
        COLMAP="$COLMAP_CANDIDATE"
        echo "   ✔ Found CUDA-enabled COLMAP in /usr/local/bin/"
    fi
fi

# 3. If still not found, check the default system version
if [ -z "$COLMAP" ] && command -v colmap &> /dev/null; then
    COLMAP_CANDIDATE="$(command -v colmap)"
    if "$COLMAP_CANDIDATE" feature_extractor --help 2>&1 | grep -q "$CUDA_OPTION"; then
        COLMAP="$COLMAP_CANDIDATE"
        echo "   ✔ Found CUDA-enabled COLMAP in system PATH: $COLMAP"
    else
        echo "   ⚠️ Found system COLMAP, but it lacks GPU support. Will use CPU."
        COLMAP="$COLMAP_CANDIDATE" # Fallback to CPU version
    fi
fi

# 4. If no version of COLMAP was found at all
if [ -z "$COLMAP" ]; then
    echo "[ERROR] No usable COLMAP executable was found." >&2
    echo "Please install COLMAP or place your custom build in '$COLMAP_DIR/bin/'." >&2
    exit 1
fi

# --- Put COLMAP’s library folder(s) on PATH (for local builds) ---
export LD_LIBRARY_PATH="${COLMAP_DIR}/lib:/usr/local/lib:${LD_LIBRARY_PATH}"

# --- Ensure required folders exist ---
if [ ! -d "$VIDEOS_DIR" ]; then
    echo "[ERROR] Input folder '$VIDEOS_DIR' missing." >&2
    exit 1
fi
mkdir -p "$SCENES_DIR"

# --- Count videos for progress bar ---
TOTAL=$(find "$VIDEOS_DIR" -maxdepth 1 -type f | wc -l)
if [ "$TOTAL" -eq 0 ]; then
    echo "[INFO] No video files found in '$VIDEOS_DIR'."
    exit 0
fi

echo "=============================================================="
echo " Starting COLMAP on $TOTAL video(s) …"
echo "=============================================================="

IDX=0
for VIDEO_FILE in "$VIDEOS_DIR"/*; do
    [ -f "$VIDEO_FILE" ] || continue
    IDX=$((IDX + 1))
    FILENAME=$(basename -- "$VIDEO_FILE")
    BASE="${FILENAME%.*}"

    echo
    echo "[$IDX/$TOTAL] === Processing \"$FILENAME\" ==="

    SCENE_DIR="$SCENES_DIR/$BASE"
    IMG_DIR="$SCENE_DIR/images"
    SPARSE_DIR="$SCENE_DIR/sparse"

    if [ -d "$SCENE_DIR" ]; then
        echo "       ↻ Skipping \"$BASE\" – already reconstructed."
        continue
    fi

    mkdir -p "$IMG_DIR" "$SPARSE_DIR"

    echo "       [1/4] Extracting frames …"
    "$FFMPEG" -loglevel error -stats -i "$VIDEO_FILE" -qscale:v 2 \
        "$IMG_DIR/frame_%06d.jpg"

    if ! ls "$IMG_DIR"/*.jpg &> /dev/null; then
        echo "       ✖ No frames extracted – skipping \"$BASE\"."
        rm -r "$SCENE_DIR"
        continue
    fi

    # Check if the found COLMAP version supports GPU
    USE_GPU=0
    if "$COLMAP" feature_extractor --help 2>&1 | grep -q "$CUDA_OPTION"; then
        USE_GPU=1
    fi

    echo "       [2/4] COLMAP feature_extractor (Using GPU: $USE_GPU)..."
    "$COLMAP" feature_extractor \
        --database_path "$SCENE_DIR/database.db" \
        --image_path    "$IMG_DIR" \
        --ImageReader.single_camera 1 \
        --FeatureExtraction.use_gpu $USE_GPU \
        --SiftExtraction.max_image_size 2048 # Lowered to prevent VRAM errors

    echo "       [3/4] COLMAP sequential_matcher …"
    "$COLMAP" sequential_matcher \
        --database_path "$SCENE_DIR/database.db" \
        --SequentialMatching.overlap 15

    echo "       [4/4] COLMAP mapper …"
    "$COLMAP" mapper \
        --database_path "$SCENE_DIR/database.db" \
        --image_path    "$IMG_DIR" \
        --output_path   "$SPARSE_DIR" \
        --Mapper.num_threads $(nproc)

    if [ -d "$SPARSE_DIR/0" ]; then
        "$COLMAP" model_converter \
            --input_path  "$SPARSE_DIR/0" \
            --output_path "$SCENE_DIR" \
            --output_type TXT &> /dev/null
    fi

    echo "       ✔ Finished \"$BASE\"  ($IDX/$TOTAL)"
done

echo "--------------------------------------------------------------"
echo " All jobs finished – results are in \"$SCENES_DIR\"."
echo "--------------------------------------------------------------"