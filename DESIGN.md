# MVP Architecture Notes

## Marketplace Scope

This system is a two-sided staffing marketplace for India-focused event operations:

- Clients post hospitality jobs and hire temporary staff
- Workers maintain profiles, discover work, and manage bookings

The architecture is intentionally simple so the team can ship quickly, validate demand, and iterate.

## Architecture Decisions

### Frontend

- React SPA with Tailwind CSS
- Role-specific dashboard routes
- Fetch-based API layer with bearer token injection
- Mobile-friendly dashboard tabs for first-release usability

### Backend

- FastAPI routers grouped by domain
- SQLAlchemy ORM for persistence
- Pydantic schemas for request/response validation
- JWT bearer auth with role guards

### Database

- PostgreSQL as the source of truth
- Relational design to support:
  - one account table for both roles
  - one worker profile per worker
  - many jobs per client
  - many applications per job
  - many bookings per client and worker over time

## Core User Flows

### Client Flow

1. Register or sign in
2. Create job
3. Review applications for own jobs
4. Create booking for selected worker
5. Track bookings and job history

### Worker Flow

1. Register or sign in
2. Complete profile
3. Browse open jobs
4. Apply to relevant jobs
5. Accept, complete, or cancel bookings
6. Review own application and booking history

## MVP Boundaries

Included:

- Auth
- Role-based access
- Worker directory
- Job CRUD for clients
- Applications
- Bookings
- Basic filtering
- Dashboards

Excluded:

- Payments
- Chat
- Ratings/reviews
- Notifications infrastructure
- Advanced analytics
- Multi-role jobs in one posting

## Recommended Backend Layout

```text
backend/app
├── api/routers
│   ├── auth.py
│   ├── users.py
│   ├── workers.py
│   ├── jobs.py
│   ├── applications.py
│   └── bookings.py
├── core
├── crud
├── db
├── dependencies
├── models
└── schemas
```

## Recommended Frontend Layout

```text
frontend/src/app
├── auth
├── components
├── pages
├── services
└── routes.ts
```

## Deployment Readiness Checklist

- PostgreSQL configured
- JWT secret configured
- Frontend API base URL configured
- CORS configured for deployed frontend origin
- Test accounts verified for both roles
- Job -> application -> booking lifecycle manually tested
- Production logging and error visibility added by hosting platform
