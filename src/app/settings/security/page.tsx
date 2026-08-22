"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Smartphone, ArrowLeft, CheckCircle2, LogOut, Key, Lock, Laptop } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function UserSecuritySettingsPage() {
  const [revoked, setRevoked] = useState(false);

  const handleRevoke = () => {
    setRevoked(true);
    setTimeout(() => setRevoked(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 font-sans">
      {/* Back Link */}
      <Link
        href="/settings"
        className="text-xs font-semibold text-[#6e6e73] hover:text-[#1d1d1f] flex items-center gap-1.5 cursor-pointer transition w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Settings
      </Link>

      {/* Header */}
      <div className="border-b border-[#e5e5ea] pb-5">
        <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
          USER SECURITY & ACTIVE SESSION GOVERNANCE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-[#0071e3]" />
          Active Sessions & Security Controls
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Audit active user sessions, device metadata, and execute global session revocation.
        </p>
      </div>

      {revoked && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#15803d] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#34c759]" /> All other active sessions have been revoked successfully.
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f5f5f7] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#0071e3]" /> Active Devices & Sessions
            </h2>
            <p className="text-xs text-[#6e6e73] font-medium mt-0.5">
              Devices currently authenticated to your Veritas account.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRevoke}
            className="flex items-center gap-1.5 bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] border border-[#fecdd3] px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" /> Revoke Other Sessions
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] flex items-center justify-between font-mono text-xs gap-4">
            <div className="space-y-0.5">
              <span className="text-[#15803d] font-bold block text-xs">
                Current Session (Windows / Chrome)
              </span>
              <span className="text-[#8e8e93] text-[11px]">
                IP: 127.0.0.1 • TLS 1.3 Certified • Last Active: Just now
              </span>
            </div>
            <Badge variant="success" size="sm">
              THIS DEVICE
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
