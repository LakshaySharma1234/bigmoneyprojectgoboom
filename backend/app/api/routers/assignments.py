from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ... import models, schemas, services
from ...dependencies.auth import require_client_role, require_worker_role
from ...dependencies.database import get_db

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.post("/create", response_model=schemas.assignment.Assignment)
def create_assignment(
    payload: schemas.assignment.AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    return services.assignment_service.create_assignment(db, payload, current_user.id)


@router.post("/{assignment_id}/accept", response_model=schemas.assignment.Assignment)
def accept_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    return services.assignment_service.accept_assignment(db, assignment_id, current_user.id)


@router.post("/{assignment_id}/reject", response_model=schemas.assignment.Assignment)
def reject_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    return services.assignment_service.reject_assignment(db, assignment_id, current_user.id)


@router.post("/{assignment_id}/complete", response_model=schemas.assignment.Assignment)
def complete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    return services.assignment_service.complete_assignment(db, assignment_id, current_user.id)


@router.post("/{assignment_id}/no-show", response_model=schemas.assignment.Assignment)
def no_show_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    return services.assignment_service.no_show_assignment(db, assignment_id, current_user.id)


@router.get("/worker/me", response_model=List[schemas.assignment.Assignment])
def read_my_assignments(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_worker_role),
):
    return services.assignment_service.get_assignments_for_worker(db, current_user.id)
