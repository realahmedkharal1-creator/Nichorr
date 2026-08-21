"use client";

import Link from "next/link";
import { Code2, Key, Activity, BookOpen, ShieldCheck, ArrowRight, Terminal } from "lucide-react";

export default function DeveloperPortalPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">GOVERNED INTELLIGENCE API & DEVELOPER PLATFORM</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-indigo-600" />
            Developer Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Build machine-to-machine integrations, query temporal knowledge graphs, and subscribe to signed intelligence feeds.</p>
        </div>

        <Link
          href="/settings/security"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition"
        >
          <Key className="w-4 h-4" /> Security & Keys
        </Link>
      </div>

      {/* Grid Features */}
      <div className="grid sm:grid-cols-3 gap-4 font-sans text-xs">
        <Link href="/developers/docs" className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 hover:border-indigo-500/50 transition space-y-2 block">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 font-mono">Interactive API Docs</h2>
          <p className="text-slate-500 text-[11px]">Explore v1 REST contracts for knowledge, graph reasoning, foresight, and intelligence products.</p>
        </Link>

        <Link href="/developers/docs" className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 hover:border-indigo-500/50 transition space-y-2 block">
          <Activity className="w-6 h-6 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 font-mono">Usage & Rate Limits</h2>
          <p className="text-slate-500 text-[11px]">Monitor request specifications, token consumption guidelines, and rate-limit quotas.</p>
        </Link>

        <Link href="/settings/security" className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 hover:border-indigo-500/50 transition space-y-2 block">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 font-mono">Security & Diagnostics</h2>
          <p className="text-slate-500 text-[11px]">Audit authentication status, active sessions, and security controls.</p>
        </Link>
      </div>
    </div>
  );
}
