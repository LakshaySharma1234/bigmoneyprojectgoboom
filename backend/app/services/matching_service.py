from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas


def get_best_workers(db: Session, job_id: int, limit: int = 5) -> List[schemas.worker_profile.WorkerMatch]:
    job = db.query(models.job.Job).filter(models.job.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    staff_type = (job.staff_type or "").strip().lower()
    job_location = (job.location or "").strip().lower()

    query = (
        db.query(models.user.User, models.worker_profile.WorkerProfile)
        .join(
            models.worker_profile.WorkerProfile,
            models.worker_profile.WorkerProfile.user_id == models.user.User.id,
        )
        .filter(models.user.User.role == "worker")
        .filter(models.worker_profile.WorkerProfile.availability.isnot(None))
        .filter(models.worker_profile.WorkerProfile.availability != "")
    )

    if staff_type:
        query = query.filter(models.worker_profile.WorkerProfile.skills.ilike(f"%{staff_type}%"))

    rows = query.all()
    matches = []
    for user, profile in rows:
        user_location = (user.location or "").strip().lower()
        location_match = bool(job_location and user_location and job_location in user_location)
        matches.append(
            schemas.worker_profile.WorkerMatch(
                user_id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                location=user.location,
                skills=profile.skills,
                availability=profile.availability,
                avg_rating=float(profile.avg_rating or 0.0),
                reliability_score=float(profile.reliability_score or 0.0),
                location_match=location_match,
                match_reason=(
                    f"Matched {job.staff_type} against worker skills"
                    + (" and found a location match." if location_match else ".")
                ),
            )
        )

    matches.sort(
        key=lambda worker: (
            worker.reliability_score,
            1 if worker.location_match else 0,
            worker.avg_rating,
        ),
        reverse=True,
    )
    return matches[:limit]
