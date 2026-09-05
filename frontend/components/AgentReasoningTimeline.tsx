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
  Cpu,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
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

export default function AgentReasoningTimeline({ events, activeAgent }: Props) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Agent Activity & Decisions
          </h3>
        </div>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center space-x-1"
        >
          <span>{showTechnicalDetails ? "Simple view" : "Technical tools"}</span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Timeline Event Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[460px]">
        {events.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            <Cpu className="w-7 h-7 mx-auto mb-2 opacity-30 text-slate-400" />
            Monitoring live system activity...
          </div>
        ) : (
          events.map((ev, idx) => {
            const displayName = AGENT_DISPLAY_NAMES[ev.agent_name] || ev.agent_name;
            const Icon = AGENT_ICONS[ev.agent_name] || Cpu;
            const isCritical = ev.severity === "CRITICAL";
            const timeStr = ev.timestamp
              ? new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
              : "Just now";

            return (
              <div
                key={ev.event_id || idx}
                className="relative pl-5 pb-1 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-800 last:before:hidden"
              >
                {/* Status Dot */}
                <div
                  className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                    isCritical
                      ? "border-red-500 bg-red-950/80 text-red-400"
                      : "border-indigo-500/40 bg-indigo-950/60 text-indigo-400"
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                <div
                  className={`rounded-xl p-3 border transition-colors ${
                    isCritical
                      ? "bg-red-950/20 border-red-500/30"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Title Bar */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{displayName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{timeStr}</span>
                  </div>

                  {/* Plain Language Action */}
                  <div className="text-xs text-slate-300 font-medium leading-snug">
                    {ev.action}
                  </div>

                  {/* Output Summary */}
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ev.output_summary}
                  </div>

                  {/* Technical Tool Tag if enabled */}
                  {showTechnicalDetails && ev.tool_invoked && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center space-x-2 text-[10px] font-mono text-cyan-400">
                      <span className="text-slate-500">Tool:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {ev.tool_invoked}
                      </span>
                    </div>
                  )}

                  {/* Handoff Indicator */}
                  {ev.handoff_to && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center space-x-1.5 text-[11px] font-semibold text-amber-400">
                      <span>Handoff to:</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px]">
                        {AGENT_DISPLAY_NAMES[ev.handoff_to] || ev.handoff_to}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
