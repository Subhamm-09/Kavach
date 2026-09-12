# KAVACH — Local Development & Contribution Guide

## 1. Prerequisites

- **Python**: 3.11+ (Tested on Python 3.12 and 3.14 on Windows 11).
- **Node.js**: 18.0+ (with `npm`).
- **Git**: For version control.

---

## 2. Setting Up the Local Workspace

### 2.1. Backend Setup
```bash
# Navigate to repository root
cd D:\Projects\Kavach

# Create and activate Python virtualenv
python -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Initialize DB and seed ChromaDB vector store
python backend\scripts\init_db.py
python backend\scripts\seed_demo_data.py
python backend\scripts\ingest_legal_docs.py

# Start Backend Dev Server
uvicorn app.main:app --reload --app-dir backend --port 8000
```

### 2.2. Frontend Setup
```bash
# In a new terminal window:
cd D:\Projects\Kavach\frontend

# Install frontend dependencies
npm.cmd install

# Start Next.js Development Server
npm.cmd run dev
```

The frontend will be live at `http://localhost:3000` with hot-reloading enabled.

---

## 3. Running Automated Tests

Kavach includes an automated test suite verifying privacy invariants, agent orchestration, trauma handoffs, and vector matching:

```bash
# Activate virtualenv first
cd D:\Projects\Kavach
.\backend\venv\Scripts\Activate.ps1

# Run full test suite
pytest -v

# Run only privacy invariant tests
pytest backend/tests/test_privacy_invariant.py -v

# Run agent and workflow tests
pytest backend/tests/test_agents_and_workflows.py -v
```

---

## 4. Code Structure Overview

```
Kavach/
├── backend/
│   ├── app/
│   │   ├── agents/          # 11 AI Agents (Guardian, Proximity, Heatmap, etc.)
│   │   ├── api/             # FastAPI Routers (Auth, GPS, Cases, Authority, etc.)
│   │   ├── geospatial/      # Haversine proximity & Dijkstra routing
│   │   ├── graph/           # LangGraph StateGraph & Orchestration
│   │   ├── models/          # SQLAlchemy Database Models
│   │   ├── privacy/         # PII Redaction, HMAC Tokenization, Privacy Guardian
│   │   ├── providers/       # Gemini AI & Deterministic Fallback Engine
│   │   ├── rag/             # ChromaDB vector stores (Offender & Legal)
│   │   └── schemas/         # Pydantic Schemas & DTOs
│   ├── scripts/             # DB init, data seeder, legal ingestion
│   └── tests/               # Pytest suite
├── frontend/
│   ├── app/                 # Next.js 14 App Router pages
│   ├── components/          # React components (Map, Timeline, Panels)
│   └── public/              # Static assets & icons
├── data/                    # Persistent SQLite DB and ChromaDB files
└── docs/                    # Architectural & Developer Documentation
```
