"""Audit, AgentRun, and Seed metadata models."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
from backend.app.database import Base


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(100), index=True, nullable=False)
    request_id = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    agent_name = Column(String(100), nullable=False)
    trigger = Column(String(100), nullable=False)  # e.g., "GPS_PING", "CHAT_MESSAGE", "OFFENDER_QUERY"
    action_taken = Column(String(255), nullable=False)
    target = Column(String(255), nullable=True)
    result_summary = Column(Text, nullable=False)
    severity = Column(String(50), default="INFO")
    
    user_ref = Column(String(100), nullable=True)  # Anonymized or tokenized user ref
    case_ref = Column(String(100), nullable=True)  # Case ID or Anonymized Case ID


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(100), unique=True, index=True, nullable=False)
    initial_signal_type = Column(String(100), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="RUNNING")  # RUNNING, COMPLETED, ESCALATED, FAILED
    execution_duration_ms = Column(Float, default=0.0)
    final_decision = Column(Text, nullable=True)


class DatabaseSeedMeta(Base):
    __tablename__ = "database_seed_meta"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seed_version = Column(String(50), unique=True, nullable=False)
    is_seeded = Column(Boolean, default=True)
    seeded_at = Column(DateTime, default=datetime.utcnow)
