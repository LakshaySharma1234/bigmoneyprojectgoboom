from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas, models, crud
from ...dependencies.database import get_db
from ...dependencies.auth import get_current_user, require_worker_role, require_client_role

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=schemas.application.Application)
def create_application(
    application: schemas.application.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    # Check if worker is applying to their own job - not possible with current schema, but good practice
    job = crud.job.get_job(db, application.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.client_id == current_user.id:
        raise HTTPException(status_code=400, detail="Workers cannot apply to their own jobs")

    existing_application = crud.application.get_application_for_job_and_worker(
        db,
        application.job_id,
        current_user.id,
    )
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    application.worker_id = current_user.id
    return crud.application.create_application(db=db, application=application)


@router.get("/job/{job_id}", response_model=List[schemas.application.Application])
def read_applications_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    job = crud.job.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view applications for this job")
    
    applications = crud.application.get_applications_for_job(db, job_id=job_id)
    return applications


@router.get("/worker/me", response_model=List[schemas.application.Application])
def read_my_applications(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    applications = crud.application.get_applications_for_worker(db, worker_id=current_user.id)
    return applications


@router.put("/{application_id}/status", response_model=schemas.application.Application)
def update_application_status(
    application_id: int,
    payload: schemas.application.ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    db_application = crud.application.get_application(db, application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = crud.job.get_job(db, db_application.job_id)
    if not job or job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")

    if payload.status not in {"pending", "accepted", "rejected"}:
        raise HTTPException(status_code=400, detail="Invalid application status")

    return crud.application.update_application_status(db, db_application, payload.status)
