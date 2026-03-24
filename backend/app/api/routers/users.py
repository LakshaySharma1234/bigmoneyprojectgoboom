from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import schemas, models, crud
from ...dependencies.database import get_db
from ...dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=schemas.user.User)
def read_users_me(current_user: models.user.User = Depends(get_current_user)):
    return current_user

@router.get("/me/jobs", response_model=List[schemas.job.Job])
def read_my_jobs(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    return crud.job.get_jobs_by_client(db, client_id=current_user.id)

@router.get("/me/bookings", response_model=List[schemas.booking.Booking])
def read_my_bookings(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    if current_user.role != "client":
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.booking.get_bookings_by_client(db, client_id=current_user.id)


@router.get("/{user_id}", response_model=schemas.user.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
