from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


# -------------------------
# Sub-models
# -------------------------

class SocialHandle(BaseModel):
    platform: str
    url: str


class Job(BaseModel):
    title: Optional[str]
    company: Optional[str]
    startDate: Optional[datetime]
    endDate: Optional[datetime]
    description: Optional[str]


# -------------------------
# User Model
# -------------------------

class User(BaseModel):
    id: str
    username: str
    name: str

    image: Optional[str] = None
    bio: Optional[str] = None

    countdowns: List[str] = []          # ObjectIds stored as strings
    onboarded: bool = False
    friendsId: List[str] = []

    communities: List[str] = []          # ObjectIds as strings

    twinxprojects: List[str] = []
    twinxfavprojects: List[str] = []

    socialhandles: List[SocialHandle] = []
    tags: List[str] = ["twinx user"]

    jobs: List[Job] = []

    country: str = "Earth"
    oneSentanceIntro: str = "Hello, I'm new to Twinx!"

    listedAssets: List[str] = []
    listedTwins: List[str] = []

    email: str = "No Email"
    website: str = "No Email"

    class Config:
        orm_mode = True
