"""Pydantic schemas for geospatial calculations, GPS simulation, heatmap, and safe routing."""

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class GPSPingInput(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    latitude: float
    longitude: float
    speed: Optional[float] = 0.0
    timestamp: Optional[datetime] = None


class GPSPingResponse(BaseModel):
    ping_id: str
    session_id: str
    latitude: float
    longitude: float
    calculated_risk_score: float
    risk_level: str
    nearest_zone_name: Optional[str] = None
    nearest_zone_distance_meters: Optional[float] = None
    escalation_triggered: bool
    guardian_action: Optional[str] = None
    active_agent: str
    handoff_details: Optional[Dict[str, Any]] = None


class RiskZoneResponse(BaseModel):
    id: str
    zone_code: str
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    radius_meters: float
    base_threat_level: str
    lighting_rating: float
    patrol_frequency: str
    offender_count: int
    historical_incident_count: int

    class Config:
        from_attributes = True


class HeatmapCellResponse(BaseModel):
    cell_id: str
    area_name: str
    center_lat: float
    center_lng: float
    polygon: List[List[float]]  # Array of [lat, lng] points
    risk_score: float  # 0 to 100
    risk_level: str  # LOW, MODERATE, ELEVATED, HIGH, CRITICAL
    incident_count: int


class HeatmapResponse(BaseModel):
    total_cells: int
    cells: List[HeatmapCellResponse]
    high_risk_zone_count: int
    calculated_at: datetime


class SafeRouteRequest(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    origin_name: Optional[str] = "Origin"
    destination_name: Optional[str] = "Destination"


class RoutePathOption(BaseModel):
    route_id: str
    name: str  # e.g. "Primary Safe Route (via Main Lit Arterial)" vs "Direct Unlit Shortcut"
    is_recommended: bool
    total_distance_km: float
    estimated_time_mins: float
    average_risk_score: float
    max_risk_level: str
    waypoints: List[List[float]]  # List of [lat, lng]
    factual_explanation: str
    avoided_zones: List[str]


class SafeRouteResponse(BaseModel):
    origin: Dict[str, Any]
    destination: Dict[str, Any]
    recommended_route: RoutePathOption
    alternative_routes: List[RoutePathOption]
    reasoning_summary: str
