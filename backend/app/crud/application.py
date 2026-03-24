from sqlalchemy.orm import Session
from .. import models, schemas

def get_application(db: Session, application_id: int):
    return db.query(models.application.Application).filter(models.application.Application.id == application_id).first()


def get_application_for_job_and_worker(db: Session, job_id: int, worker_id: int):
    return (
        db.query(models.application.Application)
        .filter(
            models.application.Application.job_id == job_id,
            models.application.Application.worker_id == worker_id,
        )
        .first()
    )

def get_applications_for_job(db: Session, job_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.application.Application).filter(models.application.Application.job_id == job_id).offset(skip).limit(limit).all()

def get_applications_for_worker(db: Session, worker_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.application.Application).filter(models.application.Application.worker_id == worker_id).offset(skip).limit(limit).all()

def create_application(db: Session, application: schemas.application.ApplicationCreate):
    db_application = models.application.Application(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def update_application_status(db: Session, db_application: models.application.Application, status: str):
    db_application.status = status
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application
