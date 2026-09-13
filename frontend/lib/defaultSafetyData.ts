import { HeatmapCell, RiskZone, RouteOption, GPSPingEvaluation } from './types';

/**
 * Deterministic Bhubaneswar Heatmap Cells (23 corridors)
 * Used for instant first-paint on deployed platforms (Vercel) and offline resilience.
 */
export const DEFAULT_HEATMAP_CELLS: HeatmapCell[] = [
  {
    "cell_id": "CELL-PATIA-INFOCITY",
    "area_name": "Patia / Infocity Tech Corridor",
    "center_lat": 20.355,
    "center_lng": 85.818,
    "polygon": [
      [
        20.349,
        85.812
      ],
      [
        20.361,
        85.812
      ],
      [
        20.361,
        85.824
      ],
      [
        20.349,
        85.824
      ]
    ],
    "risk_score": 96.9,
    "risk_level": "CRITICAL",
    "incident_count": 4
  },
  {
    "cell_id": "CELL-KIIT-ROAD",
    "area_name": "KIIT Road & Campus Square",
    "center_lat": 20.35,
    "center_lng": 85.8195,
    "polygon": [
      [
        20.345000000000002,
        85.81450000000001
      ],
      [
        20.355,
        85.81450000000001
      ],
      [
        20.355,
        85.8245
      ],
      [
        20.345000000000002,
        85.8245
      ]
    ],
    "risk_score": 11.5,
    "risk_level": "LOW",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-SAILASHREE-VIHAR",
    "area_name": "Sailashree Vihar Residential / Forest Edge",
    "center_lat": 20.338,
    "center_lng": 85.812,
    "polygon": [
      [
        20.332,
        85.806
      ],
      [
        20.344,
        85.806
      ],
      [
        20.344,
        85.818
      ],
      [
        20.332,
        85.818
      ]
    ],
    "risk_score": 54.9,
    "risk_level": "ELEVATED",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-KALARAHANGA",
    "area_name": "Kalarahanga / Nandankanan Road",
    "center_lat": 20.368,
    "center_lng": 85.827,
    "polygon": [
      [
        20.362,
        85.821
      ],
      [
        20.374,
        85.821
      ],
      [
        20.374,
        85.833
      ],
      [
        20.362,
        85.833
      ]
    ],
    "risk_score": 23.0,
    "risk_level": "MODERATE",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-CHANDRASEKHARPUR",
    "area_name": "Chandrasekharpur Commercial Belt",
    "center_lat": 20.324,
    "center_lng": 85.82,
    "polygon": [
      [
        20.318,
        85.814
      ],
      [
        20.330000000000002,
        85.814
      ],
      [
        20.330000000000002,
        85.826
      ],
      [
        20.318,
        85.826
      ]
    ],
    "risk_score": 2.2,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-NALCO-SQUARE",
    "area_name": "Nalco Square & Central Avenue",
    "center_lat": 20.315,
    "center_lng": 85.822,
    "polygon": [
      [
        20.3095,
        85.8165
      ],
      [
        20.320500000000003,
        85.8165
      ],
      [
        20.320500000000003,
        85.8275
      ],
      [
        20.3095,
        85.8275
      ]
    ],
    "risk_score": 2.7,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-JAYADEV-VIHAR",
    "area_name": "Jayadev Vihar Junction & Overbridge",
    "center_lat": 20.305,
    "center_lng": 85.825,
    "polygon": [
      [
        20.2995,
        85.8195
      ],
      [
        20.3105,
        85.8195
      ],
      [
        20.3105,
        85.8305
      ],
      [
        20.2995,
        85.8305
      ]
    ],
    "risk_score": 11.3,
    "risk_level": "LOW",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-VANI-VIHAR",
    "area_name": "Vani Vihar / Utkal University Corridor",
    "center_lat": 20.301,
    "center_lng": 85.842,
    "polygon": [
      [
        20.294999999999998,
        85.836
      ],
      [
        20.307,
        85.836
      ],
      [
        20.307,
        85.848
      ],
      [
        20.294999999999998,
        85.848
      ]
    ],
    "risk_score": 64.4,
    "risk_level": "HIGH",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-NAYAPALLI-IRC",
    "area_name": "Nayapalli / IRC Village Commercial",
    "center_lat": 20.299,
    "center_lng": 85.815,
    "polygon": [
      [
        20.293499999999998,
        85.8095
      ],
      [
        20.3045,
        85.8095
      ],
      [
        20.3045,
        85.8205
      ],
      [
        20.293499999999998,
        85.8205
      ]
    ],
    "risk_score": 4.5,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-SAHEED-NAGAR",
    "area_name": "Saheed Nagar Inner Commercial Lanes",
    "center_lat": 20.288,
    "center_lng": 85.845,
    "polygon": [
      [
        20.283,
        85.84
      ],
      [
        20.293,
        85.84
      ],
      [
        20.293,
        85.85
      ],
      [
        20.283,
        85.85
      ]
    ],
    "risk_score": 6.7,
    "risk_level": "LOW",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-RASULGARH",
    "area_name": "Rasulgarh Square & Eastern Highway Hub",
    "center_lat": 20.292,
    "center_lng": 85.865,
    "polygon": [
      [
        20.285500000000003,
        85.85849999999999
      ],
      [
        20.2985,
        85.85849999999999
      ],
      [
        20.2985,
        85.8715
      ],
      [
        20.285500000000003,
        85.8715
      ]
    ],
    "risk_score": 5.0,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-MANCHESWAR",
    "area_name": "Mancheswar Industrial & Carriage Workshop",
    "center_lat": 20.32,
    "center_lng": 85.852,
    "polygon": [
      [
        20.313,
        85.845
      ],
      [
        20.327,
        85.845
      ],
      [
        20.327,
        85.85900000000001
      ],
      [
        20.313,
        85.85900000000001
      ]
    ],
    "risk_score": 26.7,
    "risk_level": "MODERATE",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-RAM-MANDIR-JANPATH",
    "area_name": "Ram Mandir Square & Janpath Avenue",
    "center_lat": 20.277,
    "center_lng": 85.842,
    "polygon": [
      [
        20.272000000000002,
        85.837
      ],
      [
        20.282,
        85.837
      ],
      [
        20.282,
        85.847
      ],
      [
        20.272000000000002,
        85.847
      ]
    ],
    "risk_score": 0.9,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-MASTER-CANTEEN",
    "area_name": "Master Canteen / Central Station Hub",
    "center_lat": 20.266,
    "center_lng": 85.841,
    "polygon": [
      [
        20.259999999999998,
        85.835
      ],
      [
        20.272,
        85.835
      ],
      [
        20.272,
        85.847
      ],
      [
        20.259999999999998,
        85.847
      ]
    ],
    "risk_score": 25.6,
    "risk_level": "MODERATE",
    "incident_count": 1
  },
  {
    "cell_id": "CELL-BAPUJI-NAGAR",
    "area_name": "Bapuji Nagar Central Market District",
    "center_lat": 20.262,
    "center_lng": 85.833,
    "polygon": [
      [
        20.257,
        85.828
      ],
      [
        20.267,
        85.828
      ],
      [
        20.267,
        85.838
      ],
      [
        20.257,
        85.838
      ]
    ],
    "risk_score": 3.6,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-UNIT-8",
    "area_name": "Unit-8 / Raj Bhavan Perimeter",
    "center_lat": 20.28,
    "center_lng": 85.819,
    "polygon": [
      [
        20.2745,
        85.8135
      ],
      [
        20.285500000000003,
        85.8135
      ],
      [
        20.285500000000003,
        85.8245
      ],
      [
        20.2745,
        85.8245
      ]
    ],
    "risk_score": 3.2,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-BARAMUNDA-ISBT",
    "area_name": "Baramunda Inter-State Bus Terminal (ISBT)",
    "center_lat": 20.278,
    "center_lng": 85.798,
    "polygon": [
      [
        20.272,
        85.792
      ],
      [
        20.284,
        85.792
      ],
      [
        20.284,
        85.804
      ],
      [
        20.272,
        85.804
      ]
    ],
    "risk_score": 24.0,
    "risk_level": "MODERATE",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-KHANDAGIRI",
    "area_name": "Khandagiri Caves & Square",
    "center_lat": 20.259,
    "center_lng": 85.783,
    "polygon": [
      [
        20.253,
        85.777
      ],
      [
        20.265,
        85.777
      ],
      [
        20.265,
        85.789
      ],
      [
        20.253,
        85.789
      ]
    ],
    "risk_score": 24.9,
    "risk_level": "MODERATE",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-GHATIKIA",
    "area_name": "Ghatikia Residential & Main Road",
    "center_lat": 20.27,
    "center_lng": 85.7765,
    "polygon": [
      [
        20.264,
        85.7705
      ],
      [
        20.276,
        85.7705
      ],
      [
        20.276,
        85.7825
      ],
      [
        20.264,
        85.7825
      ]
    ],
    "risk_score": 4.1,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-AIIMS-PATRAPADA",
    "area_name": "Patrapada / AIIMS Hospital Medical Corridor",
    "center_lat": 20.246,
    "center_lng": 85.768,
    "polygon": [
      [
        20.2395,
        85.7615
      ],
      [
        20.252499999999998,
        85.7615
      ],
      [
        20.252499999999998,
        85.7745
      ],
      [
        20.2395,
        85.7745
      ]
    ],
    "risk_score": 3.6,
    "risk_level": "LOW",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-OLD-TOWN",
    "area_name": "Old Town / Lingaraj Heritage Precinct",
    "center_lat": 20.245,
    "center_lng": 85.834,
    "polygon": [
      [
        20.239,
        85.828
      ],
      [
        20.251,
        85.828
      ],
      [
        20.251,
        85.84
      ],
      [
        20.239,
        85.84
      ]
    ],
    "risk_score": 24.4,
    "risk_level": "MODERATE",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-LINGIPUR",
    "area_name": "Lingipur / Daya River South Bypass",
    "center_lat": 20.222,
    "center_lng": 85.845,
    "polygon": [
      [
        20.215,
        85.838
      ],
      [
        20.229000000000003,
        85.838
      ],
      [
        20.229000000000003,
        85.852
      ],
      [
        20.215,
        85.852
      ]
    ],
    "risk_score": 71.5,
    "risk_level": "HIGH",
    "incident_count": 0
  },
  {
    "cell_id": "CELL-PHULNAKHARA",
    "area_name": "Phulnakhara NH-16 Link",
    "center_lat": 20.235,
    "center_lng": 85.875,
    "polygon": [
      [
        20.227999999999998,
        85.868
      ],
      [
        20.242,
        85.868
      ],
      [
        20.242,
        85.882
      ],
      [
        20.227999999999998,
        85.882
      ]
    ],
    "risk_score": 5.4,
    "risk_level": "LOW",
    "incident_count": 0
  }
];

/**
 * Flagged Bhubaneswar Risk Zones (5 high-priority zones)
 */
export const DEFAULT_RISK_ZONES: RiskZone[] = [
  {
    "id": "RZ-D145B278",
    "zone_code": "ZONE-PATIA-01",
    "name": "Infocity Dark Forest Edge & Back Corridor",
    "description": "Unlit secondary lane connecting Infocity software park with outer forest edge. Non-functional sodium streetlights and dense blind corners.",
    "latitude": 20.355,
    "longitude": 85.818,
    "radius_meters": 180.0,
    "base_threat_level": "CRITICAL",
    "lighting_rating": 1.5,
    "patrol_frequency": "RARE",
    "offender_count": 2,
    "historical_incident_count": 8
  },
  {
    "id": "RZ-8B2E8B7C",
    "zone_code": "ZONE-SAILASHREE-02",
    "name": "Sailashree Vihar Unlit Footpath Loop",
    "description": "Isolated residential boundary corridor with sparse pedestrian traffic after 9:00 PM.",
    "latitude": 20.338,
    "longitude": 85.812,
    "radius_meters": 160.0,
    "base_threat_level": "HIGH",
    "lighting_rating": 1.8,
    "patrol_frequency": "RARE",
    "offender_count": 1,
    "historical_incident_count": 5
  },
  {
    "id": "RZ-ED4F7BAF",
    "zone_code": "ZONE-VANI-03",
    "name": "Vani Vihar Dark Botanical Perimeter",
    "description": "Heavily foliaged unmonitored road along university rear wall. Frequent stalking and harassment reports.",
    "latitude": 20.301,
    "longitude": 85.842,
    "radius_meters": 170.0,
    "base_threat_level": "HIGH",
    "lighting_rating": 2.0,
    "patrol_frequency": "RARE",
    "offender_count": 1,
    "historical_incident_count": 6
  },
  {
    "id": "RZ-90651B01",
    "zone_code": "ZONE-STATION-04",
    "name": "Station Back-Alley & Parcel Cargo Yard",
    "description": "Blind alleys between railway platform exits and cargo depot. Broken CCTV coverage and high transient loitering.",
    "latitude": 20.264,
    "longitude": 85.846,
    "radius_meters": 200.0,
    "base_threat_level": "CRITICAL",
    "lighting_rating": 2.1,
    "patrol_frequency": "OCCASIONAL",
    "offender_count": 2,
    "historical_incident_count": 9
  },
  {
    "id": "RZ-33FB82E1",
    "zone_code": "ZONE-JAGAMARA-05",
    "name": "Jagamara Hostel Back Lane & Drain Corridor",
    "description": "Unlit narrow lane behind student hostels near Khandagiri-Jagamara stretch. Poor drainage-side visibility, no CCTV, and frequent eve-teasing reports after dark.",
    "latitude": 20.2635,
    "longitude": 85.787,
    "radius_meters": 150.0,
    "base_threat_level": "HIGH",
    "lighting_rating": 1.9,
    "patrol_frequency": "RARE",
    "offender_count": 1,
    "historical_incident_count": 4
  }
];

/**
 * Pre-computed Simulation Steps for Patia Hotspot Trajectory
 * Guarantees a 100% dependable live demo even during server cold-starts or network interruptions.
 */
export const DEFAULT_SIMULATION_STEPS: any[] = [
  {
    "step_index": 0,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "f4c6c199-8796-43c7-9ef5-e062a0cb76e6",
      "session_id": "SIM-DEMO",
      "latitude": 20.358,
      "longitude": 85.8195,
      "calculated_risk_score": 7.3,
      "risk_level": "LOW",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 368.4,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 339.6,
      "lighting_rating": 4.2,
      "patrol_frequency": "FREQUENT",
      "stage": "TRANSIT_SAFE",
      "reason_summary": "Routine corridor monitoring. Path well-lit (4.2/5.0) and clear of flagged hazard zones (368m away).",
      "escalation_triggered": false,
      "guardian_action": "ROUTINE_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 1,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "dc9979bb-7976-4ea0-9a58-75f93c019300",
      "session_id": "SIM-DEMO",
      "latitude": 20.3577,
      "longitude": 85.81938,
      "calculated_risk_score": 10.4,
      "risk_level": "LOW",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 332.9,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 304.0,
      "lighting_rating": 4.2,
      "patrol_frequency": "FREQUENT",
      "stage": "TRANSIT_SAFE",
      "reason_summary": "Routine corridor monitoring. Path well-lit (4.2/5.0) and clear of flagged hazard zones (333m away).",
      "escalation_triggered": false,
      "guardian_action": "ROUTINE_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 2,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "896cdd81-451a-4150-b171-1904a5c5fb3a",
      "session_id": "SIM-DEMO",
      "latitude": 20.3574,
      "longitude": 85.81925,
      "calculated_risk_score": 23.3,
      "risk_level": "MODERATE",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 297.0,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 268.0,
      "lighting_rating": 3.7,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (297m away). Ambient lighting at 3.7/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 3,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "ee9ed356-091f-4850-af02-cb2b5d3e2149",
      "session_id": "SIM-DEMO",
      "latitude": 20.3571,
      "longitude": 85.81912,
      "calculated_risk_score": 36.4,
      "risk_level": "MODERATE",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 261.1,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 232.0,
      "lighting_rating": 3.1,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (261m away). Ambient lighting at 3.1/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 4,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "997aed56-d255-4237-bf7b-05ef22153e1e",
      "session_id": "SIM-DEMO",
      "latitude": 20.3568,
      "longitude": 85.819,
      "calculated_risk_score": 49.2,
      "risk_level": "ELEVATED",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 225.7,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 196.5,
      "lighting_rating": 2.4,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (226m away). Ambient lighting at 2.4/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 5,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "f29163e1-6ea0-4ada-8cfb-7659b5ba224e",
      "session_id": "SIM-DEMO",
      "latitude": 20.35655,
      "longitude": 85.81888,
      "calculated_risk_score": 60.3,
      "risk_level": "HIGH",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 195.2,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 166.0,
      "lighting_rating": 1.8,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (195m away). Ambient lighting at 1.8/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 6,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "1e7d239c-98ab-44c5-ab14-2471dd9d334d",
      "session_id": "SIM-DEMO",
      "latitude": 20.3563,
      "longitude": 85.81875,
      "calculated_risk_score": 84.3,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 164.3,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 135.1,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 164m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 164m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 164.3,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 135.1,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 7,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "cec16fc6-b4dd-427d-80b8-aa53eac3656a",
      "session_id": "SIM-DEMO",
      "latitude": 20.35605,
      "longitude": 85.81862,
      "calculated_risk_score": 89.2,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 133.5,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 104.2,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 133m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 133m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 133.5,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 104.2,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 8,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "f7426850-bb3d-4dc3-83c6-257e5a9155dd",
      "session_id": "SIM-DEMO",
      "latitude": 20.3558,
      "longitude": 85.8185,
      "calculated_risk_score": 92.3,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 103.1,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 73.7,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 74m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 74m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 103.1,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 73.7,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 9,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "55bb284e-2868-458a-bff6-a5b581ebf6e1",
      "session_id": "SIM-DEMO",
      "latitude": 20.35562,
      "longitude": 85.8184,
      "calculated_risk_score": 94.0,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 80.6,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 51.1,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 51m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 51m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 80.6,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 51.1,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 10,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "d44855a6-38fe-4d68-a46f-7e93dada37c9",
      "session_id": "SIM-DEMO",
      "latitude": 20.35545,
      "longitude": 85.8183,
      "calculated_risk_score": 95.6,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 59.0,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 29.7,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 30m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 30m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 59.0,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 29.7,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 11,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "2ae003a2-95fe-4300-acb6-a9fd6baf8e18",
      "session_id": "SIM-DEMO",
      "latitude": 20.35527,
      "longitude": 85.8182,
      "calculated_risk_score": 97.2,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 36.6,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 7.8,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 8m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 8m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 36.6,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 7.8,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 12,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "330249f6-32a6-4570-b0b8-425c09688079",
      "session_id": "SIM-DEMO",
      "latitude": 20.3551,
      "longitude": 85.8181,
      "calculated_risk_score": 96.6,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 15.2,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 15.2,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 15m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 15m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 15.2,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 15.2,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 13,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "be12f441-9ac5-413e-b6b1-f5584a425888",
      "session_id": "SIM-DEMO",
      "latitude": 20.35497,
      "longitude": 85.81803,
      "calculated_risk_score": 95.5,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 4.6,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 31.1,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 31m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 31m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 4.6,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 31.1,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 14,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "bf01cd0d-884c-44ad-999a-25f34b791400",
      "session_id": "SIM-DEMO",
      "latitude": 20.35485,
      "longitude": 85.81795,
      "calculated_risk_score": 94.3,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 17.5,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 46.8,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 47m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 47m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 17.5,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 46.8,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 15,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "3fc43bf2-887a-400c-add3-f5d430cd2bb1",
      "session_id": "SIM-DEMO",
      "latitude": 20.35473,
      "longitude": 85.81788,
      "calculated_risk_score": 93.2,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 32.5,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 62.0,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 62m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 62m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 32.5,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 62.0,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 16,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "00c3be91-1834-421e-bd76-176d88f79c9f",
      "session_id": "SIM-DEMO",
      "latitude": 20.3546,
      "longitude": 85.8178,
      "calculated_risk_score": 92.0,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 49.1,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 78.7,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "Imminent proximity to registered offender (MOCK-OFF-01, 79m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
      "escalation_triggered": true,
      "guardian_action": "CRITICAL_PROXIMITY_WARNING",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "Imminent proximity to registered offender (MOCK-OFF-01, 79m) in unlit sector (Infocity Dark Forest Edge & Back Corridor).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 49.1,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 78.7,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 17,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "1b0e344d-0e6e-46f4-8847-88d9856e3182",
      "session_id": "SIM-DEMO",
      "latitude": 20.3544,
      "longitude": 85.81772,
      "calculated_risk_score": 90.3,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 72.8,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 102.1,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 73m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 73m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 72.8,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 102.1,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 18,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "56788d5d-4b73-4b65-a439-ceeef3725ddc",
      "session_id": "SIM-DEMO",
      "latitude": 20.3542,
      "longitude": 85.81765,
      "calculated_risk_score": 88.6,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 96.1,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 125.1,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 96m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 96m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 96.1,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 125.1,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 19,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "2036c547-5a30-4ee0-b0d7-0c9b90f59ee2",
      "session_id": "SIM-DEMO",
      "latitude": 20.354,
      "longitude": 85.81758,
      "calculated_risk_score": 85.1,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 119.5,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 148.3,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 120m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 120m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 119.5,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 148.3,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 20,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "01a6ab8a-90a9-44af-9056-7c06a7a1731e",
      "session_id": "SIM-DEMO",
      "latitude": 20.3538,
      "longitude": 85.8175,
      "calculated_risk_score": 81.4,
      "risk_level": "CRITICAL",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 143.3,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 171.9,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 143m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 143m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 143.3,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 171.9,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 21,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "dcc671a6-8fc9-4718-833b-26216b2c4803",
      "session_id": "SIM-DEMO",
      "latitude": 20.35347,
      "longitude": 85.81775,
      "calculated_risk_score": 77.1,
      "risk_level": "HIGH",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 172.1,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 198.0,
      "lighting_rating": 1.5,
      "patrol_frequency": "RARE",
      "stage": "HAZARD_ZONE_ENTRY",
      "reason_summary": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 172m to core).",
      "escalation_triggered": true,
      "guardian_action": "ZONE_ENTRY_ELEVATED_ALERT",
      "active_agent": "GuardianOrchestrator",
      "handoff_details": {
        "initiating_agent": "ProximityRiskAgent",
        "target_agent": "GuardianOrchestrator",
        "severity": "CRITICAL",
        "reason": "User entered flagged high-risk zone 'Infocity Dark Forest Edge & Back Corridor' (Threat: CRITICAL, 172m to core).",
        "closest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
        "closest_zone_distance_meters": 172.1,
        "closest_offender_code": "MOCK-OFF-01",
        "closest_offender_distance_meters": 198.0,
        "action_recommended": "NOTIFY_USER_SUGGEST_SAFE_REROUTE_ALERT_CONTACTS"
      }
    }
  },
  {
    "step_index": 22,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "a381b535-66fa-4c8c-82e3-0597466bb618",
      "session_id": "SIM-DEMO",
      "latitude": 20.35315,
      "longitude": 85.818,
      "calculated_risk_score": 50.9,
      "risk_level": "ELEVATED",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 205.7,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 228.9,
      "lighting_rating": 2.0,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (206m away). Ambient lighting at 2.0/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 23,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": false,
    "evaluation": {
      "ping_id": "0ee5630f-4ac0-4840-bcb6-3008bcf44212",
      "session_id": "SIM-DEMO",
      "latitude": 20.35282,
      "longitude": 85.81825,
      "calculated_risk_score": 37.3,
      "risk_level": "MODERATE",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 243.8,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 264.7,
      "lighting_rating": 2.7,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (244m away). Ambient lighting at 2.7/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  },
  {
    "step_index": 24,
    "total_steps": 25,
    "scenario": "patia_hotspot",
    "is_completed": true,
    "evaluation": {
      "ping_id": "30db1bd0-5a2a-4459-bd7e-5e15544d50aa",
      "session_id": "SIM-DEMO",
      "latitude": 20.3525,
      "longitude": 85.8185,
      "calculated_risk_score": 23.6,
      "risk_level": "MODERATE",
      "nearest_zone_name": "Infocity Dark Forest Edge & Back Corridor",
      "nearest_zone_distance_meters": 282.8,
      "nearest_offender_code": "MOCK-OFF-01",
      "nearest_offender_distance_meters": 301.9,
      "lighting_rating": 3.5,
      "patrol_frequency": "OCCASIONAL",
      "stage": "APPROACHING_PERIMETER",
      "reason_summary": "Approaching outer perimeter of 'Infocity Dark Forest Edge & Back Corridor' (283m away). Ambient lighting at 3.5/5.0.",
      "escalation_triggered": false,
      "guardian_action": "PERIMETER_MONITORING",
      "active_agent": "ProximityRiskAgent",
      "handoff_details": null
    }
  }
];

/**
 * Pre-computed Safe Route Response for Patia -> Master Canteen Corridor
 */
export const DEFAULT_SAFE_ROUTE_RESPONSE: any = {
  "origin": {
    "name": "Current Location (Patia)",
    "latitude": 20.358,
    "longitude": 85.8195
  },
  "destination": {
    "name": "Master Canteen / Central Station",
    "latitude": 20.266,
    "longitude": 85.841
  },
  "recommended_route": {
    "route_id": "ROUTE-SAFEST-01",
    "name": "Safest Route (Recommended)",
    "is_recommended": true,
    "total_distance_km": 11.7,
    "estimated_time_mins": 40.9,
    "average_risk_score": 10.0,
    "max_risk_level": "LOW",
    "waypoints": [
      [
        20.358003,
        85.819486
      ],
      [
        20.357806,
        85.81944
      ],
      [
        20.357693,
        85.819418
      ],
      [
        20.357592,
        85.819393
      ],
      [
        20.35744,
        85.819363
      ],
      [
        20.356974,
        85.8193
      ],
      [
        20.356646,
        85.819294
      ],
      [
        20.356372,
        85.819288
      ],
      [
        20.356271,
        85.819286
      ],
      [
        20.35581,
        85.819277
      ],
      [
        20.35551,
        85.819277
      ],
      [
        20.35517,
        85.819277
      ],
      [
        20.355038,
        85.819283
      ],
      [
        20.35458,
        85.819304
      ],
      [
        20.354077,
        85.819317
      ],
      [
        20.353699,
        85.81931
      ],
      [
        20.353743,
        85.81853
      ],
      [
        20.353789,
        85.817818
      ],
      [
        20.353812,
        85.817436
      ],
      [
        20.353861,
        85.816509
      ],
      [
        20.353874,
        85.816434
      ],
      [
        20.353931,
        85.815603
      ],
      [
        20.354737,
        85.815642
      ],
      [
        20.354665,
        85.817494
      ],
      [
        20.354672,
        85.817843
      ],
      [
        20.354702,
        85.817932
      ],
      [
        20.354743,
        85.817979
      ],
      [
        20.354829,
        85.81801
      ],
      [
        20.354916,
        85.818023
      ],
      [
        20.355014,
        85.818035
      ],
      [
        20.355178,
        85.817971
      ],
      [
        20.355421,
        85.817857
      ],
      [
        20.355178,
        85.817971
      ],
      [
        20.355014,
        85.818035
      ],
      [
        20.354996,
        85.818033
      ],
      [
        20.354916,
        85.818023
      ],
      [
        20.354829,
        85.81801
      ],
      [
        20.354743,
        85.817979
      ],
      [
        20.354702,
        85.817932
      ],
      [
        20.354672,
        85.817843
      ],
      [
        20.354665,
        85.817494
      ],
      [
        20.354737,
        85.815642
      ],
      [
        20.353931,
        85.815603
      ],
      [
        20.353874,
        85.816434
      ],
      [
        20.353861,
        85.816509
      ],
      [
        20.353812,
        85.817436
      ],
      [
        20.353789,
        85.817818
      ],
      [
        20.353743,
        85.81853
      ],
      [
        20.353699,
        85.81931
      ],
      [
        20.353489,
        85.819284
      ],
      [
        20.352434,
        85.819319
      ],
      [
        20.351925,
        85.819314
      ],
      [
        20.351336,
        85.819333
      ],
      [
        20.35082,
        85.81935
      ],
      [
        20.350494,
        85.819363
      ],
      [
        20.349994,
        85.819392
      ],
      [
        20.349186,
        85.819439
      ],
      [
        20.349241,
        85.81904
      ],
      [
        20.348348,
        85.818718
      ],
      [
        20.348297,
        85.818709
      ],
      [
        20.348251,
        85.818716
      ],
      [
        20.348221,
        85.818774
      ],
      [
        20.348129,
        85.819181
      ],
      [
        20.348027,
        85.819604
      ],
      [
        20.348023,
        85.819663
      ],
      [
        20.348031,
        85.81971
      ],
      [
        20.34809,
        85.819782
      ],
      [
        20.348148,
        85.819842
      ],
      [
        20.348171,
        85.819882
      ],
      [
        20.348186,
        85.819951
      ],
      [
        20.348178,
        85.820072
      ],
      [
        20.348135,
        85.820325
      ],
      [
        20.348044,
        85.820859
      ],
      [
        20.348016,
        85.821098
      ],
      [
        20.347998,
        85.821328
      ],
      [
        20.347994,
        85.821417
      ],
      [
        20.347978,
        85.82179
      ],
      [
        20.347924,
        85.82208
      ],
      [
        20.347734,
        85.822467
      ],
      [
        20.347656,
        85.822654
      ],
      [
        20.347438,
        85.822606
      ],
      [
        20.347063,
        85.82253
      ],
      [
        20.347066,
        85.822621
      ],
      [
        20.347068,
        85.822683
      ],
      [
        20.347079,
        85.822854
      ],
      [
        20.347077,
        85.823041
      ],
      [
        20.34706,
        85.823111
      ],
      [
        20.346946,
        85.823349
      ],
      [
        20.346881,
        85.823519
      ],
      [
        20.346815,
        85.823795
      ],
      [
        20.346739,
        85.824301
      ],
      [
        20.346722,
        85.824387
      ],
      [
        20.345592,
        85.823995
      ],
      [
        20.344295,
        85.823543
      ],
      [
        20.344117,
        85.823483
      ],
      [
        20.343508,
        85.823278
      ],
      [
        20.343076,
        85.823133
      ],
      [
        20.342944,
        85.823085
      ],
      [
        20.342534,
        85.822938
      ],
      [
        20.34246,
        85.822909
      ],
      [
        20.342315,
        85.822882
      ],
      [
        20.34229,
        85.822872
      ],
      [
        20.341838,
        85.822797
      ],
      [
        20.341463,
        85.822745
      ],
      [
        20.340331,
        85.8226
      ],
      [
        20.340051,
        85.822565
      ],
      [
        20.339923,
        85.822548
      ],
      [
        20.339558,
        85.822501
      ],
      [
        20.339126,
        85.822446
      ],
      [
        20.338985,
        85.822428
      ],
      [
        20.338585,
        85.822375
      ],
      [
        20.33799,
        85.822296
      ],
      [
        20.337615,
        85.822246
      ],
      [
        20.336027,
        85.822041
      ],
      [
        20.335597,
        85.821985
      ],
      [
        20.335334,
        85.821953
      ],
      [
        20.335257,
        85.821944
      ],
      [
        20.334885,
        85.821897
      ],
      [
        20.334699,
        85.821872
      ],
      [
        20.334387,
        85.82183
      ],
      [
        20.3338,
        85.82175
      ],
      [
        20.333251,
        85.821675
      ],
      [
        20.332607,
        85.821587
      ],
      [
        20.332438,
        85.821566
      ],
      [
        20.332439,
        85.821454
      ],
      [
        20.333271,
        85.821575
      ],
      [
        20.333751,
        85.821639
      ],
      [
        20.333876,
        85.821653
      ],
      [
        20.334345,
        85.821715
      ],
      [
        20.334527,
        85.821735
      ],
      [
        20.33471,
        85.821766
      ],
      [
        20.33508,
        85.821808
      ],
      [
        20.335115,
        85.821468
      ],
      [
        20.33517,
        85.821024
      ],
      [
        20.335171,
        85.82102
      ],
      [
        20.335115,
        85.821468
      ],
      [
        20.33508,
        85.821808
      ],
      [
        20.33535,
        85.821838
      ],
      [
        20.335652,
        85.821868
      ],
      [
        20.33607,
        85.821926
      ],
      [
        20.336713,
        85.82201
      ],
      [
        20.337411,
        85.822106
      ],
      [
        20.337978,
        85.822172
      ],
      [
        20.33859,
        85.822266
      ],
      [
        20.339022,
        85.822325
      ],
      [
        20.341102,
        85.822609
      ],
      [
        20.342003,
        85.822732
      ],
      [
        20.342333,
        85.822798
      ],
      [
        20.342474,
        85.822833
      ],
      [
        20.34246,
        85.822909
      ],
      [
        20.342315,
        85.822882
      ],
      [
        20.34229,
        85.822872
      ],
      [
        20.341838,
        85.822797
      ],
      [
        20.341463,
        85.822745
      ],
      [
        20.340331,
        85.8226
      ],
      [
        20.340051,
        85.822565
      ],
      [
        20.339923,
        85.822548
      ],
      [
        20.339558,
        85.822501
      ],
      [
        20.339126,
        85.822446
      ],
      [
        20.338985,
        85.822428
      ],
      [
        20.338585,
        85.822375
      ],
      [
        20.33799,
        85.822296
      ],
      [
        20.337615,
        85.822246
      ],
      [
        20.336027,
        85.822041
      ],
      [
        20.335597,
        85.821985
      ],
      [
        20.335334,
        85.821953
      ],
      [
        20.335257,
        85.821944
      ],
      [
        20.334885,
        85.821897
      ],
      [
        20.334699,
        85.821872
      ],
      [
        20.334387,
        85.82183
      ],
      [
        20.3338,
        85.82175
      ],
      [
        20.333251,
        85.821675
      ],
      [
        20.332607,
        85.821587
      ],
      [
        20.332438,
        85.821566
      ],
      [
        20.331323,
        85.821437
      ],
      [
        20.330588,
        85.82134
      ],
      [
        20.329739,
        85.821229
      ],
      [
        20.329434,
        85.821189
      ],
      [
        20.328189,
        85.821027
      ],
      [
        20.327892,
        85.820988
      ],
      [
        20.327805,
        85.820977
      ],
      [
        20.327347,
        85.820918
      ],
      [
        20.326256,
        85.820766
      ],
      [
        20.32578,
        85.8207
      ],
      [
        20.325536,
        85.820656
      ],
      [
        20.325135,
        85.820617
      ],
      [
        20.324722,
        85.820609
      ],
      [
        20.324603,
        85.820606
      ],
      [
        20.324517,
        85.820607
      ],
      [
        20.324518,
        85.820497
      ],
      [
        20.324884,
        85.8205
      ],
      [
        20.325626,
        85.820579
      ],
      [
        20.325643,
        85.820078
      ],
      [
        20.32423,
        85.820069
      ],
      [
        20.323999,
        85.820066
      ],
      [
        20.323606,
        85.820061
      ],
      [
        20.32334,
        85.82004
      ],
      [
        20.323301,
        85.82046
      ],
      [
        20.323837,
        85.820475
      ],
      [
        20.324194,
        85.820481
      ],
      [
        20.324355,
        85.820492
      ],
      [
        20.324518,
        85.820497
      ],
      [
        20.324517,
        85.820607
      ],
      [
        20.324216,
        85.820598
      ],
      [
        20.323834,
        85.820588
      ],
      [
        20.323347,
        85.820578
      ],
      [
        20.321467,
        85.820507
      ],
      [
        20.320303,
        85.820472
      ],
      [
        20.320063,
        85.820483
      ],
      [
        20.319928,
        85.820474
      ],
      [
        20.319024,
        85.820448
      ],
      [
        20.318914,
        85.820453
      ],
      [
        20.318846,
        85.820447
      ],
      [
        20.318058,
        85.82044
      ],
      [
        20.317821,
        85.820436
      ],
      [
        20.317055,
        85.820421
      ],
      [
        20.317031,
        85.820421
      ],
      [
        20.317009,
        85.820419
      ],
      [
        20.316621,
        85.820406
      ],
      [
        20.316479,
        85.820401
      ],
      [
        20.316307,
        85.820394
      ],
      [
        20.315851,
        85.820377
      ],
      [
        20.315663,
        85.82037
      ],
      [
        20.315255,
        85.820354
      ],
      [
        20.315169,
        85.82201
      ],
      [
        20.315155,
        85.82229
      ],
      [
        20.314872,
        85.822709
      ],
      [
        20.314707,
        85.822934
      ],
      [
        20.314602,
        85.823058
      ],
      [
        20.314522,
        85.823057
      ],
      [
        20.314563,
        85.822125
      ],
      [
        20.314581,
        85.821621
      ],
      [
        20.314646,
        85.820338
      ],
      [
        20.314189,
        85.820322
      ],
      [
        20.312609,
        85.820283
      ],
      [
        20.312358,
        85.820277
      ],
      [
        20.311875,
        85.820266
      ],
      [
        20.311023,
        85.820252
      ],
      [
        20.310598,
        85.820228
      ],
      [
        20.310408,
        85.820217
      ],
      [
        20.310349,
        85.820215
      ],
      [
        20.309906,
        85.820199
      ],
      [
        20.309543,
        85.820185
      ],
      [
        20.308975,
        85.820164
      ],
      [
        20.308979,
        85.821147
      ],
      [
        20.30898,
        85.82159
      ],
      [
        20.308972,
        85.821942
      ],
      [
        20.308977,
        85.822007
      ],
      [
        20.308983,
        85.822885
      ],
      [
        20.308983,
        85.823831
      ],
      [
        20.308986,
        85.824472
      ],
      [
        20.308929,
        85.825805
      ],
      [
        20.308925,
        85.82598
      ],
      [
        20.308923,
        85.826041
      ],
      [
        20.308927,
        85.826106
      ],
      [
        20.307737,
        85.826454
      ],
      [
        20.307089,
        85.826614
      ],
      [
        20.306988,
        85.826634
      ],
      [
        20.306968,
        85.826638
      ],
      [
        20.306924,
        85.82664
      ],
      [
        20.306905,
        85.826636
      ],
      [
        20.306894,
        85.826621
      ],
      [
        20.30689,
        85.826594
      ],
      [
        20.306889,
        85.826547
      ],
      [
        20.306898,
        85.826352
      ],
      [
        20.306907,
        85.826255
      ],
      [
        20.306923,
        85.826067
      ],
      [
        20.306928,
        85.825902
      ],
      [
        20.30693,
        85.825548
      ],
      [
        20.306912,
        85.825361
      ],
      [
        20.306898,
        85.825214
      ],
      [
        20.306882,
        85.825147
      ],
      [
        20.30685,
        85.825119
      ],
      [
        20.306801,
        85.825105
      ],
      [
        20.306743,
        85.825116
      ],
      [
        20.306234,
        85.82529
      ],
      [
        20.306057,
        85.825372
      ],
      [
        20.305584,
        85.825524
      ],
      [
        20.305406,
        85.825579
      ],
      [
        20.305301,
        85.825599
      ],
      [
        20.305201,
        85.825593
      ],
      [
        20.305145,
        85.825574
      ],
      [
        20.305112,
        85.825522
      ],
      [
        20.305079,
        85.825435
      ],
      [
        20.304984,
        85.825004
      ],
      [
        20.304922,
        85.824722
      ],
      [
        20.304866,
        85.82443
      ],
      [
        20.30478,
        85.823974
      ],
      [
        20.304744,
        85.823764
      ],
      [
        20.304653,
        85.823258
      ],
      [
        20.304636,
        85.823168
      ],
      [
        20.304527,
        85.822563
      ],
      [
        20.304448,
        85.822129
      ],
      [
        20.30378,
        85.822339
      ],
      [
        20.303262,
        85.82249
      ],
      [
        20.302768,
        85.822634
      ],
      [
        20.302011,
        85.822862
      ],
      [
        20.300266,
        85.823393
      ],
      [
        20.299619,
        85.82359
      ],
      [
        20.299344,
        85.823674
      ],
      [
        20.299178,
        85.823724
      ],
      [
        20.298432,
        85.823955
      ],
      [
        20.297348,
        85.824283
      ],
      [
        20.297018,
        85.824381
      ],
      [
        20.296767,
        85.824456
      ],
      [
        20.296077,
        85.82466
      ],
      [
        20.29598,
        85.824686
      ],
      [
        20.295856,
        85.824796
      ],
      [
        20.295772,
        85.824895
      ],
      [
        20.29573,
        85.824986
      ],
      [
        20.295704,
        85.825058
      ],
      [
        20.295736,
        85.825119
      ],
      [
        20.295897,
        85.825454
      ],
      [
        20.296116,
        85.825891
      ],
      [
        20.296165,
        85.825995
      ],
      [
        20.296374,
        85.826445
      ],
      [
        20.296588,
        85.826908
      ],
      [
        20.296752,
        85.827351
      ],
      [
        20.29691,
        85.827834
      ],
      [
        20.297009,
        85.82828
      ],
      [
        20.297081,
        85.828617
      ],
      [
        20.297117,
        85.82882
      ],
      [
        20.297158,
        85.82905
      ],
      [
        20.297204,
        85.829458
      ],
      [
        20.29725,
        85.829799
      ],
      [
        20.297258,
        85.82988
      ],
      [
        20.297287,
        85.830662
      ],
      [
        20.297269,
        85.831399
      ],
      [
        20.297247,
        85.83206
      ],
      [
        20.297206,
        85.832521
      ],
      [
        20.297172,
        85.832963
      ],
      [
        20.297157,
        85.833141
      ],
      [
        20.297276,
        85.833121
      ],
      [
        20.2982,
        85.832936
      ],
      [
        20.298355,
        85.832914
      ],
      [
        20.298338,
        85.832319
      ],
      [
        20.29834,
        85.832248
      ],
      [
        20.298321,
        85.83218
      ],
      [
        20.298283,
        85.832122
      ],
      [
        20.298231,
        85.832078
      ],
      [
        20.298168,
        85.832054
      ],
      [
        20.298102,
        85.832052
      ],
      [
        20.298038,
        85.832071
      ],
      [
        20.298038,
        85.832071
      ],
      [
        20.297983,
        85.832111
      ],
      [
        20.297938,
        85.832174
      ],
      [
        20.297916,
        85.832249
      ],
      [
        20.297919,
        85.832327
      ],
      [
        20.297947,
        85.8324
      ],
      [
        20.297997,
        85.832458
      ],
      [
        20.298062,
        85.832495
      ],
      [
        20.298135,
        85.832506
      ],
      [
        20.298208,
        85.832489
      ],
      [
        20.29827,
        85.832448
      ],
      [
        20.298316,
        85.832386
      ],
      [
        20.298338,
        85.832319
      ],
      [
        20.298355,
        85.832914
      ],
      [
        20.2987,
        85.832865
      ],
      [
        20.298782,
        85.832867
      ],
      [
        20.299888,
        85.832889
      ],
      [
        20.300814,
        85.832962
      ],
      [
        20.30083,
        85.832963
      ],
      [
        20.30088,
        85.832968
      ],
      [
        20.300876,
        85.833178
      ],
      [
        20.299425,
        85.833073
      ],
      [
        20.298834,
        85.833046
      ],
      [
        20.298253,
        85.833109
      ],
      [
        20.2973,
        85.83325
      ],
      [
        20.297195,
        85.833259
      ],
      [
        20.297151,
        85.833265
      ],
      [
        20.296802,
        85.833307
      ],
      [
        20.296661,
        85.833317
      ],
      [
        20.296593,
        85.833324
      ],
      [
        20.29604,
        85.833388
      ],
      [
        20.295975,
        85.833375
      ],
      [
        20.295794,
        85.833394
      ],
      [
        20.294863,
        85.833523
      ],
      [
        20.294759,
        85.833547
      ],
      [
        20.294655,
        85.833557
      ],
      [
        20.29455,
        85.833567
      ],
      [
        20.294,
        85.833651
      ],
      [
        20.293654,
        85.833692
      ],
      [
        20.292831,
        85.833813
      ],
      [
        20.292059,
        85.833921
      ],
      [
        20.292092,
        85.834187
      ],
      [
        20.292119,
        85.834416
      ],
      [
        20.292168,
        85.83482
      ],
      [
        20.292272,
        85.835683
      ],
      [
        20.292287,
        85.835811
      ],
      [
        20.292385,
        85.836625
      ],
      [
        20.292437,
        85.837055
      ],
      [
        20.292486,
        85.837464
      ],
      [
        20.2926,
        85.838413
      ],
      [
        20.29271,
        85.839329
      ],
      [
        20.292739,
        85.839554
      ],
      [
        20.292797,
        85.840064
      ],
      [
        20.293004,
        85.840039
      ],
      [
        20.293323,
        85.84
      ],
      [
        20.293793,
        85.839949
      ],
      [
        20.29392,
        85.84086
      ],
      [
        20.29398,
        85.84125
      ],
      [
        20.294122,
        85.842167
      ],
      [
        20.295039,
        85.842054
      ],
      [
        20.295269,
        85.842028
      ],
      [
        20.295669,
        85.84198
      ],
      [
        20.295751,
        85.841974
      ],
      [
        20.295831,
        85.841968
      ],
      [
        20.295972,
        85.841967
      ],
      [
        20.29614,
        85.841982
      ],
      [
        20.296354,
        85.841992
      ],
      [
        20.296446,
        85.841999
      ],
      [
        20.296439,
        85.842163
      ],
      [
        20.29613,
        85.842145
      ],
      [
        20.29584,
        85.842125
      ],
      [
        20.295698,
        85.842118
      ],
      [
        20.295239,
        85.842182
      ],
      [
        20.294149,
        85.842308
      ],
      [
        20.293744,
        85.842367
      ],
      [
        20.293664,
        85.842379
      ],
      [
        20.293446,
        85.84241
      ],
      [
        20.293423,
        85.842414
      ],
      [
        20.29309,
        85.842462
      ],
      [
        20.292569,
        85.842539
      ],
      [
        20.291839,
        85.842639
      ],
      [
        20.290744,
        85.842771
      ],
      [
        20.29,
        85.84289
      ],
      [
        20.289532,
        85.842956
      ],
      [
        20.289599,
        85.843571
      ],
      [
        20.289644,
        85.844015
      ],
      [
        20.28909,
        85.844092
      ],
      [
        20.288173,
        85.844219
      ],
      [
        20.288254,
        85.844937
      ],
      [
        20.288257,
        85.844961
      ],
      [
        20.288388,
        85.845948
      ],
      [
        20.287848,
        85.846021
      ],
      [
        20.28732,
        85.846092
      ],
      [
        20.286849,
        85.846156
      ],
      [
        20.286419,
        85.846214
      ],
      [
        20.28586,
        85.846292
      ],
      [
        20.285842,
        85.846157
      ],
      [
        20.285627,
        85.844569
      ],
      [
        20.285622,
        85.844523
      ],
      [
        20.285515,
        85.843463
      ],
      [
        20.285324,
        85.843491
      ],
      [
        20.284567,
        85.843593
      ],
      [
        20.284391,
        85.843625
      ],
      [
        20.284189,
        85.843654
      ],
      [
        20.283373,
        85.843771
      ],
      [
        20.282918,
        85.843836
      ],
      [
        20.282815,
        85.84385
      ],
      [
        20.282696,
        85.843864
      ],
      [
        20.282307,
        85.843911
      ],
      [
        20.281692,
        85.843984
      ],
      [
        20.281156,
        85.844014
      ],
      [
        20.280661,
        85.843996
      ],
      [
        20.280323,
        85.843974
      ],
      [
        20.278965,
        85.843881
      ],
      [
        20.278867,
        85.843878
      ],
      [
        20.27812,
        85.84376
      ],
      [
        20.278019,
        85.843745
      ],
      [
        20.277921,
        85.843726
      ],
      [
        20.277935,
        85.843564
      ],
      [
        20.277958,
        85.843416
      ],
      [
        20.278043,
        85.842587
      ],
      [
        20.277205,
        85.842479
      ],
      [
        20.277265,
        85.84194
      ],
      [
        20.276939,
        85.841917
      ],
      [
        20.277005,
        85.841922
      ],
      [
        20.277265,
        85.84194
      ],
      [
        20.277205,
        85.842479
      ],
      [
        20.27707,
        85.84344
      ],
      [
        20.277847,
        85.843555
      ],
      [
        20.277935,
        85.843564
      ],
      [
        20.278036,
        85.843578
      ],
      [
        20.278019,
        85.843745
      ],
      [
        20.277921,
        85.843726
      ],
      [
        20.277825,
        85.843711
      ],
      [
        20.277154,
        85.843602
      ],
      [
        20.276996,
        85.843576
      ],
      [
        20.276749,
        85.843534
      ],
      [
        20.274975,
        85.843221
      ],
      [
        20.274845,
        85.843192
      ],
      [
        20.27407,
        85.842994
      ],
      [
        20.273888,
        85.842944
      ],
      [
        20.27333,
        85.842785
      ],
      [
        20.273294,
        85.842773
      ],
      [
        20.273036,
        85.842697
      ],
      [
        20.272139,
        85.842416
      ],
      [
        20.271376,
        85.842203
      ],
      [
        20.270847,
        85.842026
      ],
      [
        20.270164,
        85.84172
      ],
      [
        20.269578,
        85.841477
      ],
      [
        20.269006,
        85.84124
      ],
      [
        20.268879,
        85.841213
      ],
      [
        20.268849,
        85.841206
      ],
      [
        20.26864,
        85.841142
      ],
      [
        20.268496,
        85.841084
      ],
      [
        20.268384,
        85.841035
      ],
      [
        20.26819,
        85.840944
      ],
      [
        20.268069,
        85.84088
      ],
      [
        20.267952,
        85.840818
      ],
      [
        20.267906,
        85.840791
      ],
      [
        20.267764,
        85.840721
      ],
      [
        20.267409,
        85.84055
      ],
      [
        20.267095,
        85.840387
      ],
      [
        20.266563,
        85.840115
      ],
      [
        20.266177,
        85.840711
      ],
      [
        20.266181,
        85.840714
      ]
    ],
    "factual_explanation": "Recommended Route is 1.9 km (7 mins) longer but strictly navigates via continuously lit CCTV-monitored arterials, successfully bypassing 1 high-risk zones (including Sailashree Vihar forest perimeter and unlit transit corridors).",
    "avoided_zones": [
      "Infocity Dark Forest Edge & Back Corridor"
    ]
  },
  "alternative_routes": [
    {
      "route_id": "ROUTE-BALANCED-02",
      "name": "Balanced Route",
      "is_recommended": false,
      "total_distance_km": 10.75,
      "estimated_time_mins": 35.5,
      "average_risk_score": 8.4,
      "max_risk_level": "MODERATE",
      "waypoints": [
        [
          20.358003,
          85.819486
        ],
        [
          20.357806,
          85.81944
        ],
        [
          20.357693,
          85.819418
        ],
        [
          20.357592,
          85.819393
        ],
        [
          20.35744,
          85.819363
        ],
        [
          20.356974,
          85.8193
        ],
        [
          20.356646,
          85.819294
        ],
        [
          20.356372,
          85.819288
        ],
        [
          20.356271,
          85.819286
        ],
        [
          20.35581,
          85.819277
        ],
        [
          20.35551,
          85.819277
        ],
        [
          20.35517,
          85.819277
        ],
        [
          20.355038,
          85.819283
        ],
        [
          20.35458,
          85.819304
        ],
        [
          20.354077,
          85.819317
        ],
        [
          20.353699,
          85.81931
        ],
        [
          20.353743,
          85.81853
        ],
        [
          20.353789,
          85.817818
        ],
        [
          20.353812,
          85.817436
        ],
        [
          20.353861,
          85.816509
        ],
        [
          20.353874,
          85.816434
        ],
        [
          20.353931,
          85.815603
        ],
        [
          20.354737,
          85.815642
        ],
        [
          20.354665,
          85.817494
        ],
        [
          20.354672,
          85.817843
        ],
        [
          20.354702,
          85.817932
        ],
        [
          20.354743,
          85.817979
        ],
        [
          20.354829,
          85.81801
        ],
        [
          20.354916,
          85.818023
        ],
        [
          20.355014,
          85.818035
        ],
        [
          20.355178,
          85.817971
        ],
        [
          20.355421,
          85.817857
        ],
        [
          20.355178,
          85.817971
        ],
        [
          20.355014,
          85.818035
        ],
        [
          20.354996,
          85.818033
        ],
        [
          20.354916,
          85.818023
        ],
        [
          20.354829,
          85.81801
        ],
        [
          20.354743,
          85.817979
        ],
        [
          20.354702,
          85.817932
        ],
        [
          20.354672,
          85.817843
        ],
        [
          20.354665,
          85.817494
        ],
        [
          20.354737,
          85.815642
        ],
        [
          20.353931,
          85.815603
        ],
        [
          20.353984,
          85.814773
        ],
        [
          20.35404,
          85.813895
        ],
        [
          20.354054,
          85.813684
        ],
        [
          20.354112,
          85.812778
        ],
        [
          20.354129,
          85.812579
        ],
        [
          20.354103,
          85.81249
        ],
        [
          20.354168,
          85.811735
        ],
        [
          20.354181,
          85.811448
        ],
        [
          20.354247,
          85.810154
        ],
        [
          20.354299,
          85.809038
        ],
        [
          20.354305,
          85.808929
        ],
        [
          20.35435,
          85.808165
        ],
        [
          20.354359,
          85.808
        ],
        [
          20.354398,
          85.807246
        ],
        [
          20.354407,
          85.807156
        ],
        [
          20.354409,
          85.807057
        ],
        [
          20.354406,
          85.807016
        ],
        [
          20.354389,
          85.80699
        ],
        [
          20.354358,
          85.806967
        ],
        [
          20.354328,
          85.806961
        ],
        [
          20.354202,
          85.806958
        ],
        [
          20.354102,
          85.806954
        ],
        [
          20.353018,
          85.806984
        ],
        [
          20.352902,
          85.806989
        ],
        [
          20.352286,
          85.807027
        ],
        [
          20.351978,
          85.807056
        ],
        [
          20.351593,
          85.807073
        ],
        [
          20.350892,
          85.807084
        ],
        [
          20.349862,
          85.807106
        ],
        [
          20.349777,
          85.807109
        ],
        [
          20.349664,
          85.807113
        ],
        [
          20.348779,
          85.807131
        ],
        [
          20.347905,
          85.807156
        ],
        [
          20.34695,
          85.807163
        ],
        [
          20.346617,
          85.807172
        ],
        [
          20.346301,
          85.807181
        ],
        [
          20.345952,
          85.807189
        ],
        [
          20.345602,
          85.80719
        ],
        [
          20.34493,
          85.807209
        ],
        [
          20.344568,
          85.807224
        ],
        [
          20.34434,
          85.807232
        ],
        [
          20.344165,
          85.807234
        ],
        [
          20.3437,
          85.807253
        ],
        [
          20.34316,
          85.807263
        ],
        [
          20.342952,
          85.807274
        ],
        [
          20.342854,
          85.807272
        ],
        [
          20.342354,
          85.807291
        ],
        [
          20.342126,
          85.807302
        ],
        [
          20.34108,
          85.807339
        ],
        [
          20.340834,
          85.807369
        ],
        [
          20.340578,
          85.807429
        ],
        [
          20.340496,
          85.807448
        ],
        [
          20.340219,
          85.807479
        ],
        [
          20.339808,
          85.807512
        ],
        [
          20.338897,
          85.80756
        ],
        [
          20.3385,
          85.807599
        ],
        [
          20.338302,
          85.807603
        ],
        [
          20.338173,
          85.807594
        ],
        [
          20.338142,
          85.80759
        ],
        [
          20.338026,
          85.807574
        ],
        [
          20.337818,
          85.807537
        ],
        [
          20.337753,
          85.807476
        ],
        [
          20.337557,
          85.807412
        ],
        [
          20.337446,
          85.808369
        ],
        [
          20.337417,
          85.808594
        ],
        [
          20.337404,
          85.808698
        ],
        [
          20.337393,
          85.808801
        ],
        [
          20.337337,
          85.809261
        ],
        [
          20.337279,
          85.809738
        ],
        [
          20.33726,
          85.809962
        ],
        [
          20.337247,
          85.809984
        ],
        [
          20.337305,
          85.810022
        ],
        [
          20.337377,
          85.81005
        ],
        [
          20.337639,
          85.810076
        ],
        [
          20.337924,
          85.810108
        ],
        [
          20.337921,
          85.810276
        ],
        [
          20.337935,
          85.810338
        ],
        [
          20.337965,
          85.810414
        ],
        [
          20.337993,
          85.810492
        ],
        [
          20.337999,
          85.810572
        ],
        [
          20.337828,
          85.811847
        ],
        [
          20.338086,
          85.811883
        ],
        [
          20.338068,
          85.812011
        ],
        [
          20.338027,
          85.812305
        ],
        [
          20.338003,
          85.812478
        ],
        [
          20.337896,
          85.813265
        ],
        [
          20.337528,
          85.81322
        ],
        [
          20.337356,
          85.813199
        ],
        [
          20.337095,
          85.813168
        ],
        [
          20.336672,
          85.813116
        ],
        [
          20.336273,
          85.813068
        ],
        [
          20.336239,
          85.813413
        ],
        [
          20.336216,
          85.813638
        ],
        [
          20.336019,
          85.815096
        ],
        [
          20.336,
          85.815242
        ],
        [
          20.335951,
          85.815853
        ],
        [
          20.335901,
          85.816293
        ],
        [
          20.335873,
          85.81656
        ],
        [
          20.335822,
          85.81699
        ],
        [
          20.335821,
          85.817088
        ],
        [
          20.33582,
          85.817314
        ],
        [
          20.335755,
          85.817672
        ],
        [
          20.335641,
          85.817654
        ],
        [
          20.334959,
          85.817546
        ],
        [
          20.334948,
          85.817591
        ],
        [
          20.334804,
          85.81814
        ],
        [
          20.334838,
          85.818184
        ],
        [
          20.334845,
          85.818217
        ],
        [
          20.334801,
          85.818403
        ],
        [
          20.33479,
          85.818451
        ],
        [
          20.334772,
          85.818525
        ],
        [
          20.334722,
          85.818761
        ],
        [
          20.334653,
          85.819088
        ],
        [
          20.334606,
          85.819543
        ],
        [
          20.334536,
          85.819587
        ],
        [
          20.334482,
          85.819621
        ],
        [
          20.334474,
          85.819626
        ],
        [
          20.334437,
          85.81968
        ],
        [
          20.334355,
          85.819803
        ],
        [
          20.334332,
          85.81986
        ],
        [
          20.334279,
          85.819984
        ],
        [
          20.334254,
          85.820296
        ],
        [
          20.334137,
          85.820547
        ],
        [
          20.333939,
          85.821098
        ],
        [
          20.333751,
          85.821639
        ],
        [
          20.333876,
          85.821653
        ],
        [
          20.334345,
          85.821715
        ],
        [
          20.334527,
          85.821735
        ],
        [
          20.33471,
          85.821766
        ],
        [
          20.33508,
          85.821808
        ],
        [
          20.335115,
          85.821468
        ],
        [
          20.33517,
          85.821024
        ],
        [
          20.335171,
          85.82102
        ],
        [
          20.335115,
          85.821468
        ],
        [
          20.33508,
          85.821808
        ],
        [
          20.33535,
          85.821838
        ],
        [
          20.335652,
          85.821868
        ],
        [
          20.33607,
          85.821926
        ],
        [
          20.336713,
          85.82201
        ],
        [
          20.337411,
          85.822106
        ],
        [
          20.337978,
          85.822172
        ],
        [
          20.33859,
          85.822266
        ],
        [
          20.339022,
          85.822325
        ],
        [
          20.341102,
          85.822609
        ],
        [
          20.342003,
          85.822732
        ],
        [
          20.342333,
          85.822798
        ],
        [
          20.342474,
          85.822833
        ],
        [
          20.34246,
          85.822909
        ],
        [
          20.342315,
          85.822882
        ],
        [
          20.34229,
          85.822872
        ],
        [
          20.341838,
          85.822797
        ],
        [
          20.341463,
          85.822745
        ],
        [
          20.340331,
          85.8226
        ],
        [
          20.340051,
          85.822565
        ],
        [
          20.339923,
          85.822548
        ],
        [
          20.339558,
          85.822501
        ],
        [
          20.339126,
          85.822446
        ],
        [
          20.338985,
          85.822428
        ],
        [
          20.338585,
          85.822375
        ],
        [
          20.33799,
          85.822296
        ],
        [
          20.337615,
          85.822246
        ],
        [
          20.336027,
          85.822041
        ],
        [
          20.335597,
          85.821985
        ],
        [
          20.335334,
          85.821953
        ],
        [
          20.335257,
          85.821944
        ],
        [
          20.334885,
          85.821897
        ],
        [
          20.334699,
          85.821872
        ],
        [
          20.334387,
          85.82183
        ],
        [
          20.3338,
          85.82175
        ],
        [
          20.333251,
          85.821675
        ],
        [
          20.332607,
          85.821587
        ],
        [
          20.332438,
          85.821566
        ],
        [
          20.331323,
          85.821437
        ],
        [
          20.330588,
          85.82134
        ],
        [
          20.329739,
          85.821229
        ],
        [
          20.329434,
          85.821189
        ],
        [
          20.328189,
          85.821027
        ],
        [
          20.327892,
          85.820988
        ],
        [
          20.327805,
          85.820977
        ],
        [
          20.327347,
          85.820918
        ],
        [
          20.326256,
          85.820766
        ],
        [
          20.32578,
          85.8207
        ],
        [
          20.325536,
          85.820656
        ],
        [
          20.325135,
          85.820617
        ],
        [
          20.324722,
          85.820609
        ],
        [
          20.324603,
          85.820606
        ],
        [
          20.324517,
          85.820607
        ],
        [
          20.324518,
          85.820497
        ],
        [
          20.324884,
          85.8205
        ],
        [
          20.325626,
          85.820579
        ],
        [
          20.325643,
          85.820078
        ],
        [
          20.32423,
          85.820069
        ],
        [
          20.323999,
          85.820066
        ],
        [
          20.323606,
          85.820061
        ],
        [
          20.32334,
          85.82004
        ],
        [
          20.323301,
          85.82046
        ],
        [
          20.323837,
          85.820475
        ],
        [
          20.324194,
          85.820481
        ],
        [
          20.324355,
          85.820492
        ],
        [
          20.324518,
          85.820497
        ],
        [
          20.324517,
          85.820607
        ],
        [
          20.324216,
          85.820598
        ],
        [
          20.323834,
          85.820588
        ],
        [
          20.323347,
          85.820578
        ],
        [
          20.321467,
          85.820507
        ],
        [
          20.320303,
          85.820472
        ],
        [
          20.320063,
          85.820483
        ],
        [
          20.319928,
          85.820474
        ],
        [
          20.319024,
          85.820448
        ],
        [
          20.318914,
          85.820453
        ],
        [
          20.318846,
          85.820447
        ],
        [
          20.318058,
          85.82044
        ],
        [
          20.317821,
          85.820436
        ],
        [
          20.317055,
          85.820421
        ],
        [
          20.317031,
          85.820421
        ],
        [
          20.317009,
          85.820419
        ],
        [
          20.316621,
          85.820406
        ],
        [
          20.316479,
          85.820401
        ],
        [
          20.316307,
          85.820394
        ],
        [
          20.315851,
          85.820377
        ],
        [
          20.315663,
          85.82037
        ],
        [
          20.315255,
          85.820354
        ],
        [
          20.315169,
          85.82201
        ],
        [
          20.315155,
          85.82229
        ],
        [
          20.314872,
          85.822709
        ],
        [
          20.314707,
          85.822934
        ],
        [
          20.314602,
          85.823058
        ],
        [
          20.314522,
          85.823057
        ],
        [
          20.314563,
          85.822125
        ],
        [
          20.314581,
          85.821621
        ],
        [
          20.314646,
          85.820338
        ],
        [
          20.314189,
          85.820322
        ],
        [
          20.312609,
          85.820283
        ],
        [
          20.312358,
          85.820277
        ],
        [
          20.311875,
          85.820266
        ],
        [
          20.311023,
          85.820252
        ],
        [
          20.310598,
          85.820228
        ],
        [
          20.310408,
          85.820217
        ],
        [
          20.310349,
          85.820215
        ],
        [
          20.309906,
          85.820199
        ],
        [
          20.309543,
          85.820185
        ],
        [
          20.308975,
          85.820164
        ],
        [
          20.308979,
          85.821147
        ],
        [
          20.30898,
          85.82159
        ],
        [
          20.308972,
          85.821942
        ],
        [
          20.308977,
          85.822007
        ],
        [
          20.308983,
          85.822885
        ],
        [
          20.308983,
          85.823831
        ],
        [
          20.308986,
          85.824472
        ],
        [
          20.308929,
          85.825805
        ],
        [
          20.308925,
          85.82598
        ],
        [
          20.308923,
          85.826041
        ],
        [
          20.308927,
          85.826106
        ],
        [
          20.307737,
          85.826454
        ],
        [
          20.307089,
          85.826614
        ],
        [
          20.306988,
          85.826634
        ],
        [
          20.306968,
          85.826638
        ],
        [
          20.306924,
          85.82664
        ],
        [
          20.306905,
          85.826636
        ],
        [
          20.306894,
          85.826621
        ],
        [
          20.30689,
          85.826594
        ],
        [
          20.306889,
          85.826547
        ],
        [
          20.306898,
          85.826352
        ],
        [
          20.306907,
          85.826255
        ],
        [
          20.306923,
          85.826067
        ],
        [
          20.306928,
          85.825902
        ],
        [
          20.30693,
          85.825548
        ],
        [
          20.306912,
          85.825361
        ],
        [
          20.306898,
          85.825214
        ],
        [
          20.306882,
          85.825147
        ],
        [
          20.30685,
          85.825119
        ],
        [
          20.306801,
          85.825105
        ],
        [
          20.306743,
          85.825116
        ],
        [
          20.306234,
          85.82529
        ],
        [
          20.306057,
          85.825372
        ],
        [
          20.305584,
          85.825524
        ],
        [
          20.305406,
          85.825579
        ],
        [
          20.305301,
          85.825599
        ],
        [
          20.305201,
          85.825593
        ],
        [
          20.305145,
          85.825574
        ],
        [
          20.305112,
          85.825522
        ],
        [
          20.305079,
          85.825435
        ],
        [
          20.304984,
          85.825004
        ],
        [
          20.304922,
          85.824722
        ],
        [
          20.304866,
          85.82443
        ],
        [
          20.30478,
          85.823974
        ],
        [
          20.304744,
          85.823764
        ],
        [
          20.304653,
          85.823258
        ],
        [
          20.304636,
          85.823168
        ],
        [
          20.304527,
          85.822563
        ],
        [
          20.304448,
          85.822129
        ],
        [
          20.30378,
          85.822339
        ],
        [
          20.303262,
          85.82249
        ],
        [
          20.302768,
          85.822634
        ],
        [
          20.302011,
          85.822862
        ],
        [
          20.300266,
          85.823393
        ],
        [
          20.299619,
          85.82359
        ],
        [
          20.299344,
          85.823674
        ],
        [
          20.299178,
          85.823724
        ],
        [
          20.298432,
          85.823955
        ],
        [
          20.297348,
          85.824283
        ],
        [
          20.297018,
          85.824381
        ],
        [
          20.296767,
          85.824456
        ],
        [
          20.296077,
          85.82466
        ],
        [
          20.29598,
          85.824686
        ],
        [
          20.295856,
          85.824796
        ],
        [
          20.295772,
          85.824895
        ],
        [
          20.29573,
          85.824986
        ],
        [
          20.295704,
          85.825058
        ],
        [
          20.295736,
          85.825119
        ],
        [
          20.295897,
          85.825454
        ],
        [
          20.296116,
          85.825891
        ],
        [
          20.296165,
          85.825995
        ],
        [
          20.296374,
          85.826445
        ],
        [
          20.296588,
          85.826908
        ],
        [
          20.296752,
          85.827351
        ],
        [
          20.29691,
          85.827834
        ],
        [
          20.297009,
          85.82828
        ],
        [
          20.297081,
          85.828617
        ],
        [
          20.297117,
          85.82882
        ],
        [
          20.297158,
          85.82905
        ],
        [
          20.297204,
          85.829458
        ],
        [
          20.29725,
          85.829799
        ],
        [
          20.297258,
          85.82988
        ],
        [
          20.297287,
          85.830662
        ],
        [
          20.297269,
          85.831399
        ],
        [
          20.297247,
          85.83206
        ],
        [
          20.297206,
          85.832521
        ],
        [
          20.297172,
          85.832963
        ],
        [
          20.297157,
          85.833141
        ],
        [
          20.297276,
          85.833121
        ],
        [
          20.2982,
          85.832936
        ],
        [
          20.298355,
          85.832914
        ],
        [
          20.298338,
          85.832319
        ],
        [
          20.29834,
          85.832248
        ],
        [
          20.298321,
          85.83218
        ],
        [
          20.298283,
          85.832122
        ],
        [
          20.298231,
          85.832078
        ],
        [
          20.298168,
          85.832054
        ],
        [
          20.298102,
          85.832052
        ],
        [
          20.298038,
          85.832071
        ],
        [
          20.298038,
          85.832071
        ],
        [
          20.297983,
          85.832111
        ],
        [
          20.297938,
          85.832174
        ],
        [
          20.297916,
          85.832249
        ],
        [
          20.297919,
          85.832327
        ],
        [
          20.297947,
          85.8324
        ],
        [
          20.297997,
          85.832458
        ],
        [
          20.298062,
          85.832495
        ],
        [
          20.298135,
          85.832506
        ],
        [
          20.298208,
          85.832489
        ],
        [
          20.29827,
          85.832448
        ],
        [
          20.298316,
          85.832386
        ],
        [
          20.298338,
          85.832319
        ],
        [
          20.298355,
          85.832914
        ],
        [
          20.2987,
          85.832865
        ],
        [
          20.298782,
          85.832867
        ],
        [
          20.299888,
          85.832889
        ],
        [
          20.300814,
          85.832962
        ],
        [
          20.30083,
          85.832963
        ],
        [
          20.30088,
          85.832968
        ],
        [
          20.300876,
          85.833178
        ],
        [
          20.299425,
          85.833073
        ],
        [
          20.298834,
          85.833046
        ],
        [
          20.298253,
          85.833109
        ],
        [
          20.2973,
          85.83325
        ],
        [
          20.297195,
          85.833259
        ],
        [
          20.297151,
          85.833265
        ],
        [
          20.296802,
          85.833307
        ],
        [
          20.296661,
          85.833317
        ],
        [
          20.296593,
          85.833324
        ],
        [
          20.29604,
          85.833388
        ],
        [
          20.295975,
          85.833375
        ],
        [
          20.295794,
          85.833394
        ],
        [
          20.294863,
          85.833523
        ],
        [
          20.294759,
          85.833547
        ],
        [
          20.294655,
          85.833557
        ],
        [
          20.29455,
          85.833567
        ],
        [
          20.294,
          85.833651
        ],
        [
          20.293654,
          85.833692
        ],
        [
          20.292831,
          85.833813
        ],
        [
          20.292059,
          85.833921
        ],
        [
          20.292092,
          85.834187
        ],
        [
          20.292119,
          85.834416
        ],
        [
          20.292168,
          85.83482
        ],
        [
          20.292272,
          85.835683
        ],
        [
          20.292287,
          85.835811
        ],
        [
          20.292385,
          85.836625
        ],
        [
          20.292437,
          85.837055
        ],
        [
          20.292486,
          85.837464
        ],
        [
          20.2926,
          85.838413
        ],
        [
          20.29271,
          85.839329
        ],
        [
          20.292739,
          85.839554
        ],
        [
          20.292797,
          85.840064
        ],
        [
          20.293004,
          85.840039
        ],
        [
          20.293323,
          85.84
        ],
        [
          20.293793,
          85.839949
        ],
        [
          20.29392,
          85.84086
        ],
        [
          20.29398,
          85.84125
        ],
        [
          20.294122,
          85.842167
        ],
        [
          20.295039,
          85.842054
        ],
        [
          20.295269,
          85.842028
        ],
        [
          20.295669,
          85.84198
        ],
        [
          20.295751,
          85.841974
        ],
        [
          20.295831,
          85.841968
        ],
        [
          20.295972,
          85.841967
        ],
        [
          20.29614,
          85.841982
        ],
        [
          20.296354,
          85.841992
        ],
        [
          20.296446,
          85.841999
        ],
        [
          20.296439,
          85.842163
        ],
        [
          20.29613,
          85.842145
        ],
        [
          20.29584,
          85.842125
        ],
        [
          20.295698,
          85.842118
        ],
        [
          20.295239,
          85.842182
        ],
        [
          20.294149,
          85.842308
        ],
        [
          20.293744,
          85.842367
        ],
        [
          20.293664,
          85.842379
        ],
        [
          20.293446,
          85.84241
        ],
        [
          20.293423,
          85.842414
        ],
        [
          20.29309,
          85.842462
        ],
        [
          20.292569,
          85.842539
        ],
        [
          20.291839,
          85.842639
        ],
        [
          20.290744,
          85.842771
        ],
        [
          20.29,
          85.84289
        ],
        [
          20.289532,
          85.842956
        ],
        [
          20.289599,
          85.843571
        ],
        [
          20.289644,
          85.844015
        ],
        [
          20.28909,
          85.844092
        ],
        [
          20.288173,
          85.844219
        ],
        [
          20.288254,
          85.844937
        ],
        [
          20.288257,
          85.844961
        ],
        [
          20.288388,
          85.845948
        ],
        [
          20.287848,
          85.846021
        ],
        [
          20.28732,
          85.846092
        ],
        [
          20.286849,
          85.846156
        ],
        [
          20.286419,
          85.846214
        ],
        [
          20.28586,
          85.846292
        ],
        [
          20.285842,
          85.846157
        ],
        [
          20.285627,
          85.844569
        ],
        [
          20.285622,
          85.844523
        ],
        [
          20.285515,
          85.843463
        ],
        [
          20.285324,
          85.843491
        ],
        [
          20.284567,
          85.843593
        ],
        [
          20.284391,
          85.843625
        ],
        [
          20.284189,
          85.843654
        ],
        [
          20.283373,
          85.843771
        ],
        [
          20.282918,
          85.843836
        ],
        [
          20.282815,
          85.84385
        ],
        [
          20.282696,
          85.843864
        ],
        [
          20.282307,
          85.843911
        ],
        [
          20.281692,
          85.843984
        ],
        [
          20.281156,
          85.844014
        ],
        [
          20.280661,
          85.843996
        ],
        [
          20.280323,
          85.843974
        ],
        [
          20.278965,
          85.843881
        ],
        [
          20.278867,
          85.843878
        ],
        [
          20.27812,
          85.84376
        ],
        [
          20.278019,
          85.843745
        ],
        [
          20.277921,
          85.843726
        ],
        [
          20.277935,
          85.843564
        ],
        [
          20.277958,
          85.843416
        ],
        [
          20.278043,
          85.842587
        ],
        [
          20.277205,
          85.842479
        ],
        [
          20.277265,
          85.84194
        ],
        [
          20.276939,
          85.841917
        ],
        [
          20.277005,
          85.841922
        ],
        [
          20.277265,
          85.84194
        ],
        [
          20.277205,
          85.842479
        ],
        [
          20.27707,
          85.84344
        ],
        [
          20.277847,
          85.843555
        ],
        [
          20.277935,
          85.843564
        ],
        [
          20.278036,
          85.843578
        ],
        [
          20.278019,
          85.843745
        ],
        [
          20.277921,
          85.843726
        ],
        [
          20.277825,
          85.843711
        ],
        [
          20.277154,
          85.843602
        ],
        [
          20.276996,
          85.843576
        ],
        [
          20.276749,
          85.843534
        ],
        [
          20.274975,
          85.843221
        ],
        [
          20.274845,
          85.843192
        ],
        [
          20.27407,
          85.842994
        ],
        [
          20.273888,
          85.842944
        ],
        [
          20.27333,
          85.842785
        ],
        [
          20.273294,
          85.842773
        ],
        [
          20.273036,
          85.842697
        ],
        [
          20.272139,
          85.842416
        ],
        [
          20.271376,
          85.842203
        ],
        [
          20.270847,
          85.842026
        ],
        [
          20.270164,
          85.84172
        ],
        [
          20.269578,
          85.841477
        ],
        [
          20.269006,
          85.84124
        ],
        [
          20.268879,
          85.841213
        ],
        [
          20.268849,
          85.841206
        ],
        [
          20.26864,
          85.841142
        ],
        [
          20.268496,
          85.841084
        ],
        [
          20.268384,
          85.841035
        ],
        [
          20.26819,
          85.840944
        ],
        [
          20.268069,
          85.84088
        ],
        [
          20.267952,
          85.840818
        ],
        [
          20.267906,
          85.840791
        ],
        [
          20.267764,
          85.840721
        ],
        [
          20.267409,
          85.84055
        ],
        [
          20.267095,
          85.840387
        ],
        [
          20.266563,
          85.840115
        ],
        [
          20.266177,
          85.840711
        ],
        [
          20.266181,
          85.840714
        ]
      ],
      "factual_explanation": "Balanced Route offers a compromise: stays along primary roads where possible while using standard municipal links. Moderate risk with partial lighting.",
      "avoided_zones": [
        "Infocity Dark Forest Edge & Back Corridor"
      ]
    },
    {
      "route_id": "ROUTE-FASTEST-03",
      "name": "Fastest Route (Elevated Risk)",
      "is_recommended": false,
      "total_distance_km": 9.8,
      "estimated_time_mins": 29.4,
      "average_risk_score": 6.8,
      "max_risk_level": "HIGH",
      "waypoints": [
        [
          20.358003,
          85.819486
        ],
        [
          20.357806,
          85.81944
        ],
        [
          20.357693,
          85.819418
        ],
        [
          20.357592,
          85.819393
        ],
        [
          20.35744,
          85.819363
        ],
        [
          20.356974,
          85.8193
        ],
        [
          20.356646,
          85.819294
        ],
        [
          20.356372,
          85.819288
        ],
        [
          20.356271,
          85.819286
        ],
        [
          20.35581,
          85.819277
        ],
        [
          20.35551,
          85.819277
        ],
        [
          20.35517,
          85.819277
        ],
        [
          20.355038,
          85.819283
        ],
        [
          20.35458,
          85.819304
        ],
        [
          20.354077,
          85.819317
        ],
        [
          20.353699,
          85.81931
        ],
        [
          20.353743,
          85.81853
        ],
        [
          20.353789,
          85.817818
        ],
        [
          20.353812,
          85.817436
        ],
        [
          20.353861,
          85.816509
        ],
        [
          20.353874,
          85.816434
        ],
        [
          20.353931,
          85.815603
        ],
        [
          20.354737,
          85.815642
        ],
        [
          20.354665,
          85.817494
        ],
        [
          20.354672,
          85.817843
        ],
        [
          20.354702,
          85.817932
        ],
        [
          20.354743,
          85.817979
        ],
        [
          20.354829,
          85.81801
        ],
        [
          20.354916,
          85.818023
        ],
        [
          20.355014,
          85.818035
        ],
        [
          20.355178,
          85.817971
        ],
        [
          20.355421,
          85.817857
        ],
        [
          20.355178,
          85.817971
        ],
        [
          20.355014,
          85.818035
        ],
        [
          20.354996,
          85.818033
        ],
        [
          20.354916,
          85.818023
        ],
        [
          20.354829,
          85.81801
        ],
        [
          20.354743,
          85.817979
        ],
        [
          20.354702,
          85.817932
        ],
        [
          20.354672,
          85.817843
        ],
        [
          20.354665,
          85.817494
        ],
        [
          20.354737,
          85.815642
        ],
        [
          20.353931,
          85.815603
        ],
        [
          20.353984,
          85.814773
        ],
        [
          20.35404,
          85.813895
        ],
        [
          20.354054,
          85.813684
        ],
        [
          20.354112,
          85.812778
        ],
        [
          20.354129,
          85.812579
        ],
        [
          20.354103,
          85.81249
        ],
        [
          20.354168,
          85.811735
        ],
        [
          20.354181,
          85.811448
        ],
        [
          20.354247,
          85.810154
        ],
        [
          20.354299,
          85.809038
        ],
        [
          20.354305,
          85.808929
        ],
        [
          20.35435,
          85.808165
        ],
        [
          20.354359,
          85.808
        ],
        [
          20.354398,
          85.807246
        ],
        [
          20.354407,
          85.807156
        ],
        [
          20.354409,
          85.807057
        ],
        [
          20.354406,
          85.807016
        ],
        [
          20.354389,
          85.80699
        ],
        [
          20.354358,
          85.806967
        ],
        [
          20.354328,
          85.806961
        ],
        [
          20.354202,
          85.806958
        ],
        [
          20.354102,
          85.806954
        ],
        [
          20.353018,
          85.806984
        ],
        [
          20.352902,
          85.806989
        ],
        [
          20.352286,
          85.807027
        ],
        [
          20.351978,
          85.807056
        ],
        [
          20.351593,
          85.807073
        ],
        [
          20.350892,
          85.807084
        ],
        [
          20.349862,
          85.807106
        ],
        [
          20.349777,
          85.807109
        ],
        [
          20.349664,
          85.807113
        ],
        [
          20.348779,
          85.807131
        ],
        [
          20.347905,
          85.807156
        ],
        [
          20.34695,
          85.807163
        ],
        [
          20.346617,
          85.807172
        ],
        [
          20.346301,
          85.807181
        ],
        [
          20.345952,
          85.807189
        ],
        [
          20.345602,
          85.80719
        ],
        [
          20.34493,
          85.807209
        ],
        [
          20.344568,
          85.807224
        ],
        [
          20.34434,
          85.807232
        ],
        [
          20.344165,
          85.807234
        ],
        [
          20.3437,
          85.807253
        ],
        [
          20.34316,
          85.807263
        ],
        [
          20.342952,
          85.807274
        ],
        [
          20.342854,
          85.807272
        ],
        [
          20.342354,
          85.807291
        ],
        [
          20.342126,
          85.807302
        ],
        [
          20.34108,
          85.807339
        ],
        [
          20.340834,
          85.807369
        ],
        [
          20.340578,
          85.807429
        ],
        [
          20.340496,
          85.807448
        ],
        [
          20.340219,
          85.807479
        ],
        [
          20.339808,
          85.807512
        ],
        [
          20.338897,
          85.80756
        ],
        [
          20.3385,
          85.807599
        ],
        [
          20.338302,
          85.807603
        ],
        [
          20.338173,
          85.807594
        ],
        [
          20.338142,
          85.80759
        ],
        [
          20.338026,
          85.807574
        ],
        [
          20.337818,
          85.807537
        ],
        [
          20.337753,
          85.807476
        ],
        [
          20.337557,
          85.807412
        ],
        [
          20.337446,
          85.808369
        ],
        [
          20.337417,
          85.808594
        ],
        [
          20.337404,
          85.808698
        ],
        [
          20.337393,
          85.808801
        ],
        [
          20.337337,
          85.809261
        ],
        [
          20.337279,
          85.809738
        ],
        [
          20.33726,
          85.809962
        ],
        [
          20.337247,
          85.809984
        ],
        [
          20.337305,
          85.810022
        ],
        [
          20.337377,
          85.81005
        ],
        [
          20.337639,
          85.810076
        ],
        [
          20.337924,
          85.810108
        ],
        [
          20.337921,
          85.810276
        ],
        [
          20.337935,
          85.810338
        ],
        [
          20.337965,
          85.810414
        ],
        [
          20.337993,
          85.810492
        ],
        [
          20.337999,
          85.810572
        ],
        [
          20.337828,
          85.811847
        ],
        [
          20.338086,
          85.811883
        ],
        [
          20.338068,
          85.812011
        ],
        [
          20.338027,
          85.812305
        ],
        [
          20.338003,
          85.812478
        ],
        [
          20.337896,
          85.813265
        ],
        [
          20.337528,
          85.81322
        ],
        [
          20.337356,
          85.813199
        ],
        [
          20.337095,
          85.813168
        ],
        [
          20.336672,
          85.813116
        ],
        [
          20.336273,
          85.813068
        ],
        [
          20.336239,
          85.813413
        ],
        [
          20.336216,
          85.813638
        ],
        [
          20.336019,
          85.815096
        ],
        [
          20.336,
          85.815242
        ],
        [
          20.335951,
          85.815853
        ],
        [
          20.335901,
          85.816293
        ],
        [
          20.335873,
          85.81656
        ],
        [
          20.335822,
          85.81699
        ],
        [
          20.335821,
          85.817088
        ],
        [
          20.33582,
          85.817314
        ],
        [
          20.335755,
          85.817672
        ],
        [
          20.335641,
          85.817654
        ],
        [
          20.334959,
          85.817546
        ],
        [
          20.334948,
          85.817591
        ],
        [
          20.334804,
          85.81814
        ],
        [
          20.334838,
          85.818184
        ],
        [
          20.334845,
          85.818217
        ],
        [
          20.334801,
          85.818403
        ],
        [
          20.33479,
          85.818451
        ],
        [
          20.334772,
          85.818525
        ],
        [
          20.334722,
          85.818761
        ],
        [
          20.334653,
          85.819088
        ],
        [
          20.334606,
          85.819543
        ],
        [
          20.334536,
          85.819587
        ],
        [
          20.334482,
          85.819621
        ],
        [
          20.334474,
          85.819626
        ],
        [
          20.334437,
          85.81968
        ],
        [
          20.334355,
          85.819803
        ],
        [
          20.334332,
          85.81986
        ],
        [
          20.334279,
          85.819984
        ],
        [
          20.334254,
          85.820296
        ],
        [
          20.334137,
          85.820547
        ],
        [
          20.333939,
          85.821098
        ],
        [
          20.333751,
          85.821639
        ],
        [
          20.333876,
          85.821653
        ],
        [
          20.334345,
          85.821715
        ],
        [
          20.334527,
          85.821735
        ],
        [
          20.33471,
          85.821766
        ],
        [
          20.33508,
          85.821808
        ],
        [
          20.335115,
          85.821468
        ],
        [
          20.33517,
          85.821024
        ],
        [
          20.335171,
          85.82102
        ],
        [
          20.335115,
          85.821468
        ],
        [
          20.33508,
          85.821808
        ],
        [
          20.33535,
          85.821838
        ],
        [
          20.335652,
          85.821868
        ],
        [
          20.33607,
          85.821926
        ],
        [
          20.336713,
          85.82201
        ],
        [
          20.337411,
          85.822106
        ],
        [
          20.337978,
          85.822172
        ],
        [
          20.33859,
          85.822266
        ],
        [
          20.339022,
          85.822325
        ],
        [
          20.341102,
          85.822609
        ],
        [
          20.342003,
          85.822732
        ],
        [
          20.342333,
          85.822798
        ],
        [
          20.342474,
          85.822833
        ],
        [
          20.34246,
          85.822909
        ],
        [
          20.342315,
          85.822882
        ],
        [
          20.34229,
          85.822872
        ],
        [
          20.341838,
          85.822797
        ],
        [
          20.341463,
          85.822745
        ],
        [
          20.340331,
          85.8226
        ],
        [
          20.340051,
          85.822565
        ],
        [
          20.339923,
          85.822548
        ],
        [
          20.339558,
          85.822501
        ],
        [
          20.339126,
          85.822446
        ],
        [
          20.338985,
          85.822428
        ],
        [
          20.338585,
          85.822375
        ],
        [
          20.33799,
          85.822296
        ],
        [
          20.337615,
          85.822246
        ],
        [
          20.336027,
          85.822041
        ],
        [
          20.335597,
          85.821985
        ],
        [
          20.335334,
          85.821953
        ],
        [
          20.335257,
          85.821944
        ],
        [
          20.334885,
          85.821897
        ],
        [
          20.334699,
          85.821872
        ],
        [
          20.334387,
          85.82183
        ],
        [
          20.3338,
          85.82175
        ],
        [
          20.333251,
          85.821675
        ],
        [
          20.332607,
          85.821587
        ],
        [
          20.332438,
          85.821566
        ],
        [
          20.331323,
          85.821437
        ],
        [
          20.330588,
          85.82134
        ],
        [
          20.329739,
          85.821229
        ],
        [
          20.329434,
          85.821189
        ],
        [
          20.328189,
          85.821027
        ],
        [
          20.327892,
          85.820988
        ],
        [
          20.327805,
          85.820977
        ],
        [
          20.327347,
          85.820918
        ],
        [
          20.326256,
          85.820766
        ],
        [
          20.32578,
          85.8207
        ],
        [
          20.325536,
          85.820656
        ],
        [
          20.325135,
          85.820617
        ],
        [
          20.324722,
          85.820609
        ],
        [
          20.324603,
          85.820606
        ],
        [
          20.324517,
          85.820607
        ],
        [
          20.324518,
          85.820497
        ],
        [
          20.324884,
          85.8205
        ],
        [
          20.325626,
          85.820579
        ],
        [
          20.325643,
          85.820078
        ],
        [
          20.32423,
          85.820069
        ],
        [
          20.323999,
          85.820066
        ],
        [
          20.323606,
          85.820061
        ],
        [
          20.32334,
          85.82004
        ],
        [
          20.323301,
          85.82046
        ],
        [
          20.323837,
          85.820475
        ],
        [
          20.324194,
          85.820481
        ],
        [
          20.324355,
          85.820492
        ],
        [
          20.324518,
          85.820497
        ],
        [
          20.324517,
          85.820607
        ],
        [
          20.324216,
          85.820598
        ],
        [
          20.323834,
          85.820588
        ],
        [
          20.323347,
          85.820578
        ],
        [
          20.321467,
          85.820507
        ],
        [
          20.320303,
          85.820472
        ],
        [
          20.320063,
          85.820483
        ],
        [
          20.319928,
          85.820474
        ],
        [
          20.319024,
          85.820448
        ],
        [
          20.318914,
          85.820453
        ],
        [
          20.318846,
          85.820447
        ],
        [
          20.318058,
          85.82044
        ],
        [
          20.317821,
          85.820436
        ],
        [
          20.317055,
          85.820421
        ],
        [
          20.317031,
          85.820421
        ],
        [
          20.317009,
          85.820419
        ],
        [
          20.316621,
          85.820406
        ],
        [
          20.316479,
          85.820401
        ],
        [
          20.316307,
          85.820394
        ],
        [
          20.315851,
          85.820377
        ],
        [
          20.315663,
          85.82037
        ],
        [
          20.315255,
          85.820354
        ],
        [
          20.315169,
          85.82201
        ],
        [
          20.315155,
          85.82229
        ],
        [
          20.314872,
          85.822709
        ],
        [
          20.314707,
          85.822934
        ],
        [
          20.314602,
          85.823058
        ],
        [
          20.314522,
          85.823057
        ],
        [
          20.314563,
          85.822125
        ],
        [
          20.314581,
          85.821621
        ],
        [
          20.314646,
          85.820338
        ],
        [
          20.314189,
          85.820322
        ],
        [
          20.312609,
          85.820283
        ],
        [
          20.312358,
          85.820277
        ],
        [
          20.311875,
          85.820266
        ],
        [
          20.311023,
          85.820252
        ],
        [
          20.310598,
          85.820228
        ],
        [
          20.310408,
          85.820217
        ],
        [
          20.310349,
          85.820215
        ],
        [
          20.309906,
          85.820199
        ],
        [
          20.309543,
          85.820185
        ],
        [
          20.308975,
          85.820164
        ],
        [
          20.308979,
          85.821147
        ],
        [
          20.30898,
          85.82159
        ],
        [
          20.308972,
          85.821942
        ],
        [
          20.308977,
          85.822007
        ],
        [
          20.308983,
          85.822885
        ],
        [
          20.308983,
          85.823831
        ],
        [
          20.308986,
          85.824472
        ],
        [
          20.308929,
          85.825805
        ],
        [
          20.308925,
          85.82598
        ],
        [
          20.308923,
          85.826041
        ],
        [
          20.308927,
          85.826106
        ],
        [
          20.307737,
          85.826454
        ],
        [
          20.307089,
          85.826614
        ],
        [
          20.306988,
          85.826634
        ],
        [
          20.306968,
          85.826638
        ],
        [
          20.306924,
          85.82664
        ],
        [
          20.306905,
          85.826636
        ],
        [
          20.306894,
          85.826621
        ],
        [
          20.30689,
          85.826594
        ],
        [
          20.306889,
          85.826547
        ],
        [
          20.306898,
          85.826352
        ],
        [
          20.306907,
          85.826255
        ],
        [
          20.306923,
          85.826067
        ],
        [
          20.306928,
          85.825902
        ],
        [
          20.30693,
          85.825548
        ],
        [
          20.306912,
          85.825361
        ],
        [
          20.306898,
          85.825214
        ],
        [
          20.306882,
          85.825147
        ],
        [
          20.30685,
          85.825119
        ],
        [
          20.306801,
          85.825105
        ],
        [
          20.306743,
          85.825116
        ],
        [
          20.306234,
          85.82529
        ],
        [
          20.306057,
          85.825372
        ],
        [
          20.305584,
          85.825524
        ],
        [
          20.305406,
          85.825579
        ],
        [
          20.305301,
          85.825599
        ],
        [
          20.305201,
          85.825593
        ],
        [
          20.305145,
          85.825574
        ],
        [
          20.305112,
          85.825522
        ],
        [
          20.305079,
          85.825435
        ],
        [
          20.304984,
          85.825004
        ],
        [
          20.304922,
          85.824722
        ],
        [
          20.304866,
          85.82443
        ],
        [
          20.30478,
          85.823974
        ],
        [
          20.304744,
          85.823764
        ],
        [
          20.304653,
          85.823258
        ],
        [
          20.304636,
          85.823168
        ],
        [
          20.304527,
          85.822563
        ],
        [
          20.304448,
          85.822129
        ],
        [
          20.30378,
          85.822339
        ],
        [
          20.303262,
          85.82249
        ],
        [
          20.302768,
          85.822634
        ],
        [
          20.302011,
          85.822862
        ],
        [
          20.300266,
          85.823393
        ],
        [
          20.299619,
          85.82359
        ],
        [
          20.299344,
          85.823674
        ],
        [
          20.299178,
          85.823724
        ],
        [
          20.298432,
          85.823955
        ],
        [
          20.297348,
          85.824283
        ],
        [
          20.297018,
          85.824381
        ],
        [
          20.296767,
          85.824456
        ],
        [
          20.296077,
          85.82466
        ],
        [
          20.29598,
          85.824686
        ],
        [
          20.295856,
          85.824796
        ],
        [
          20.295772,
          85.824895
        ],
        [
          20.29573,
          85.824986
        ],
        [
          20.295704,
          85.825058
        ],
        [
          20.295736,
          85.825119
        ],
        [
          20.295897,
          85.825454
        ],
        [
          20.296116,
          85.825891
        ],
        [
          20.296165,
          85.825995
        ],
        [
          20.296374,
          85.826445
        ],
        [
          20.296588,
          85.826908
        ],
        [
          20.296752,
          85.827351
        ],
        [
          20.29691,
          85.827834
        ],
        [
          20.297009,
          85.82828
        ],
        [
          20.297081,
          85.828617
        ],
        [
          20.297117,
          85.82882
        ],
        [
          20.297158,
          85.82905
        ],
        [
          20.297204,
          85.829458
        ],
        [
          20.29725,
          85.829799
        ],
        [
          20.297258,
          85.82988
        ],
        [
          20.297287,
          85.830662
        ],
        [
          20.297269,
          85.831399
        ],
        [
          20.297247,
          85.83206
        ],
        [
          20.297206,
          85.832521
        ],
        [
          20.297172,
          85.832963
        ],
        [
          20.297157,
          85.833141
        ],
        [
          20.297276,
          85.833121
        ],
        [
          20.2982,
          85.832936
        ],
        [
          20.298355,
          85.832914
        ],
        [
          20.298338,
          85.832319
        ],
        [
          20.29834,
          85.832248
        ],
        [
          20.298321,
          85.83218
        ],
        [
          20.298283,
          85.832122
        ],
        [
          20.298231,
          85.832078
        ],
        [
          20.298168,
          85.832054
        ],
        [
          20.298102,
          85.832052
        ],
        [
          20.298038,
          85.832071
        ],
        [
          20.298038,
          85.832071
        ],
        [
          20.297983,
          85.832111
        ],
        [
          20.297938,
          85.832174
        ],
        [
          20.297916,
          85.832249
        ],
        [
          20.297919,
          85.832327
        ],
        [
          20.297947,
          85.8324
        ],
        [
          20.297997,
          85.832458
        ],
        [
          20.298062,
          85.832495
        ],
        [
          20.298135,
          85.832506
        ],
        [
          20.298208,
          85.832489
        ],
        [
          20.29827,
          85.832448
        ],
        [
          20.298316,
          85.832386
        ],
        [
          20.298338,
          85.832319
        ],
        [
          20.298355,
          85.832914
        ],
        [
          20.2987,
          85.832865
        ],
        [
          20.298782,
          85.832867
        ],
        [
          20.299888,
          85.832889
        ],
        [
          20.300814,
          85.832962
        ],
        [
          20.30083,
          85.832963
        ],
        [
          20.30088,
          85.832968
        ],
        [
          20.300876,
          85.833178
        ],
        [
          20.299425,
          85.833073
        ],
        [
          20.298834,
          85.833046
        ],
        [
          20.298253,
          85.833109
        ],
        [
          20.2973,
          85.83325
        ],
        [
          20.297195,
          85.833259
        ],
        [
          20.297151,
          85.833265
        ],
        [
          20.297131,
          85.833425
        ],
        [
          20.297097,
          85.833803
        ],
        [
          20.297025,
          85.834688
        ],
        [
          20.296889,
          85.836284
        ],
        [
          20.296801,
          85.83739
        ],
        [
          20.296774,
          85.837724
        ],
        [
          20.296633,
          85.839398
        ],
        [
          20.296588,
          85.840399
        ],
        [
          20.296582,
          85.840527
        ],
        [
          20.296551,
          85.840856
        ],
        [
          20.296542,
          85.841024
        ],
        [
          20.296469,
          85.841766
        ],
        [
          20.296446,
          85.841999
        ],
        [
          20.296439,
          85.842163
        ],
        [
          20.296321,
          85.843764
        ],
        [
          20.296211,
          85.844901
        ],
        [
          20.29615,
          85.845535
        ],
        [
          20.296126,
          85.845829
        ],
        [
          20.29607,
          85.846437
        ],
        [
          20.296007,
          85.847326
        ],
        [
          20.295862,
          85.847638
        ],
        [
          20.295731,
          85.849107
        ],
        [
          20.295587,
          85.851099
        ],
        [
          20.295654,
          85.851205
        ],
        [
          20.295681,
          85.851371
        ],
        [
          20.295681,
          85.851405
        ],
        [
          20.296862,
          85.851093
        ],
        [
          20.297304,
          85.850939
        ],
        [
          20.297817,
          85.850741
        ],
        [
          20.297979,
          85.850694
        ],
        [
          20.299866,
          85.850054
        ],
        [
          20.300371,
          85.849825
        ],
        [
          20.301564,
          85.849278
        ],
        [
          20.30168,
          85.849225
        ],
        [
          20.301866,
          85.849149
        ],
        [
          20.301556,
          85.848797
        ],
        [
          20.301271,
          85.84849
        ],
        [
          20.301233,
          85.848451
        ],
        [
          20.301208,
          85.848432
        ],
        [
          20.301176,
          85.848412
        ],
        [
          20.301145,
          85.848392
        ],
        [
          20.301118,
          85.848371
        ],
        [
          20.301095,
          85.848347
        ],
        [
          20.30108,
          85.848316
        ],
        [
          20.301073,
          85.848285
        ],
        [
          20.30106,
          85.848201
        ],
        [
          20.301046,
          85.848095
        ],
        [
          20.301035,
          85.848003
        ],
        [
          20.301018,
          85.847927
        ],
        [
          20.300998,
          85.847842
        ],
        [
          20.300969,
          85.847707
        ],
        [
          20.300945,
          85.847608
        ],
        [
          20.300924,
          85.847527
        ],
        [
          20.300883,
          85.847371
        ],
        [
          20.300828,
          85.847141
        ],
        [
          20.300782,
          85.846958
        ],
        [
          20.300709,
          85.846687
        ],
        [
          20.300671,
          85.846542
        ],
        [
          20.300628,
          85.846377
        ],
        [
          20.300569,
          85.846116
        ],
        [
          20.300532,
          85.845947
        ],
        [
          20.300516,
          85.845858
        ],
        [
          20.300503,
          85.845775
        ],
        [
          20.30049,
          85.845692
        ],
        [
          20.300471,
          85.845569
        ],
        [
          20.300462,
          85.845491
        ],
        [
          20.300462,
          85.845491
        ],
        [
          20.300471,
          85.845569
        ],
        [
          20.30049,
          85.845692
        ],
        [
          20.300503,
          85.845775
        ],
        [
          20.300516,
          85.845858
        ],
        [
          20.300532,
          85.845947
        ],
        [
          20.300569,
          85.846116
        ],
        [
          20.300628,
          85.846377
        ],
        [
          20.300671,
          85.846542
        ],
        [
          20.300314,
          85.846657
        ],
        [
          20.300263,
          85.846674
        ],
        [
          20.300202,
          85.846694
        ],
        [
          20.299932,
          85.846783
        ],
        [
          20.300027,
          85.846965
        ],
        [
          20.300137,
          85.847186
        ],
        [
          20.300195,
          85.847306
        ],
        [
          20.300247,
          85.847426
        ],
        [
          20.300388,
          85.847674
        ],
        [
          20.300405,
          85.847706
        ],
        [
          20.300408,
          85.847728
        ],
        [
          20.3004,
          85.847745
        ],
        [
          20.30038,
          85.847761
        ],
        [
          20.300415,
          85.847984
        ],
        [
          20.300432,
          85.848145
        ],
        [
          20.300449,
          85.848317
        ],
        [
          20.300449,
          85.848434
        ],
        [
          20.30044,
          85.848497
        ],
        [
          20.300414,
          85.848547
        ],
        [
          20.300364,
          85.848583
        ],
        [
          20.300001,
          85.848718
        ],
        [
          20.299885,
          85.848757
        ],
        [
          20.299399,
          85.848909
        ],
        [
          20.298928,
          85.849058
        ],
        [
          20.298873,
          85.849075
        ],
        [
          20.298336,
          85.849254
        ],
        [
          20.297866,
          85.849408
        ],
        [
          20.297878,
          85.849013
        ],
        [
          20.296898,
          85.849078
        ],
        [
          20.296896,
          85.848822
        ],
        [
          20.296872,
          85.847812
        ],
        [
          20.295974,
          85.84779
        ],
        [
          20.295893,
          85.848858
        ],
        [
          20.295875,
          85.849179
        ],
        [
          20.295805,
          85.849797
        ],
        [
          20.29578,
          85.850196
        ],
        [
          20.29575,
          85.850537
        ],
        [
          20.295742,
          85.850658
        ],
        [
          20.295737,
          85.850755
        ],
        [
          20.295729,
          85.850825
        ],
        [
          20.295722,
          85.850894
        ],
        [
          20.295714,
          85.850967
        ],
        [
          20.295705,
          85.850997
        ],
        [
          20.295701,
          85.851007
        ],
        [
          20.295691,
          85.851014
        ],
        [
          20.295369,
          85.85099
        ],
        [
          20.295296,
          85.850929
        ],
        [
          20.295262,
          85.85087
        ],
        [
          20.295245,
          85.850782
        ],
        [
          20.295251,
          85.8507
        ],
        [
          20.29527,
          85.850544
        ],
        [
          20.295303,
          85.850286
        ],
        [
          20.295347,
          85.85008
        ],
        [
          20.295379,
          85.849931
        ],
        [
          20.295427,
          85.849701
        ],
        [
          20.295462,
          85.849554
        ],
        [
          20.295618,
          85.848896
        ],
        [
          20.295725,
          85.847758
        ],
        [
          20.295688,
          85.847203
        ],
        [
          20.295694,
          85.847037
        ],
        [
          20.295705,
          85.846826
        ],
        [
          20.295725,
          85.846591
        ],
        [
          20.295734,
          85.846289
        ],
        [
          20.29575,
          85.846112
        ],
        [
          20.295852,
          85.844959
        ],
        [
          20.295668,
          85.844967
        ],
        [
          20.295014,
          85.84505
        ],
        [
          20.293892,
          85.845207
        ],
        [
          20.293387,
          85.845265
        ],
        [
          20.293244,
          85.845278
        ],
        [
          20.292588,
          85.845361
        ],
        [
          20.29251,
          85.845374
        ],
        [
          20.292041,
          85.845457
        ],
        [
          20.29164,
          85.845497
        ],
        [
          20.29095,
          85.845601
        ],
        [
          20.290392,
          85.845677
        ],
        [
          20.289853,
          85.845738
        ],
        [
          20.289289,
          85.845826
        ],
        [
          20.288838,
          85.845887
        ],
        [
          20.288388,
          85.845948
        ],
        [
          20.288257,
          85.844961
        ],
        [
          20.288254,
          85.844937
        ],
        [
          20.288173,
          85.844219
        ],
        [
          20.287631,
          85.844294
        ],
        [
          20.287515,
          85.843203
        ],
        [
          20.285642,
          85.843447
        ],
        [
          20.285515,
          85.843463
        ],
        [
          20.285324,
          85.843491
        ],
        [
          20.284567,
          85.843593
        ],
        [
          20.284391,
          85.843625
        ],
        [
          20.284189,
          85.843654
        ],
        [
          20.283373,
          85.843771
        ],
        [
          20.282918,
          85.843836
        ],
        [
          20.282815,
          85.84385
        ],
        [
          20.282696,
          85.843864
        ],
        [
          20.282307,
          85.843911
        ],
        [
          20.281692,
          85.843984
        ],
        [
          20.281156,
          85.844014
        ],
        [
          20.280661,
          85.843996
        ],
        [
          20.280323,
          85.843974
        ],
        [
          20.278965,
          85.843881
        ],
        [
          20.278867,
          85.843878
        ],
        [
          20.27812,
          85.84376
        ],
        [
          20.278019,
          85.843745
        ],
        [
          20.277921,
          85.843726
        ],
        [
          20.277935,
          85.843564
        ],
        [
          20.277958,
          85.843416
        ],
        [
          20.278043,
          85.842587
        ],
        [
          20.277205,
          85.842479
        ],
        [
          20.277265,
          85.84194
        ],
        [
          20.276939,
          85.841917
        ],
        [
          20.277005,
          85.841922
        ],
        [
          20.277265,
          85.84194
        ],
        [
          20.277205,
          85.842479
        ],
        [
          20.27707,
          85.84344
        ],
        [
          20.277847,
          85.843555
        ],
        [
          20.277935,
          85.843564
        ],
        [
          20.278036,
          85.843578
        ],
        [
          20.278019,
          85.843745
        ],
        [
          20.277921,
          85.843726
        ],
        [
          20.277825,
          85.843711
        ],
        [
          20.277154,
          85.843602
        ],
        [
          20.276996,
          85.843576
        ],
        [
          20.276749,
          85.843534
        ],
        [
          20.274975,
          85.843221
        ],
        [
          20.274845,
          85.843192
        ],
        [
          20.27407,
          85.842994
        ],
        [
          20.273888,
          85.842944
        ],
        [
          20.27333,
          85.842785
        ],
        [
          20.273294,
          85.842773
        ],
        [
          20.273036,
          85.842697
        ],
        [
          20.272139,
          85.842416
        ],
        [
          20.271376,
          85.842203
        ],
        [
          20.270847,
          85.842026
        ],
        [
          20.270164,
          85.84172
        ],
        [
          20.269578,
          85.841477
        ],
        [
          20.269006,
          85.84124
        ],
        [
          20.268879,
          85.841213
        ],
        [
          20.268849,
          85.841206
        ],
        [
          20.26864,
          85.841142
        ],
        [
          20.268496,
          85.841084
        ],
        [
          20.268384,
          85.841035
        ],
        [
          20.26819,
          85.840944
        ],
        [
          20.268069,
          85.84088
        ],
        [
          20.267952,
          85.840818
        ],
        [
          20.267906,
          85.840791
        ],
        [
          20.267764,
          85.840721
        ],
        [
          20.267409,
          85.84055
        ],
        [
          20.267095,
          85.840387
        ],
        [
          20.266563,
          85.840115
        ],
        [
          20.266177,
          85.840711
        ],
        [
          20.266181,
          85.840714
        ]
      ],
      "factual_explanation": "Fastest Route is shorter by 1.9 km but cuts directly through 1 unlit high-risk zones with frequent historical harassment reports and low police patrol frequency.",
      "avoided_zones": []
    }
  ],
  "reasoning_summary": "Recommended Route is 1.9 km (7 mins) longer but strictly navigates via continuously lit CCTV-monitored arterials, successfully bypassing 1 high-risk zones (including Sailashree Vihar forest perimeter and unlit transit corridors)."
};
