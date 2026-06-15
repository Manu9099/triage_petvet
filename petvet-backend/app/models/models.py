import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class Species(str, PyEnum):
    dog = "dog"
    cat = "cat"
    bird = "bird"
    rabbit = "rabbit"
    other = "other"


class UrgencyLevel(str, PyEnum):
    low = "low"
    medium = "medium"
    high = "high"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    pets: Mapped[list["Pet"]] = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken", back_populates="user", cascade="all, delete-orphan"
    )


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False, index=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship("User", back_populates="refresh_tokens")


class Pet(Base):
    __tablename__ = "pets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    species: Mapped[Species] = mapped_column(Enum(Species), nullable=False)
    breed: Mapped[str | None] = mapped_column(String(100))
    age_years: Mapped[float | None] = mapped_column(Float)
    weight_kg: Mapped[float | None] = mapped_column(Float)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    owner: Mapped["User"] = relationship("User", back_populates="pets")
    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        "Diagnosis", back_populates="pet", cascade="all, delete-orphan"
    )


class Symptom(Base):
    __tablename__ = "symptoms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    species: Mapped[Species | None] = mapped_column(Enum(Species))  # None = all species

    diagnosis_symptoms: Mapped[list["DiagnosisSymptom"]] = relationship(
        "DiagnosisSymptom", back_populates="symptom"
    )


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    pet_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pets.id"), nullable=False
    )
    additional_notes: Mapped[str | None] = mapped_column(Text)
    ai_response: Mapped[str] = mapped_column(Text, nullable=False)
    probable_disease: Mapped[str] = mapped_column(String(255), nullable=False)
    urgency_level: Mapped[UrgencyLevel] = mapped_column(Enum(UrgencyLevel), nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    groq_model_used: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    pet: Mapped["Pet"] = relationship("Pet", back_populates="diagnoses")
    diagnosis_symptoms: Mapped[list["DiagnosisSymptom"]] = relationship(
        "DiagnosisSymptom", back_populates="diagnosis", cascade="all, delete-orphan"
    )


class DiagnosisSymptom(Base):
    __tablename__ = "diagnosis_symptoms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    diagnosis_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("diagnoses.id"), nullable=False
    )
    symptom_id: Mapped[int] = mapped_column(Integer, ForeignKey("symptoms.id"), nullable=False)

    diagnosis: Mapped["Diagnosis"] = relationship("Diagnosis", back_populates="diagnosis_symptoms")
    symptom: Mapped["Symptom"] = relationship("Symptom", back_populates="diagnosis_symptoms")
