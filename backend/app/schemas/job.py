from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date
from decimal import Decimal

class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    date: date
    duration: Optional[str] = None
    staff_type: str
    staff_count: int
    pay_per_hour: Optional[Decimal] = None
    status: Optional[str] = "open"

class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[date] = None
    duration: Optional[str] = None
    staff_type: Optional[str] = None
    staff_count: Optional[int] = None
    pay_per_hour: Optional[Decimal] = None
    status: Optional[str] = None

class Job(JobBase):
    id: int
    client_id: int
    model_config = ConfigDict(from_attributes=True)
