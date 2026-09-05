"""Fictional Offender Registry Seed Data for IIT Bhubaneswar Hackathon Demo.
NOTICE: This is a fictional demo dataset created solely for academic/hackathon simulation.
Not an actual government registry. All names, identifiers, and traits are fictional.
"""

from typing import List, Dict, Any

MOCK_OFFENDERS: List[Dict[str, Any]] = [
    {
        "offender_code": "MOCK-OFF-01",
        "fictional_full_name": "Rakesh 'Kalia' Mohanty (Fictional)",
        "aliases": "Kalia, Bullet Rakesh",
        "approximate_age": 29,
        "approximate_height": "5'10\"",
        "build": "Athletic, Broad-shouldered",
        "distinguishing_marks": "Deep crescent scar below left cheekbone, tribal tattoo on right forearm",
        "modus_operandi": (
            "Operates on a black pulsar two-wheeler without license plate. "
            "Targets solo pedestrians and students during late evening hours (8:30 PM - 11:30 PM) "
            "in unlit tech corridors near Infocity forest perimeter. Approaches from behind, blocks path, "
            "uses verbal intimidation, and snatches mobile phones or handbags before speeding towards Damana."
        ),
        "conviction_history": "2 prior arrests for stalking and chain snatching (2023, 2024)",
        "sections_charged": "BNS 354D, 304, 308 (IPC 354D, 392)",
        "last_known_latitude": 20.3552,
        "last_known_longitude": 85.8182,
        "registered_zone": "Patia / Infocity",
        "risk_tier": "CRITICAL",
        "is_verified_in_registry": True,
    },
    {
        "offender_code": "MOCK-OFF-02",
        "fictional_full_name": "Debasis 'Gulu' Jena (Fictional)",
        "aliases": "Gulu, Rider Deba",
        "approximate_age": 26,
        "approximate_height": "5'7\"",
        "build": "Slim, Agile",
        "distinguishing_marks": "Burn mark on left wrist, silver ring on right thumb",
        "modus_operandi": (
            "Prolonged stalking of women commuters along KIIT Road and Sailashree Vihar back lanes. "
            "Drives a red scooter, slowly tailing victims while passing derogatory remarks. "
            "Diverts into unlit side alleys when confronted by passersby."
        ),
        "conviction_history": "1 charge sheet filed for persistent stalking (2024)",
        "sections_charged": "BNS 354D, 509 (IPC 354D, 509)",
        "last_known_latitude": 20.3485,
        "last_known_longitude": 85.8190,
        "registered_zone": "KIIT Road Corridor",
        "risk_tier": "HIGH",
        "is_verified_in_registry": True,
    },
    {
        "offender_code": "MOCK-OFF-03",
        "fictional_full_name": "Bikash 'Mantu' Samal (Fictional)",
        "aliases": "Mantu, Shadow",
        "approximate_age": 34,
        "approximate_height": "5'11\"",
        "build": "Heavy, Stocky",
        "distinguishing_marks": "Limp in right leg, prominent mole near throat",
        "modus_operandi": (
            "Loiters near Station Square back alleys and unlit railway footbridges after 10 PM. "
            "Follows arriving train passengers through dim connecting alleys towards Master Canteen, "
            "attempting extortion and menacing behavior in isolated pockets."
        ),
        "conviction_history": "3 prior convictions for criminal intimidation and extortion",
        "sections_charged": "BNS 351, 308 (IPC 506, 384)",
        "last_known_latitude": 20.2645,
        "last_known_longitude": 85.8455,
        "registered_zone": "Master Canteen / Station",
        "risk_tier": "HIGH",
        "is_verified_in_registry": True,
    },
    {
        "offender_code": "MOCK-OFF-04",
        "fictional_full_name": "Sanjay 'Tulu' Das (Fictional)",
        "aliases": "Tulu",
        "approximate_age": 31,
        "approximate_height": "5'8\"",
        "build": "Medium",
        "distinguishing_marks": "Cut mark across left eyebrow",
        "modus_operandi": (
            "Operates around Vani Vihar Utkal University perimeter road. "
            "Waits near dark bus stops with broken lighting, catcalling and blocking women returning from library or evening classes."
        ),
        "conviction_history": "Arrested in 2023 under preventive custody",
        "sections_charged": "BNS 509, 354A",
        "last_known_latitude": 20.3015,
        "last_known_longitude": 85.8422,
        "registered_zone": "Vani Vihar / Saheed Nagar",
        "risk_tier": "MODERATE",
        "is_verified_in_registry": True,
    },
    {
        "offender_code": "MOCK-OFF-05",
        "fictional_full_name": "Prakash 'Babul' Rout (Fictional)",
        "aliases": "Babul auto-wala",
        "approximate_age": 38,
        "approximate_height": "5'6\"",
        "build": "Medium",
        "distinguishing_marks": "Betel-stained teeth, faded tiger tattoo on left neck",
        "modus_operandi": (
            "Drives unverified auto-rickshaw near Jayadev Vihar and Nayapalli flyover. "
            "Takes unauthorized circuitous routes through dark residential lanes under pretext of traffic diversion, demanding exorbitant fares and intimidating passengers."
        ),
        "conviction_history": "Multiple passenger harassment complaints logged with traffic cell",
        "sections_charged": "BNS 351, 509",
        "last_known_latitude": 20.3060,
        "last_known_longitude": 85.8245,
        "registered_zone": "Jayadev Vihar",
        "risk_tier": "MODERATE",
        "is_verified_in_registry": True,
    },
]
