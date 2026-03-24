from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BookingBase(BaseModel):
    job_id: int
    worker_id: int
    status: Optional[str] = "pending"

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class BookingStatusUpdate(BaseModel):
    status: str
