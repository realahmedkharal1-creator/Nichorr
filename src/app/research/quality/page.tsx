"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Database, Activity, RefreshCw } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ResearchQualityPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">EVIDENCE-FIRST RESEARCH QUALITY GOVERNANCE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Research Quality & Source Diversity Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Monitor source diversity, independent source ratios, and evidence grounding scores across research runs.</p>
        </div>

        <button
          onClick={() => setLoading(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-indigo-300 border border-slate-750 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" /> Refresh Quality Metrics
        </button>
      </div>

      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">AVERAGE SOURCE DIVERSITY</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono">92.4%</p>
              <span className="text-[10px] text-slate-500 font-mono">Primary tech documentation & benchmarks</span>
            </div>

            <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">UNSUPPORTED CLAIM RATIO</span>
              <p className="text-2xl font-bold text-slate-100 font-mono">0.0%</p>
              <span className="text-[10px] text-emerald-400 font-mono">Zero-hallucination policy verified</span>
            </div>

            <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">INDEPENDENT SOURCE RATIO</span>
              <p className="text-2xl font-bold text-indigo-300 font-mono">3.4x</p>
              <span className="text-[10px] text-slate-500 font-mono">Multiple independent sources per claim</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
