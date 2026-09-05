"""User model for authentication and role-based access control."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from backend.app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="ROLE_USER")  # ROLE_USER or ROLE_AUTHORITY
    phone = Column(String(50), nullable=True)
    emergency_contacts = Column(Text, nullable=True)  # JSON string of contacts
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
