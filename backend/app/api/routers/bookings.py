from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas, models, crud
from ...dependencies.database import get_db
from ...dependencies.auth import require_client_role, require_worker_role

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=schemas.booking.Booking)
def create_booking(
    booking: schemas.booking.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    job = crud.job.get_job(db, booking.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create booking for this job")

    # Check if application exists and is pending
    application = db.query(models.application.Application).filter(
        models.application.Application.job_id == booking.job_id,
        models.application.Application.worker_id == booking.worker_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != "pending":
        raise HTTPException(status_code=400, detail="Application not pending")

    existing_booking = crud.booking.get_booking_for_job_and_worker(db, booking.job_id, booking.worker_id)
    if existing_booking:
        raise HTTPException(status_code=400, detail="Booking already exists for this worker and job")

    # Update application status
    application.status = "accepted"
    db.add(application)

    booking.status = "pending"

    # Create booking
    new_booking = crud.booking.create_booking(db=db, booking=booking)

    # Check if job is filled
    job_bookings_count = len(crud.booking.get_bookings_for_job(db, job.id))
    if job_bookings_count >= job.staff_count:
        job.status = "filled"
        db.add(job)
    
    db.commit()
    db.refresh(new_booking)

    return new_booking


@router.get("/job/{job_id}", response_model=List[schemas.booking.Booking])
def read_bookings_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    job = crud.job.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view bookings for this job")
    
    bookings = crud.booking.get_bookings_for_job(db, job_id=job_id)
    return bookings


@router.get("/worker/me", response_model=List[schemas.booking.Booking])
def read_my_bookings(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    bookings = crud.booking.get_bookings_for_worker(db, worker_id=current_user.id)
    return bookings


@router.put("/{booking_id}/status", response_model=schemas.booking.Booking)
def update_booking_status(
    booking_id: int,
    payload: schemas.booking.BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    db_booking = crud.booking.get_booking(db, booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if db_booking.worker_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")
    if payload.status not in {"accepted", "completed", "cancelled"}:
        raise HTTPException(status_code=400, detail="Invalid booking status")

    return crud.booking.update_booking_status(db, db_booking, payload.status)
