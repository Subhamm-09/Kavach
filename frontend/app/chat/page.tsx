"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareHeart,
  Send,
  ShieldAlert,
  Sparkles,
  Lock,
  PhoneCall,
  Route,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { ChatMessage } from "@/lib/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message_id: "welcome-1",
      session_token: "DEMO-THERAPY-SESS",
      sender: "THERAPY_AGENT",
      text: "Hello. I'm here to provide a safe, confidential space if you are feeling uneasy, distressed, or unsure about something that happened. Take your time—how are you feeling right now?",
      distress_analysis: {
        is_distressed: false,
        distress_level: "NONE",
        distress_score: 0.0,
        detected_intent: "WELCOME",
        trigger_cues: [],
        guardian_handoff_required: false,
        recommended_action: "SUPPORT",
      },
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken] = useState(() => "SESS-CHAT-" + Math.random().toString(36).substring(7).toUpperCase());
  const [activeHandoff, setActiveHandoff] = useState<any>(null);
  const [showDemoControls, setShowDemoControls] = useState(false);
  const [showAgentActivity, setShowAgentActivity] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    // Add user message to UI
    const userMsg: ChatMessage = {
      message_id: `user-${Date.now()}`,
      session_token: sessionToken,
      sender: "USER",
      text: text,
      distress_analysis: {
        is_distressed: false,
        distress_level: "NONE",
        distress_score: 0.0,
        detected_intent: "USER_INPUT",
        trigger_cues: [],
        guardian_handoff_required: false,
        recommended_action: "",
      },
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const res = await api.sendTherapyMessage(
        sessionToken,
        text,
        20.3551, // Current demo lat/lng in Patia
        85.8181
      );

      if (res) {
        setMessages((prev) => [...prev, res]);
        if (res.guardian_handoff) {
          setActiveHandoff(res.guardian_handoff);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDemoDangerCue = () => {
    handleSendMessage("I was walking near Patia and someone on a black bike began following me closely and won't leave.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-1">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Confidential Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Talk to Kavach
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            A private space to talk about what happened or what you are feeling.
          </p>
        </div>

        {/* Subtle Privacy Indicator */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Private & confidential</span>
        </div>
      </div>

      {/* Autonomous Escalation Banner if Distress Detected */}
      {activeHandoff && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border border-red-500/50 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-red-300">
                  I am concerned that you may not be safe right now.
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Kavach has activated additional support options to help you move to safety immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-red-500/20">
            <Link
              href="/safety"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Find safer route</span>
            </Link>

            <a
              href="tel:181"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center space-x-1.5 shadow-md transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Helpline (181)</span>
            </a>

            <Link
              href="/report"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <span>Record Incident Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Collapsible Agent Decision Summary */}
          <div className="pt-2">
            <button
              onClick={() => setShowAgentActivity(!showAgentActivity)}
              className="text-[11px] font-medium text-red-300/80 hover:text-red-200 flex items-center space-x-1"
            >
              <span>{showAgentActivity ? "Hide agent activity" : "View agent activity"}</span>
              {showAgentActivity ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showAgentActivity && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <strong className="text-slate-200">Support Dialogue Agent:</strong>
                  <span>Detected danger cues in message narrative.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <strong className="text-slate-200">Guardian Orchestrator:</strong>
                  <span>Triaged severity as elevated; activated proactive safety pathways.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Conversation Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        {/* Message Stream */}
        <div className="space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === "USER";
            return (
              <div
                key={msg.message_id || idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? "text-blue-200 text-right" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Just now"}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl p-4 bg-slate-950/80 border border-slate-800 text-xs text-slate-400 rounded-bl-none flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span>Support Agent is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700/80 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-rose-500/80 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white shadow-md shadow-rose-600/20 transition-colors"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Demo Controls Drawer (Separated from normal UX) */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
        <button
          onClick={() => setShowDemoControls(!showDemoControls)}
          className="w-full p-3 px-4 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Judge Demo Controls (Moment 3: Distress Cue)</span>
          </div>
          {showDemoControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDemoControls && (
          <div className="p-4 pt-0 border-t border-slate-800/60 text-xs text-slate-400 space-y-2">
            <p>
              Click below to send a pre-constructed distress statement to test the real-time Therapy $\to$ Guardian handoff:
            </p>
            <button
              onClick={triggerDemoDangerCue}
              disabled={isLoading}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center space-x-2 font-medium transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate: "Someone on a black bike is following me down the dark lane"</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
