"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Compass,
  Flame,
  Route,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  MessageSquareHeart,
  Scale,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
} from "lucide-react";

export interface TimelineItem {
  event_id: string;
  timestamp: string;
  agent_name: string;
  action: string;
  tool_invoked?: string;
  input_summary?: string;
  output_summary: string;
  severity?: string;
  handoff_to?: string;
}

interface Props {
  events: TimelineItem[];
  activeAgent?: string;
}

const AGENT_DISPLAY_NAMES: Record<string, string> = {
  GuardianOrchestrator: "Guardian Orchestrator",
  ProximityRiskAgent: "Proximity Risk Agent",
  SafetyHeatmapAgent: "Safety Heatmap Agent",
  SafeRouteAgent: "Safe-Route Agent",
  ModeSelectionConsentAgent: "Consent & Mode Agent",
  CulpritMatchingModule: "Pattern Matching Agent",
  VerificationAgent: "Verification Agent",
  PrivacyGuardianAgent: "Privacy-Guardian Agent",
  LegalAgent: "Legal Agent (BNS)",
  TherapyAgent: "Support Dialogue Agent",
  EvidenceCompilerAgent: "Evidence Compiler",
};

const AGENT_ICONS: Record<string, any> = {
  GuardianOrchestrator: ShieldAlert,
  ProximityRiskAgent: Compass,
  SafetyHeatmapAgent: Flame,
  SafeRouteAgent: Route,
  ModeSelectionConsentAgent: Lock,
  CulpritMatchingModule: Search,
  VerificationAgent: CheckCircle2,
  PrivacyGuardianAgent: Lock,
  LegalAgent: Scale,
  TherapyAgent: MessageSquareHeart,
  EvidenceCompilerAgent: FileText,
};

export default function AgentReasoningTimeline({ events }: Props) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [showAllTechnical, setShowAllTechnical] = useState(false);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-2xl border border-[#cfdad3] bg-[#fffdf8] p-4 flex flex-col h-full shadow-[0_8px_24px_rgba(23,51,47,0.06)]">
      {/* Header: Consumer Intelligence Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e6ece8] mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#e5f5ed] border border-[#b8d8cc] flex items-center justify-center text-[#006d62]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[.08em] text-[#17332f]">
              Safety Intelligence
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eef1eb] text-[#65736f] border border-[#dbe2dc]">
            {events.length} insight{events.length === 1 ? "" : "s"}
          </span>
          <button
            onClick={() => setShowAllTechnical(!showAllTechnical)}
            className="text-[11px] font-bold text-[#006d62] hover:text-[#075c54] flex items-center gap-1 transition-colors"
          >
            <span>{showAllTechnical ? "Hide technical" : "View reasoning →"}</span>
          </button>
        </div>
      </div>

      {/* Insight Feed */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[480px]">
        {events.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#65736f]">
            <Sparkles className="w-7 h-7 mx-auto mb-2 opacity-30 text-[#006d62]" />
            Standing by. Live safety intelligence will appear as you travel.
          </div>
        ) : (
          events.map((ev, idx) => {
            const displayName = AGENT_DISPLAY_NAMES[ev.agent_name] || ev.agent_name;
            const Icon = AGENT_ICONS[ev.agent_name] || Cpu;
            const isCritical = ev.severity === "CRITICAL";
            const isMedium = ev.severity === "MEDIUM" || ev.severity === "HIGH";
            const isExpanded = showAllTechnical || Boolean(expandedItems[ev.event_id || String(idx)]);

            const timeStr = ev.timestamp
              ? new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Just now";

            return (
              <div
                key={ev.event_id || idx}
                className={`rounded-xl p-3 border transition-all ${
                  isCritical
                    ? "bg-[#fef2f0] border-[#e5a9a0] shadow-sm"
                    : isMedium
                    ? "bg-[#fff9ed] border-[#fae5b0]"
                    : "bg-[#fffdf8] border-[#e6ece8] hover:border-[#cfdad3]"
                }`}
              >
                {/* Header: Human-Readable Insight Title & Time */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">
                      {isCritical ? "🔴" : isMedium ? "🟠" : "🟢"}
                    </span>
                    <span className="text-xs font-black text-[#17332f] leading-snug">
                      {ev.action}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#65736f] shrink-0">
                    {timeStr}
                  </span>
                </div>

                {/* Plain-Language Intelligence Summary */}
                <div className="text-xs text-[#52635c] mt-0.5 leading-relaxed">
                  {ev.output_summary}
                </div>

                {/* Micro Toggle for Deep Agent Reasoning */}
                <div className="mt-2 pt-2 border-t border-[#e6ece8]/80 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => toggleItem(ev.event_id || String(idx))}
                    className="inline-flex items-center gap-1 font-bold text-[#006d62] hover:text-[#075c54]"
                  >
                    <span>{isExpanded ? "Hide agent reasoning" : "Agent reasoning →"}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <span className="text-[#8e9c96] font-medium">
                    {displayName}
                  </span>
                </div>

                {/* Deep Hackathon Architecture Drawer (Revealed on click) */}
                {isExpanded && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#f4f7f4] border border-[#d6e2db] space-y-1.5 text-[10px] font-mono text-[#285048] animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[#65736f]">Active Agent:</span>
                      <strong className="text-[#006d62]">{displayName}</strong>
                    </div>

                    {ev.tool_invoked && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#65736f]">Tool Dispatched:</span>
                        <code className="px-1.5 py-0.5 rounded bg-[#fffdf8] border border-[#cfdad3] text-[#17332f]">
                          {ev.tool_invoked}
                        </code>
                      </div>
                    )}

                    {ev.handoff_to && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#d6e2db]">
                        <span className="text-[#c0392b] font-bold">Autonomous Handoff:</span>
                        <span className="text-[#c0392b] font-bold">
                          ➔ {AGENT_DISPLAY_NAMES[ev.handoff_to] || ev.handoff_to}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
