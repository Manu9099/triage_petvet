import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.models import Pet, User
from app.schemas.schemas import PetCreate, PetUpdate


def create_pet(db: Session, data: PetCreate, owner: User) -> Pet:
    pet = Pet(**data.model_dump(), owner_id=owner.id)
    db.add(pet)
    db.commit()
    db.refresh(pet)
    return pet


def get_pets(db: Session, owner: User) -> list[Pet]:
    return db.query(Pet).filter(Pet.owner_id == owner.id).all()


def get_pet(db: Session, pet_id: uuid.UUID, owner: User) -> Pet:
    pet = db.query(Pet).filter(Pet.id == pet_id, Pet.owner_id == owner.id).first()
    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mascota no encontrada")
    return pet


def update_pet(db: Session, pet_id: uuid.UUID, data: PetUpdate, owner: User) -> Pet:
    pet = get_pet(db, pet_id, owner)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(pet, field, value)
    db.commit()
    db.refresh(pet)
    return pet


def delete_pet(db: Session, pet_id: uuid.UUID, owner: User) -> None:
    pet = get_pet(db, pet_id, owner)
    db.delete(pet)
    db.commit()
