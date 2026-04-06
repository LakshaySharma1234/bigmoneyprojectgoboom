from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AssignmentCreate(BaseModel):
    job_id: int
    worker_id: int


class Assignment(BaseModel):
    id: int
    job_id: int
    worker_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    worker_name: Optional[str] = None
    worker_location: Optional[str] = None
    worker_skills: Optional[str] = None
    worker_avg_rating: float = 0.0
    worker_reliability_score: float = 0.0
    has_rating: bool = False
    job_title: Optional[str] = None
    job_location: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
