"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquareHeart,
  Send,
  X,
  Maximize2,
  Lock,
  PhoneCall,
  AlertTriangle,
  Sparkles,
  Shield,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";
import { ChatMessage } from "@/lib/types";

const STARTER_PROMPTS = [
  { text: "I'm feeling unsafe right now", label: "Feeling unsafe" },
  { text: "Someone is following me closely", label: "Being followed" },
  { text: "I need someone to talk through an incident", label: "Talk it through" },
  { text: "What legal protections do I have?", label: "Legal advice" },
];

export default function TalkWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken] = useState(() => "SESS-WIDGET-" + Math.random().toString(36).substring(7).toUpperCase());

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message_id: "welcome-widget",
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

  const [activeHandoff, setActiveHandoff] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Don't render the floating widget on the /chat page itself
  if (pathname === "/chat") {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setHasInteracted(true);

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
      console.error("Talk widget error:", err);
      setMessages((prev) => [
        ...prev,
        {
          message_id: `err-${Date.now()}`,
          session_token: sessionToken,
          sender: "THERAPY_AGENT",
          text: "I am listening and here with you. If you are in immediate physical danger, please call emergency services right away at 112.",
          distress_analysis: {
            is_distressed: false,
            distress_level: "NONE",
            distress_score: 0.0,
            detected_intent: "SUPPORT",
            trigger_cues: [],
            guardian_handoff_required: false,
            recommended_action: "SUPPORT",
          },
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside aria-label="Confidential Support Companion" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Talk with Kavach private companion"
          className="pointer-events-auto mb-3 w-[360px] sm:w-[400px] max-w-[calc(100vw-28px)] h-[530px] max-h-[calc(100vh-100px)] rounded-3xl border border-[#cfdad3] bg-[#fffdf8] shadow-[0_24px_64px_rgba(23,51,47,0.22)] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="p-4 pb-3 border-b border-[#e6ece8] bg-gradient-to-r from-[#fdf2f4] via-[#fdf7f5] to-[#f7f5ef] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-[#a53f59] text-white shadow-[0_4px_14px_rgba(165,63,89,0.3)]">
                <MessageSquareHeart className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#1c9b73] border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-[#17332f] tracking-tight">Talk to Kavach</h3>
                  <span className="rounded-full bg-[#fce9ed] px-2 py-0.5 text-[9px] font-black uppercase tracking-[.06em] text-[#a53f59] border border-[#f5b7b1]">
                    Private
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-[#65736f]">Trauma-informed AI companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-[#52635c] hover:bg-white hover:text-[#17332f] transition"
                title="Expand to full screen"
                aria-label="Expand to full screen"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-[#52635c] hover:bg-white hover:text-[#17332f] transition"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Distress Banner if Triggered */}
          {activeHandoff && (
            <div className="p-3 bg-[#fce9e7] border-b border-[#f5b7b1] flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-[#c0392b] shrink-0 mt-0.5" />
              <div className="flex-1 text-[11px] leading-tight">
                <strong className="text-[#c0392b] block font-bold">Guardian Protocol Active</strong>
                <span className="text-[#65736f]">High distress detected. Would you like emergency dispatch?</span>
                <div className="mt-2 flex items-center gap-2">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#c0392b] text-white text-[10px] font-black"
                  >
                    <PhoneCall className="h-2.5 w-2.5" /> Call 112
                  </a>
                  <Link
                    href="/safety"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#17332f] border border-[#dbe2dc] text-[10px] font-bold"
                  >
                    <Shield className="h-2.5 w-2.5 text-[#006d62]" /> Safe route
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fffdf8]/60 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === "USER";
              return (
                <div
                  key={m.message_id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-[#17332f] text-white rounded-br-sm"
                        : "bg-white text-[#17332f] border border-[#e6ece8] rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] font-medium text-[#8a9893] px-1 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#65736f] bg-white border border-[#e6ece8] px-3.5 py-2 rounded-2xl w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a53f59] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a53f59] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#a53f59] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-semibold ml-1">Kavach is listening...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions (shown before long conversation) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[#f9f8f3] border-t border-[#e6ece8] flex gap-1.5 overflow-x-auto no-scrollbar">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSendMessage(p.text)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#cfdad3] text-[10px] font-bold text-[#52635c] hover:border-[#a53f59] hover:text-[#a53f59] transition shadow-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-[#e6ece8] bg-[#fdfcf9]">
            <div className="flex items-center gap-2 rounded-2xl border border-[#cfdad3] bg-white px-3 py-1.5 shadow-inner focus-within:border-[#a53f59] focus-within:ring-2 focus-within:ring-[#a53f59]/15 transition">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type privately here..."
                className="w-full bg-transparent text-xs text-[#17332f] placeholder:text-[#8a9893] outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className={`grid h-7 w-7 place-items-center rounded-xl transition ${
                  inputText.trim() && !isLoading
                    ? "bg-[#a53f59] text-white hover:bg-[#8e3249]"
                    : "bg-[#f1efea] text-[#a5b0ab] cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Privacy Subtext */}
            <div className="flex items-center justify-between text-[9px] text-[#72827b] font-semibold mt-2 px-1">
              <span className="flex items-center gap-1">
                <Lock className="h-2.5 w-2.5 text-[#006d62]" /> Zero PII retention • Anonymized
              </span>
              <Link href="/chat" className="text-[#a53f59] hover:underline font-bold">
                Full page view →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (Always Visible in Bottom Right) */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 rounded-full px-4 py-3 text-xs font-bold transition-all duration-300 shadow-[0_12px_32px_rgba(23,51,47,0.18)] ${
            isOpen
              ? "bg-[#17332f] text-white hover:bg-[#285048]"
              : "bg-[#a53f59] text-white hover:bg-[#8e3249] hover:shadow-[0_16px_36px_rgba(165,63,89,0.36)] hover:scale-105"
          }`}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={isOpen ? "Close Talk companion" : "Open Talk companion"}
        >
          {isOpen ? (
            <>
              <X className="h-4 w-4" />
              <span className="tracking-tight">Close</span>
            </>
          ) : (
            <>
              <div className="relative">
                <MessageSquareHeart className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
              </div>
              <span className="tracking-tight">Talk to Kavach</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
