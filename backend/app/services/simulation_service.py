"""GPS Simulation Service for Bhubaneswar live tracking demos.
Provides pre-defined realistic demonstration trajectories across Bhubaneswar
and streams live simulated GPS pings to Proximity Risk Agent and Guardian.
"""

import asyncio
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session

from backend.app.geospatial.coordinates import interpolate_path
from backend.app.geospatial.proximity import ProximityRiskAgent

# Trajectory 1: Patia / Infocity Hotspot Ingress (Safe -> Elevated -> Flagged Unlit Forest Edge -> Escalation)
TRAJECTORY_PATIA_HOTSPOT: List[Tuple[float, float]] = [
    (20.3580, 85.8195),  # 1. Safe bright campus corridor
    (20.3568, 85.8190),  # 2. Transition zone towards Infocity back road
    (20.3558, 85.8185),  # 3. Ambient lighting drops, risk elevated
    (20.3551, 85.8181),  # 4. Entry into Flagged Risk Zone (ZONE-PATIA-01) - Proximity Escalation!
    (20.3546, 85.8178),  # 5. Forest edge alley, within 50m of offender last-known location
    (20.3538, 85.8175),  # 6. Critical danger zone
    (20.3525, 85.8185),  # 7. Safe reroute towards lit KIIT Road corridor
]

# Trajectory 2: Vani Vihar Dark Perimeter Walk
TRAJECTORY_VANI_VIHAR: List[Tuple[float, float]] = [
    (20.2940, 85.8390),  # Main lit highway
    (20.2970, 85.8405),  # Entering university outer road
    (20.3010, 85.8420),  # Flagged dark botanical perimeter (ZONE-VANI-03)
    (20.3030, 85.8435),  # Dim lane
    (20.2980, 85.8450),  # Saheed Nagar main road (Safe)
]

# Trajectory 3: Master Canteen / Station Back-Alley
TRAJECTORY_STATION_ALLEY: List[Tuple[float, float]] = [
    (20.2680, 85.8400),  # Master Canteen main junction
    (20.2660, 85.8425),  # Approaching platform approach road
    (20.2640, 85.8460),  # Flagged station back alley (ZONE-STATION-04)
    (20.2630, 85.8475),  # Cargo yard dark curve
]


class SimulationService:
    """Service providing simulated GPS feeds and trajectory playback."""

    @classmethod
    def get_trajectory_waypoints(cls, scenario: str = "patia_hotspot") -> List[Dict[str, Any]]:
        """Retrieve smooth interpolated coordinates for the selected demo scenario."""
        raw_points = TRAJECTORY_PATIA_HOTSPOT
        if scenario == "vani_vihar":
            raw_points = TRAJECTORY_VANI_VIHAR
        elif scenario == "station_alley":
            raw_points = TRAJECTORY_STATION_ALLEY

        # Interpolate points for smooth visual playback
        smooth_coords = interpolate_path(raw_points, num_intermediate_points=4)
        
        waypoints = []
        for idx, (lat, lng) in enumerate(smooth_coords):
            waypoints.append({
                "step_index": idx,
                "latitude": round(lat, 5),
                "longitude": round(lng, 5),
                "speed_kmh": 4.5 if idx < 10 else 3.8,  # Pedestrian walking speed
            })
        return waypoints

    @classmethod
    def process_simulation_step(
        cls,
        db: Session,
        session_id: str,
        step_index: int,
        scenario: str = "patia_hotspot",
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Execute a single step of the live GPS simulation and run through Proximity Risk Agent."""
        waypoints = cls.get_trajectory_waypoints(scenario)
        if step_index >= len(waypoints):
            step_index = len(waypoints) - 1

        point = waypoints[step_index]
        eval_result = ProximityRiskAgent.evaluate_gps_ping(
            db=db,
            session_id=session_id,
            lat=point["latitude"],
            lng=point["longitude"],
            speed_kmh=point["speed_kmh"],
            user_id=user_id,
        )

        return {
            "step_index": step_index,
            "total_steps": len(waypoints),
            "scenario": scenario,
            "is_completed": step_index >= (len(waypoints) - 1),
            "evaluation": eval_result,
        }
