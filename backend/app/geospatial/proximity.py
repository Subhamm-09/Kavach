"""Proximity Risk Agent evaluating live GPS pings, zone intersections, and dwell time.
Triggers autonomous Guardian escalation when environmental or offender proximity hazards increase.
"""

from datetime import datetime
from typing import Dict, Any, Optional, Tuple, List
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.models.geospatial import RiskZone, GPSPing
from backend.app.models.offender import Offender
from backend.app.models.incident import Incident
from backend.app.geospatial.coordinates import haversine_distance_meters
from backend.app.geospatial.heatmap import SafetyHeatmapAgent


class ProximityRiskAgent:
    """Proximity Risk Agent acts on incoming simulated or live GPS pings."""

    @classmethod
    def evaluate_gps_ping(
        cls,
        db: Session,
        session_id: str,
        lat: float,
        lng: float,
        speed_kmh: float = 0.0,
        user_id: Optional[str] = None,
        current_time: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Evaluate proximity to:
        1. Flagged Risk Zones
        2. Known Offender Locations
        3. Local Incident Clusters
        
        Decides if immediate Autonomous Guardian Escalation is required.
        """
        if current_time is None:
            current_time = datetime.utcnow()

        risk_zones = db.query(RiskZone).filter(RiskZone.is_active == True).all()
        offenders = db.query(Offender).all()
        incidents = db.query(Incident).all()

        # Find closest risk zone
        closest_zone: Optional[RiskZone] = None
        min_zone_dist = float("inf")

        for rz in risk_zones:
            dist = haversine_distance_meters(lat, lng, rz.latitude, rz.longitude)
            if dist < min_zone_dist:
                min_zone_dist = dist
                closest_zone = rz

        # Find closest offender location
        closest_offender: Optional[Offender] = None
        min_offender_dist = float("inf")

        for off in offenders:
            dist = haversine_distance_meters(lat, lng, off.last_known_latitude, off.last_known_longitude)
            if dist < min_offender_dist:
                min_offender_dist = dist
                closest_offender = off

        # Determine dynamic environmental attributes based on closest zone distance
        if closest_zone:
            if min_zone_dist <= closest_zone.radius_meters:
                # Inside flagged zone core
                lighting = closest_zone.lighting_rating
                patrol = closest_zone.patrol_frequency
                stage = "HAZARD_ZONE_ENTRY"
            elif min_zone_dist <= (closest_zone.radius_meters + 120.0):
                # In perimeter buffer transition zone
                frac = (min_zone_dist - closest_zone.radius_meters) / 120.0
                lighting = closest_zone.lighting_rating * (1.0 - frac) + 3.8 * frac
                patrol = "OCCASIONAL"
                stage = "APPROACHING_PERIMETER"
            else:
                # Active illuminated corridor
                lighting = 4.2
                patrol = "FREQUENT"
                stage = "TRANSIT_SAFE"
        else:
            lighting = 4.0
            patrol = "FREQUENT"
            stage = "TRANSIT_SAFE"

        # Compute dynamic risk score at current coordinate
        risk_score, risk_level, nearby_inc_count = SafetyHeatmapAgent.calculate_cell_risk(
            center_lat=lat,
            center_lng=lng,
            lighting_rating=lighting,
            patrol_frequency=patrol,
            incidents=incidents,
            offenders=offenders,
            risk_zones=risk_zones,
            current_time=current_time,
        )

        # Check for autonomous escalation condition:
        # 1. Directly inside flagged danger zone core (<= radius_meters)
        # 2. Or acute proximity to high/critical tier registered offender (<= 80m)
        # 3. Or critical calculated composite risk score >= 75.0
        is_inside_danger_zone = bool(closest_zone and (min_zone_dist <= closest_zone.radius_meters))
        is_near_critical_offender = bool(closest_offender and (min_offender_dist <= settings.HIGH_RISK_DISTANCE_METERS) and (closest_offender.risk_tier in ["HIGH", "CRITICAL"]))
        is_critical_risk_score = risk_score >= 75.0

        escalation_triggered = bool(is_inside_danger_zone or is_near_critical_offender or is_critical_risk_score)
        
        guardian_action = None
        handoff_details = None

        if escalation_triggered:
            if is_near_critical_offender:
                guardian_action = "CRITICAL_PROXIMITY_WARNING"
                reason = f"Imminent proximity to registered offender ({closest_offender.offender_code}, {min_offender_dist:.0f}m) in unlit sector ({closest_zone.name if closest_zone else 'Area'})."
            elif is_inside_danger_zone:
                guardian_action = "ZONE_ENTRY_ELEVATED_ALERT"
                reason = f"User entered flagged high-risk zone '{closest_zone.name}' (Threat: {closest_zone.base_threat_level}, {min_zone_dist:.0f}m to core)."
            else:
                guardian_action = "ELEVATED_RISK_WARN"
                reason = f"Dynamic environmental risk increased to {risk_score} ({risk_level}) with {nearby_inc_count} recent incident clusters."

            handoff_details = {
                "initiating_agent": "ProximityRiskAgent",
                "target_agent": "GuardianOrchestrator",
                "severity": "CRITICAL" if risk_score >= 75 else "HIGH",
                "reason": reason,
                "closest_zone_name": closest_zone.name if closest_zone else "Unknown Zone",
                "closest_zone_distance_meters": round(min_zone_dist, 1),
                "closest_offender_code": closest_offender.offender_code if closest_offender and min_offender_dist < 400 else None,
                "closest_offender_distance_meters": round(min_offender_dist, 1) if min_offender_dist < 400 else None,
                "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
            }
        else:
            if stage == "APPROACHING_PERIMETER":
                reason = f"Approaching outer perimeter of '{closest_zone.name}' ({min_zone_dist:.0f}m away). Ambient lighting at {lighting:.1f}/5.0."
                guardian_action = "PERIMETER_MONITORING"
            else:
                reason = f"Routine corridor monitoring. Path well-lit ({lighting:.1f}/5.0) and clear of flagged hazard zones ({min_zone_dist:.0f}m away)."
                guardian_action = "ROUTINE_MONITORING"

        # Store GPS ping in database
        ping = GPSPing(
            session_id=session_id,
            user_id=user_id,
            latitude=lat,
            longitude=lng,
            speed=speed_kmh,
            timestamp=current_time,
            calculated_risk_score=risk_score,
            nearest_zone_name=closest_zone.name if closest_zone else None,
            nearest_zone_distance_meters=round(min_zone_dist, 1) if min_zone_dist != float("inf") else None,
            escalation_triggered=escalation_triggered,
        )
        db.add(ping)
        db.commit()
        db.refresh(ping)

        return {
            "ping_id": ping.id,
            "session_id": session_id,
            "latitude": lat,
            "longitude": lng,
            "calculated_risk_score": risk_score,
            "risk_level": risk_level,
            "nearest_zone_name": closest_zone.name if closest_zone else None,
            "nearest_zone_distance_meters": round(min_zone_dist, 1) if min_zone_dist != float("inf") else None,
            "nearest_offender_code": closest_offender.offender_code if closest_offender and min_offender_dist < 400 else None,
            "nearest_offender_distance_meters": round(min_offender_dist, 1) if closest_offender and min_offender_dist < 400 else None,
            "lighting_rating": round(lighting, 1),
            "patrol_frequency": patrol,
            "stage": stage,
            "reason_summary": reason,
            "escalation_triggered": escalation_triggered,
            "guardian_action": guardian_action,
            "active_agent": "GuardianOrchestrator" if escalation_triggered else "ProximityRiskAgent",
            "handoff_details": handoff_details,
        }
