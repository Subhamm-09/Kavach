"""Idempotent Database Seeder for Kavach.
Seeds fictional demo users, authorities, risk zones, offenders, incidents, and cases.
Guarantees idempotency via DatabaseSeedMeta version tracking.
"""

import uuid
import json
from datetime import datetime
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.models.user import User
from backend.app.models.offender import Offender, IncidentOffenderCandidate
from backend.app.models.geospatial import RiskZone
from backend.app.models.incident import Incident
from backend.app.models.case import Case
from backend.app.models.verification import VerificationResult
from backend.app.models.audit import DatabaseSeedMeta, AuditEvent
from backend.app.security.hashing import hash_password
from backend.app.privacy.guardian import PrivacyGuardianService
from backend.app.privacy.tokenization import generate_anonymized_case_id
from backend.app.rag.offender_store import OffenderVectorStore

from backend.app.seed.mock_offenders import MOCK_OFFENDERS
from backend.app.seed.mock_zones import MOCK_RISK_ZONES
from backend.app.seed.mock_incidents import MOCK_INCIDENTS

CURRENT_SEED_VERSION = "kavach_seed_v1.0.0"


def init_database_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)


def seed_database(db: Session, force: bool = False) -> Dict[str, Any]:
    """Execute idempotent database seeding."""
    init_database_tables()

    # Check if already seeded
    seed_meta = db.query(DatabaseSeedMeta).filter(DatabaseSeedMeta.seed_version == CURRENT_SEED_VERSION).first()
    if seed_meta and not force:
        return {
            "status": "ALREADY_SEEDED",
            "message": f"Database already initialized with seed version '{CURRENT_SEED_VERSION}'. Skipping duplicate seed.",
            "version": CURRENT_SEED_VERSION,
        }

    if force:
        # Clear existing data
        db.query(VerificationResult).delete()
        db.query(IncidentOffenderCandidate).delete()
        db.query(Incident).delete()
        db.query(Case).delete()
        db.query(Offender).delete()
        db.query(RiskZone).delete()
        db.query(User).delete()
        db.query(DatabaseSeedMeta).delete()
        db.commit()

    # 1. Seed Authority User (Insp. Patnaik)
    authority = User(
        id="USR-AUTH-PATNAIK-01",
        email=settings.AUTHORITY_DEMO_EMAIL,
        hashed_password=hash_password(settings.AUTHORITY_DEMO_PASSWORD),
        full_name=settings.AUTHORITY_DEMO_NAME,
        role="ROLE_AUTHORITY",
        phone="+91-674-2540112",
        is_active=True,
    )
    db.add(authority)

    # 2. Seed Standard User (Priya Sharma)
    demo_user = User(
        id="USR-USER-PRIYA-02",
        email=settings.USER_DEMO_EMAIL,
        hashed_password=hash_password(settings.USER_DEMO_PASSWORD),
        full_name=settings.USER_DEMO_NAME,
        role="ROLE_USER",
        phone="+91-9876543210",
        emergency_contacts=json.dumps([
            {"name": "Ananya Sharma (Sister)", "phone": "+91-9876543211", "relation": "Family"},
            {"name": "Odisha Women Helpline", "phone": "181", "relation": "Helpline"}
        ]),
        is_active=True,
    )
    db.add(demo_user)
    db.commit()

    # 3. Seed Risk Zones
    zone_records = []
    for z_data in MOCK_RISK_ZONES:
        rz = RiskZone(
            id=f"RZ-{uuid.uuid4().hex[:8].upper()}",
            zone_code=z_data["zone_code"],
            name=z_data["name"],
            description=z_data["description"],
            latitude=z_data["latitude"],
            longitude=z_data["longitude"],
            radius_meters=z_data["radius_meters"],
            base_threat_level=z_data["base_threat_level"],
            lighting_rating=z_data["lighting_rating"],
            patrol_frequency=z_data["patrol_frequency"],
            offender_count=z_data["offender_count"],
            historical_incident_count=z_data["historical_incident_count"],
            is_active=True,
        )
        db.add(rz)
        zone_records.append(rz)
    db.commit()

    # 4. Seed Fictional Offenders
    offender_records = []
    for o_data in MOCK_OFFENDERS:
        off = Offender(
            id=f"OFF-{uuid.uuid4().hex[:8].upper()}",
            offender_code=o_data["offender_code"],
            fictional_full_name=o_data["fictional_full_name"],
            aliases=o_data["aliases"],
            approximate_age=o_data["approximate_age"],
            approximate_height=o_data["approximate_height"],
            build=o_data["build"],
            distinguishing_marks=o_data["distinguishing_marks"],
            modus_operandi=o_data["modus_operandi"],
            conviction_history=o_data["conviction_history"],
            sections_charged=o_data["sections_charged"],
            last_known_latitude=o_data["last_known_latitude"],
            last_known_longitude=o_data["last_known_longitude"],
            registered_zone=o_data["registered_zone"],
            risk_tier=o_data["risk_tier"],
            source_type="MOCK_REGISTRY",
            is_verified_in_registry=o_data["is_verified_in_registry"],
        )
        db.add(off)
        offender_records.append(off)
    db.commit()

    # Index offenders into ChromaDB
    OffenderVectorStore.index_offenders(db=db, force_reindex=True)

    # 5. Seed Primary Demonstration Case (Patia Stalking Serial Cluster)
    primary_case = Case(
        id=str(uuid.uuid4()),
        tracking_number="CASE-2026-PATIA-7F82",
        anonymized_id=generate_anonymized_case_id(str(uuid.uuid4())),
        user_id=demo_user.id,
        title="Patia Tech Corridor Serial Stalking & Threat Pattern",
        status="UNDER_INVESTIGATION",
        severity="CRITICAL",
        verification_status="VERIFIED",
        corroboration_count=3,
        privacy_guardian_applied=True,
        extracted_pattern=json.dumps({
            "primary_tactic": "Unlit Tech Corridor Stalking on Motorcycle",
            "vehicle": "Black Pulsar (no license plate)",
            "timing_window": "20:30 - 23:30",
            "corridor": "Infocity Outer Forest Perimeter",
            "threat_classification": "SERIAL_MODUS_OPERANDI",
        }),
        formal_complaint_draft=(
            "Formal statutory complaint registered with Infocity Police Station under Bharatiya Nyaya Sanhita (BNS) §§ 354, 354D, 509."
        ),
    )
    db.add(primary_case)
    db.commit()

    # 6. Seed Incidents and link to Case
    kalia_offender = next((o for o in offender_records if o.offender_code == "MOCK-OFF-01"), offender_records[0])

    for idx, inc_data in enumerate(MOCK_INCIDENTS):
        # Transform through Privacy-Guardian
        sanitized_info = PrivacyGuardianService.transform_raw_incident(
            raw_narrative=inc_data["raw_narrative"],
            perpetrator_description=inc_data.get("perpetrator_description")
        )

        inc_case_id = primary_case.id if idx < 3 else None

        inc = Incident(
            id=f"INC-{uuid.uuid4().hex[:8].upper()}",
            case_id=inc_case_id,
            user_id=demo_user.id if idx == 0 else None,
            timestamp=inc_data["timestamp"],
            latitude=inc_data["latitude"],
            longitude=inc_data["longitude"],
            area_name=inc_data["area_name"],
            category=inc_data["category"],
            severity=inc_data["severity"],
            raw_narrative=inc_data["raw_narrative"],
            sanitized_narrative=sanitized_info["sanitized_narrative"],
            perpetrator_description=inc_data.get("perpetrator_description"),
            lighting_condition=inc_data["lighting_condition"],
            crowd_density=inc_data["crowd_density"],
            status="INVESTIGATING" if inc_case_id else "REPORTED",
        )
        db.add(inc)

    db.commit()

    # 7. Seed Candidate & Verification for primary case
    candidate_match = IncidentOffenderCandidate(
        id=str(uuid.uuid4()),
        case_id=primary_case.id,
        offender_id=kalia_offender.id,
        similarity_score=0.912,
        matched_attributes=json.dumps({
            "modus_operandi_match": "High (93%) - Two-wheeler unlit corridor interception",
            "physical_marks": "Crescent scar below left cheek confirmed",
            "vehicle_type": "Black motorcycle without plates",
            "spatial_coincidence": "Within 150m of last registered location",
        }),
        match_rationale="Vector search against ChromaDB offender profiles matched MOCK-OFF-01 with 91.2% similarity score.",
        status="VERIFIED",
    )
    db.add(candidate_match)
    db.commit()

    verification = VerificationResult(
        id=str(uuid.uuid4()),
        case_id=primary_case.id,
        candidate_id=candidate_match.id,
        verification_path="PATH_B_CORROBORATION",
        outcome="VERIFIED",
        corroboration_reports_count=3,
        corroboration_threshold_required=3,
        confidence_score=0.92,
        audit_notes="3 independent incident reports in Patia cluster corroborate candidate modus operandi. Corroboration threshold satisfied.",
        verified_at=datetime.utcnow(),
    )
    db.add(verification)

    # 8. Seed Database Marker
    meta = DatabaseSeedMeta(
        seed_version=CURRENT_SEED_VERSION,
        is_seeded=True,
        seeded_at=datetime.utcnow(),
    )
    db.add(meta)
    db.commit()

    return {
        "status": "SUCCESS",
        "message": f"Successfully seeded Kavach database (version {CURRENT_SEED_VERSION}).",
        "users_seeded": 2,
        "zones_seeded": len(zone_records),
        "offenders_seeded": len(offender_records),
        "incidents_seeded": len(MOCK_INCIDENTS),
        "primary_case_id": primary_case.id,
        "primary_anonymized_id": primary_case.anonymized_id,
    }


if __name__ == "__main__":
    db = SessionLocal()
    try:
        res = seed_database(db, force=True)
        print(json.dumps(res, indent=2))
    finally:
        db.close()
