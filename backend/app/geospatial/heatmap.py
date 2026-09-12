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

# Bhubaneswar Area Grid Specifications (23 key corridors covering North, South, East, West & Lingipur)
# Latitude ~ 20.21 to 20.37, Longitude ~ 85.77 to 85.88
GRID_ZONES = [
    # 1. Northern Tech & Education Belt
    {
        "cell_id": "CELL-PATIA-INFOCITY",
        "area_name": "Patia / Infocity Tech Corridor",
        "center_lat": 20.3550,
        "center_lng": 85.8180,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.2,  # RED 1: Dark forest perimeter with multiple incident clusters (Score ~88)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-KIIT-ROAD",
        "area_name": "KIIT Road & Campus Square",
        "center_lat": 20.3500,
        "center_lng": 85.8195,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 4.5,  # GREEN 1: Campus hub (Score ~12)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-SAILASHREE-VIHAR",
        "area_name": "Sailashree Vihar Residential / Forest Edge",
        "center_lat": 20.3380,
        "center_lng": 85.8120,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.8,  # ORANGE 1: Elevated perimeter (Score ~54)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-KALARAHANGA",
        "area_name": "Kalarahanga / Nandankanan Road",
        "center_lat": 20.3680,
        "center_lng": 85.8270,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 2.1,  # ORANGE 2: Semi-rural fringe (Score ~45)
        "patrol_frequency": "RARE",
    },
    # 2. Central Commercial & Institutional Arterials
    {
        "cell_id": "CELL-CHANDRASEKHARPUR",
        "area_name": "Chandrasekharpur Commercial Belt",
        "center_lat": 20.3240,
        "center_lng": 85.8200,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 4.5,  # GREEN 2: Well-lit commercial avenue (Score ~6)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-NALCO-SQUARE",
        "area_name": "Nalco Square & Central Avenue",
        "center_lat": 20.3150,
        "center_lng": 85.8220,
        "delta_lat": 0.011,
        "delta_lng": 0.011,
        "lighting_rating": 4.4,  # GREEN 3: Major junction (Score ~5)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-JAYADEV-VIHAR",
        "area_name": "Jayadev Vihar Junction & Overbridge",
        "center_lat": 20.3050,
        "center_lng": 85.8250,
        "delta_lat": 0.011,
        "delta_lng": 0.011,
        "lighting_rating": 4.2,  # GREEN 4: Overbridge (Score ~11)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-VANI-VIHAR",
        "area_name": "Vani Vihar / Utkal University Corridor",
        "center_lat": 20.3010,
        "center_lng": 85.8420,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.4,  # RED 2: University unlit dense botanical belt (Score ~76)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-NAYAPALLI-IRC",
        "area_name": "Nayapalli / IRC Village Commercial",
        "center_lat": 20.2990,
        "center_lng": 85.8150,
        "delta_lat": 0.011,
        "delta_lng": 0.011,
        "lighting_rating": 4.0,  # GREEN 5: Busy commercial (Score ~7)
        "patrol_frequency": "FREQUENT",
    },
    # 3. Eastern Commercial & Transit Flank
    {
        "cell_id": "CELL-SAHEED-NAGAR",
        "area_name": "Saheed Nagar Inner Commercial Lanes",
        "center_lat": 20.2880,
        "center_lng": 85.8450,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 3.8,  # GREEN 6: Active residential lanes (Score ~14)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-RASULGARH",
        "area_name": "Rasulgarh Square & Eastern Highway Hub",
        "center_lat": 20.2920,
        "center_lng": 85.8650,
        "delta_lat": 0.013,
        "delta_lng": 0.013,
        "lighting_rating": 3.9,  # GREEN 7: Main highway nexus (Score ~8)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-MANCHESWAR",
        "area_name": "Mancheswar Industrial & Carriage Workshop",
        "center_lat": 20.3200,
        "center_lng": 85.8520,
        "delta_lat": 0.014,
        "delta_lng": 0.014,
        "lighting_rating": 1.3,  # ORANGE 3: Isolated railway yard alleys (Score ~48)
        "patrol_frequency": "RARE",
    },
    # 4. Urban Core & Downtown Belts
    {
        "cell_id": "CELL-RAM-MANDIR-JANPATH",
        "area_name": "Ram Mandir Square & Janpath Avenue",
        "center_lat": 20.2770,
        "center_lng": 85.8420,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 4.8,  # GREEN 8: Bright retail boulevard (Score ~3)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-MASTER-CANTEEN",
        "area_name": "Master Canteen / Central Station Hub",
        "center_lat": 20.2660,
        "center_lng": 85.8410,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.6,  # ORANGE 4: Dark unmonitored back alleys (Score ~44)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-BAPUJI-NAGAR",
        "area_name": "Bapuji Nagar Central Market District",
        "center_lat": 20.2620,
        "center_lng": 85.8330,
        "delta_lat": 0.010,
        "delta_lng": 0.010,
        "lighting_rating": 4.2,  # GREEN 9: Central market (Score ~7)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-UNIT-8",
        "area_name": "Unit-8 / Raj Bhavan Perimeter",
        "center_lat": 20.2800,
        "center_lng": 85.8190,
        "delta_lat": 0.011,
        "delta_lng": 0.011,
        "lighting_rating": 4.3,  # GREEN 10: VIP perimeter (Score ~5)
        "patrol_frequency": "FREQUENT",
    },
    # 5. Western & NH-16 Transit Hubs
    {
        "cell_id": "CELL-BARAMUNDA-ISBT",
        "area_name": "Baramunda Inter-State Bus Terminal (ISBT)",
        "center_lat": 20.2780,
        "center_lng": 85.7980,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.9,  # ORANGE 5: High transit outer bus yard (Score ~43)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-KHANDAGIRI",
        "area_name": "Khandagiri Caves & Square",
        "center_lat": 20.2590,
        "center_lng": 85.7830,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.7,  # ORANGE 6: Hillside outer perimeter (Score ~45)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-GHATIKIA",
        "area_name": "Ghatikia Residential & Main Road",
        "center_lat": 20.2700,
        "center_lng": 85.7765,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 4.1,  # GREEN 11: Main road corridor (Score ~12)
        "patrol_frequency": "FREQUENT",
    },
    {
        "cell_id": "CELL-AIIMS-PATRAPADA",
        "area_name": "Patrapada / AIIMS Hospital Medical Corridor",
        "center_lat": 20.2460,
        "center_lng": 85.7680,
        "delta_lat": 0.013,
        "delta_lng": 0.013,
        "lighting_rating": 4.2,  # GREEN 12: Hospital emergency corridor (Score ~6)
        "patrol_frequency": "FREQUENT",
    },
    # 6. Southern Heritage & Lingipur Flanks
    {
        "cell_id": "CELL-OLD-TOWN",
        "area_name": "Old Town / Lingaraj Heritage Precinct",
        "center_lat": 20.2450,
        "center_lng": 85.8340,
        "delta_lat": 0.012,
        "delta_lng": 0.012,
        "lighting_rating": 1.8,  # ORANGE 7: Unlit narrow labyrinthine alleys (Score ~46)
        "patrol_frequency": "RARE",
    },
    {
        "cell_id": "CELL-LINGIPUR",
        "area_name": "Lingipur / Daya River South Bypass",
        "center_lat": 20.2220,
        "center_lng": 85.8450,
        "delta_lat": 0.014,
        "delta_lng": 0.014,
        "lighting_rating": 1.1,  # RED 3: Unlit rural Daya riverbed boundary (Score ~71.6)
        "patrol_frequency": "RARE",
        "base_risk_penalty": 44.0,  # Isolated riverbed flood-plain bypass with zero street surveillance
    },
    {
        "cell_id": "CELL-PHULNAKHARA",
        "area_name": "Phulnakhara NH-16 Link",
        "center_lat": 20.2350,
        "center_lng": 85.8750,
        "delta_lat": 0.014,
        "delta_lng": 0.014,
        "lighting_rating": 3.8,  # GREEN 13: NH arterial link (Score ~14)
        "patrol_frequency": "FREQUENT",
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
        current_time: datetime = None,
        base_risk_penalty: float = 0.0,
    ) -> Tuple[float, str, int]:
        """Deterministic risk formula:
        Score = Base_Env_Penalty + Incident_Density_Weight + Recency_Weight + Offender_Proximity_Weight + Flagged_Zone_Weight + Base_Risk_Penalty
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

        raw_total = env_score + incident_score + offender_score + zone_penalty + base_risk_penalty
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
                base_risk_penalty=zone_cfg.get("base_risk_penalty", 0.0),
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
