from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..crud import user as crud_user
from ..schemas.user import UserCreate, UserLogin
from ..core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

ACCESS_TOKEN_EXPIRE_MINUTES = 30

ROLE_ALIASES = {
    "worker": "worker",
    "staff": "worker",
    "client": "client",
    "employer": "client",
}


def normalize_role(role: str) -> str:
    normalized_role = ROLE_ALIASES.get(role.strip().lower())
    if not normalized_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be one of: worker, staff, client, employer",
        )
    return normalized_role

def register_user(db: Session, user: UserCreate):
    existing_user = crud_user.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user.role = normalize_role(user.role)
    return crud_user.create_user(db=db, user=user)

def login_user(db: Session, user: UserLogin):
    db_user = crud_user.get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
