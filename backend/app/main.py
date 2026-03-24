from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.database import Base, engine
from .api.routers import auth, users, jobs, applications, bookings, workers


from .models import user, worker_profile, job, application, booking

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(bookings.router)
app.include_router(workers.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
