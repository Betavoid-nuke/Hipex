from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


# -------------------------
# Sub-models
# -------------------------

class PipelineStep(BaseModel):
    id: int
    name: str
    description: str
    icon: str


# -------------------------
# Main Project Model
# -------------------------

class TwinxProject(BaseModel):
    title: str
    twinxid: str

    thumbnail: Optional[str] = ""
    ThumbnailUrl: Optional[str] = ""
    videoUrl: Optional[str] = ""

    currentStep: int = 0
    ownerID: str

    published: Optional[bool] = False
    isFavorite: Optional[bool] = False
    isPublished: Optional[bool] = False

    toatlSteps: int = 0

    pipelineConfig: List[PipelineStep] = [
        PipelineStep(
            id=1,
            name="Upload",
            description="Video is being uploaded to secure servers.",
            icon="UploadCloud",
        ),
        PipelineStep(
            id=2,
            name="Transcoding",
            description="Adjusting video format for compatibility.",
            icon="Settings",
        ),
        PipelineStep(
            id=3,
            name="Quality Analysis",
            description="Assessing video resolution and bitrate.",
            icon="Check",
        ),
        PipelineStep(
            id=4,
            name="Scene Detection",
            description="Identifying distinct scenes in the video.",
            icon="FileText",
        ),
        PipelineStep(
            id=5,
            name="Object Recognition",
            description="Detecting objects within each frame.",
            icon="Search",
        ),
        PipelineStep(
            id=6,
            name="Metadata Extraction",
            description="Gathering technical details from the file.",
            icon="Briefcase",
        ),
        PipelineStep(
            id=7,
            name="Audio Transcription",
            description="Converting spoken words to text.",
            icon="User",
        ),
        PipelineStep(
            id=8,
            name="Geometry Mapping",
            description="Creating a 3D representation of the scene.",
            icon="MoreVertical",
        ),
        PipelineStep(
            id=9,
            name="Texture Baking",
            description="Applying textures to the 3D model.",
            icon="Star",
        ),
        PipelineStep(
            id=10,
            name="Lighting Simulation",
            description="Simulating realistic lighting conditions.",
            icon="Eye",
        ),
        PipelineStep(
            id=11,
            name="Physics Caching",
            description="Pre-calculating physics interactions.",
            icon="Trash2",
        ),
        PipelineStep(
            id=12,
            name="Final Assembly",
            description="Compiling all data into the final twin.",
            icon="Check",
        ),
    ]

    pipelineFinished: bool = False

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        orm_mode = True
