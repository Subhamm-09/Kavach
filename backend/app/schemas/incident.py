"""Pydantic schemas for Incidents and User Cases."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class IncidentCreate(BaseModel):
    latitude: float
    longitude: float
    area_name: str
    category: str
    severity: Optional[str] = "MEDIUM"
    raw_narrative: str
    perpetrator_description: Optional[str] = None
    lighting_condition: Optional[str] = "POOR"
    crowd_density: Optional[str] = "ISOLATED"
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    user_email: Optional[str] = None


class IncidentResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    timestamp: datetime
    latitude: float
    longitude: float
    area_name: str
    category: str
    severity: str
    raw_narrative: str
    sanitized_narrative: Optional[str] = None
    perpetrator_description: Optional[str] = None
    lighting_condition: str
    crowd_density: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class CaseCreate(BaseModel):
    title: str
    primary_incident: IncidentCreate


class CaseUserResponse(BaseModel):
    id: str
    tracking_number: str
    anonymized_id: str
    title: str
    status: str
    severity: str
    verification_status: str
    corroboration_count: int
    privacy_guardian_applied: bool
    formal_complaint_draft: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    incidents: List[IncidentResponse] = []

    class Config:
        from_attributes = True
