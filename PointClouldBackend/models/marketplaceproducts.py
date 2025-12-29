from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


# -------------------------
# Sub-models
# -------------------------

class DownloadUrl(BaseModel):
    format: str
    url: str


class Comment(BaseModel):
    content: str
    owner: str                # userId or username
    date: Optional[datetime] = None
    likes: int = 0
    LikedBy: List[str] = []


# -------------------------
# Main Model
# -------------------------

class MarketplaceProduct(BaseModel):
    title: str
    description: str

    imageUrl: List[str]
    category: str

    creator: str
    creatorid: str

    downloads: int = 0

    downloadUrls: List[DownloadUrl] = []
    comments: List[Comment] = []

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        orm_mode = True
