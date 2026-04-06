from sqlalchemy.orm import Session

from .. import models, schemas
from . import assignment_service, reliability_service


def get_overview(db: Session) -> schemas.admin.AdminOverview:
    recent_assignments = (
        db.query(models.assignment.Assignment)
        .order_by(models.assignment.Assignment.created_at.desc())
        .limit(10)
        .all()
    )

    return schemas.admin.AdminOverview(
        total_jobs=db.query(models.job.Job).count(),
        open_jobs=db.query(models.job.Job).filter(models.job.Job.status == "open").count(),
        filled_jobs=db.query(models.job.Job).filter(models.job.Job.status == "filled").count(),
        total_workers=db.query(models.user.User).filter(models.user.User.role == "worker").count(),
        total_assignments=db.query(models.assignment.Assignment).count(),
        pending_assignments=db.query(models.assignment.Assignment).filter(models.assignment.Assignment.status == "pending").count(),
        accepted_assignments=db.query(models.assignment.Assignment).filter(models.assignment.Assignment.status == "accepted").count(),
        completed_assignments=db.query(models.assignment.Assignment).filter(models.assignment.Assignment.status == "completed").count(),
        rejected_assignments=db.query(models.assignment.Assignment).filter(models.assignment.Assignment.status == "rejected").count(),
        no_show_assignments=db.query(models.assignment.Assignment).filter(models.assignment.Assignment.status == "no_show").count(),
        recent_assignments=[assignment_service._build_assignment_payload(item) for item in recent_assignments],
    )


def get_worker_performance(db: Session, worker_id: int) -> schemas.worker_profile.WorkerPerformance:
    worker = db.query(models.user.User).filter(models.user.User.id == worker_id).first()
    if worker is None or worker.role != "worker":
        raise ValueError("Worker not found")

    profile = (
        db.query(models.worker_profile.WorkerProfile)
        .filter(models.worker_profile.WorkerProfile.user_id == worker_id)
        .first()
    )
    if profile is None:
        profile = reliability_service.recompute_worker_metrics(db, worker_id)
        db.commit()
        db.refresh(profile)

    return schemas.worker_profile.WorkerPerformance(
        worker_id=worker.id,
        first_name=worker.first_name,
        last_name=worker.last_name,
        total_jobs=profile.total_jobs,
        completed_jobs=profile.completed_jobs,
        no_show_count=profile.no_show_count,
        avg_rating=float(profile.avg_rating or 0.0),
        reliability_score=float(profile.reliability_score or 0.0),
        response_rate=round(reliability_service.get_response_rate(db, worker_id), 4),
    )
