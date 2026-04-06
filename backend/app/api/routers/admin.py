from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ... import models, schemas, services
from ...dependencies.auth import get_current_user
from ...dependencies.database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview", response_model=schemas.admin.AdminOverview)
def read_admin_overview(
    db: Session = Depends(get_db),
    current_user: models.user.User = Depends(get_current_user),
):
    # TODO: restrict to admin role later
    return services.admin_service.get_overview(db)
