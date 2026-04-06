from pydantic import BaseModel, ConfigDict
from typing import Optional

class WorkerProfileBase(BaseModel):
    skills: Optional[str] = None
    experience: Optional[str] = None
    availability: Optional[str] = None
    profile_picture_url: Optional[str] = None

class WorkerProfileCreate(WorkerProfileBase):
    pass

class WorkerProfile(WorkerProfileBase):
    id: int
    user_id: int
    total_jobs: int = 0
    completed_jobs: int = 0
    no_show_count: int = 0
    avg_rating: float = 0.0
    reliability_score: float = 0.0
    model_config = ConfigDict(from_attributes=True)


class WorkerDirectoryEntry(BaseModel):
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    availability: Optional[str] = None
    profile_picture_url: Optional[str] = None
    total_jobs: int = 0
    completed_jobs: int = 0
    no_show_count: int = 0
    avg_rating: float = 0.0
    reliability_score: float = 0.0


class WorkerPerformance(BaseModel):
    worker_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    total_jobs: int = 0
    completed_jobs: int = 0
    no_show_count: int = 0
    avg_rating: float = 0.0
    reliability_score: float = 0.0
    response_rate: float = 0.0


class WorkerMatch(BaseModel):
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    avg_rating: float = 0.0
    reliability_score: float = 0.0
    location_match: bool = False
    match_reason: Optional[str] = None
