from sqlalchemy.orm import Session

from app.models.models import Symptom


SYMPTOMS_SEED = [
    # Síntomas generales (todas las especies)
    {"name": "Pérdida de apetito", "description": "El animal come menos de lo normal o rechaza la comida", "species": None},
    {"name": "Letargo o cansancio excesivo", "description": "El animal está más quieto o inactivo de lo habitual", "species": None},
    {"name": "Fiebre", "description": "Temperatura corporal elevada, cuerpo caliente al tacto", "species": None},
    {"name": "Pérdida de peso", "description": "Adelgazamiento notorio sin cambio de dieta", "species": None},
    {"name": "Sed excesiva", "description": "Bebe mucha más agua de lo normal (polidipsia)", "species": None},
    {"name": "Orina excesiva", "description": "Orina con mucha más frecuencia o cantidad (poliuria)", "species": None},
    {"name": "Vómitos", "description": "Expulsión del contenido estomacal", "species": None},
    {"name": "Diarrea", "description": "Heces líquidas o muy blandas", "species": None},
    {"name": "Estreñimiento", "description": "Dificultad o incapacidad para defecar", "species": None},
    {"name": "Dificultad para respirar", "description": "Respiración rápida, trabajosa o con sonidos anormales", "species": None},
    {"name": "Tos persistente", "description": "Tos frecuente que no cede", "species": None},
    {"name": "Estornudos frecuentes", "description": "Estornudos repetitivos", "species": None},
    {"name": "Secreción ocular", "description": "Lagañas, ojos llorosos o con pus", "species": None},
    {"name": "Secreción nasal", "description": "Moco o líquido por la nariz", "species": None},
    {"name": "Convulsiones o temblores", "description": "Movimientos involuntarios del cuerpo o ataques", "species": None},
    {"name": "Parálisis o debilidad en extremidades", "description": "Dificultad para moverse o caminar", "species": None},

    # Perros
    {"name": "Sangre en heces", "description": "Heces con sangre roja o negra (perros)", "species": "dog"},
    {"name": "Sangre en vómito", "description": "Vómito con presencia de sangre (perros)", "species": "dog"},
    {"name": "Piel con costras o sarna", "description": "Lesiones en piel, picazón intensa, pérdida de pelo (perros)", "species": "dog"},
    {"name": "Inflamación de ganglios", "description": "Bultos palpables en cuello, axilas o ingle (perros)", "species": "dog"},
    {"name": "Rascado excesivo de oídos", "description": "Sacude la cabeza frecuentemente, se rasca las orejas (perros)", "species": "dog"},
    {"name": "Secreción en oídos", "description": "Mal olor o líquido oscuro en el canal auditivo (perros)", "species": "dog"},
    {"name": "Abdomen distendido", "description": "Barriga hinchada o dura (perros)", "species": "dog"},
    {"name": "Dificultad al tragar", "description": "Problemas para comer o deglutir (perros)", "species": "dog"},
    {"name": "Úlceras en boca o encías", "description": "Llagas visibles en la cavidad oral (perros)", "species": "dog"},
    {"name": "Heces muy oscuras o con sangre negra", "description": "Posible sangrado en tracto digestivo alto (perros)", "species": "dog"},

    # Gatos
    {"name": "Sangre en orina", "description": "Orina rosada o con sangre visible (gatos)", "species": "cat"},
    {"name": "Llanto al orinar", "description": "Maúlla de dolor al intentar orinar (gatos)", "species": "cat"},
    {"name": "No puede orinar", "description": "Intenta orinar pero no sale nada — emergencia (gatos)", "species": "cat"},
    {"name": "Encías pálidas o amarillas", "description": "Color anormal en las encías (gatos)", "species": "cat"},
    {"name": "Úlceras en lengua o paladar", "description": "Llagas visibles en boca (gatos)", "species": "cat"},
    {"name": "Ojos con secreción amarillenta", "description": "Pus o líquido espeso en ojos (gatos)", "species": "cat"},
    {"name": "Pelo opaco o caída excesiva", "description": "Pelaje sin brillo, muchos pelos caídos (gatos)", "species": "cat"},
    {"name": "Inflamación de encías", "description": "Encías rojas, inflamadas, con mal aliento (gatos)", "species": "cat"},
]


def seed_symptoms(db: Session) -> None:
    existing = db.query(Symptom).count()
    if existing > 0:
        return

    for s in SYMPTOMS_SEED:
        db.add(Symptom(**s))
    db.commit()
    print(f"[seed] {len(SYMPTOMS_SEED)} síntomas insertados.")
