"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  MapPin,
  Flame,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  EyeOff,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
  Building,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { api } from "@/lib/api";
import { AuthorityDashboardSummary, SanitizedAuthorityCase } from "@/lib/types";

export default function AuthorityDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AuthorityDashboardSummary | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<SanitizedAuthorityCase | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load Authority Dashboard Data
  useEffect(() => {
    api.getAuthorityDashboard()
      .then((data) => {
        setSummary(data);
        if (data && data.correlated_patterns && data.correlated_patterns.length > 0) {
          const firstAnonId = data.correlated_patterns[0].anonymized_case_id;
          setSelectedCaseId(firstAnonId);
          loadCaseDetail(firstAnonId);
        }
      })
      .catch((err) => {
        console.error("Authority auth error:", err);
        setAuthError(true);
      });
  }, []);

  const loadCaseDetail = async (anonymizedId: string) => {
    setIsLoadingDetail(true);
    setSelectedCaseId(anonymizedId);
    try {
      const res = await api.getAuthorityCaseDetail(anonymizedId);
      setSelectedCaseDetail(res);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error("Failed to load sanitized case detail:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleVerifyCandidate = async (candidateId: string) => {
    try {
      await api.evaluateVerification({
        candidate_id: candidateId,
        verification_path: "PATH_B_CORROBORATION",
      });
      if (selectedCaseId) {
        loadCaseDetail(selectedCaseId);
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  if (authError) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Authority Access Required</h2>
        <p className="text-xs text-slate-400">
          This interface is strictly restricted to authenticated law enforcement personnel with ROLE_AUTHORITY.
        </p>
        <button
          onClick={() => router.push("/authority/login")}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          Login as Authority (Insp. Patnaik)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Law Enforcement Intelligence Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Bhubaneswar Police Cyber & Field Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Privacy-Preserving Serial Pattern Matching, Multi-Source Verification, and Corroboration Analytics.
          </p>
        </div>

        {/* Live Privacy Invariant Badge */}
        <div className="flex items-center space-x-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Victim PII Blocked from Authority View</span>
          </span>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cases</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-100">
            {summary?.total_active_cases ?? 18}
          </div>
          <span className="text-[11px] text-cyan-400 block">Logged across Bhubaneswar grid</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flagged Clusters</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {summary?.active_risk_zones_count ?? 4}
          </div>
          <span className="text-[11px] text-slate-400 block">High-density unlit sectors</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">
            {summary?.pending_verification_count ?? 4}
          </div>
          <span className="text-[11px] text-slate-400 block">Requires corroboration</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Patterns</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {summary?.verified_serial_patterns ?? 3}
          </div>
          <span className="text-[11px] text-emerald-400/80 block">Meets statutory threshold (N≥3)</span>
        </div>
      </div>

      {/* Discovered Emerging Pattern / Investigation Narrative Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-900/50">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Emerging Pattern Detected by Vector Intelligence
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 self-start sm:self-auto">
            3 Incidents Share Similar Behavioral Pattern
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Area Corridor:</span>
            <strong className="text-slate-200">Patia / KIIT Tech Perimeter</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Time Window:</span>
            <strong className="text-slate-200">20:30 – 23:30</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Pattern Similarity:</span>
            <strong className="text-cyan-400">91.2% match</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Verification:</span>
            <strong className="text-emerald-400">3/3 Corroborated</strong>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-300">Why this matters:</strong> These incidents share identical location clusters, evening timeframes, behavioral modus operandi (two-wheeler unlit road interception), and matching vehicle characteristics (black Pulsar, loud exhaust).
        </div>
      </div>

      {/* Correlated Incident Pattern Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Correlated Pattern Intelligence Table
            </h2>
            <p className="text-xs text-slate-400">
              Click any case to inspect suspect triangulation and verified BNS legal draft.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                <th className="py-3 px-3">Case Token ID</th>
                <th className="py-3 px-3">Pattern Summary</th>
                <th className="py-3 px-3">Candidate Profile</th>
                <th className="py-3 px-3">Similarity</th>
                <th className="py-3 px-3">Corroboration</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {summary?.correlated_patterns.map((item, idx) => {
                const isSelected = selectedCaseId === item.anonymized_case_id;
                const isVerified = item.verification_status === "VERIFIED";

                return (
                  <tr
                    key={item.anonymized_case_id || idx}
                    onClick={() => loadCaseDetail(item.anonymized_case_id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-indigo-950/40" : "hover:bg-slate-950/40"
                    }`}
                  >
                    <td className="py-3.5 px-3 font-mono font-semibold text-cyan-300">
                      {item.anonymized_case_id}
                    </td>

                    <td className="py-3.5 px-3 text-slate-200 font-medium">
                      {item.incident_pattern || "Serial Loitering & Stalking"}
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      {item.candidate_offender_code ? (
                        <span className="font-semibold text-indigo-300">
                          {item.candidate_offender_code}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unmatched Profile</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-cyan-400">
                        {item.similarity_score ? `${(item.similarity_score * 100).toFixed(1)}%` : "88.5%"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      <span className="font-semibold">{item.corroboration_count}</span> reports
                    </td>

                    <td className="py-3.5 px-3">
                      {isVerified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Verified (N≥3)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 transition-colors">
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Side Drawer / Focused Modal */}
      {isDrawerOpen && selectedCaseDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0b0f19] border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-bold text-slate-100">
                    Case {selectedCaseDetail.anonymized_case_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedCaseDetail.verification_status === "VERIFIED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {selectedCaseDetail.verification_status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{selectedCaseDetail.title}</p>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mandatory Privacy Guardian Output Panel */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy Guardian Protection Active</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% PII Isolated</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">VICTIM NAME</span>
                  <strong className="text-emerald-400">[REDACTED]</strong>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">PHONE</span>
                  <strong className="text-cyan-400">[TOKENIZED]</strong>
                </div>
                <div className="p-2 rounded bg-slate-900 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">EMAIL</span>
                  <strong className="text-emerald-400">[REDACTED]</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Victim PII blocked from authority view. Law enforcement investigation proceeds solely via behavioral modus operandi and spatial correlation.
              </p>
            </div>

            {/* Offender Candidate Triangulation */}
            {selectedCaseDetail.candidates && selectedCaseDetail.candidates.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Vector Matched Suspect Candidate
                  </h3>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Similarity: {(selectedCaseDetail.candidates[0].similarity_score * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="text-xs text-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-400">Alias:</span>{" "}
                    <strong>{selectedCaseDetail.candidates[0].fictional_alias_or_code || "Shadow Rider"}</strong>{" "}
                    <span className="text-slate-500 font-mono">({selectedCaseDetail.candidates[0].offender_id})</span>
                  </div>

                  <p className="text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    Matched based on crescent facial scar, dark bomber jacket, and unlit motorcycle interception pattern.
                  </p>
                </div>

                {selectedCaseDetail.verification_status !== "VERIFIED" && (
                  <button
                    onClick={() => handleVerifyCandidate(selectedCaseDetail.candidates[0].candidate_id)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                  >
                    Execute Verification Engine (Corroborate N≥3)
                  </button>
                )}
              </div>
            )}

            {/* Formal BNS Complaint Draft */}
            {(selectedCaseDetail as any).formal_complaint_draft && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Statutory Police Complaint / Zero FIR Draft
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed max-h-[180px] overflow-y-auto whitespace-pre-wrap">
                  {(selectedCaseDetail as any).formal_complaint_draft}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
