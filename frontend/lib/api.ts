/**
 * Kavach Unified API Client
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  
  // Retrieve token if stored in localStorage (for client-side calls)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("kavach_auth_token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorDetail = "API Request Failed";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text() || res.statusText;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

// API Methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchJson<{ access_token: string; role: string; full_name: string; user_id: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  // Geospatial & Heatmap
  getHeatmap: () => fetchJson<any>("/api/heatmap/bhubaneswar"),
  getRiskZones: () => fetchJson<any[]>("/api/heatmap/zones"),
  getSafeRoute: (req: { origin_lat: number; origin_lng: number; destination_lat: number; destination_lng: number }) =>
    fetchJson<any>("/api/routes/safe-route", { method: "POST", body: JSON.stringify(req) }),

  // GPS Simulation
  getWaypoints: (scenario: string = "patia_hotspot") =>
    fetchJson<any>(`/api/gps/simulation/waypoints?scenario=${scenario}`),
  sendGpsPing: (ping: { session_id: string; latitude: number; longitude: number; speed?: number }) =>
    fetchJson<any>("/api/gps/ping", { method: "POST", body: JSON.stringify(ping) }),
  stepSimulation: (session_id: string, step_index: number, scenario: string = "patia_hotspot") =>
    fetchJson<any>(`/api/gps/simulation/step?session_id=${session_id}&step_index=${step_index}&scenario=${scenario}`, { method: "POST" }),

  // Therapy Agent
  sendTherapyMessage: (session_token: string, text: string, lat?: number, lng?: number) =>
    fetchJson<any>("/api/therapy/chat", {
      method: "POST",
      body: JSON.stringify({ session_token, text, user_latitude: lat, user_longitude: lng }),
    }),

  // Legal Agent
  queryLegal: (query: string, incident_context?: string) =>
    fetchJson<any>("/api/legal/query", { method: "POST", body: JSON.stringify({ query, incident_context }) }),
  draftComplaint: (req: any) =>
    fetchJson<any>("/api/legal/draft-complaint", { method: "POST", body: JSON.stringify(req) }),
  getLegalAidContacts: () => fetchJson<any[]>("/api/legal/aid-contacts"),

  // Culprit Matching & Verification
  matchCulprit: (perpetrator_description: string) =>
    fetchJson<any>("/api/matching/culprit-search", {
      method: "POST",
      body: JSON.stringify({ perpetrator_description }),
    }),
  evaluateVerification: (req: any) =>
    fetchJson<any>("/api/verification/evaluate", { method: "POST", body: JSON.stringify(req) }),

  // Incidents & Cases
  reportIncident: (payload: any) =>
    fetchJson<any>("/api/incidents/report", { method: "POST", body: JSON.stringify(payload) }),
  getRecentIncidents: () => fetchJson<any[]>("/api/incidents/recent"),
  getCases: () => fetchJson<any[]>("/api/cases"),
  getCaseDossier: (case_id: string) => fetchJson<any>(`/api/evidence/dossier/${case_id}`),

  // Authority Dashboard
  getAuthorityDashboard: () => fetchJson<any>("/api/authority/dashboard"),
  getAuthorityCaseDetail: (anonymized_id: string) => fetchJson<any>(`/api/authority/cases/${anonymized_id}`),

  // Agent Observability & LangGraph
  runAgentPipeline: (signal_type: string, payload: any) =>
    fetchJson<any>("/api/agents/pipeline/run", {
      method: "POST",
      body: JSON.stringify({ signal_type, payload }),
    }),
  getAgentTimeline: () => fetchJson<any[]>("/api/agents/timeline"),
};
