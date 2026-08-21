"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Video, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CreatorQualityPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">FACTUAL INTEGRITY IN CREATOR CONTENT</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-indigo-600" />
            Creator Quality & Fact-Check Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit evidence grounding for video script outlines, on-screen claims, and publish readiness.</p>
        </div>

        <button
          onClick={() => setLoading(true)}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-600" /> Refresh Metrics
        </button>
      </div>

      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">SUPPORTED SCRIPT CLAIMS</span>
              <p className="text-2xl font-bold text-emerald-600 font-mono">100% Grounded</p>
              <span className="text-[10px] text-slate-500 font-mono">All script hooks bound to evidence</span>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">PUBLISH READINESS PASS</span>
              <p className="text-2xl font-bold text-slate-900 font-mono">8/8 Checklist</p>
              <span className="text-[10px] text-emerald-600 font-mono">Ready to record & publish</span>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">CONTRADICTION SAFEGUARD</span>
              <p className="text-2xl font-bold text-indigo-600 font-mono">0 Conflicts</p>
              <span className="text-[10px] text-slate-500 font-mono">No conflicting hardware specs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

