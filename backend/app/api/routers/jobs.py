from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ... import crud, models, schemas, services
from ...dependencies.database import get_db
from ...dependencies.auth import get_current_user, require_client_role

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", response_model=schemas.job.Job)
def create_job(
    job: schemas.job.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    return crud.job.create_job(db=db, job=job, client_id=current_user.id)


@router.get("/", response_model=List[schemas.job.Job])
def read_jobs(
    skip: int = 0,
    limit: int = 100,
    location: Optional[str] = None,
    staff_type: Optional[str] = None,
    event_date: Optional[date] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    jobs = crud.job.get_jobs(
        db,
        skip=skip,
        limit=limit,
        location=location,
        staff_type=staff_type,
        event_date=event_date,
        status=status,
    )
    return jobs


@router.get("/{job_id}", response_model=schemas.job.Job)
def read_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.job.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job


@router.get("/{job_id}/assignments", response_model=List[schemas.assignment.Assignment])
def read_assignments_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    # TODO: restrict to admin role later
    if current_user.role == "client":
        return services.assignment_service.get_assignments_for_job(db, job_id, current_user.id)

    job = crud.job.get_job(db, job_id=job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return services.assignment_service.get_assignments_for_job(db, job_id, job.client_id)


@router.get("/{job_id}/matches", response_model=List[schemas.worker_profile.WorkerMatch])
def read_job_matches(
    job_id: int,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    # TODO: restrict to admin role later
    return services.matching_service.get_best_workers(db, job_id, limit=limit)


@router.put("/{job_id}", response_model=schemas.job.Job)
def update_job(
    job_id: int,
    payload: schemas.job.JobUpdate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    db_job = crud.job.get_job(db, job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    return crud.job.update_job(db, db_job, payload)
