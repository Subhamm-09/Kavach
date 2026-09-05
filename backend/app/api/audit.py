"""Audit and Health API Routers."""

import os
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database import get_db
from backend.app.models.audit import AuditEvent, DatabaseSeedMeta
from backend.app.rag.chroma_client import get_chroma_client, get_offender_collection, get_legal_collection

audit_router = APIRouter(prefix="/api/audit", tags=["Auditability"])
health_router = APIRouter(tags=["Health"])


@audit_router.get("/events")
def list_audit_events(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve audit log events."""
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(limit).all()
    return events


@health_router.get("/health")
def get_health_status(db: Session = Depends(get_db)):
    """Application health status."""
    return {
        "status": "HEALTHY",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "timestamp": datetime.utcnow().isoformat(),
    }


@health_router.get("/health/dependencies")
def get_dependencies_health(db: Session = Depends(get_db)):
    """Detailed dependency health check for SQLite, ChromaDB, Gemini, and Seed state."""
    # 1. SQLite
    sqlite_healthy = False
    try:
        db.execute(db.query(DatabaseSeedMeta).statement)
        sqlite_healthy = True
    except Exception:
        pass

    # 2. ChromaDB
    chroma_healthy = False
    offender_vectors = 0
    legal_vectors = 0
    chroma_error = None
    try:
        client = get_chroma_client()
        for col in client.list_collections():
            if col.name == "kavach_offender_profiles":
                offender_vectors = col.count()
            elif col.name == "kavach_legal_documents":
                legal_vectors = col.count()
        chroma_healthy = True
    except Exception as e:
        chroma_error = str(e)

    # 3. Gemini API Key Status
    gemini_configured = bool(settings.GEMINI_API_KEY)

    # 4. Seed Version
    seed_record = db.query(DatabaseSeedMeta).first()

    return {
        "sqlite": {
            "status": "UP" if sqlite_healthy else "DOWN",
            "database_url": settings.DATABASE_URL,
        },
        "chromadb": {
            "status": "UP" if chroma_healthy else "DOWN",
            "persist_directory": settings.CHROMA_PERSIST_DIRECTORY,
            "offender_profiles_indexed": offender_vectors,
            "legal_chunks_indexed": legal_vectors,
            "error": chroma_error,
        },
        "gemini_ai": {
            "configured": gemini_configured,
            "model": settings.GEMINI_MODEL,
            "mode": "ACTIVE_GEMINI" if gemini_configured else "DETERMINISTIC_FALLBACK",
        },
        "seed_state": {
            "is_seeded": seed_record.is_seeded if seed_record else False,
            "version": seed_record.seed_version if seed_record else None,
            "seeded_at": seed_record.seeded_at.isoformat() if seed_record else None,
        }
    }
