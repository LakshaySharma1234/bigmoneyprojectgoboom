from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..schemas.rating import RatingCreate
from . import reliability_service


def create_rating(db: Session, payload: RatingCreate, client_id: int):
    job = db.query(models.job.Job).filter(models.job.Job.id == payload.job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != client_id:
        raise HTTPException(status_code=403, detail="Not authorized to rate this worker")

    assignment = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.job_id == payload.job_id,
            models.assignment.Assignment.worker_id == payload.worker_id,
        )
        .first()
    )
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    if assignment.status != "completed":
        raise HTTPException(status_code=400, detail="Ratings can only be added after job completion")

    existing_rating = (
        db.query(models.rating.Rating)
        .filter(
            models.rating.Rating.job_id == payload.job_id,
            models.rating.Rating.worker_id == payload.worker_id,
            models.rating.Rating.client_id == client_id,
        )
        .first()
    )
    if existing_rating is not None:
        raise HTTPException(status_code=400, detail="Rating already submitted for this worker on this job")

    db_rating = models.rating.Rating(
        job_id=payload.job_id,
        worker_id=payload.worker_id,
        client_id=client_id,
        rating=payload.rating,
        feedback=payload.feedback,
    )
    db.add(db_rating)
    reliability_service.recompute_worker_metrics(db, payload.worker_id)
    db.commit()
    db.refresh(db_rating)
    return db_rating
