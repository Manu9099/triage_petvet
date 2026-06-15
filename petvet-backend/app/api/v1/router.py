from fastapi import APIRouter

from app.api.v1.endpoints import auth, diagnoses, pets, symptoms

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(pets.router)
api_router.include_router(symptoms.router)
api_router.include_router(diagnoses.router)
