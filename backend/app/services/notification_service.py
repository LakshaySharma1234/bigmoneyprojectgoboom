import logging


logger = logging.getLogger(__name__)


def notify_worker_new_job(worker_id: int, job_id: int) -> None:
    logger.info("notify_worker_new_job worker_id=%s job_id=%s", worker_id, job_id)


def notify_assignment_status(worker_id: int, status: str) -> None:
    logger.info("notify_assignment_status worker_id=%s status=%s", worker_id, status)
