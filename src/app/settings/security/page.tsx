"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Smartphone, ArrowLeft, CheckCircle2, LogOut } from "lucide-react";

export default function UserSecuritySettingsPage() {
  const [revoked, setRevoked] = useState(false);

  const handleRevoke = () => {
    setRevoked(true);
    setTimeout(() => setRevoked(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Back Link */}
      <Link href="/settings" className="text-xs font-mono text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
      </Link>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">USER SECURITY & ACTIVE SESSION GOVERNANCE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-indigo-600" />
          Active Sessions & Security Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit active user sessions, device metadata, and execute global session revocation.</p>
      </div>

      {revoked && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All other active sessions have been revoked successfully.
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" /> Active Devices & Sessions
          </h2>
          <button
            onClick={handleRevoke}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Revoke All Other Sessions
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="text-emerald-600 font-bold block">Current Session (Windows / Chrome)</span>
              <span className="text-slate-500">IP: 127.0.0.1 • Last Active: Just now</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200">
              THIS DEVICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
