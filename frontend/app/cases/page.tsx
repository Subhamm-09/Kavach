"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Lock,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { api } from "@/lib/api";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [dossier, setDossier] = useState<any | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState(false);

  useEffect(() => {
    api.getCases()
      .then((data) => {
        if (data && data.length > 0) {
          setCases(data);
          loadDossier(data[0].id);
        }
      })
      .catch((err) => console.error("Failed to load cases:", err));
  }, []);

  const loadDossier = async (caseId: string) => {
    setIsLoadingDossier(true);
    try {
      const res = await api.getCaseDossier(caseId);
      setDossier(res);
      const matchedCase = cases.find((c) => c.id === caseId);
      setSelectedCase(matchedCase || null);
    } catch (err) {
      console.error("Dossier load error:", err);
    } finally {
      setIsLoadingDossier(false);
    }
  };

  const handleDownloadHtml = () => {
    if (!dossier?.exportable_html) return;
    const blob = new Blob([dossier.exportable_html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kavach-dossier-${dossier.anonymized_case_id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatHumanStatus = (status: string) => {
    switch (status) {
      case "UNDER_INVESTIGATION":
        return { label: "Investigation Active", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "VERIFIED":
        return { label: "Pattern Verified", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "REPORTED":
        return { label: "Report Submitted", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      default:
        return { label: "Under Review", color: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>My Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            My Cases & Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track the status of your recorded incidents and review compiled digital dossiers.
          </p>
        </div>

        <Link
          href="/report"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow-md transition-colors self-start sm:self-auto"
        >
          <span>Record New Incident</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {cases.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-200">No reports submitted yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When you report a safety concern or record an incident, your chronological case files will appear here with encrypted identity tokens.
          </p>
          <Link
            href="/report"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
          >
            <span>File your first report</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Case List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
              Submitted Records ({cases.length})
            </h2>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {cases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const statusInfo = formatHumanStatus(c.status);

                return (
                  <div
                    key={c.id}
                    onClick={() => loadDossier(c.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-950/40 border-blue-500/50 shadow-md"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-200">{c.tracking_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h4 className="text-xs text-slate-300 font-medium line-clamp-2">
                      {c.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-800/60">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Recent update</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Dossier Detail View */}
          <div className="lg:col-span-2 space-y-4">
            {isLoadingDossier ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-400 space-y-2">
                <Clock className="w-6 h-6 mx-auto text-blue-400 animate-spin" />
                <p>Loading digital dossier...</p>
              </div>
            ) : dossier ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-base font-bold text-slate-100">
                        {dossier.case_tracking_number}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                        Protected ID: {dossier.anonymized_case_id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Digital Evidence Dossier compiled by Evidence Compiler Agent
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadHtml}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download Dossier (.HTML)</span>
                  </button>
                </div>

                {/* Plain-Language Case Overview */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Case Summary
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {dossier.title}
                  </div>
                </div>

                {/* Privacy Guarantee Panel */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-start space-x-3 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-emerald-300 block">Privacy Guarantee Active</strong>
                    <p className="text-slate-400 leading-relaxed">
                      Your name and phone number have been tokenized as <code className="text-cyan-300 font-mono">TOK_USR_...</code>. Police authorities only see incident patterns and suspect traits.
                    </p>
                  </div>
                </div>

                {/* Chronological Milestones */}
                {dossier.chronological_milestones && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Timeline & Milestones
                    </h3>
                    <div className="space-y-2">
                      {dossier.chronological_milestones.map((ms: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3 text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-200 block">
                              {ms.title || ms.action || "Milestone Logged"}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {ms.description || ms.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
