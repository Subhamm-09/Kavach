"""Geospatial models: RiskZone, HeatmapCell, and GPSPing."""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Integer
from backend.app.database import Base


class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    zone_code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., "ZONE-PATIA-01"
    name = Column(String(255), nullable=False)  # e.g. "Infocity Dark Alley & Forest Edge"
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_meters = Column(Float, default=150.0)
    
    base_threat_level = Column(String(50), default="HIGH")  # LOW, MODERATE, HIGH, CRITICAL
    lighting_rating = Column(Float, default=2.0)  # 1.0 (Pitch Dark) to 5.0 (Bright LED)
    patrol_frequency = Column(String(50), default="LOW")  # FREQUENT, OCCASIONAL, RARE, NONE
    offender_count = Column(Integer, default=1)
    historical_incident_count = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class HeatmapCell(Base):
    __tablename__ = "heatmap_cells"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cell_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. "CELL-20.29-85.82"
    area_name = Column(String(255), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    
    # Grid Polygon Coordinates stored as JSON String [[lat, lng], [lat, lng], ...]
    polygon_geojson = Column(Text, nullable=False)
    
    # Risk Score: 0 - 100
    risk_score = Column(Float, default=0.0)
    # Risk Level: LOW (0-20), MODERATE (21-40), ELEVATED (41-60), HIGH (61-80), CRITICAL (81-100)
    risk_level = Column(String(50), default="LOW")
    incident_count = Column(Integer, default=0)
    last_incident_timestamp = Column(DateTime, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GPSPing(Base):
    __tablename__ = "gps_pings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(100), index=True, nullable=False)
    user_id = Column(String(36), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, default=0.0)  # in km/h
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    calculated_risk_score = Column(Float, default=0.0)
    nearest_zone_name = Column(String(255), nullable=True)
    nearest_zone_distance_meters = Column(Float, nullable=True)
    escalation_triggered = Column(Boolean, default=False)
