from typing import List

from pydantic import BaseModel

from .assignment import Assignment


class AdminOverview(BaseModel):
    total_jobs: int
    open_jobs: int
    filled_jobs: int
    total_workers: int
    total_assignments: int
    pending_assignments: int
    accepted_assignments: int
    completed_assignments: int
    rejected_assignments: int
    no_show_assignments: int
    recent_assignments: List[Assignment]
