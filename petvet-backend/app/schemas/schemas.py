import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.models import Species, UrgencyLevel


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    email: str
    full_name: str
    is_active: bool
    created_at: datetime


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


# ── Pets ──────────────────────────────────────────────────────────────────────

class PetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    species: Species
    breed: str | None = Field(default=None, max_length=100)
    age_years: float | None = Field(default=None, ge=0, le=50)
    weight_kg: float | None = Field(default=None, ge=0, le=500)
    notes: str | None = None


class PetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    breed: str | None = Field(default=None, max_length=100)
    age_years: float | None = Field(default=None, ge=0, le=50)
    weight_kg: float | None = Field(default=None, ge=0, le=500)
    notes: str | None = None


class PetOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    species: Species
    breed: str | None
    age_years: float | None
    weight_kg: float | None
    notes: str | None
    created_at: datetime


# ── Symptoms ──────────────────────────────────────────────────────────────────

class SymptomOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str
    description: str | None
    species: Species | None


# ── Diagnosis ─────────────────────────────────────────────────────────────────

class DiagnosisCreate(BaseModel):
    pet_id: uuid.UUID
    symptom_ids: list[int] = Field(min_length=1)
    additional_notes: str | None = None


class DiagnosisOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    pet_id: uuid.UUID
    additional_notes: str | None
    ai_response: str
    probable_disease: str
    urgency_level: UrgencyLevel
    recommendation: str
    groq_model_used: str
    created_at: datetime
    symptoms: list[SymptomOut] = []


class DiagnosisSummary(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    pet_id: uuid.UUID
    probable_disease: str
    urgency_level: UrgencyLevel
    created_at: datetime
