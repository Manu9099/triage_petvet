# PetVet AI — Sistema de Triage Veterinario con IA

PetVet AI es una aplicación full stack orientada al registro de mascotas, selección de síntomas y generación de una orientación inicial mediante inteligencia artificial. El sistema permite que un usuario registre sus mascotas, consulte síntomas frecuentes y obtenga un prediagnóstico orientativo basado en la información ingresada.

> Este proyecto tiene fines educativos y demostrativos. No reemplaza la evaluación, diagnóstico ni tratamiento realizado por un médico veterinario.

---

## Tabla de contenidos

* [Descripción general](#descripción-general)
* [Características principales](#características-principales)
* [Arquitectura del proyecto](#arquitectura-del-proyecto)
* [Tecnologías utilizadas](#tecnologías-utilizadas)
* [Estructura del repositorio](#estructura-del-repositorio)
* [Instalación y ejecución local](#instalación-y-ejecución-local)
* [Variables de entorno](#variables-de-entorno)
* [Endpoints principales](#endpoints-principales)
* [Flujo de uso](#flujo-de-uso)
* [Seguridad](#seguridad)
* [Próximas mejoras](#próximas-mejoras)
* [Autor](#autor)

---

## Descripción general

PetVet AI funciona como una plataforma de triage veterinario básico. El usuario puede crear una cuenta, registrar una o más mascotas, seleccionar síntomas asociados a cada mascota y generar un diagnóstico preliminar asistido por IA.

El backend se encarga de la autenticación, persistencia de datos, manejo de mascotas, síntomas y diagnósticos. El frontend ofrece una interfaz web moderna para consumir los servicios de la API.

---

## Características principales

* Registro e inicio de sesión de usuarios.
* Autenticación mediante JWT.
* Manejo de access token y refresh token.
* Registro, edición, listado y eliminación de mascotas.
* Consulta de síntomas por especie.
* Generación de diagnósticos asistidos por IA.
* Historial de diagnósticos por mascota.
* Backend documentado con Swagger.
* Base de datos PostgreSQL.
* Migraciones con Alembic.
* Frontend desarrollado con React, TypeScript y Vite.
* Consumo de API mediante Axios.
* Manejo de estado asíncrono con React Query.
* Interfaz moderna con Tailwind CSS.

---

## Arquitectura del proyecto

El proyecto está organizado como un monorepo con dos módulos principales:

```txt
triage_petvet/
│
├── petvet-backend/      # API REST con FastAPI
│
└── petvet-frontend/     # Aplicación web con React + TypeScript
```

### Backend

El backend expone una API REST encargada de:

* Autenticación de usuarios.
* Gestión de mascotas.
* Gestión de síntomas.
* Generación de diagnósticos.
* Comunicación con el modelo de IA.
* Persistencia en PostgreSQL.

### Frontend

El frontend permite al usuario interactuar con el sistema mediante una interfaz web:

* Registro e inicio de sesión.
* Gestión visual de mascotas.
* Selección de síntomas.
* Visualización de resultados del diagnóstico.
* Consulta de historial.

---

## Tecnologías utilizadas

### Backend

* Python 3.12
* FastAPI
* Uvicorn
* PostgreSQL
* SQLAlchemy
* Alembic
* Pydantic
* Python-Jose
* Passlib
* Groq API
* Docker
* Docker Compose

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* TanStack React Query
* React Router DOM
* Lucide React
* React Hot Toast

---

## Estructura del repositorio

```txt
triage_petvet/
│
├── petvet-backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── scripts/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
└── petvet-frontend/
    ├── public/
    ├── src/
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── README.md
```

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Manu9099/triage_petvet.git
cd triage_petvet
```

---

## Backend

### 2. Entrar al backend

```bash
cd petvet-backend
```

### 3. Crear entorno virtual

```bash
python -m venv venv
```

Activar entorno virtual:

```bash
# Windows
venv\Scripts\activate
```

```bash
# Linux / macOS
source venv/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Configurar variables de entorno

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Editar el archivo `.env` y colocar las credenciales correspondientes.

### 6. Levantar PostgreSQL con Docker

```bash
docker compose up db -d
```

### 7. Ejecutar migraciones

```bash
alembic upgrade head
```

### 8. Iniciar servidor backend

```bash
uvicorn app.main:app --reload
```

La API estará disponible en:

```txt
http://localhost:8000
```

Documentación Swagger:

```txt
http://localhost:8000/docs
```

---

## Frontend

### 9. Entrar al frontend

Desde la raíz del proyecto:

```bash
cd petvet-frontend
```

### 10. Instalar dependencias

```bash
npm install
```

### 11. Ejecutar aplicación

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```txt
http://localhost:5173
```

---

## Variables de entorno

Ejemplo de configuración para el backend:

```env
APP_NAME=PetVet AI
APP_VERSION=1.0.0
DEBUG=true

DATABASE_URL=postgresql://petvet:petvet123@localhost:5432/petvetdb

SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=llama-3.3-70b-versatile
```

No se debe subir el archivo `.env` al repositorio. Solo debe mantenerse `.env.example`.

---

## Endpoints principales

### Autenticación

| Método | Ruta                    | Descripción                            |
| ------ | ----------------------- | -------------------------------------- |
| POST   | `/api/v1/auth/register` | Registrar usuario                      |
| POST   | `/api/v1/auth/login`    | Iniciar sesión                         |
| POST   | `/api/v1/auth/refresh`  | Renovar token                          |
| GET    | `/api/v1/auth/me`       | Obtener perfil del usuario autenticado |

### Mascotas

| Método | Ruta                | Descripción                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/api/v1/pets`      | Crear mascota                  |
| GET    | `/api/v1/pets`      | Listar mascotas del usuario    |
| GET    | `/api/v1/pets/{id}` | Obtener detalle de una mascota |
| PATCH  | `/api/v1/pets/{id}` | Actualizar mascota             |
| DELETE | `/api/v1/pets/{id}` | Eliminar mascota               |

### Síntomas

| Método | Ruta                           | Descripción                           |
| ------ | ------------------------------ | ------------------------------------- |
| GET    | `/api/v1/symptoms?species=dog` | Listar síntomas filtrados por especie |

### Diagnósticos

| Método | Ruta                             | Descripción                                      |
| ------ | -------------------------------- | ------------------------------------------------ |
| POST   | `/api/v1/diagnoses`              | Crear diagnóstico asistido por IA                |
| GET    | `/api/v1/diagnoses/{id}`         | Obtener detalle de diagnóstico                   |
| GET    | `/api/v1/diagnoses/pet/{pet_id}` | Obtener historial de diagnósticos de una mascota |

---

## Flujo de uso

1. El usuario se registra o inicia sesión.
2. Registra una mascota con sus datos principales.
3. Selecciona síntomas asociados a la mascota.
4. El backend procesa la información.
5. La API consulta el modelo de IA configurado.
6. Se genera un resultado orientativo.
7. El diagnóstico queda asociado al historial de la mascota.

---

## Seguridad

El proyecto implementa autenticación mediante tokens JWT. Para un entorno de producción se recomienda:

* No subir archivos `.env`.
* Usar claves secretas seguras.
* Configurar CORS solo para dominios permitidos.
* Usar HTTPS.
* Rotar claves sensibles periódicamente.
* No exponer credenciales de base de datos.
* No subir carpetas como `venv`, `node_modules` o archivos temporales.
* Revisar dependencias antes de desplegar.

---

## Comandos útiles

### Backend

```bash
# Ejecutar servidor
uvicorn app.main:app --reload

# Ejecutar migraciones
alembic upgrade head

# Crear nueva migración
alembic revision --autogenerate -m "descripcion"

# Levantar base de datos
docker compose up db -d
```

### Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Generar build
npm run build

# Previsualizar build
npm run preview

# Ejecutar lint
npm run lint
```

---

## Próximas mejoras

* Dashboard visual para el historial de diagnósticos.
* Panel administrativo para síntomas y enfermedades.
* Integración con clínicas veterinarias.
* Exportación de diagnóstico en PDF.
* Recomendaciones preventivas por especie y edad.
* Sistema de alertas según nivel de urgencia.
* Mejora del prompt clínico para respuestas más estructuradas.
* Deploy del backend y frontend.
* Testing automatizado para endpoints principales.

---

## Estado del proyecto

Proyecto en desarrollo.

Actualmente cuenta con una base funcional para autenticación, gestión de mascotas, síntomas y generación de diagnósticos asistidos por IA.

---

## Autor

Desarrollado por Manuel Chirinose.

GitHub: [@Manu9099](https://github.com/Manu9099)

---

## Licencia

Este proyecto puede ser utilizado con fines educativos y de portafolio.
