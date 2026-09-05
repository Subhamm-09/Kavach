"""GPS Telemetry & Simulation API Router."""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.schemas.geospatial import GPSPingInput, GPSPingResponse
from backend.app.geospatial.proximity import ProximityRiskAgent
from backend.app.services.simulation_service import SimulationService

router = APIRouter(prefix="/api/gps", tags=["GPS Telemetry"])


@router.post("/ping", response_model=GPSPingResponse)
def receive_gps_ping(payload: GPSPingInput, db: Session = Depends(get_db)):
    """Receive a live or simulated GPS telemetry ping and evaluate proximity risk."""
    res = ProximityRiskAgent.evaluate_gps_ping(
        db=db,
        session_id=payload.session_id,
        lat=payload.latitude,
        lng=payload.longitude,
        speed_kmh=payload.speed or 0.0,
        user_id=payload.user_id,
    )
    return res


@router.get("/simulation/waypoints")
def get_simulation_waypoints(
    scenario: str = Query("patia_hotspot", description="patia_hotspot, vani_vihar, station_alley")
):
    """Retrieve pre-interpolated waypoints for smooth client-side animation."""
    waypoints = SimulationService.get_trajectory_waypoints(scenario=scenario)
    return {
        "scenario": scenario,
        "total_steps": len(waypoints),
        "waypoints": waypoints,
    }


@router.post("/simulation/step")
def execute_simulation_step(
    session_id: str = Query(...),
    step_index: int = Query(...),
    scenario: str = Query("patia_hotspot"),
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Process a single simulation step through the backend Proximity Risk Agent."""
    step_result = SimulationService.process_simulation_step(
        db=db,
        session_id=session_id,
        step_index=step_index,
        scenario=scenario,
        user_id=user_id,
    )
    return step_result
