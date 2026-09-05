"""Realistic Fictional Incidents Seed Data centered on Bhubaneswar."""

from datetime import datetime, timedelta
from typing import List, Dict, Any

now = datetime.utcnow()

MOCK_INCIDENTS: List[Dict[str, Any]] = [
    # Patia / Infocity Hotspot Cluster (Corroborating pattern with MOCK-OFF-01)
    {
        "area_name": "Patia / Infocity Tech Corridor",
        "category": "Stalking & Threat",
        "severity": "CRITICAL",
        "latitude": 20.3551,
        "longitude": 85.8181,
        "timestamp": now - timedelta(days=2, hours=3),
        "raw_narrative": "Complainant Priya Sharma (Phone: +91-9876543210, Email: priya.sharma@example.com) reported being followed by a man on a black pulsar without license plate while walking from Infocity Gate towards hostel. Perpetrator had a crescent scar below left eye, blocked the pathway, and made threatening remarks.",
        "perpetrator_description": "Male, ~28-30 yrs, athletic build, crescent scar on left cheek, riding black pulsar motorcycle, black jacket.",
        "lighting_condition": "DARK",
        "crowd_density": "ISOLATED",
    },
    {
        "area_name": "Patia / Infocity Tech Corridor",
        "category": "Attempted Snatching & Stalking",
        "severity": "HIGH",
        "latitude": 20.3548,
        "longitude": 85.8183,
        "timestamp": now - timedelta(days=5, hours=1),
        "raw_narrative": "Victim Ananya Sahoo was walking near forest edge road after night shift. A man matching description of Kalia on a black two-wheeler cut across her path and attempted to snatch her purse.",
        "perpetrator_description": "Athletic male with tribal tattoo on right arm, black pulsar motorcycle, aggressive verbal intimidation.",
        "lighting_condition": "POOR",
        "crowd_density": "ISOLATED",
    },
    {
        "area_name": "Patia / Infocity Tech Corridor",
        "category": "Harassment & Stalking",
        "severity": "HIGH",
        "latitude": 20.3553,
        "longitude": 85.8179,
        "timestamp": now - timedelta(days=9, hours=4),
        "raw_narrative": "IT employee reported persistent tailing on Infocity outer road. Motorcyclist slowed down alongside for 300 meters revving engine aggressively.",
        "perpetrator_description": "Male rider with facial scar, dark jacket, loud black bike without plates.",
        "lighting_condition": "DARK",
        "crowd_density": "ISOLATED",
    },

    # KIIT Road Corridor Cluster
    {
        "area_name": "KIIT Road & Square",
        "category": "Persistent Stalking",
        "severity": "MEDIUM",
        "latitude": 20.3490,
        "longitude": 85.8192,
        "timestamp": now - timedelta(days=3, hours=5),
        "raw_narrative": "Student reported being followed from KIIT campus 3 towards food street by a slim male on a red scooter who turned into dark side lane when victim entered lighted cafe.",
        "perpetrator_description": "Slim male, mid 20s, burn mark on wrist, red scooter.",
        "lighting_condition": "MODERATE",
        "crowd_density": "SPARSE",
    },
    {
        "area_name": "Sailashree Vihar",
        "category": "Harassment",
        "severity": "HIGH",
        "latitude": 20.3382,
        "longitude": 85.8118,
        "timestamp": now - timedelta(days=7, hours=2),
        "raw_narrative": "Resident returning home at 9:45 PM reported verbal catcalling from unlit lane behind park.",
        "perpetrator_description": "Two individuals on red two-wheeler loitering in dark park curve.",
        "lighting_condition": "POOR",
        "crowd_density": "ISOLATED",
    },

    # Vani Vihar Corridor Cluster
    {
        "area_name": "Vani Vihar / Utkal University",
        "category": "Verbal Harassment & Intimidation",
        "severity": "HIGH",
        "latitude": 20.3012,
        "longitude": 85.8421,
        "timestamp": now - timedelta(days=4, hours=6),
        "raw_narrative": "Scholar exiting university side gate accosted by man standing near broken streetlight passing obscene comments.",
        "perpetrator_description": "Male in mid 30s, cut on eyebrow, standing near dark bus bay.",
        "lighting_condition": "DARK",
        "crowd_density": "ISOLATED",
    },

    # Master Canteen / Station Cluster
    {
        "area_name": "Master Canteen / Station Square",
        "category": "Extortion & Menacing Behavior",
        "severity": "CRITICAL",
        "latitude": 20.2642,
        "longitude": 85.8458,
        "timestamp": now - timedelta(days=1, hours=8),
        "raw_narrative": "Passenger arriving on Puri express intercepted in back alley connecting platform 4 to main road. Heavy-set man with limp demanded money and threatened physical harm.",
        "perpetrator_description": "Heavy build, limp in right leg, prominent neck mole, dark shirt.",
        "lighting_condition": "DARK",
        "crowd_density": "ISOLATED",
    },
    {
        "area_name": "Master Canteen / Station Square",
        "category": "Stalking & Menace",
        "severity": "HIGH",
        "latitude": 20.2650,
        "longitude": 85.8445,
        "timestamp": now - timedelta(days=6, hours=4),
        "raw_narrative": "Solo commuter reported being trailed from auto stand into dim alleyway behind railway colony.",
        "perpetrator_description": "Stocky male walking with limp, threatening demeanor.",
        "lighting_condition": "POOR",
        "crowd_density": "SPARSE",
    },

    # Saheed Nagar & Jayadev Vihar
    {
        "area_name": "Jayadev Vihar",
        "category": "Suspicious Route & Intimidation",
        "severity": "MEDIUM",
        "latitude": 20.3055,
        "longitude": 85.8248,
        "timestamp": now - timedelta(days=8, hours=3),
        "raw_narrative": "Passenger in auto-rickshaw reported driver intentionally diverting into unlit Nayapalli alleys and demanding double fare aggressively.",
        "perpetrator_description": "Auto driver, late 30s, betel stained teeth, tiger neck tattoo.",
        "lighting_condition": "MODERATE",
        "crowd_density": "MODERATE",
    },
    {
        "area_name": "Saheed Nagar",
        "category": "Attempted Theft",
        "severity": "LOW",
        "latitude": 20.2885,
        "longitude": 85.8448,
        "timestamp": now - timedelta(days=12, hours=2),
        "raw_narrative": "Attempted bag pull from moving bicycle in market side lane during evening rush.",
        "perpetrator_description": "Youth on foot fleeing into market crowd.",
        "lighting_condition": "GOOD",
        "crowd_density": "DENSE",
    },
]
