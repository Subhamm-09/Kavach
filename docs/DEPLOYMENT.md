# KAVACH — Production Deployment & Build Guide

## 1. Deployment Architecture

Kavach supports two production deployment topologies:

1. **Decoupled Service Topology (Recommended)**:
   - Frontend: Next.js 14 hosted on Vercel / Node.js container (`http://localhost:3000`).
   - Backend: FastAPI ASGI application running via Uvicorn/Gunicorn (`http://localhost:8000`).
   - Database: Persistent SQLite (or PostgreSQL via SQLAlchemy connection string) + Persistent ChromaDB (`data/chroma`).

2. **Single-Origin Topology**:
   - Next.js pre-built static export (`frontend/out`) mounted directly to FastAPI static file handler (`/`).

---

## 2. Environment Configuration

Create a `.env` file in the project root:

```ini
# Environment
ENV=production
DEBUG=False
SECRET_KEY=kavach_production_hmac_secret_key_change_me_in_prod

# Databases
DATABASE_URL=sqlite:///./data/kavach.db
CHROMA_PERSIST_DIRECTORY=./data/chroma

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Law Enforcement Demo Credentials
DEMO_AUTHORITY_EMAIL=inspector.patnaik@odishapolice.gov.in
DEMO_AUTHORITY_PASSWORD=KavachShield@2026
```

---

## 3. Step-by-Step Production Build

### 3.1. Backend Setup & Ingestion
```bash
# 1. Create and activate virtual environment
python -m venv backend/venv
backend\venv\Scripts\activate   # Windows
# or: source backend/venv/bin/activate  # Linux/macOS

# 2. Install dependencies
pip install -r requirements.txt

# 3. Initialize database and seed vector indexes
python backend/scripts/init_db.py
python backend/scripts/seed_demo_data.py
python backend/scripts/ingest_legal_docs.py

# 4. Start ASGI production server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 3.2. Frontend Build & Launch
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Build Next.js production bundle
npm run build

# 3. Start Next.js production server
npm start -p 3000
```

---

## 4. Health Checks & Verification

- **Backend Health**: `GET http://localhost:8000/api/health` -> `{"status": "healthy", "service": "kavach-backend"}`
- **OpenAPI Docs**: `http://localhost:8000/docs`
- **Frontend App**: `http://localhost:3000`
