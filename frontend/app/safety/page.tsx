"use client";

import React, { useState, useEffect, useRef } from "react";
import BhubaneswarMap from "@/components/BhubaneswarMap";
import AgentReasoningTimeline, { TimelineItem } from "@/components/AgentReasoningTimeline";
import DemoControlPanel from "@/components/DemoControlPanel";
import { HeatmapCell, RiskZone, RouteOption, GPSPingEvaluation } from "@/lib/types";
import { api } from "@/lib/api";
import {
  Compass,
  Flame,
  Route,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  MapPinned,
  X,
} from "lucide-react";

export interface DestinationOption {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area: string;
}

export const BHUBANESWAR_DESTINATIONS: DestinationOption[] = [
  { id: "dest-station", name: "Master Canteen / Central Station", lat: 20.2660, lng: 85.8410, area: "Station Area" },
  { id: "dest-kiit", name: "KIIT Square & Campus", lat: 20.3500, lng: 85.8195, area: "Patia / KIIT" },
  { id: "dest-infocity", name: "Infocity Software Park", lat: 20.3550, lng: 85.8180, area: "Infocity" },
  { id: "dest-damana", name: "Damana Square Commercial Junction", lat: 20.3350, lng: 85.8210, area: "Damana" },
  { id: "dest-cspur", name: "Chandrasekharpur Main Road", lat: 20.3240, lng: 85.8200, area: "C.S. Pur" },
  { id: "dest-nalco", name: "Nalco Square & Central Avenue", lat: 20.3150, lng: 85.8220, area: "Nalco Sq." },
  { id: "dest-jayadev", name: "Jayadev Vihar Junction", lat: 20.3050, lng: 85.8250, area: "Jayadev Vihar" },
  { id: "dest-acharya", name: "Acharya Vihar Science Park Loop", lat: 20.2980, lng: 85.8320, area: "Acharya Vihar" },
  { id: "dest-vani", name: "Vani Vihar University Highway Gate", lat: 20.2930, lng: 85.8400, area: "Vani Vihar" },
  { id: "dest-saheed", name: "Saheed Nagar Commercial Center", lat: 20.2880, lng: 85.8450, area: "Saheed Nagar" },
  { id: "dest-ram-mandir", name: "Ram Mandir Square & Janpath", lat: 20.2770, lng: 85.8420, area: "Janpath" },
  { id: "dest-khandagiri", name: "Khandagiri Caves & Main Square", lat: 20.2590, lng: 85.7830, area: "Khandagiri" },
  { id: "dest-ghatikia", name: "Ghatikia Residential Corridor", lat: 20.2700, lng: 85.7765, area: "Ghatikia" },
  { id: "dest-old-town", name: "Old Town Heritage Area", lat: 20.2450, lng: 85.8340, area: "Old Town" },
];

export default function SafetyPage() {
  const [userLocation, setUserLocation] = useState<[number, number]>([20.3580, 85.8195]);
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption>(BHUBANESWAR_DESTINATIONS[0]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [heatmapCells, setHeatmapCells] = useState<HeatmapCell[]>([]);
  const [recommendedRoute, setRecommendedRoute] = useState<RouteOption | null>(null);
  const [alternativeRoute, setAlternativeRoute] = useState<RouteOption | null>(null);

  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showSafeRoute, setShowSafeRoute] = useState(false);
  const [isComputingRoute, setIsComputingRoute] = useState(false);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeScenario] = useState("patia_hotspot");
  const [sessionId] = useState(() => "SESS-SIM-" + Math.random().toString(36).substring(7).toUpperCase());

  // Escalation & Decision Transparency State
  const [escalationData, setEscalationData] = useState<GPSPingEvaluation | null>(null);
  const [activeAgent, setActiveAgent] = useState<string>("ProximityRiskAgent");
  const [timelineEvents, setTimelineEvents] = useState<TimelineItem[]>([]);
  const [showDecisionExplanation, setShowDecisionExplanation] = useState(false);
  const [localityQuery, setLocalityQuery] = useState("");
  const [selectedLocalityId, setSelectedLocalityId] = useState<string | null>(null);
  const [localityMessage, setLocalityMessage] = useState("");

  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Load
  useEffect(() => {
    // 1. Fetch Heatmap
    api.getHeatmap()
      .then((data) => {
        if (data && data.cells) setHeatmapCells(data.cells);
      })
      .catch((err) => console.error("Failed to load heatmap:", err));

    // 2. Fetch Risk Zones
    api.getRiskZones()
      .then((data) => {
        if (data) setRiskZones(data);
      })
      .catch((err) => console.error("Failed to load danger zones:", err));

    // Initial timeline event
    setTimelineEvents([
      {
        event_id: "init-1",
        timestamp: new Date().toISOString(),
        agent_name: "SafetyHeatmapAgent",
        action: "Assessed local Bhubaneswar lighting & historical activity",
        tool_invoked: "HeatmapSurfaceEngine",
        output_summary: "Loaded 12 spatial grid cells across Bhubaneswar, including Ghatikia and Khandagiri.",
        severity: "INFO",
      },
      {
        event_id: "init-2",
        timestamp: new Date().toISOString(),
        agent_name: "ProximityRiskAgent",
        action: "Monitoring live distance to unlit/flagged sectors",
        tool_invoked: "GeospatialRadar",
        output_summary: "Radar active. Standing by for location updates.",
        severity: "LOW",
      },
    ]);
  }, []);

  // Compute Safe Routes
  const calculateRoute = async (destOverride?: DestinationOption) => {
    const dest = destOverride || selectedDestination;
    setIsComputingRoute(true);
    try {
      setShowSafeRoute(true);
      const res = await api.getSafeRoute({
        origin_lat: userLocation[0],
        origin_lng: userLocation[1],
        destination_lat: dest.lat,
        destination_lng: dest.lng,
      });

      if (res && res.recommended_route) {
        setRecommendedRoute(res.recommended_route);
        if (res.alternative_routes && res.alternative_routes.length > 0) {
          setAlternativeRoute(res.alternative_routes[0]);
        }

        setTimelineEvents((prev) => [
          {
            event_id: `route-${Date.now()}`,
            timestamp: new Date().toISOString(),
            agent_name: "SafeRouteAgent",
            action: `Generated safer route to ${dest.name}`,
            tool_invoked: "DijkstraSafetyGraphRouter",
            output_summary: res.reasoning_summary,
            severity: "INFO",
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Failed to compute safe route:", err);
    } finally {
      setIsComputingRoute(false);
    }
  };

  // Step Simulation Logic
  const executeSimulationStep = async (step: number) => {
    try {
      const stepRes = await api.stepSimulation(sessionId, step, activeScenario);
      if (stepRes && stepRes.evaluation) {
        const evalData: GPSPingEvaluation = stepRes.evaluation;
        setUserLocation([evalData.latitude, evalData.longitude]);
        setEscalationData(evalData);
        setActiveAgent(evalData.active_agent);

        const isEsc = evalData.escalation_triggered;
        const distToZone = evalData.nearest_zone_distance_meters != null ? `${evalData.nearest_zone_distance_meters}m` : "N/A";
        const lighting = evalData.lighting_rating != null ? `${evalData.lighting_rating}/5.0` : "4.0/5.0";
        const zoneName = evalData.nearest_zone_name || "Flagged Zone";

        let actionText = "";
        let toolName = "";
        let outputText = "";
        let severityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";

        if (isEsc) {
          severityLevel = "CRITICAL";
          if (evalData.nearest_offender_distance_meters != null && evalData.nearest_offender_distance_meters <= 80) {
            toolName = "HighRiskProximityAlarm";
            actionText = `Critical safety signal (Step ${step + 1}): Immediate action recommended`;
            outputText = evalData.handoff_details?.reason || "CRITICAL: Multiple high-risk proximity signals detected. Autonomous Guardian intervention activated.";
          } else {
            toolName = "GuardianEmergencyDispatcher";
            actionText = `Autonomous Escalation (Step ${step + 1}): Entered unlit hotspot core (${distToZone} to center)`;
            outputText = evalData.handoff_details?.reason || `User entered flagged hazard zone '${zoneName}' (Threat: CRITICAL, ${distToZone} from center). Recommending immediate reroute.`;
          }
        } else if (evalData.stage === "APPROACHING_PERIMETER" || (evalData.calculated_risk_score >= 35 && evalData.calculated_risk_score < 75)) {
          severityLevel = "MEDIUM";
          toolName = "HaversinePerimeterMonitor";
          actionText = `Proximity Warning (Step ${step + 1}): Approaching unlit perimeter of ${zoneName} (${distToZone})`;
          outputText = `Lighting dropping to ${lighting}. Nearest flagged corridor: ${distToZone} away. Monitoring trajectory using area-level safety signals.`;
        } else {
          severityLevel = "LOW";
          toolName = "ProximityRiskEvaluator";
          actionText = `Corridor Monitoring (Step ${step + 1}): Active transit along main road (${distToZone} from unlit sector)`;
          outputText = `Path safe and well-lit (${lighting}). Geo-fence active. Risk score: ${evalData.calculated_risk_score} (${evalData.risk_level}). No immediate hazard.`;
        }

        const newEvent: TimelineItem = {
          event_id: evalData.ping_id || `ping-${Date.now()}-${step}`,
          timestamp: new Date().toISOString(),
          agent_name: evalData.active_agent,
          action: actionText,
          tool_invoked: toolName,
          output_summary: outputText,
          severity: severityLevel,
          handoff_to: evalData.handoff_details?.target_agent,
        };

        setTimelineEvents((prev) => [newEvent, ...prev.slice(0, 15)]);

        if (stepRes.is_completed) {
          setIsSimulating(false);
          if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
        }
      }
    } catch (err) {
      console.error("Simulation step error:", err);
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    let step = currentStepIndex;

    simulationTimerRef.current = setInterval(() => {
      executeSimulationStep(step);
      step += 1;
      setCurrentStepIndex(step);
    }, 1400);
  };

  const pauseSimulation = () => {
    setIsSimulating(false);
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
  };

  const resetSimulation = () => {
    pauseSimulation();
    setCurrentStepIndex(0);
    setUserLocation([20.3580, 85.8195]);
    setEscalationData(null);
    setActiveAgent("ProximityRiskAgent");
  };

  // Derive human status
  const currentRiskScore = escalationData?.calculated_risk_score ?? 28;
  const isElevatedRisk = Boolean(escalationData?.escalation_triggered);
  const localityMatches = heatmapCells.filter((cell) =>
    cell.area_name.toLowerCase().includes(localityQuery.trim().toLowerCase())
  );
  const selectedLocality = heatmapCells.find((cell) => cell.cell_id === selectedLocalityId) || null;

  const selectLocality = (cell: HeatmapCell) => {
    setSelectedLocalityId(cell.cell_id);
    setLocalityQuery(cell.area_name);
    setLocalityMessage("");
    setUserLocation([cell.center_lat, cell.center_lng]);
    setShowHeatmap(true);
    setRecommendedRoute(null);
    setAlternativeRoute(null);
    setShowSafeRoute(false);
    setTimelineEvents((prev) => [
      {
        event_id: `locality-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agent_name: "SafetyHeatmapAgent",
        action: `Opened aggregated safety view for ${cell.area_name}`,
        tool_invoked: "AreaRiskSurface",
        output_summary: `Area-level signal: ${cell.risk_level.toLowerCase()} risk (${cell.risk_score}/100), based on environmental and historical incident patterns.`,
        severity: cell.risk_score > 65 ? "HIGH" : cell.risk_score > 35 ? "MEDIUM" : "LOW",
      },
      ...prev.slice(0, 15),
    ]);
  };

  const handleLocalitySearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!localityQuery.trim()) return;
    if (localityMatches.length) {
      selectLocality(localityMatches[0]);
    } else {
      setSelectedLocalityId(null);
      setLocalityMessage("That locality is not in the current Bhubaneswar safety grid. Try one of the area suggestions below.");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full border border-[#b8d8cc] bg-[#e5f5ed] text-[#006d62] text-[11px] font-extrabold uppercase tracking-[.1em] mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Surroundings &amp; Live Risk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-.055em] text-[#17332f]">
            Safety Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#65736f]">
            Bhubaneswar • Real-time environmental risk awareness and well-lit corridor routing.
          </p>
        </div>

        {/* Map Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded-full text-xs font-bold border flex items-center space-x-1.5 transition-all ${
              showHeatmap
                ? "bg-[#fff0e8] text-[#b04a32] border-[#e9c8b9]"
                : "bg-[#fffdf8] text-[#65736f] border-[#dbe2dc] hover:text-[#17332f] hover:border-[#cfdad3]"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Risk overlay ({heatmapCells.length} areas)</span>
          </button>

          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`px-3 py-2 rounded-full text-xs font-bold border flex items-center space-x-1.5 transition-all ${
              showRiskZones
                ? "bg-[#fce9ed] text-[#a53f59] border-[#e8bfc8]"
                : "bg-[#fffdf8] text-[#65736f] border-[#dbe2dc] hover:text-[#17332f] hover:border-[#cfdad3]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Flagged areas ({riskZones.length} zones)</span>
          </button>

          {/* Destination Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#fffdf8] border border-[#cfdad3] rounded-full px-3 py-1.5 shadow-[0_2px_8px_rgba(23,51,47,0.06)] text-xs font-bold text-[#17332f]">
            <MapPinned className="w-3.5 h-3.5 text-[#006d62] shrink-0" />
            <span className="text-[#65736f] text-[11px] font-semibold">To:</span>
            <select
              value={selectedDestination.id}
              onChange={(e) => {
                const found = BHUBANESWAR_DESTINATIONS.find((d) => d.id === e.target.value);
                if (found) {
                  setSelectedDestination(found);
                  if (showSafeRoute) {
                    calculateRoute(found);
                  }
                }
              }}
              className="bg-transparent border-none text-xs font-bold text-[#17332f] focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[210px] truncate"
            >
              {BHUBANESWAR_DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => calculateRoute()}
            disabled={isComputingRoute}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#006d62] hover:bg-[#075c54] text-white shadow-[0_6px_16px_rgba(0,109,98,.18)] flex items-center space-x-1.5 transition-all"
          >
            <Route className="w-3.5 h-3.5" />
            <span>{isComputingRoute ? "Computing..." : "Find safer route"}</span>
          </button>
        </div>
      </div>

      {/* Privacy-preserving locality search */}
      <section className="rounded-2xl border border-[#d3e2db] bg-[#eef6f1] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#006d62]">
              <MapPinned className="h-4 w-4" />
              <span className="text-[11px] font-extrabold uppercase tracking-[.13em]">Explore a locality</span>
            </div>
            <h2 className="mt-1 text-lg font-extrabold tracking-[-.04em] text-[#17332f]">Understand an area, not a person.</h2>
            <p className="mt-1 text-xs leading-5 text-[#52635c]">Search the live safety grid for area-level conditions, lighting, and historical incident patterns. Kavach never publishes names, addresses, or person-level locations.</p>
          </div>
          <form onSubmit={handleLocalitySearch} className="flex w-full gap-2 lg:max-w-md">
            <label className="sr-only" htmlFor="locality-search">Search a locality</label>
            <input id="locality-search" value={localityQuery} onChange={(e) => { setLocalityQuery(e.target.value); setLocalityMessage(""); }} placeholder="Search Patia, KIIT, Saheed Nagar…" className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-xs" />
            <button type="submit" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#006d62] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#075c54]"><Search className="h-3.5 w-3.5" />Search</button>
          </form>
        </div>
        {localityMessage && <p role="status" className="mt-3 rounded-xl border border-[#e9c8b9] bg-[#fff8f3] px-3 py-2 text-xs text-[#8c4a38]">{localityMessage}</p>}
        {localityQuery.trim() && !selectedLocality && localityMatches.length > 0 && <div className="mt-3 flex flex-wrap gap-2"><span className="self-center text-[11px] font-bold text-[#65736f]">Matching areas:</span>{localityMatches.slice(0, 5).map((cell) => <button type="button" key={cell.cell_id} onClick={() => selectLocality(cell)} className="rounded-full border border-[#c6ddd3] bg-[#fffdf8] px-3 py-1.5 text-xs font-bold text-[#397066] transition hover:border-[#006d62] hover:text-[#006d62]">{cell.area_name}</button>)}</div>}
        {selectedLocality && <div className="mt-4 grid gap-3 rounded-2xl border border-[#cde0d7] bg-[#fffdf8] p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-extrabold text-[#17332f]">{selectedLocality.area_name}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${selectedLocality.risk_score > 65 ? "bg-[#fff0ea] text-[#b04a32]" : selectedLocality.risk_score > 35 ? "bg-[#fff6dd] text-[#936915]" : "bg-[#e5f5ed] text-[#167a5b]"}`}>{selectedLocality.risk_level} area signal</span></div><p className="mt-1 text-xs text-[#65736f]">Risk index: <strong className="text-[#17332f]">{selectedLocality.risk_score}/100</strong> · {selectedLocality.incident_count} aggregated incident signal{selectedLocality.incident_count === 1 ? "" : "s"} in the current model.</p></div><div className="flex items-center gap-2"><button onClick={calculateRoute} className="rounded-xl bg-[#17332f] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#285048]">Route from here</button><button onClick={() => { setSelectedLocalityId(null); setLocalityQuery(""); }} className="grid h-8 w-8 place-items-center rounded-xl border border-[#dbe2dc] text-[#65736f] hover:text-[#17332f]" aria-label="Clear locality search"><X className="h-4 w-4" /></button></div></div>}
      </section>

      {/* Escalation Alert Banner */}
      {isElevatedRisk ? (
        <div className="p-4 sm:p-5 rounded-2xl border border-[#e5a9a0] bg-[#fef2f0] shadow-[0_12px_28px_rgba(192,57,43,0.10)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fce4e1] border border-[#e5a9a0] flex items-center justify-center text-[#c0392b] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold text-[#c0392b]">
                  Kavach detected elevated risk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#fce4e1] text-[#c0392b] border border-[#e5a9a0]">
                  Flagged Zone Nearby
                </span>
              </div>
              <p className="text-xs text-[#52635c]">
                You are approaching <strong className="text-[#17332f]">{escalationData?.nearest_zone_name}</strong> (~{escalationData?.nearest_zone_distance_meters}m away). Lighting is poor in this sector.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={calculateRoute}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full text-xs font-bold bg-[#006d62] hover:bg-[#075c54] text-white flex items-center justify-center space-x-1.5 shadow-[0_6px_16px_rgba(0,109,98,.18)] transition-all"
            >
              <span>View safer route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 px-4 rounded-2xl border border-[#c6e0d4] bg-[#edf7f2] flex items-center justify-between text-xs text-[#397066]">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#1c9b73]"></span>
            <span className="font-bold">You are in a lower-risk corridor • Kavach is watching your surroundings</span>
          </div>
          <span className="hidden sm:inline text-[#72827b] font-mono text-[11px]">
            {selectedLocality?.area_name || "Patia"} • Grid Active
          </span>
        </div>
      )}

      {/* Main Grid: Map & Activity Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-[540px] w-full rounded-2xl overflow-hidden border border-[#cfdad3] shadow-[0_12px_32px_rgba(23,51,47,0.10)]">
            <BhubaneswarMap
              userLocation={userLocation}
              riskZones={riskZones}
              heatmapCells={heatmapCells}
              recommendedRoute={showSafeRoute ? recommendedRoute : null}
              alternativeRoute={showSafeRoute ? alternativeRoute : null}
              destinationLocation={showSafeRoute ? [selectedDestination.lat, selectedDestination.lng] : null}
              destinationName={selectedDestination.name}
              showHeatmap={showHeatmap}
              showRiskZones={showRiskZones}
              isEscalated={isElevatedRisk}
            />

            {/* Floating Risk Score Badge on Map */}
            <div className="absolute top-4 right-4 z-[400] backdrop-blur-md rounded-2xl p-2.5 px-3.5 text-xs" style={{ background: "rgba(255,253,248,0.95)", border: "1px solid #cfdad3", boxShadow: "0 8px 20px rgba(23,51,47,0.10)" }}>
              <span className="text-[10px] uppercase font-extrabold tracking-[.1em] text-[#65736f] block mb-0.5">
                Nearby Risk
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className="text-base font-extrabold"
                  style={{ color: currentRiskScore > 65 ? "#c0392b" : currentRiskScore > 35 ? "#e67e22" : "#27ae60" }}
                >
                  {currentRiskScore > 65 ? "High" : currentRiskScore > 35 ? "Moderate" : "Low"}
                </span>
                <span className="text-[#65736f] font-mono text-xs">
                  ({currentRiskScore} / 100)
                </span>
              </div>
            </div>
          </div>

          {/* Safer Route Decision Card */}
          {recommendedRoute && showSafeRoute && (
            <div className="p-4 rounded-2xl border border-[#b8d8cc] bg-[#edf7f2] space-y-2 shadow-[0_8px_20px_rgba(0,109,98,0.08)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#006d62] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1c9b73] shrink-0" />
                  <span>Safer Route: {recommendedRoute.name}</span>
                </span>
                <span className="text-xs font-mono text-[#65736f]">
                  {recommendedRoute.total_distance_km} km • ~{recommendedRoute.estimated_time_mins} mins
                </span>
              </div>
              <div className="text-[11px] font-bold text-[#17332f] flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[#65736f]">Heading to:</span>
                <span className="rounded-full bg-[#d8eee5] px-2.5 py-0.5 text-[#006d62] border border-[#b8d8cc]">
                  🎯 {selectedDestination.name}
                </span>
              </div>
              <p className="text-xs text-[#52635c] leading-relaxed">
                {recommendedRoute.factual_explanation}
              </p>
              {recommendedRoute.avoided_zones.length > 0 && (
                <div className="text-xs text-[#65736f] flex items-center space-x-1.5 pt-1">
                  <span>Bypassed unlit areas:</span>
                  <span className="text-[#b04a32] font-bold">
                    {recommendedRoute.avoided_zones.join(", ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Secondary Transparency Accordion */}
          <div className="rounded-2xl border border-[#dbe2dc] bg-[#fffdf8] overflow-hidden">
            <button
              onClick={() => setShowDecisionExplanation(!showDecisionExplanation)}
              className="w-full p-3.5 px-4 flex items-center justify-between text-xs font-bold text-[#397066] hover:text-[#17332f] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-[#006d62]" />
                <span>How Kavach decided this</span>
              </div>
              {showDecisionExplanation ? (
                <ChevronUp className="w-4 h-4 text-[#65736f]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#65736f]" />
              )}
            </button>

            {showDecisionExplanation && (
              <div className="p-4 pt-0 border-t border-[#dbe2dc] text-xs text-[#52635c] space-y-2.5">
                <div className="flex items-start space-x-2">
                  <strong className="text-[#006d62] min-w-[130px]">1. Proximity Risk</strong>
                  <span>Calculated proximity to flagged, area-level safety zones using environmental and historical incident signals.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <strong className="text-[#b04a32] min-w-[130px]">2. Guardian Handoff</strong>
                  <span>Triggered an escalation recommendation because the nearest flagged sector distance dropped below 80m.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <strong className="text-[#1c9b73] min-w-[130px]">3. Safe-Route Agent</strong>
                  <span>Solved Dijkstra path optimization favoring well-lit main boulevards over secluded shortcuts.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Demo Controller & Decision Timeline */}
        <div className="space-y-4 flex flex-col justify-between">
          <DemoControlPanel
            isSimulating={isSimulating}
            onStartSimulation={startSimulation}
            onPauseSimulation={pauseSimulation}
            onResetSimulation={resetSimulation}
          />

          <div className="flex-1">
            <AgentReasoningTimeline
              events={timelineEvents}
              activeAgent={activeAgent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
