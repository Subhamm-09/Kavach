"""KAVACH Agentic Safety Platform — Master FastAPI Application."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.seed.seeder import seed_database

# Routers
from backend.app.api.auth import router as auth_router
from backend.app.api.cases import cases_router, incidents_router, evidence_router
from backend.app.api.gps import router as gps_router
from backend.app.api.heatmap import heatmap_router, routes_router, proximity_router
from backend.app.api.therapy import router as therapy_router
from backend.app.api.legal import router as legal_router
from backend.app.api.matching import matching_router, verification_router, offenders_router
from backend.app.api.authority import router as authority_router
from backend.app.api.agents import router as agents_router
from backend.app.api.audit import audit_router, health_router
from backend.app.api.websocket import ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifespan."""
    print(f"[INIT] Initializing {settings.APP_NAME} (v{settings.APP_VERSION}) in {settings.APP_ENV} mode...")
    
    # Initialize DB & Seed Data
    db = SessionLocal()
    try:
        seed_res = seed_database(db, force=False)
        print(f"[SEED] Database & Vector Store Initialized: {seed_res.get('message')}")
    except Exception as e:
        print(f"[WARNING] Seeder warning during startup: {e}")
    finally:
        db.close()
        
    yield
    print(f"[SHUTDOWN] Shutting down {settings.APP_NAME}...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Agentic AI Platform for Proactive Prevention, Trauma-Informed Response, and Privacy-Preserving Prosecution.",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(gps_router)
app.include_router(heatmap_router)
app.include_router(proximity_router)
app.include_router(routes_router)
app.include_router(therapy_router)
app.include_router(legal_router)
app.include_router(matching_router)
app.include_router(verification_router)
app.include_router(offenders_router)
app.include_router(cases_router)
app.include_router(incidents_router)
app.include_router(evidence_router)
app.include_router(authority_router)
app.include_router(agents_router)
app.include_router(audit_router)
app.include_router(ws_router)

# Mount Next.js static build if present (for single-origin production deployment)
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "out")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static_frontend")
