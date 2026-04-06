from sqlalchemy import Column, Float, ForeignKey, Integer, String, TEXT, TIMESTAMP, text
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
    total_jobs = Column(Integer, nullable=False, default=0, server_default=text("0"))
    completed_jobs = Column(Integer, nullable=False, default=0, server_default=text("0"))
    no_show_count = Column(Integer, nullable=False, default=0, server_default=text("0"))
    avg_rating = Column(Float, nullable=False, default=0.0, server_default=text("0"))
    reliability_score = Column(Float, nullable=False, default=0.0, server_default=text("0"))
    updated_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="worker_profile")
    assignments = relationship(
        "Assignment",
        primaryjoin="WorkerProfile.user_id==foreign(Assignment.worker_id)",
        viewonly=True,
    )
    ratings = relationship(
        "Rating",
        primaryjoin="WorkerProfile.user_id==foreign(Rating.worker_id)",
        viewonly=True,
    )
