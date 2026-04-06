from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models


ACTIVE_ASSIGNMENT_STATUSES = {"accepted", "completed", "no_show"}
RESPONDED_ASSIGNMENT_STATUSES = {"accepted", "rejected", "completed", "no_show"}


def _get_or_create_worker_profile(db: Session, worker_id: int) -> models.worker_profile.WorkerProfile:
    profile = (
        db.query(models.worker_profile.WorkerProfile)
        .filter(models.worker_profile.WorkerProfile.user_id == worker_id)
        .first()
    )
    if profile is None:
        profile = models.worker_profile.WorkerProfile(user_id=worker_id)
        db.add(profile)
        db.flush()
    return profile


def get_response_rate(db: Session, worker_id: int) -> float:
    total_assignments = (
        db.query(models.assignment.Assignment)
        .filter(models.assignment.Assignment.worker_id == worker_id)
        .count()
    )
    if total_assignments == 0:
        return 0.0

    responded_assignments = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.worker_id == worker_id,
            models.assignment.Assignment.status.in_(RESPONDED_ASSIGNMENT_STATUSES),
        )
        .count()
    )
    return responded_assignments / total_assignments


def recompute_worker_metrics(db: Session, worker_id: int) -> models.worker_profile.WorkerProfile:
    profile = _get_or_create_worker_profile(db, worker_id)

    total_jobs = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.worker_id == worker_id,
            models.assignment.Assignment.status.in_(ACTIVE_ASSIGNMENT_STATUSES),
        )
        .count()
    )
    completed_jobs = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.worker_id == worker_id,
            models.assignment.Assignment.status == "completed",
        )
        .count()
    )
    no_show_count = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.worker_id == worker_id,
            models.assignment.Assignment.status == "no_show",
        )
        .count()
    )

    avg_rating = (
        db.query(func.avg(models.rating.Rating.rating))
        .filter(models.rating.Rating.worker_id == worker_id)
        .scalar()
    )
    avg_rating = float(avg_rating or 0.0)

    response_rate = get_response_rate(db, worker_id)
    completion_ratio = (completed_jobs / total_jobs) if total_jobs else 0.0
    reliability_score = (completion_ratio * 0.5) + ((avg_rating / 5) * 0.3) + (response_rate * 0.2)

    profile.total_jobs = total_jobs
    profile.completed_jobs = completed_jobs
    profile.no_show_count = no_show_count
    profile.avg_rating = round(avg_rating, 2)
    profile.reliability_score = round(reliability_score, 4)

    db.add(profile)
    db.flush()
    return profile
