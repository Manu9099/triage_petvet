from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Species, Symptom, User
from app.schemas.schemas import SymptomOut
from app.utils.deps import get_current_user

router = APIRouter(prefix="/symptoms", tags=["symptoms"])


@router.get("", response_model=list[SymptomOut])
def list_symptoms(
    species: Species | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = db.query(Symptom)
    if species:
        query = query.filter(
            (Symptom.species == species) | (Symptom.species == None)
        )
    return query.order_by(Symptom.name).all()
