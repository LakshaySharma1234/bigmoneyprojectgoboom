from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RatingCreate(BaseModel):
    job_id: int
    worker_id: int
    rating: int = Field(ge=1, le=5)
    feedback: Optional[str] = None


class Rating(BaseModel):
    id: int
    job_id: int
    worker_id: int
    client_id: int
    rating: int
    feedback: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
