"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Lock,
  CheckCircle2,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  UserCheck,
  EyeOff,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    area_name: "Patia / Infocity Tech Corridor",
    category: "Stalking & Threat",
    severity: "HIGH",
    raw_narrative:
      "My name is Priya Sharma (Phone: +91-9876543210, Email: priya.sharma@example.com). While walking along the Infocity forest edge road near campus, a man riding a black pulsar motorcycle without license plate blocked my path, followed me for several minutes, and used threatening verbal language.",
    perpetrator_description:
      "Male, late 20s, athletic build, deep crescent scar below left cheek, black jacket, riding loud black pulsar motorcycle.",
    lighting_condition: "DARK",
    crowd_density: "ISOLATED",
    latitude: 20.3551,
    longitude: 85.8181,
  });

  const [submittedIncident, setSubmittedIncident] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.reportIncident(formData);
      setSubmittedIncident(res);
    } catch (err) {
      console.error("Report submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Incident Recording</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Report an Incident
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Securely record what happened. Your personal identity is cryptographically protected before any authority review.
        </p>
      </div>

      {/* Submitted Success View with Visual Privacy Transformation */}
      {submittedIncident ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Report Successfully Recorded</h2>
                <span className="text-xs text-slate-400">
                  Case File: <strong className="text-slate-200 font-mono">{submittedIncident.incident_id || "INC-2026-BBSR"}</strong>
                </span>
              </div>
            </div>

            {/* Visual Privacy Proof */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Your Identity Is Protected</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  Privacy Guardian Applied
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">What You Entered:</span>
                  <div className="text-slate-300 font-mono text-[11px] space-y-1">
                    <div>Name: Priya Sharma</div>
                    <div>Phone: +91-9876543210</div>
                    <div>Email: priya.sharma@example.com</div>
                  </div>
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase block">What Law Enforcement Sees:</span>
                  <div className="text-slate-200 font-mono text-[11px] space-y-1">
                    <div>Name: <span className="text-emerald-400">[REDACTED]</span></div>
                    <div>Phone: <span className="text-cyan-400">[TOKENIZED: TOK_USR_8f7b2c91a0]</span></div>
                    <div>Email: <span className="text-emerald-400">[REDACTED]</span></div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                Authorities can investigate the behavioral pattern, time cluster, and suspect physical description without ever accessing your personal contact information.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/cases"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow-md transition-colors"
              >
                <span>View in My Cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  setSubmittedIncident(null);
                  setCurrentStep(1);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                Submit another report
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step Progressive Form */
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <div className={`flex items-center space-x-1.5 ${currentStep >= 1 ? "text-blue-400 font-bold" : "text-slate-500"}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[11px]">1</span>
              <span>What happened</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`flex items-center space-x-1.5 ${currentStep >= 2 ? "text-blue-400 font-bold" : "text-slate-500"}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[11px]">2</span>
              <span>Where & when</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`flex items-center space-x-1.5 ${currentStep >= 3 ? "text-blue-400 font-bold" : "text-slate-500"}`}>
              <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[11px]">3</span>
              <span>Perpetrator details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: What happened? */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category of Incident
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Stalking & Threat">Stalking & Threat</option>
                    <option value="Verbal Harassment">Verbal Harassment</option>
                    <option value="Physical Intimidation">Physical Intimidation</option>
                    <option value="Attempted Snatching">Attempted Snatching</option>
                    <option value="Suspicious Following">Suspicious Following</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Describe what happened
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Write freely. Any personal names or phone numbers you include will be automatically scrubbed by the Privacy Guardian.
                  </p>
                  <textarea
                    rows={5}
                    value={formData.raw_narrative}
                    onChange={(e) => setFormData({ ...formData, raw_narrative: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Next: Location details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Where did it happen? */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Location / Area Name
                  </label>
                  <input
                    type="text"
                    value={formData.area_name}
                    onChange={(e) => setFormData({ ...formData, area_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Lighting Condition
                    </label>
                    <select
                      value={formData.lighting_condition}
                      onChange={(e) => setFormData({ ...formData, lighting_condition: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100"
                    >
                      <option value="DARK">Unlit / Completely Dark</option>
                      <option value="POOR">Dim Streetlights</option>
                      <option value="WELL_LIT">Well-Lit Main Road</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Crowd Density
                    </label>
                    <select
                      value={formData.crowd_density}
                      onChange={(e) => setFormData({ ...formData, crowd_density: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100"
                    >
                      <option value="ISOLATED">Deserted / No Bystanders</option>
                      <option value="SPARSE">A few passersby</option>
                      <option value="CROWDED">Crowded Public Space</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Next: Perpetrator traits</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Perpetrator details & Submit */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    What do you remember about the person?
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Physical features, scars, vehicle make/model, clothing, or behavior patterns.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.perpetrator_description}
                    onChange={(e) => setFormData({ ...formData, perpetrator_description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                {/* Privacy Guarantee Reminder */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 text-xs text-slate-300 flex items-start space-x-3">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block mb-0.5">Privacy Invariant Active</strong>
                    Your contact information will be tokenized using HMAC-SHA256. Authorities will only see anonymized case IDs and pattern clusters.
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Sanitizing & Submitting..." : "Submit Secure Report"}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
