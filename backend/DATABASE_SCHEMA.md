# Database Schema

This schema supports the first deployment MVP of the event staffing marketplace.

## 1. `users`

Stores account and shared identity fields for both roles.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INTEGER` | PK | User id |
| `email` | `VARCHAR` | `UNIQUE`, `NOT NULL` | Login identifier |
| `hashed_password` | `VARCHAR` | `NOT NULL` | Password hash |
| `role` | `VARCHAR` | `NOT NULL` | `client` or `worker` |
| `first_name` | `VARCHAR` | nullable | |
| `last_name` | `VARCHAR` | nullable | |
| `phone_number` | `VARCHAR` | nullable | |
| `location` | `VARCHAR` | nullable | City/state-friendly text for MVP |
| `created_at` | `TIMESTAMP` | default current timestamp | |
| `updated_at` | `TIMESTAMP` | default current timestamp | |

## 2. `worker_profiles`

Stores worker-only data. One worker has one profile.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INTEGER` | PK | |
| `user_id` | `INTEGER` | FK -> `users.id`, `UNIQUE`, `NOT NULL` | One-to-one with worker user |
| `skills` | `TEXT` | nullable | Comma-separated or free-text MVP format |
| `experience` | `TEXT` | nullable | Summary of work experience |
| `availability` | `TEXT` | nullable | Availability notes |
| `profile_picture_url` | `VARCHAR` | nullable | Optional |
| `updated_at` | `TIMESTAMP` | default current timestamp | |

## 3. `jobs`

Client-created staffing requests.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INTEGER` | PK | |
| `client_id` | `INTEGER` | FK -> `users.id`, `NOT NULL` | Job owner |
| `title` | `VARCHAR` | `NOT NULL` | Job headline |
| `description` | `TEXT` | nullable | |
| `location` | `VARCHAR` | `NOT NULL` | City/locality-oriented search field |
| `date` | `DATE` | `NOT NULL` | Event date |
| `duration` | `VARCHAR` | nullable | Example: `8 hours` |
| `staff_type` | `VARCHAR` | `NOT NULL` | waiter, bartender, chef, cleaner, helper |
| `staff_count` | `INTEGER` | `NOT NULL` | Number of workers needed |
| `pay_per_hour` | `DECIMAL(10,2)` | nullable | Indian rupee hourly rate |
| `status` | `VARCHAR` | default `open` | `open`, `filled`, `completed`, `cancelled` |
| `created_at` | `TIMESTAMP` | default current timestamp | |
| `updated_at` | `TIMESTAMP` | default current timestamp | |

## 4. `applications`

Workers apply to jobs. One worker should only apply once per job.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INTEGER` | PK | |
| `job_id` | `INTEGER` | FK -> `jobs.id`, `NOT NULL` | |
| `worker_id` | `INTEGER` | FK -> `users.id`, `NOT NULL` | |
| `status` | `VARCHAR` | default `pending` | `pending`, `accepted`, `rejected` |
| `applied_at` | `TIMESTAMP` | default current timestamp | |

Recommended DB constraint for hardening:

```sql
ALTER TABLE applications
ADD CONSTRAINT unique_job_worker_application UNIQUE (job_id, worker_id);
```

## 5. `bookings`

Confirmed client-worker match for a job.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `id` | `INTEGER` | PK | |
| `job_id` | `INTEGER` | FK -> `jobs.id`, `NOT NULL` | |
| `worker_id` | `INTEGER` | FK -> `users.id`, `NOT NULL` | |
| `status` | `VARCHAR` | default `pending` | `pending`, `accepted`, `completed`, `cancelled` |
| `created_at` | `TIMESTAMP` | default current timestamp | |
| `updated_at` | `TIMESTAMP` | default current timestamp | |

Recommended DB constraint for hardening:

```sql
ALTER TABLE bookings
ADD CONSTRAINT unique_job_worker_booking UNIQUE (job_id, worker_id);
```

## Relationships

- One `client` user can create many `jobs`
- One `worker` user has one `worker_profile`
- One `job` can have many `applications`
- One `worker` can have many `applications`
- One `job` can have many `bookings` until `staff_count` is reached
- One `worker` can have many `bookings` across different jobs

## Search Fields for Indian Market MVP

For the first release, the following text-based fields drive search and filtering:

- `users.location`
- `jobs.location`
- `jobs.staff_type`
- `jobs.date`
- `worker_profiles.skills`
- `worker_profiles.availability`

This keeps the schema simple while still supporting city-based filtering for markets such as Mumbai, Pune, Bengaluru, Delhi, Hyderabad, and Chennai.
