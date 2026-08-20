"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Smartphone, ArrowLeft, CheckCircle2, LogOut } from "lucide-react";

export default function UserSecuritySettingsPage() {
  const [revoked, setRevoked] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Back Link */}
      <Link href="/settings" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
      </Link>

      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">USER SECURITY & ACTIVE SESSION GOVERNANCE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-indigo-400" />
          Active Sessions & Security Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit active user sessions, device metadata, and execute global session revocation.</p>
      </div>

      {revoked && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All other active sessions have been revoked successfully.
        </div>
      )}

      {/* Sessions List */}
      <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" /> Active Devices & Sessions
          </h2>
          <button
            onClick={() => setRevoked(true)}
            className="flex items-center gap-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Revoke All Other Sessions
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="text-emerald-400 font-bold block">Current Session (Windows / Chrome)</span>
              <span className="text-slate-500">IP: 127.0.0.1 • Last Active: Just now</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
              THIS DEVICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
