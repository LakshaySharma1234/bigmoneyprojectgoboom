# System Design

## Overview

This repository remains a FastAPI backend with a React + TypeScript frontend.
The existing job creation, application flow, and legacy booking workflow are preserved.
New operational logic is layered on top of the MVP without removing backward-compatible endpoints.

## Architectural Decisions

- Assignments are the new source of truth for worker engagement.
- Bookings remain in place for backward compatibility only.
- Reliability metrics are stored on `worker_profiles`, not `users`.
- Ratings are persisted in a dedicated `ratings` table and rolled into worker profile metrics.
- New schema changes are managed through Alembic migrations instead of `Base.metadata.create_all`.
- Admin visibility endpoints are temporarily available to any authenticated user.
- Notification hooks are abstractions only and currently log events.

## Feature 1: Worker Assignment & Acceptance System

### What Was Added

- New `assignments` table and SQLAlchemy model.
- Assignment endpoints:
  - `POST /assignments/create`
  - `POST /assignments/{id}/accept`
  - `POST /assignments/{id}/reject`
  - `POST /assignments/{id}/complete`
  - `POST /assignments/{id}/no-show`
  - `GET /assignments/worker/me`
  - `GET /jobs/{id}/assignments`
- Assignment service layer to keep business logic out of route handlers.
- Worker assignment inbox UI for accept/reject.
- Employer-side assignment tracking panel.

### Why It Was Added

- The previous booking-based acceptance flow made bookings drive operational logic.
- The platform now has an explicit pending acceptance step before a booking is created.
- This aligns worker response, fulfillment, and no-show tracking with a dedicated source of truth.

### Data Model Changes

- Added `assignments` table with:
  - `id`
  - `job_id`
  - `worker_id`
  - `status`
  - `created_at`
  - `updated_at`

### Tradeoffs

- Legacy booking creation endpoints remain intact, so there are temporarily two ways to create engagement records.
- New frontend flows now use assignments, but old booking endpoints still exist for compatibility.

### Future Improvements

- Add assignment audit history for staff dispatching.
- Add concurrency controls to prevent oversubscription under heavy simultaneous acceptance.

### Files Modified

- `backend/app/models/assignment.py`
- `backend/app/schemas/assignment.py`
- `backend/app/services/assignment_service.py`
- `backend/app/api/routers/assignments.py`
- `backend/app/api/routers/jobs.py`
- `frontend/src/app/components/WorkerAssignmentsList.tsx`
- `frontend/src/app/components/JobAssignmentsPanel.tsx`
- `frontend/src/app/components/ApplicationList.tsx`
- `frontend/src/app/components/MyJobsListItem.tsx`
- `frontend/src/app/pages/StaffDashboardPage.tsx`

## Feature 2: Worker Reliability System

### What Was Added

- Reliability fields on `worker_profiles`:
  - `total_jobs`
  - `completed_jobs`
  - `no_show_count`
  - `avg_rating`
  - `reliability_score`
- Reliability recomputation service based only on assignment and rating data.
- Minimal ratings system with `ratings` table and `POST /ratings/`.
- Worker performance endpoint: `GET /workers/{id}/performance`
- Reliability display in worker profile and employer assignment views.

### Why It Was Added

- Operational staffing needs durable worker trust metrics.
- Reliability now reflects fulfillment, no-shows, rating quality, and assignment response behavior.

### Data Model Changes

- Added worker profile metrics columns.
- Added `ratings` table with:
  - `id`
  - `job_id`
  - `worker_id`
  - `client_id`
  - `rating`
  - `feedback`
  - `created_at`

### Tradeoffs

- Metrics are recomputed and stored on writes instead of being lazily calculated on reads.
- Response rate currently treats all non-pending assignment responses equally and does not yet include timing quality.

### Future Improvements

- Add rating edits and dispute handling.
- Store response timestamps to evolve response-rate quality beyond binary replied/not replied.

### Files Modified

- `backend/app/models/worker_profile.py`
- `backend/app/models/rating.py`
- `backend/app/schemas/worker_profile.py`
- `backend/app/schemas/rating.py`
- `backend/app/services/reliability_service.py`
- `backend/app/services/rating_service.py`
- `backend/app/api/routers/ratings.py`
- `backend/app/api/routers/workers.py`
- `frontend/src/app/components/WorkerProfileForm.tsx`

## Feature 3: Basic Matching System

### What Was Added

- `matching_service.py`
- `GET /jobs/{id}/matches`
- Employer-facing matching suggestions panel in the job review dialog

### Why It Was Added

- Clients need a quick shortlist of workers before manually creating assignments.
- The system now surfaces the best available workers using current free-text skills and stored reliability.

### Data Model Changes

- No new tables were needed.
- Matching uses `jobs.staff_type` against `worker_profiles.skills` with case-insensitive partial matching.

### Tradeoffs

- Availability is still free-text, so matching currently uses simple presence filtering rather than structured schedule resolution.
- Distance is approximated via location text match because there is no geospatial data yet.

### Future Improvements

- Normalize worker skills into structured tags.
- Add geospatial coordinates and travel radius constraints.
- Add date-aware availability parsing.

### Files Modified

- `backend/app/services/matching_service.py`
- `backend/app/api/routers/jobs.py`
- `frontend/src/app/components/MatchingSuggestions.tsx`
- `frontend/src/app/components/MyJobsListItem.tsx`

## Feature 4: Admin Visibility Dashboard

### What Was Added

- `GET /admin/overview`
- Summary counts for job/assignment operations
- Recent assignment visibility
- Minimal frontend operations dashboard

### Why It Was Added

- The MVP needed a single place to inspect pending work, accepted staffing, and no-show risk.

### Data Model Changes

- No new tables were required beyond assignments and ratings.

### Tradeoffs

- Admin endpoints are temporarily open to all authenticated users.
- The dashboard is intentionally backend-first and operational rather than polished.

### Future Improvements

- Introduce a real admin role and scope-sensitive filtering.
- Add charts, time windows, and assignment aging metrics.

### Files Modified

- `backend/app/schemas/admin.py`
- `backend/app/services/admin_service.py`
- `backend/app/api/routers/admin.py`
- `frontend/src/app/components/AdminOverviewPanel.tsx`
- `frontend/src/app/pages/EmployerDashboardPage.tsx`
- `frontend/src/app/pages/StaffDashboardPage.tsx`

## Feature 5: Notification Hook Abstraction

### What Was Added

- `notification_service.py`
- Assignment creation and assignment status updates now emit internal log events

### Why It Was Added

- This creates a stable integration seam for future SMS, email, or WhatsApp delivery without coupling transport code to business logic.

### Data Model Changes

- No schema changes.

### Tradeoffs

- Notifications are currently log-only and not persisted.

### Future Improvements

- Add delivery adapters and retry tracking.
- Persist notification events for observability.

### Files Modified

- `backend/app/services/notification_service.py`
- `backend/app/services/assignment_service.py`

## Migration Strategy

- Alembic configuration now lives under `backend/alembic/`.
- Initial migration file:
  - `backend/alembic/versions/20260406_0001_assignments_reliability_admin.py`
- `Base.metadata.create_all(...)` was removed from application startup.

## Operational Notes

- Apply schema changes with Alembic before running the upgraded backend.
- Existing booking endpoints remain available but should not be used for new assignment-driven workflows.
- Current admin route access includes a code comment marker for future restriction:
  - `# TODO: restrict to admin role later`
