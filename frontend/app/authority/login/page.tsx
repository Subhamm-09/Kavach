"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Shield, Sparkles, Key, Mail, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function AuthorityLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("inspector.patnaik@odishapolice.gov.in");
  const [password, setPassword] = useState("KavachShield@2026");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await api.login(email, password);
      if (res && res.access_token) {
        localStorage.setItem("kavach_auth_token", res.access_token);
        localStorage.setItem("kavach_user_role", res.role);
        localStorage.setItem("kavach_user_email", email);
        localStorage.setItem("kavach_user_name", res.full_name);

        if (res.role === "ROLE_AUTHORITY") {
          router.push("/authority");
        } else {
          setErrorMessage("This account does not have ROLE_AUTHORITY privileges.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAuthority = () => {
    setEmail("inspector.patnaik@odishapolice.gov.in");
    setPassword("KavachShield@2026");
  };

  return (
    <div className="max-w-md mx-auto py-16 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to citizen home</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          Law Enforcement Portal
        </h1>
        <p className="text-xs text-slate-400">
          Bhubaneswar Urban Police Commissionerate • Restricted Intelligence Access
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Security Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? "Authenticating..." : "Access Authority Dashboard"}</span>
          </button>
        </form>

        {/* Quick Demo Fill Button */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            onClick={fillDemoAuthority}
            type="button"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center space-x-1.5 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Demo Credentials (Insp. Patnaik)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
