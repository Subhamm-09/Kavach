"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageSquareHeart,
  Scale,
  Lock,
} from "lucide-react";

interface Props {
  isSimulating: boolean;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onResetSimulation: () => void;
}

export default function DemoControlPanel({
  isSimulating,
  onStartSimulation,
  onPauseSimulation,
  onResetSimulation,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Simulation & Demo Mode
          </h3>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center space-x-0.5"
        >
          <span>{isExpanded ? "Collapse" : "Expand"}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-400">
            Simulate real GPS telemetry along the <strong>Patia / Infocity corridor</strong> to trigger proximity alerts and safer routing.
          </p>

          <div className="flex items-center space-x-2">
            {!isSimulating ? (
              <button
                onClick={onStartSimulation}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Simulation</span>
              </button>
            ) : (
              <button
                onClick={onPauseSimulation}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Movement</span>
              </button>
            )}

            <button
              onClick={onResetSimulation}
              className="py-2 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center space-x-1 transition-colors"
              title="Reset location"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Pillar Jump */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Quick jump:</span>
            <div className="flex items-center space-x-2">
              <Link href="/chat" className="hover:text-rose-400 text-slate-300 transition-colors">
                Talk
              </Link>
              <span>•</span>
              <Link href="/legal" className="hover:text-yellow-400 text-slate-300 transition-colors">
                Legal
              </Link>
              <span>•</span>
              <Link href="/authority" className="hover:text-indigo-400 text-slate-300 transition-colors">
                Authority
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
