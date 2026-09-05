/**
 * TypeScript Data Contracts for Kavach Safety Platform
 */

export interface RiskZone {
  id: string;
  zone_code: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  base_threat_level: string;
  lighting_rating: number;
  patrol_frequency: string;
  offender_count: number;
  historical_incident_count: number;
}

export interface LegalAidContact {
  name: string;
  authority_type: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  is_emergency: boolean;
}

export interface HeatmapCell {
  cell_id: string;
  area_name: string;
  center_lat: number;
  center_lng: number;
  polygon: [number, number][];
  risk_score: number;
  risk_level: "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL";
  incident_count: number;
}

export interface HeatmapResponse {
  total_cells: number;
  cells: HeatmapCell[];
  high_risk_zone_count: number;
  calculated_at: string;
}

export interface GPSPingEvaluation {
  ping_id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  calculated_risk_score: number;
  risk_level: string;
  nearest_zone_name?: string;
  nearest_zone_distance_meters?: number;
  nearest_offender_code?: string;
  nearest_offender_distance_meters?: number;
  lighting_rating?: number;
  patrol_frequency?: string;
  stage?: string;
  reason_summary?: string;
  escalation_triggered: boolean;
  guardian_action?: string;
  active_agent: string;
  handoff_details?: {
    initiating_agent: string;
    target_agent: string;
    severity: string;
    reason: string;
    closest_zone_name?: string;
    closest_zone_distance_meters?: number;
    closest_offender_code?: string;
    closest_offender_distance_meters?: number;
    action_recommended: string;
  };
}

export interface RouteOption {
  route_id: string;
  name: string;
  is_recommended: boolean;
  total_distance_km: number;
  estimated_time_mins: number;
  average_risk_score: number;
  max_risk_level: string;
  waypoints: [number, number][];
  factual_explanation: string;
  avoided_zones: string[];
}

export interface SafeRouteResponse {
  origin: { name: string; latitude: number; longitude: number };
  destination: { name: string; latitude: number; longitude: number };
  recommended_route: RouteOption;
  alternative_routes: RouteOption[];
  reasoning_summary: string;
}

export interface DistressSignal {
  is_distressed: boolean;
  distress_level: "NONE" | "MILD" | "ELEVATED" | "IMMINENT_DANGER";
  distress_score: number;
  detected_intent: string;
  trigger_cues: string[];
  guardian_handoff_required: boolean;
  recommended_action: string;
}

export interface ChatMessage {
  message_id: string;
  session_token: string;
  sender: "USER" | "THERAPY_AGENT" | "GUARDIAN_ORCHESTRATOR" | "SYSTEM";
  text: string;
  distress_analysis: DistressSignal;
  guardian_handoff?: any;
  timestamp: string;
}

export interface LegalCitation {
  document_name: string;
  section?: string;
  page?: number;
  chunk_id: string;
  source: string;
  snippet: string;
  relevance_score: number;
}

export interface LegalQueryResponse {
  query: string;
  is_knowledge_base_loaded: boolean;
  status_message: string;
  answer: string;
  citations: LegalCitation[];
  applicable_sections: string[];
  recommended_next_steps: string[];
}

export interface CandidateMatch {
  offender_id: string;
  offender_code: string;
  fictional_name: string;
  aliases?: string;
  similarity_score: number;
  is_above_threshold: boolean;
  risk_tier: string;
  registered_zone: string;
  matched_traits: string[];
  match_rationale: string;
  conviction_summary?: string;
}

export interface AuthorityDashboardSummary {
  total_active_cases: number;
  total_flagged_clusters: number;
  pending_verification_count: number;
  verified_serial_patterns: number;
  privacy_redaction_rate_percent: number;
  correlated_patterns: {
    anonymized_case_id: string;
    incident_pattern: string;
    area_cluster: string;
    candidate_offender_code?: string;
    similarity_score?: number;
    corroboration_count: number;
    verification_status: string;
    risk_tier: string;
    trend: string;
    last_event_timestamp: string;
  }[];
  offender_patterns: {
    offender_code: string;
    fictional_name: string;
    aliases?: string;
    risk_tier: string;
    registered_zone: string;
    incident_cluster_count: number;
    matched_cases_count: number;
    verification_status: string;
    modus_operandi_summary: string;
    last_known_lat: number;
    last_known_lng: number;
  }[];
  active_risk_zones_count: number;
}

export interface SanitizedAuthorityCase {
  anonymized_case_id: string;
  title: string;
  status: string;
  severity: string;
  verification_status: string;
  corroboration_count: number;
  corroboration_threshold: number;
  extracted_pattern?: any;
  privacy_panel: {
    victim_name_status: string;
    victim_phone_status: string;
    victim_email_status: string;
    victim_identity_access: string;
    privacy_guardian_certified: boolean;
    tokenized_subject_ref: string;
  };
  sanitized_incidents: {
    incident_id: string;
    timestamp: string;
    approximate_latitude: number;
    approximate_longitude: number;
    area_name: string;
    category: string;
    severity: string;
    sanitized_narrative: string;
    perpetrator_pattern_descriptors?: string;
    lighting_condition: string;
    crowd_density: string;
  }[];
  candidates: {
    candidate_id: string;
    offender_id: string;
    fictional_alias_or_code: string;
    similarity_score: number;
    matched_attributes?: any;
    risk_tier: string;
    status: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface AgentActivityEvent {
  event_id: string;
  timestamp: string;
  agent_name: string;
  signal_type: string;
  action: string;
  tool_invoked?: string;
  input_summary: string;
  output_summary: string;
  severity: string;
  handoff_to?: string;
}
