"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Compass,
  MessageSquareHeart,
  Scale,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Search,
} from "lucide-react";

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<"pillars" | "graph" | "privacy">("pillars");
  const [dependenciesHealth, setDependenciesHealth] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health/dependencies")
      .then((res) => res.json())
      .then((data) => setDependenciesHealth(data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Architecture & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Kavach Works
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          An end-to-end multi-agent AI architecture engineered across three operational pillars, coordinated by a central LangGraph state graph.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-slate-800">
        <div className="flex space-x-2 pb-px">
          <button
            onClick={() => setActiveTab("pillars")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === "pillars"
                ? "border-blue-500 text-blue-400 bg-blue-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>The 3 Pillars & 11 Agents</span>
          </button>
          <button
            onClick={() => setActiveTab("graph")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === "graph"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>LangGraph State Orchestration</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === "privacy"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Guardian Subsystem</span>
          </button>
        </div>
      </div>

      {/* Tab 1: The 3 Pillars */}
      {activeTab === "pillars" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PREVENT */}
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">1. PREVENT</h3>
                  <span className="text-[11px] text-cyan-400 font-medium">Environmental Awareness</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Identifies nearby risk before harm occurs via GPS telemetry, dynamic heatmap scoring, and Dijkstra safe routing.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-cyan-300 block">Proximity Risk Agent</strong>
                  <span className="text-slate-400 text-[11px]">Real-time Haversine distance tracking to unlit/flagged areas.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-cyan-300 block">Safety Heatmap Agent</strong>
                  <span className="text-slate-400 text-[11px]">0–100 spatial danger scoring based on lighting and patrols.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-cyan-300 block">Safe-Route Agent</strong>
                  <span className="text-slate-400 text-[11px]">Risk-weighted path optimization avoiding high-danger cells.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-cyan-300 block">Mode/Consent Agent</strong>
                  <span className="text-slate-400 text-[11px]">Recommends tracking transition upon danger entry.</span>
                </div>
              </div>
            </div>

            {/* RESPOND */}
            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">2. RESPOND</h3>
                  <span className="text-[11px] text-rose-400 font-medium">Trauma Care & Redress</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides calming, trauma-informed support, automatic crisis handoffs, and statutory BNS legal guidance.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-rose-300 block">Therapy Agent</strong>
                  <span className="text-slate-400 text-[11px]">Confidential dialogue with distress detection and Guardian handoff.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-rose-300 block">Legal RAG Agent</strong>
                  <span className="text-slate-400 text-[11px]">ChromaDB search across Bharatiya Nyaya Sanhita (BNS) statutes.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-rose-300 block">Evidence Compiler</strong>
                  <span className="text-slate-400 text-[11px]">Aggregates chronological milestones and exportable dossiers.</span>
                </div>
              </div>
            </div>

            {/* PROSECUTE */}
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">3. PROSECUTE</h3>
                  <span className="text-[11px] text-indigo-400 font-medium">Privacy-First Intelligence</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Matches recurring behavioral patterns and verifies suspects while cryptographically isolating citizen identity.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-indigo-300 block">Culprit Matching Module</strong>
                  <span className="text-slate-400 text-[11px]">Vector cosine + trait similarity matching over offender database.</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-indigo-300 block">Verification Agent</strong>
                  <span className="text-slate-400 text-[11px]">Enforces Registry Match (Path A) and N≥3 Corroboration (Path B).</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <strong className="text-indigo-300 block">Privacy-Guardian Agent</strong>
                  <span className="text-slate-400 text-[11px]">HMAC-SHA256 tokenization and regex scrubbing of victim PII.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: LangGraph */}
      {activeTab === "graph" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Central LangGraph StateGraph Architecture</h3>
              <p className="text-xs text-slate-400">Deterministic state transitions, checkpointing, and tool routing.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              KavachGraphState
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
            <div className="text-cyan-400">{"// LangGraph Orchestration Pipeline"}</div>
            <div>
              <span className="text-purple-400">1. Ingress Signal</span> →{" "}
              <span className="text-blue-300">GuardianOrchestrator.triage()</span>
            </div>
            <div>
              <span className="text-purple-400">2. Context Classification</span> →{" "}
              <span className="text-emerald-400">Gemini 2.5 Flash</span> / <span className="text-amber-400">Fallback Engine</span>
            </div>
            <div>
              <span className="text-purple-400">3. Conditional Branching</span> →{" "}
              <span className="text-slate-200">Routes to Proximity, Therapy, Legal, or Verification agents</span>
            </div>
            <div>
              <span className="text-purple-400">4. Tool Execution</span> →{" "}
              <span className="text-cyan-300">Haversine Radar, Dijkstra Router, ChromaDB Search</span>
            </div>
            <div>
              <span className="text-purple-400">5. Privacy Serialization</span> →{" "}
              <span className="text-indigo-400">PrivacyGuardian sanitization before Authority boundary</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy */}
      {activeTab === "privacy" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-100">The Strict Privacy Invariant</h3>
            <p className="text-xs text-slate-400">Authority endpoints never receive raw citizen identity details.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider block">Raw Citizen Input</span>
              <p className="text-slate-300">"My name is Priya Sharma, phone 9876543210. A man followed me near Infocity..."</p>
              <div className="text-slate-500 pt-2 border-t border-slate-800">Contains PII: Name, phone, email, private location.</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block">Authority Dashboard View</span>
              <p className="text-slate-300">"[CITIZEN_REDACTED] (Token: TOK_USR_8f7b2c91a0) reported suspicious loitering near Infocity..."</p>
              <div className="text-emerald-400/80 pt-2 border-t border-slate-800">Protected: Only behavioral patterns and timestamps visible.</div>
            </div>
          </div>
        </div>
      )}

      {/* Real Infrastructure Status */}
      {dependenciesHealth && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 font-medium">SQLite Database: {dependenciesHealth.sqlite?.status}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 font-medium">ChromaDB Vectors: {dependenciesHealth.chromadb?.offender_profiles_indexed} Offenders • {dependenciesHealth.chromadb?.legal_chunks_indexed} Legal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 font-medium">AI Engine: {dependenciesHealth.gemini_ai?.mode}</span>
          </div>
        </div>
      )}
    </div>
  );
}
