from sqlalchemy import Column, Integer, String, TEXT, TIMESTAMP, text, ForeignKey, DECIMAL, DATE
from sqlalchemy.orm import relationship
from ..db.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(TEXT)
    location = Column(String, nullable=False)
    date = Column(DATE, nullable=False)
    duration = Column(String)
    staff_type = Column(String, nullable=False)
    staff_count = Column(Integer, nullable=False)
    pay_per_hour = Column(DECIMAL(10, 2))
    status = Column(String, default="open")
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), onupdate=text("CURRENT_TIMESTAMP"))

    client = relationship("User")
    applications = relationship("Application", back_populates="job")
    bookings = relationship("Booking", back_populates="job")
