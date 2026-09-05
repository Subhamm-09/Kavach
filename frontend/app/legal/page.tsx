"use client";

import React, { useState } from "react";
import {
  Scale,
  Search,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  Phone,
  Building,
  Sparkles,
  ExternalLink,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { LegalQueryResponse, LegalCitation, LegalAidContact } from "@/lib/types";

export default function LegalPage() {
  const [query, setQuery] = useState("");
  const [legalResult, setLegalResult] = useState<LegalQueryResponse | null>(null);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [showTechnicalSources, setShowTechnicalSources] = useState(false);

  // Complaint Drafter State
  const [complaintFacts, setComplaintFacts] = useState(
    "On September 4th at approximately 9:30 PM, while returning from Infocity Software Park along the unlit forest boundary road in Patia, an unidentified male riding a black pulsar motorcycle without license plates blocked my path, followed me for 300 meters, and made explicit threatening gestures."
  );
  const [perpTraits, setPerpTraits] = useState(
    "Male, approx 28-30 yrs, athletic build, crescent scar below left cheek, riding black pulsar motorcycle."
  );
  const [policeStation, setPoliceStation] = useState("Infocity Police Station, Bhubaneswar");
  const [draftedComplaint, setDraftedComplaint] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Search Legal Corpus
  const handleSearchLegal = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;
    setIsLoadingQuery(true);
    try {
      const res = await api.queryLegal(q);
      setLegalResult(res);
    } catch (err) {
      console.error("Legal query error:", err);
    } finally {
      setIsLoadingQuery(false);
    }
  };

  // Draft Complaint Letter
  const handleDraftComplaint = async () => {
    setIsDrafting(true);
    try {
      const res = await api.draftComplaint({
        incident_narrative: complaintFacts,
        perpetrator_details: perpTraits,
        police_station: policeStation,
        complainant_name: "Priya Sharma (Complainant)",
      });
      setDraftedComplaint(res);
    } catch (err) {
      console.error("Drafting error:", err);
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = () => {
    if (draftedComplaint?.draft_body_formatted) {
      navigator.clipboard.writeText(draftedComplaint.draft_body_formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold mb-1">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Rights & Redress</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Legal Guidance & Police Complaint Drafter
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Grounded advice derived from the <strong>Bharatiya Nyaya Sanhita (BNS, 2023)</strong> and automated formal Zero FIR drafting.
        </p>
      </div>

      {/* Main Grid: Legal Search & Complaint Drafter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Statutory Search */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold text-slate-200">
                Ask a Legal Question
              </h2>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchLegal()}
                placeholder="e.g., Someone is repeatedly following me..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={() => handleSearchLegal()}
                disabled={isLoadingQuery || !query.trim()}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-slate-950 font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isLoadingQuery ? "Searching..." : "Search"}</span>
              </button>
            </div>

            {/* Quick Question Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Suggested scenarios:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setQuery("Someone is repeatedly following me and calling my number");
                    handleSearchLegal("Someone is repeatedly following me and calling my number");
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-yellow-500/40 text-slate-300 transition-colors text-left"
                >
                  Repeated stalking & calls
                </button>

                <button
                  onClick={() => {
                    setQuery("How does Zero FIR work under BNSS 173?");
                    handleSearchLegal("How does Zero FIR work under BNSS 173?");
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-yellow-500/40 text-slate-300 transition-colors text-left"
                >
                  Zero FIR provisions (BNSS 173)
                </button>

                <button
                  onClick={() => {
                    setQuery("Cyber stalking and publishing private photos online");
                    handleSearchLegal("Cyber stalking and publishing private photos online");
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-yellow-500/40 text-slate-300 transition-colors text-left"
                >
                  Cyber privacy violation (IT Act)
                </button>
              </div>
            </div>

            {/* Legal Results Container */}
            {legalResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-yellow-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-yellow-300">
                    Statutory Provisions Found
                  </span>
                  <span className="text-[10px] text-slate-400">
                    BNS / BNSS Indexed Corpus
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {legalResult.answer}
                </div>

                {/* Retrieved Citations */}
                {legalResult.citations && legalResult.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <button
                      onClick={() => setShowTechnicalSources(!showTechnicalSources)}
                      className="text-[11px] font-semibold text-yellow-400/90 hover:text-yellow-300 flex items-center space-x-1"
                    >
                      <span>{showTechnicalSources ? "Hide verified sources" : `View ${legalResult.citations.length} verified statutory citations`}</span>
                      {showTechnicalSources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showTechnicalSources && (
                      <div className="space-y-2 pt-1">
                        {legalResult.citations.map((c: LegalCitation, idx: number) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1"
                          >
                            <div className="flex items-center justify-between font-semibold text-yellow-300">
                              <span>{c.document_name} • {c.section}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Relevance: {(c.relevance_score * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                              "{c.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legal Aid Contacts */}
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-semibold text-slate-300 block">Emergency & Legal Aid Contacts (Odisha):</span>
            <div className="flex flex-wrap gap-3">
              <a href="tel:181" className="flex items-center space-x-1 text-rose-400 hover:underline">
                <Phone className="w-3 h-3" />
                <span>Women Helpline: 181</span>
              </a>
              <a href="tel:112" className="flex items-center space-x-1 text-blue-400 hover:underline">
                <Phone className="w-3 h-3" />
                <span>Police Emergency: 112</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Police Complaint Letter Drafter */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-200">
                Formal Complaint Drafter
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Zero FIR Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Police Station
              </label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Incident Facts
              </label>
              <textarea
                rows={3}
                value={complaintFacts}
                onChange={(e) => setComplaintFacts(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Perpetrator Descriptors
              </label>
              <input
                type="text"
                value={perpTraits}
                onChange={(e) => setPerpTraits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              />
            </div>

            <button
              onClick={handleDraftComplaint}
              disabled={isDrafting}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDrafting ? "Drafting with BNS citations..." : "Generate Formal Complaint Letter"}</span>
            </button>
          </div>

          {/* Render Drafted Letter Preview */}
          {draftedComplaint && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400">
                  Drafted Legal Document
                </span>
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? "Copied!" : "Copy Letter"}</span>
                </button>
              </div>

              <div className="font-mono text-xs text-slate-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed pr-1">
                {draftedComplaint.draft_body_formatted}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
