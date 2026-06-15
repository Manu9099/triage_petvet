import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.models import Diagnosis, DiagnosisSymptom, Pet, Symptom, User
from app.schemas.schemas import DiagnosisCreate
from app.services.groq_service import run_diagnosis


def create_diagnosis(db: Session, data: DiagnosisCreate, current_user: User) -> Diagnosis:
    pet = (
        db.query(Pet)
        .filter(Pet.id == data.pet_id, Pet.owner_id == current_user.id)
        .first()
    )
    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mascota no encontrada")

    symptoms = db.query(Symptom).filter(Symptom.id.in_(data.symptom_ids)).all()
    if len(symptoms) != len(data.symptom_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uno o más síntomas no existen",
        )

    ai_result = run_diagnosis(pet, symptoms, data.additional_notes)

    diagnosis = Diagnosis(
        pet_id=pet.id,
        additional_notes=data.additional_notes,
        ai_response=ai_result["full_response"],
        probable_disease=ai_result.get("probable_disease", "No determinado"),
        urgency_level=ai_result["urgency_level"],
        recommendation=ai_result.get("recommendation", "Consulte a su veterinario"),
        groq_model_used=ai_result["model_used"],
    )
    db.add(diagnosis)
    db.flush()

    for symptom in symptoms:
        db.add(DiagnosisSymptom(diagnosis_id=diagnosis.id, symptom_id=symptom.id))

    db.commit()
    db.refresh(diagnosis)
    return diagnosis


def get_diagnosis(db: Session, diagnosis_id: uuid.UUID, current_user: User) -> Diagnosis:
    diagnosis = (
        db.query(Diagnosis)
        .join(Pet)
        .options(joinedload(Diagnosis.diagnosis_symptoms).joinedload(DiagnosisSymptom.symptom))
        .filter(Diagnosis.id == diagnosis_id, Pet.owner_id == current_user.id)
        .first()
    )
    if not diagnosis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diagnóstico no encontrado")
    return diagnosis


def get_diagnoses_by_pet(
    db: Session, pet_id: uuid.UUID, current_user: User
) -> list[Diagnosis]:
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == current_user.id).first()
    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mascota no encontrada")

    return (
        db.query(Diagnosis)
        .filter(Diagnosis.pet_id == pet_id)
        .order_by(Diagnosis.created_at.desc())
        .all()
    )
