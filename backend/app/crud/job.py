from typing import Optional

from sqlalchemy.orm import Session
from .. import models, schemas

def get_job(db: Session, job_id: int):
    return db.query(models.job.Job).filter(models.job.Job.id == job_id).first()

def get_jobs(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = None,
    staff_type: Optional[str] = None,
    event_date=None,
    status: Optional[str] = None,
):
    query = db.query(models.job.Job)

    if location:
        query = query.filter(models.job.Job.location.ilike(f"%{location}%"))
    if staff_type:
        query = query.filter(models.job.Job.staff_type.ilike(f"%{staff_type}%"))
    if event_date:
        query = query.filter(models.job.Job.date == event_date)
    if status:
        query = query.filter(models.job.Job.status == status)

    return query.order_by(models.job.Job.date.asc()).offset(skip).limit(limit).all()

def get_jobs_by_client(db: Session, client_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.job.Job).filter(models.job.Job.client_id == client_id).offset(skip).limit(limit).all()

def create_job(db: Session, job: schemas.job.JobCreate, client_id: int):
    db_job = models.job.Job(**job.dict(), client_id=client_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def update_job(db: Session, db_job: models.job.Job, payload: schemas.job.JobUpdate):
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(db_job, field, value)

    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job
