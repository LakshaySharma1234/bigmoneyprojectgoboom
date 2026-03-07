from fastapi import FastAPI

from .db.database import Base, engine
from .api.routers import auth
from .models import user

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "CaterStaff API running"}

@app.post("/test")
def test():
    return {"message": "Test endpoint"}