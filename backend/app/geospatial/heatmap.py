"""Safety Heatmap Agent & Geospatial Risk Engine for Bhubaneswar.
Calculates deterministic risk scores based on weighted incident density,
recency weighting, lighting, patrol frequency, and offender proximity.
"""

import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session

from backend.app.models.incident import Incident
from backend.app.models.geospatial import HeatmapCell, RiskZone
from backend.app.models.offender import Offender
from backend.app.geospatial.coordinates import haversine_distance_meters
from backend.app.schemas.geospatial import HeatmapResponse, HeatmapCellResponse

# Bhubaneswar Area Grid Specifications (covering key corridors)
# Latitude ~ 20.25 to 20.37, Longitude ~ 85.78 to 85.87
GRID_ZONES = [
    {
        "cell_id": "CELL-PATIA-INFOCITY",
        "area_name": "Patia / Infocity Tech Corridor",
        "center_lat": 20.3550,
        "center_lng": 85.8180,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 2.2,  # Sub-optimal side alleys
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-KIIT-ROAD",
        "area_name": "KIIT Road & Square",
        "center_lat": 20.3500,
        "center_lng": 85.8195,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 3.8,  # Relatively well lit near university
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-SAILASHREE-VIHAR",
        "area_name": "Sailashree Vihar Residential / Forest Edge",
        "center_lat": 20.3380,
        "center_lng": 85.8120,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.8,  # Dimly lit outer perimeter
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-CHANDRASEKHARPUR",
        "area_name": "Chandrasekharpur Commercial Belt",
        "center_lat": 20.3240,
        "center_lng": 85.8200,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 4.0,  # Commercial arterial
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-JAYADEV-VIHAR",
        "area_name": "Jayadev Vihar Junction & Overbridge",
        "center_lat": 20.3050,
        "center_lng": 85.8250,
        "delta_lat": 0.011,
        "delta_lng": 0.011,
        "lighting_rating": 4.2,  # Major junction
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-ACHARYA-VIHAR",
        "area_name": "Acharya Vihar / Science Park Loop",
        "center_lat": 20.2980,
        "center_lng": 85.8320,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 2.5,  # Quiet green pockets
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-VANI-VIHAR",
        "area_name": "Vani Vihar / Utkal University Corridor",
        "center_lat": 20.3010,
        "center_lng": 85.8420,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 2.0,  # Dark foliage sectors
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-SAHEED-NAGAR",
        "area_name": "Saheed Nagar Inner Commercial Lanes",
        "center_lat": 20.2880,
        "center_lng": 85.8450,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 3.2,
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-MASTER-CANTEEN",
        "area_name": "Master Canteen / Station Square Area",
        "center_lat": 20.2660,
        "center_lng": 85.8410,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 2.8,  # High transit, dark back alleys
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-OLD-TOWN",
        "area_name": "Old Town Heritage Zone",
        "center_lat": 20.2450,
        "center_lng": 85.8340,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 2.6,
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-GHATIKIA",
        "area_name": "Ghatikia Residential & Main Road",
        "center_lat": 20.2700,
        "center_lng": 85.7765,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        # Baseline only; live incident, lighting, and patrol data refine this score.
        "lighting_rating": 3.0,
        "patrol_frequency": "OCCASIONAL",
    },
    {
        "cell_id": "CELL-KHANDAGIRI",
        "area_name": "Khandagiri Caves & Main Corridor",
        "center_lat": 20.2590,
        "center_lng": 85.7830,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        # Baseline only; live incident, lighting, and patrol data refine this score.
        "lighting_rating": 3.1,
        "patrol_frequency": "OCCASIONAL",
    },
]


def determine_risk_level(score: float) -> str:
    """Normalize score to 5 standardized risk levels."""
    if score <= 20.0:
        return "LOW"
    elif score <= 40.0:
        return "MODERATE"
    elif score <= 60.0:
        return "ELEVATED"
    elif score <= 80.0:
        return "HIGH"
    else:
        return "CRITICAL"


class SafetyHeatmapAgent:
    """Safety Heatmap Agent computes real-time geospatial risk scores for Bhubaneswar cells."""

    @staticmethod
    def calculate_cell_risk(
        center_lat: float,
        center_lng: float,
        lighting_rating: float,
        patrol_frequency: str,
        incidents: List[Incident],
        offenders: List[Offender],
        risk_zones: List[RiskZone],
        current_time: datetime = None
    ) -> Tuple[float, str, int]:
        """Deterministic risk formula:
        Score = Base_Env_Penalty + Incident_Density_Weight + Recency_Weight + Offender_Proximity_Weight + Flagged_Zone_Weight
        Normalized to 0 - 100.
        """
        if current_time is None:
            current_time = datetime.utcnow()

        # 1. Environmental Risk Factor (Lighting & Patrol)
        # Lighting: 1.0 (Dark) -> 18 pts, 5.0 (Bright) -> 0 pts
        lighting_penalty = max(0.0, (5.0 - lighting_rating) * 4.5)  # max ~18 pts
        patrol_penalties = {"FREQUENT": 0.0, "OCCASIONAL": 5.0, "RARE": 10.0, "NONE": 15.0}
        patrol_penalty = patrol_penalties.get(patrol_frequency.upper(), 5.0)
        env_score = lighting_penalty + patrol_penalty  # max ~33 pts

        # 2. Incident Density & Recency Weighting
        incident_score = 0.0
        relevant_incident_count = 0
        severity_multipliers = {"LOW": 1.5, "MEDIUM": 3.5, "HIGH": 6.0, "CRITICAL": 9.0}

        for inc in incidents:
            dist = haversine_distance_meters(center_lat, center_lng, inc.latitude, inc.longitude)
            if dist <= 400.0:  # Within 400m influence radius
                relevant_incident_count += 1
                base_sev = severity_multipliers.get(inc.severity.upper(), 3.5)
                
                # Distance attenuation (1.0 at epicenter down to 0.0 at 400m)
                dist_factor = max(0.0, 1.0 - (dist / 400.0))
                
                # Recency factor: Within 7 days = 1.2x, Within 30 days = 1.0x, older = 0.6x
                days_ago = (current_time - inc.timestamp).total_seconds() / 86400.0
                recency_factor = 1.2 if days_ago <= 7 else (1.0 if days_ago <= 30 else 0.6)

                incident_score += base_sev * dist_factor * recency_factor
        
        incident_score = min(25.0, incident_score)

        # 3. Offender Proximity Contribution (High risk only in close vicinity < 300m)
        offender_score = 0.0
        for off in offenders:
            dist = haversine_distance_meters(center_lat, center_lng, off.last_known_latitude, off.last_known_longitude)
            if dist <= 300.0:
                tier_pts = {"CRITICAL": 22.0, "HIGH": 15.0, "MODERATE": 8.0, "LOW": 3.0}.get(off.risk_tier.upper(), 8.0)
                dist_factor = max(0.0, 1.0 - (dist / 300.0))
                offender_score += tier_pts * dist_factor

        offender_score = min(25.0, offender_score)

        # 4. Flagged Risk Zone Overlap
        zone_penalty = 0.0
        for rz in risk_zones:
            dist = haversine_distance_meters(center_lat, center_lng, rz.latitude, rz.longitude)
            if dist <= rz.radius_meters:
                # Inside flagged zone core
                zone_penalty = max(zone_penalty, 25.0)
            elif dist <= (rz.radius_meters + 120.0):
                # In perimeter buffer
                buffer_factor = 1.0 - ((dist - rz.radius_meters) / 120.0)
                zone_penalty = max(zone_penalty, 14.0 * buffer_factor)

        raw_total = env_score + incident_score + offender_score + zone_penalty
        final_score = min(100.0, max(0.0, raw_total))
        risk_level = determine_risk_level(final_score)

        return round(final_score, 1), risk_level, relevant_incident_count

    @classmethod
    def get_bhubaneswar_heatmap(cls, db: Session) -> HeatmapResponse:
        """Compute the full heatmap grid for Bhubaneswar."""
        incidents = db.query(Incident).all()
        offenders = db.query(Offender).all()
        risk_zones = db.query(RiskZone).filter(RiskZone.is_active == True).all()

        cells_response: List[HeatmapCellResponse] = []
        high_risk_count = 0

        for zone_cfg in GRID_ZONES:
            c_lat = zone_cfg["center_lat"]
            c_lng = zone_cfg["center_lng"]
            d_lat = zone_cfg["delta_lat"]
            d_lng = zone_cfg["delta_lng"]

            # Compute bounding polygon
            poly = [
                [c_lat - d_lat / 2, c_lng - d_lng / 2],
                [c_lat + d_lat / 2, c_lng - d_lng / 2],
                [c_lat + d_lat / 2, c_lng + d_lng / 2],
                [c_lat - d_lat / 2, c_lng + d_lng / 2],
            ]

            score, level, inc_count = cls.calculate_cell_risk(
                center_lat=c_lat,
                center_lng=c_lng,
                lighting_rating=zone_cfg["lighting_rating"],
                patrol_frequency=zone_cfg["patrol_frequency"],
                incidents=incidents,
                offenders=offenders,
                risk_zones=risk_zones,
            )

            if level in ["HIGH", "CRITICAL"]:
                high_risk_count += 1

            cells_response.append(
                HeatmapCellResponse(
                    cell_id=zone_cfg["cell_id"],
                    area_name=zone_cfg["area_name"],
                    center_lat=c_lat,
                    center_lng=c_lng,
                    polygon=poly,
                    risk_score=score,
                    risk_level=level,
                    incident_count=inc_count,
                )
            )

        return HeatmapResponse(
            total_cells=len(cells_response),
            cells=cells_response,
            high_risk_zone_count=high_risk_count,
            calculated_at=datetime.utcnow(),
        )
