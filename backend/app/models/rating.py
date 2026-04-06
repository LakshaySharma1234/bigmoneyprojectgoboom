from sqlalchemy import CheckConstraint, Column, ForeignKey, Integer, TEXT, TIMESTAMP, text
from sqlalchemy.orm import relationship

from ..db.database import Base


class Rating(Base):
    __tablename__ = "ratings"
    __table_args__ = (CheckConstraint("rating >= 1 AND rating <= 5", name="ck_ratings_range"),)

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, index=True)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    feedback = Column(TEXT)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

    job = relationship("Job", back_populates="ratings")
    worker = relationship("User", foreign_keys=[worker_id])
    client = relationship("User", foreign_keys=[client_id])
    worker_profile = relationship(
        "WorkerProfile",
        primaryjoin="Rating.worker_id==foreign(WorkerProfile.user_id)",
        viewonly=True,
    )
