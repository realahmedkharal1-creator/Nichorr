"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Terminal, ShieldCheck } from "lucide-react";

export default function DeveloperDocsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Back Link */}
      <Link href="/developers" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Developer Portal
      </Link>

      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">INTERACTIVE V1 API REFERENCE & EPISTEMIC CONTRACTS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Terminal className="w-7 h-7 text-indigo-400" />
          Interactive API Reference
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Versioned public REST endpoints preserving provenance, epistemic certainty metadata, and RBAC scope guards.</p>
      </div>

      <div className="space-y-4 font-sans text-xs">
        <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">GET</span>
            <span>/api/v1/knowledge/search</span>
          </div>
          <p className="text-slate-400 text-[11px] font-sans">Query knowledge claims with hybrid semantic and source authority ranking.</p>
        </div>

        <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded">POST</span>
            <span>/api/v1/knowledge/answer</span>
          </div>
          <p className="text-slate-400 text-[11px] font-sans">Execute governed knowledge Q&A returning standardized epistemic certainty metadata.</p>
        </div>
      </div>
    </div>
  );
}
