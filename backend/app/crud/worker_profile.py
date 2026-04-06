from typing import Optional

from sqlalchemy.orm import Session

from .. import models, schemas


def get_profile_by_user_id(db: Session, user_id: int):
    return (
        db.query(models.worker_profile.WorkerProfile)
        .filter(models.worker_profile.WorkerProfile.user_id == user_id)
        .first()
    )


def upsert_profile(
    db: Session,
    user_id: int,
    profile: schemas.worker_profile.WorkerProfileCreate,
):
    db_profile = get_profile_by_user_id(db, user_id)
    payload = profile.dict()

    if db_profile is None:
        db_profile = models.worker_profile.WorkerProfile(user_id=user_id, **payload)
        db.add(db_profile)
    else:
        for field, value in payload.items():
            setattr(db_profile, field, value)

    db.commit()
    db.refresh(db_profile)
    return db_profile


def list_worker_profiles(
    db: Session,
    *,
    location: Optional[str] = None,
    skill: Optional[str] = None,
    availability: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = (
        db.query(models.user.User, models.worker_profile.WorkerProfile)
        .join(
            models.worker_profile.WorkerProfile,
            models.worker_profile.WorkerProfile.user_id == models.user.User.id,
        )
        .filter(models.user.User.role == "worker")
    )

    if location:
        query = query.filter(models.user.User.location.ilike(f"%{location}%"))
    if skill:
        query = query.filter(models.worker_profile.WorkerProfile.skills.ilike(f"%{skill}%"))
    if availability:
        query = query.filter(models.worker_profile.WorkerProfile.availability.ilike(f"%{availability}%"))

    rows = query.offset(skip).limit(limit).all()

    return [
        schemas.worker_profile.WorkerDirectoryEntry(
            user_id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            location=user.location,
            phone_number=user.phone_number,
            skills=profile.skills,
            experience=profile.experience,
            availability=profile.availability,
            profile_picture_url=profile.profile_picture_url,
            total_jobs=profile.total_jobs or 0,
            completed_jobs=profile.completed_jobs or 0,
            no_show_count=profile.no_show_count or 0,
            avg_rating=float(profile.avg_rating or 0.0),
            reliability_score=float(profile.reliability_score or 0.0),
        )
        for user, profile in rows
    ]
