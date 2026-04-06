from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ... import models, schemas, services
from ...dependencies.auth import require_client_role
from ...dependencies.database import get_db

router = APIRouter(prefix="/ratings", tags=["ratings"])


@router.post("/", response_model=schemas.rating.Rating)
def create_rating(
    payload: schemas.rating.RatingCreate,
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(require_client_role),
):
    return services.rating_service.create_rating(db, payload, current_user.id)
