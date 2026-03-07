from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...dependencies.database import get_db
from ...schemas.user import UserCreate, UserLogin
from ...services import auth_services

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return auth_services.register_user(db, user)


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return auth_services.login_user(db, user)
