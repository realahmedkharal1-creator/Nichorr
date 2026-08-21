"use client";

import Link from "next/link";
import { Video, ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";

export default function CreatorIntelligencePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Back Link */}
      <Link href="/content" className="text-xs font-mono text-slate-500 hover:text-slate-700 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Content Studio
      </Link>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">CREATOR PRODUCTION OPPORTUNITY & FACTUAL RISK TRACKING</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Video className="w-7 h-7 text-indigo-600" />
          Creator Intelligence Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit content production opportunities, evidence coverage, and publish readiness performance.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">HIGH-IMPACT IDEAS</span>
          <p className="text-2xl font-bold text-indigo-600 font-mono">18 Ideas</p>
          <span className="text-[10px] text-emerald-600 font-mono">100% Grounded in Evidence</span>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-600 uppercase">AVG PUBLISH READINESS</span>
          <p className="text-2xl font-bold text-emerald-600 font-mono">96.8%</p>
          <span className="text-[10px] text-slate-500 font-mono">Checklist criteria pass</span>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">REVISION EFFICIENCY</span>
          <p className="text-2xl font-bold text-slate-900 font-mono">1.2 Revisions/Script</p>
          <span className="text-[10px] text-emerald-600 font-mono">-20% faster production</span>
        </div>
      </div>
    </div>
  );
}

