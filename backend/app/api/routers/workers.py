from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ... import crud, models, schemas, services
from ...dependencies.auth import get_current_user, require_worker_role
from ...dependencies.database import get_db

router = APIRouter(prefix="/workers", tags=["workers"])


@router.get("/", response_model=List[schemas.worker_profile.WorkerDirectoryEntry])
def list_workers(
    location: Optional[str] = None,
    skill: Optional[str] = None,
    availability: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.worker_profile.list_worker_profiles(
        db,
        location=location,
        skill=skill,
        availability=availability,
        skip=skip,
        limit=limit,
    )


@router.get("/me/profile", response_model=Optional[schemas.worker_profile.WorkerProfile])
def read_my_worker_profile(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    return crud.worker_profile.get_profile_by_user_id(db, current_user.id)


@router.put("/me/profile", response_model=schemas.worker_profile.WorkerProfile)
def upsert_my_worker_profile(
    profile: schemas.worker_profile.WorkerProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    return crud.worker_profile.upsert_profile(db, current_user.id, profile)


@router.get("/{worker_id}/performance", response_model=schemas.worker_profile.WorkerPerformance)
def read_worker_performance(
    worker_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    # TODO: restrict to admin role later
    try:
        return services.admin_service.get_worker_performance(db, worker_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
