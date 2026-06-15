"""
Script de seed para usuarios y mascotas de prueba.
Corre desde la raíz del proyecto con el venv activado:

    python scripts/seed_demo.py
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.models import User, Pet, Species
from app.core.security import hash_password

# ── Datos de prueba ───────────────────────────────────────────────────────────

USERS = [
    {"email": "maria.garcia@demo.com",   "full_name": "María García",    "password": "demo1234"},
    {"email": "carlos.rios@demo.com",    "full_name": "Carlos Ríos",     "password": "demo1234"},
    {"email": "lucia.mendez@demo.com",   "full_name": "Lucía Méndez",    "password": "demo1234"},
    {"email": "jorge.flores@demo.com",   "full_name": "Jorge Flores",    "password": "demo1234"},
    {"email": "ana.torres@demo.com",     "full_name": "Ana Torres",      "password": "demo1234"},
]

# (email_owner, name, species, breed, age_years, weight_kg)
PETS = [
    # María — 3 mascotas
    ("maria.garcia@demo.com", "Luna",     Species.cat,    "Siamés",            3.0,  4.2),
    ("maria.garcia@demo.com", "Mochi",    Species.cat,    "Persa",             1.5,  3.8),
    ("maria.garcia@demo.com", "Rocky",    Species.dog,    "Labrador",          5.0, 28.0),

    # Carlos — 2 mascotas
    ("carlos.rios@demo.com",  "Toby",     Species.dog,    "Beagle",            4.0, 12.5),
    ("carlos.rios@demo.com",  "Piolín",   Species.bird,   "Canario",           2.0,  0.03),

    # Lucía — 3 mascotas
    ("lucia.mendez@demo.com", "Max",      Species.dog,    "Golden Retriever",  7.0, 32.0),
    ("lucia.mendez@demo.com", "Nieve",    Species.rabbit, "Angora",            1.0,  1.8),
    ("lucia.mendez@demo.com", "Cleo",     Species.cat,    "Angora",            6.0,  5.1),

    # Jorge — 2 mascotas
    ("jorge.flores@demo.com", "Brutus",   Species.dog,    "Rottweiler",        3.5, 42.0),
    ("jorge.flores@demo.com", "Canela",   Species.dog,    "Chihuahua",         2.0,  2.8),

    # Ana — 2 mascotas
    ("ana.torres@demo.com",   "Simba",    Species.cat,    "Maine Coon",        4.0,  7.5),
    ("ana.torres@demo.com",   "Lola",     Species.dog,    "Poodle",            6.0,  5.5),
]

# ── Runner ────────────────────────────────────────────────────────────────────

def run():
    db = SessionLocal()
    try:
        users_created = 0
        pets_created = 0

        # Crear usuarios
        user_map: dict[str, User] = {}
        for u in USERS:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                print(f"  [skip] usuario ya existe: {u['email']}")
                user_map[u["email"]] = existing
            else:
                user = User(
                    email=u["email"],
                    full_name=u["full_name"],
                    hashed_password=hash_password(u["password"]),
                )
                db.add(user)
                db.flush()
                user_map[u["email"]] = user
                users_created += 1
                print(f"  [+] usuario: {u['full_name']} ({u['email']})")

        db.commit()

        # Crear mascotas
        for (email, name, species, breed, age, weight) in PETS:
            owner = user_map.get(email)
            if not owner:
                print(f"  [skip] dueño no encontrado: {email}")
                continue

            existing = db.query(Pet).filter(
                Pet.owner_id == owner.id,
                Pet.name == name
            ).first()

            if existing:
                print(f"  [skip] mascota ya existe: {name} ({email})")
                continue

            pet = Pet(
                owner_id=owner.id,
                name=name,
                species=species,
                breed=breed,
                age_years=age,
                weight_kg=weight,
            )
            db.add(pet)
            pets_created += 1
            print(f"  [+] mascota: {name} ({species.value}) → {email}")

        db.commit()
        print(f"\n✅ Seed completado: {users_created} usuarios, {pets_created} mascotas creadas.")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
