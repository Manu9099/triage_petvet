# PetVet AI — Backend

FastAPI + PostgreSQL + Groq para detección de enfermedades comunes en mascotas.

## Stack

- **Python 3.12** + FastAPI
- **PostgreSQL 16** (Docker)
- **SQLAlchemy 2** + Alembic (migraciones)
- **Groq API** (`llama-3.3-70b-versatile`) para diagnóstico IA
- **JWT** con refresh token rotation

## Setup local

### 1. Clonar y configurar entorno

```bash
cd petvet-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Variables de entorno

```bash
cp .env.example .env
# Editar .env y colocar tu GROQ_API_KEY y SECRET_KEY
```

### 3. Levantar PostgreSQL con Docker

```bash
docker compose up db -d
```

### 4. Correr migraciones y seed

```bash
alembic upgrade head
# El seed de síntomas se ejecuta automáticamente al iniciar la app
```

### 5. Iniciar el servidor

```bash
uvicorn app.main:app --reload
```

API disponible en `http://localhost:8000`
Docs: `http://localhost:8000/docs`

---

## Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/login` | Login → access + refresh token |
| POST | `/api/v1/auth/refresh` | Rotar refresh token |
| GET  | `/api/v1/auth/me` | Perfil del usuario autenticado |

### Mascotas
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | `/api/v1/pets` | Crear mascota |
| GET    | `/api/v1/pets` | Listar mis mascotas |
| GET    | `/api/v1/pets/{id}` | Detalle mascota |
| PATCH  | `/api/v1/pets/{id}` | Actualizar mascota |
| DELETE | `/api/v1/pets/{id}` | Eliminar mascota |

### Síntomas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/symptoms?species=dog` | Listar síntomas (filtrar por especie) |

### Diagnósticos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/diagnoses` | Crear diagnóstico (llama a Groq) |
| GET  | `/api/v1/diagnoses/{id}` | Detalle de diagnóstico |
| GET  | `/api/v1/diagnoses/pet/{pet_id}` | Historial de diagnósticos de una mascota |

---

## Estructura

```
petvet-backend/
├── app/
│   ├── api/v1/endpoints/   # Routers FastAPI
│   ├── core/               # Config, JWT/security
│   ├── db/                 # Session, seed
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # Lógica de negocio + Groq
│   ├── utils/              # Dependencias (get_current_user)
│   └── main.py
├── alembic/                # Migraciones
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```
