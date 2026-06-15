import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import PetCreate, PetOut, PetUpdate
from app.services import pet_service
from app.utils.deps import get_current_user

router = APIRouter(prefix="/pets", tags=["pets"])


@router.post("", response_model=PetOut, status_code=201)
def create_pet(
    data: PetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return pet_service.create_pet(db, data, current_user)


@router.get("", response_model=list[PetOut])
def list_pets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return pet_service.get_pets(db, current_user)


@router.get("/{pet_id}", response_model=PetOut)
def get_pet(
    pet_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return pet_service.get_pet(db, pet_id, current_user)


@router.patch("/{pet_id}", response_model=PetOut)
def update_pet(
    pet_id: uuid.UUID,
    data: PetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return pet_service.update_pet(db, pet_id, data, current_user)


@router.delete("/{pet_id}", status_code=204)
def delete_pet(
    pet_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pet_service.delete_pet(db, pet_id, current_user)
