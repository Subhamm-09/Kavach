"""Geospatial Risk & Heatmap API Routers."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.schemas.geospatial import HeatmapResponse, SafeRouteRequest, SafeRouteResponse, RiskZoneResponse
from backend.app.geospatial.heatmap import SafetyHeatmapAgent
from backend.app.geospatial.routing import SafeRouteAgent
from backend.app.models.geospatial import RiskZone

heatmap_router = APIRouter(prefix="/api/heatmap", tags=["Safety Heatmap"])
routes_router = APIRouter(prefix="/api/routes", tags=["Safe Routing"])
proximity_router = APIRouter(prefix="/api/proximity", tags=["Proximity Risk"])


@heatmap_router.get("/bhubaneswar", response_model=HeatmapResponse)
def get_bhubaneswar_heatmap(db: Session = Depends(get_db)):
    """Retrieve full dynamic safety heatmap grid for Bhubaneswar."""
    return SafetyHeatmapAgent.get_bhubaneswar_heatmap(db)


@heatmap_router.get("/zones", response_model=list[RiskZoneResponse])
def get_active_risk_zones(db: Session = Depends(get_db)):
    """Retrieve all flagged high-risk hotspots and unlit corridors."""
    zones = db.query(RiskZone).filter(RiskZone.is_active == True).all()
    return zones


@routes_router.post("/safe-route", response_model=SafeRouteResponse)
def calculate_safe_route(payload: SafeRouteRequest, db: Session = Depends(get_db)):
    """Compute safety-cost optimized routing versus direct unlit shortcuts."""
    return SafeRouteAgent.compute_safe_routes(
        db=db,
        origin_lat=payload.origin_lat,
        origin_lng=payload.origin_lng,
        dest_lat=payload.destination_lat,
        dest_lng=payload.destination_lng,
        origin_name=payload.origin_name or "Origin",
        dest_name=payload.destination_name or "Destination",
    )


@proximity_router.get("/zones")
def list_proximity_zones(db: Session = Depends(get_db)):
    """List all registered danger zones for proximity monitoring."""
    zones = db.query(RiskZone).filter(RiskZone.is_active == True).all()
    return [{
        "zone_code": z.zone_code,
        "name": z.name,
        "threat_level": z.base_threat_level,
        "lat": z.latitude,
        "lng": z.longitude,
        "radius_meters": z.radius_meters,
    } for z in zones]
