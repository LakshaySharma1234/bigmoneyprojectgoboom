from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..schemas.assignment import AssignmentCreate
from . import notification_service, reliability_service


def _sync_job_status(db: Session, job_id: int) -> None:
    job = db.query(models.job.Job).filter(models.job.Job.id == job_id).first()
    if job is None:
        return

    filled_slots = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.job_id == job_id,
            models.assignment.Assignment.status.in_(["accepted", "completed"]),
        )
        .count()
    )
    job.status = "filled" if filled_slots >= job.staff_count else "open"
    db.add(job)


def _build_assignment_payload(db_assignment: models.assignment.Assignment, *, has_rating: bool = False) -> dict:
    worker = db_assignment.worker
    job = db_assignment.job
    profile = db_assignment.worker_profile

    worker_name = None
    if worker:
        worker_name = " ".join(part for part in [worker.first_name, worker.last_name] if part).strip() or None

    return {
        "id": db_assignment.id,
        "job_id": db_assignment.job_id,
        "worker_id": db_assignment.worker_id,
        "status": db_assignment.status,
        "created_at": db_assignment.created_at,
        "updated_at": db_assignment.updated_at,
        "worker_name": worker_name,
        "worker_location": worker.location if worker else None,
        "worker_skills": profile.skills if profile else None,
        "worker_avg_rating": float(profile.avg_rating or 0.0) if profile else 0.0,
        "worker_reliability_score": float(profile.reliability_score or 0.0) if profile else 0.0,
        "has_rating": has_rating,
        "job_title": job.title if job else None,
        "job_location": job.location if job else None,
    }


def _get_assignment_or_404(db: Session, assignment_id: int) -> models.assignment.Assignment:
    db_assignment = (
        db.query(models.assignment.Assignment)
        .filter(models.assignment.Assignment.id == assignment_id)
        .first()
    )
    if db_assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return db_assignment


def _get_job_for_client(db: Session, job_id: int, client_id: int) -> models.job.Job:
    db_job = db.query(models.job.Job).filter(models.job.Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if db_job.client_id != client_id:
        raise HTTPException(status_code=403, detail="Not authorized for this job")
    return db_job


def _get_existing_booking(db: Session, job_id: int, worker_id: int):
    return (
        db.query(models.booking.Booking)
        .filter(
            models.booking.Booking.job_id == job_id,
            models.booking.Booking.worker_id == worker_id,
        )
        .first()
    )


def _get_has_rating(db: Session, job_id: int, worker_id: int) -> bool:
    return (
        db.query(models.rating.Rating)
        .filter(
            models.rating.Rating.job_id == job_id,
            models.rating.Rating.worker_id == worker_id,
        )
        .first()
        is not None
    )


def create_assignment(db: Session, payload: AssignmentCreate, client_id: int) -> dict:
    _get_job_for_client(db, payload.job_id, client_id)

    worker = db.query(models.user.User).filter(models.user.User.id == payload.worker_id).first()
    if worker is None or worker.role != "worker":
        raise HTTPException(status_code=404, detail="Worker not found")

    application = (
        db.query(models.application.Application)
        .filter(
            models.application.Application.job_id == payload.job_id,
            models.application.Application.worker_id == payload.worker_id,
        )
        .first()
    )
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.status == "rejected":
        raise HTTPException(status_code=400, detail="Cannot assign a rejected application")

    existing_assignment = (
        db.query(models.assignment.Assignment)
        .filter(
            models.assignment.Assignment.job_id == payload.job_id,
            models.assignment.Assignment.worker_id == payload.worker_id,
        )
        .first()
    )
    if existing_assignment is not None:
        raise HTTPException(status_code=400, detail="Assignment already exists for this worker and job")

    db_assignment = models.assignment.Assignment(
        job_id=payload.job_id,
        worker_id=payload.worker_id,
        status="pending",
    )
    db.add(db_assignment)
    reliability_service.recompute_worker_metrics(db, payload.worker_id)
    _sync_job_status(db, payload.job_id)
    db.commit()
    db.refresh(db_assignment)

    notification_service.notify_worker_new_job(payload.worker_id, payload.job_id)
    return _build_assignment_payload(db_assignment)


def accept_assignment(db: Session, assignment_id: int, worker_id: int) -> dict:
    db_assignment = _get_assignment_or_404(db, assignment_id)
    if db_assignment.worker_id != worker_id:
        raise HTTPException(status_code=403, detail="Not authorized to accept this assignment")
    if db_assignment.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending assignments can be accepted")

    db_assignment.status = "accepted"
    db.add(db_assignment)

    db_booking = _get_existing_booking(db, db_assignment.job_id, db_assignment.worker_id)
    if db_booking is None:
        db.add(
            models.booking.Booking(
                job_id=db_assignment.job_id,
                worker_id=db_assignment.worker_id,
                status="accepted",
            )
        )
    else:
        db_booking.status = "accepted"
        db.add(db_booking)

    reliability_service.recompute_worker_metrics(db, worker_id)
    _sync_job_status(db, db_assignment.job_id)
    db.commit()
    db.refresh(db_assignment)

    notification_service.notify_assignment_status(worker_id, db_assignment.status)
    return _build_assignment_payload(db_assignment)


def reject_assignment(db: Session, assignment_id: int, worker_id: int) -> dict:
    db_assignment = _get_assignment_or_404(db, assignment_id)
    if db_assignment.worker_id != worker_id:
        raise HTTPException(status_code=403, detail="Not authorized to reject this assignment")
    if db_assignment.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending assignments can be rejected")

    db_assignment.status = "rejected"
    db.add(db_assignment)
    reliability_service.recompute_worker_metrics(db, worker_id)
    _sync_job_status(db, db_assignment.job_id)
    db.commit()
    db.refresh(db_assignment)

    notification_service.notify_assignment_status(worker_id, db_assignment.status)
    return _build_assignment_payload(db_assignment)


def complete_assignment(db: Session, assignment_id: int, client_id: int) -> dict:
    db_assignment = _get_assignment_or_404(db, assignment_id)
    _get_job_for_client(db, db_assignment.job_id, client_id)
    if db_assignment.status != "accepted":
        raise HTTPException(status_code=400, detail="Only accepted assignments can be completed")

    db_assignment.status = "completed"
    db.add(db_assignment)

    db_booking = _get_existing_booking(db, db_assignment.job_id, db_assignment.worker_id)
    if db_booking is not None:
        db_booking.status = "completed"
        db.add(db_booking)

    reliability_service.recompute_worker_metrics(db, db_assignment.worker_id)
    _sync_job_status(db, db_assignment.job_id)
    db.commit()
    db.refresh(db_assignment)

    notification_service.notify_assignment_status(db_assignment.worker_id, db_assignment.status)
    return _build_assignment_payload(
        db_assignment,
        has_rating=_get_has_rating(db, db_assignment.job_id, db_assignment.worker_id),
    )


def no_show_assignment(db: Session, assignment_id: int, client_id: int) -> dict:
    db_assignment = _get_assignment_or_404(db, assignment_id)
    _get_job_for_client(db, db_assignment.job_id, client_id)
    if db_assignment.status != "accepted":
        raise HTTPException(status_code=400, detail="Only accepted assignments can be marked as no-show")

    db_assignment.status = "no_show"
    db.add(db_assignment)

    db_booking = _get_existing_booking(db, db_assignment.job_id, db_assignment.worker_id)
    if db_booking is not None:
        db_booking.status = "cancelled"
        db.add(db_booking)

    reliability_service.recompute_worker_metrics(db, db_assignment.worker_id)
    _sync_job_status(db, db_assignment.job_id)
    db.commit()
    db.refresh(db_assignment)

    notification_service.notify_assignment_status(db_assignment.worker_id, db_assignment.status)
    return _build_assignment_payload(db_assignment)


def get_assignments_for_job(db: Session, job_id: int, client_id: int) -> List[dict]:
    _get_job_for_client(db, job_id, client_id)
    assignments = (
        db.query(models.assignment.Assignment)
        .filter(models.assignment.Assignment.job_id == job_id)
        .order_by(models.assignment.Assignment.created_at.desc())
        .all()
    )
    return [
        _build_assignment_payload(
            item,
            has_rating=_get_has_rating(db, item.job_id, item.worker_id),
        )
        for item in assignments
    ]


def get_assignments_for_worker(db: Session, worker_id: int) -> List[dict]:
    assignments = (
        db.query(models.assignment.Assignment)
        .filter(models.assignment.Assignment.worker_id == worker_id)
        .order_by(models.assignment.Assignment.created_at.desc())
        .all()
    )
    return [
        _build_assignment_payload(
            item,
            has_rating=_get_has_rating(db, item.job_id, item.worker_id),
        )
        for item in assignments
    ]
