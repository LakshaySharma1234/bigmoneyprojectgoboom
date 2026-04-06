from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import admin, assignments, applications, auth, bookings, jobs, ratings, users, workers


from .models import application, assignment, booking, job, rating, user, worker_profile

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(bookings.router)
app.include_router(assignments.router)
app.include_router(ratings.router)
app.include_router(admin.router)
app.include_router(workers.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
