import json

from groq import Groq

from app.core.config import settings
from app.models.models import Pet, Symptom, UrgencyLevel

_client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = """Eres un asistente veterinario especializado en diagnóstico de enfermedades comunes en mascotas.
Tu rol es analizar los síntomas reportados y proporcionar una evaluación preliminar.

IMPORTANTE:
- No eres un sustituto de un veterinario real. Siempre recomienda consulta profesional cuando sea necesario.
- Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown.
- Sé específico pero conservador en el diagnóstico.

Formato de respuesta JSON requerido:
{
  "probable_disease": "nombre de la enfermedad o condición más probable",
  "confidence": "alta | media | baja",
  "urgency_level": "low | medium | high",
  "explanation": "explicación detallada del diagnóstico basada en los síntomas",
  "recommendation": "recomendación específica de acción (casa / veterinario urgente / veterinario en 24-48h)",
  "differential_diagnoses": ["enfermedad alternativa 1", "enfermedad alternativa 2"],
  "warning_signs": ["señal de alarma 1 a vigilar", "señal de alarma 2"]
}

Criterios de urgencia:
- high: riesgo de vida, requiere veterinario de emergencia inmediata
- medium: requiere veterinario en menos de 24-48 horas
- low: puede manejarse en casa con observación, consulta veterinaria en próximos días si persiste"""


def build_user_prompt(pet: Pet, symptoms: list[Symptom], additional_notes: str | None) -> str:
    symptom_list = "\n".join(f"  - {s.name}: {s.description or ''}" for s in symptoms)
    notes_section = f"\nNotas adicionales del dueño: {additional_notes}" if additional_notes else ""

    return f"""Mascota:
  - Nombre: {pet.name}
  - Especie: {pet.species.value}
  - Raza: {pet.breed or 'No especificada'}
  - Edad: {f'{pet.age_years} años' if pet.age_years else 'No especificada'}
  - Peso: {f'{pet.weight_kg} kg' if pet.weight_kg else 'No especificado'}

Síntomas reportados:
{symptom_list}{notes_section}

Proporciona el diagnóstico en el formato JSON especificado."""


def run_diagnosis(pet: Pet, symptoms: list[Symptom], additional_notes: str | None) -> dict:
    user_prompt = build_user_prompt(pet, symptoms, additional_notes)

    response = _client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=1024,
    )

    raw = response.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: intentar extraer JSON si hay texto extra
        import re
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            result = json.loads(match.group())
        else:
            raise ValueError(f"Groq no devolvió JSON válido: {raw[:200]}")

    # Normalizar urgency_level al enum
    urgency_raw = result.get("urgency_level", "medium").lower()
    if urgency_raw not in ("low", "medium", "high"):
        urgency_raw = "medium"
    result["urgency_level"] = UrgencyLevel(urgency_raw)
    result["full_response"] = raw
    result["model_used"] = settings.GROQ_MODEL

    return result
