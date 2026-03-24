# Event Hospitality Staffing Platform

Production-ready MVP marketplace for the Indian event industry. The platform connects event organizers with temporary hospitality workers such as waiters, bartenders, chefs, cleaners, and helpers.

## Project Overview

This repository contains a two-sided marketplace with:

- Clients who create jobs, review applications, create bookings, and track hiring activity
- Workers who register, maintain profiles, browse jobs, apply, and manage bookings

The current implementation is intentionally MVP-first:

- Role-based authentication with JWT
- Worker profile management
- Job posting and listing
- Job applications
- Booking lifecycle tracking
- React dashboards for both roles
- FastAPI REST API backed by PostgreSQL

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL
- Auth: JWT bearer tokens

## System Architecture

```text
React + Tailwind SPA
        |
        | HTTP/JSON + Bearer Token
        v
FastAPI REST API
        |
        | SQLAlchemy ORM
        v
PostgreSQL
```

Request flow:

1. The React frontend sends authentication or business requests to FastAPI.
2. FastAPI validates JWT tokens and role permissions.
3. Routers call CRUD helpers and business rules.
4. SQLAlchemy persists and queries marketplace data in PostgreSQL.
5. JSON responses drive dashboard state in the frontend.

## Folder Structure

```text
.
├── backend
│   ├── app
│   │   ├── api/routers        # REST endpoints
│   │   ├── core               # security and shared backend config
│   │   ├── crud               # database access helpers
│   │   ├── db                 # engine/session setup
│   │   ├── dependencies       # auth and database dependencies
│   │   ├── models             # SQLAlchemy models
│   │   ├── schemas            # Pydantic request/response models
│   │   └── main.py            # FastAPI app entrypoint
│   ├── DATABASE_SCHEMA.md
│   └── requirements.txt
├── frontend
│   ├── src/app
│   │   ├── auth               # auth session utilities
│   │   ├── components         # shared and dashboard UI
│   │   ├── pages              # page-level screens
│   │   ├── services           # API client
│   │   ├── routes.ts          # app routing
│   │   └── App.tsx
│   ├── index.html
│   └── package.json
├── DESIGN.md
└── README.md
```

## Core Data Model

Main entities:

- `users`: shared account table for both roles
- `worker_profiles`: worker-specific profile data
- `jobs`: client job postings
- `applications`: worker applications to jobs
- `bookings`: accepted hiring records

See [backend/DATABASE_SCHEMA.md](/Users/lakshay/Desktop/project/bigmoneyprojectgoboom/bigmoneyprojectgoboom/backend/DATABASE_SCHEMA.md) for the full schema.

## Database Setup

Install PostgreSQL locally and create a database:

```sql
CREATE DATABASE event_staffing;
```

Recommended `.env` inside `backend/`:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/event_staffing
SECRET_KEY=replace_this_with_a_long_random_secret
```

Notes:

- The checked-in `backend/app.db` is not the target production database.
- For first deployment, use PostgreSQL only.
- The current backend creates tables with `Base.metadata.create_all(...)`. For a later phase, add Alembic migrations before production scaling.

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

## Frontend Setup

Recommended `.env` inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

Backend:

- `DATABASE_URL`: PostgreSQL SQLAlchemy connection string
- `SECRET_KEY`: JWT signing secret

Frontend:

- `VITE_API_BASE_URL`: FastAPI base URL

## API Summary

Authentication:

- `POST /auth/register`
- `POST /auth/login`

Users:

- `GET /users/me`
- `GET /users/me/jobs`
- `GET /users/me/bookings`
- `GET /users/{user_id}`

Workers:

- `GET /workers`
- `GET /workers/me/profile`
- `PUT /workers/me/profile`

Jobs:

- `POST /jobs/`
- `GET /jobs/`
- `GET /jobs/{job_id}`
- `PUT /jobs/{job_id}`

Applications:

- `POST /applications/`
- `GET /applications/job/{job_id}`
- `GET /applications/worker/me`
- `PUT /applications/{application_id}/status`

Bookings:

- `POST /bookings/`
- `GET /bookings/job/{job_id}`
- `GET /bookings/worker/me`
- `PUT /bookings/{booking_id}/status`

## Example API Payloads

Register client:

```json
{
  "email": "client@example.com",
  "password": "StrongPassword123",
  "role": "client",
  "first_name": "Aarav",
  "last_name": "Sharma",
  "phone_number": "+919876543210",
  "location": "Mumbai, Maharashtra"
}
```

Create worker profile:

```json
{
  "skills": "waiter, banquet setup, bartender",
  "experience": "3 years across weddings and hotel banquets in Mumbai",
  "availability": "weekends and evenings",
  "profile_picture_url": ""
}
```

Create job:

```json
{
  "title": "Wedding Reception Wait Staff",
  "description": "Need experienced staff for guest service and table clearing.",
  "location": "Pune, Maharashtra",
  "date": "2026-04-12",
  "duration": "8 hours",
  "staff_type": "waiter",
  "staff_count": 6,
  "pay_per_hour": 450
}
```

Create booking:

```json
{
  "job_id": 12,
  "worker_id": 34
}
```

## Frontend Integration Plan

Current frontend coverage:

- Landing page
- Sign up / sign in
- Employer dashboard
- Staff dashboard

Current dashboard integrations:

- Employer creates jobs and views jobs/bookings
- Worker browses jobs, views own applications and bookings, and edits profile

Still recommended before first public launch:

- Add dedicated job detail page for mobile browsing
- Add richer employer worker directory UI using `GET /workers`
- Replace `alert(...)` feedback with toast notifications
- Add loading and empty states with branding consistency
- Add form validation for phone, pay, and location fields

## Local Development Workflow

1. Start PostgreSQL.
2. Start the FastAPI backend.
3. Start the React frontend.
4. Register one client and one worker account.
5. Create worker profile.
6. Create a job as client.
7. Apply as worker.
8. Accept application as client by creating a booking.
9. Update booking status as worker.

## First Deployment Plan

Use this sequence for the first deployment:

1. Provision PostgreSQL.
2. Set backend `DATABASE_URL` and `SECRET_KEY`.
3. Build frontend with `VITE_API_BASE_URL` pointing at the backend domain.
4. Serve FastAPI behind a reverse proxy or platform-managed HTTPS endpoint.
5. Enable CORS for the deployed frontend origin.
6. Verify sign up, login, job posting, application, booking, and profile update flows.
7. Seed a small set of realistic Indian city/location test records if needed.

## Assumptions

- Roles are stored as `client` and `worker` in the backend.
- Route labels in the frontend still use employer/staff naming for UX copy.
- Payments, chat, reviews, and notifications are intentionally out of scope.
- The MVP supports one staff type per job posting.
- Search/filtering is basic and server-driven: location, staff type, date, and worker skill/availability.
- Table creation currently uses SQLAlchemy `create_all`; migration tooling is a recommended next step.

## Recommended Next Steps

- Add Alembic migrations
- Add automated backend tests with pytest
- Add frontend form validation and toast-based feedback
- Introduce pagination and better search UX for larger datasets
- Add audit-friendly status transition rules for bookings and jobs
