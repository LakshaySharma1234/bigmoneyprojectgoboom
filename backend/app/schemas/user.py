from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserBase(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
