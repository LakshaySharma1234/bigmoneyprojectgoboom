from sqlalchemy import Column, Integer, String, TEXT, TIMESTAMP, text, ForeignKey
from sqlalchemy.orm import relationship
from ..db.database import Base

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    skills = Column(TEXT)
    experience = Column(TEXT)
    availability = Column(TEXT)
    profile_picture_url = Column(String)
    updated_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="worker_profile")
