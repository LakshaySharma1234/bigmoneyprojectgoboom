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
