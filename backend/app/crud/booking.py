from sqlalchemy.orm import Session
from .. import models, schemas

def get_booking(db: Session, booking_id: int):
    return db.query(models.booking.Booking).filter(models.booking.Booking.id == booking_id).first()


def get_booking_for_job_and_worker(db: Session, job_id: int, worker_id: int):
    return (
        db.query(models.booking.Booking)
        .filter(
            models.booking.Booking.job_id == job_id,
            models.booking.Booking.worker_id == worker_id,
        )
        .first()
    )

def get_bookings_for_job(db: Session, job_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.booking.Booking).filter(models.booking.Booking.job_id == job_id).offset(skip).limit(limit).all()

def get_bookings_for_worker(db: Session, worker_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.booking.Booking).filter(models.booking.Booking.worker_id == worker_id).offset(skip).limit(limit).all()

def get_bookings_by_client(db: Session, client_id: int, skip: int = 0, limit: int = 100):
    # This requires a join to get the client_id from the job
    return db.query(models.booking.Booking).join(models.job.Job).filter(models.job.Job.client_id == client_id).offset(skip).limit(limit).all()

def create_booking(db: Session, booking: schemas.booking.BookingCreate):
    db_booking = models.booking.Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def update_booking_status(db: Session, db_booking: models.booking.Booking, status: str):
    db_booking.status = status
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
