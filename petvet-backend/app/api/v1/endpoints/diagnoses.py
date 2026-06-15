import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import DiagnosisCreate, DiagnosisOut, DiagnosisSummary
from app.services import diagnosis_service
from app.utils.deps import get_current_user

router = APIRouter(prefix="/diagnoses", tags=["diagnoses"])


@router.post("", response_model=DiagnosisOut, status_code=201)
def create_diagnosis(
    data: DiagnosisCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return diagnosis_service.create_diagnosis(db, data, current_user)


@router.get("/{diagnosis_id}", response_model=DiagnosisOut)
def get_diagnosis(
    diagnosis_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return diagnosis_service.get_diagnosis(db, diagnosis_id, current_user)


@router.get("/pet/{pet_id}", response_model=list[DiagnosisSummary])
def list_diagnoses_by_pet(
    pet_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return diagnosis_service.get_diagnoses_by_pet(db, pet_id, current_user)
