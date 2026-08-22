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
    <div className="space-y-6 max-w-[1400px] mx-auto py-4 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-3xl font-mono font-semibold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-slate-200/70">
              <ShieldCheck className="w-5 h-5" />
            </div>
            Evidence-First Research Quality Governance
          </h1>
          <p className="text-sm text-slate-500 font-medium">Monitor source diversity, independent source ratios, and evidence grounding scores across research runs.</p>
        </div>

        <button
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 300); }}
          className="flex items-center gap-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-full text-xs font-semibold transition shadow-sm shadow-slate-200/70"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" /> Refresh Quality Metrics
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* Quality KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm shadow-slate-200/70">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Independent Sources</span>
                <Database className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">85%</div>
                <div className="text-xs text-slate-500 mt-1">Ratio of non-vendor sources</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm shadow-slate-200/70">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Evidence Grounding</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 mt-1">Claims mapped to raw citations</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm shadow-slate-200/70">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Unsupported Claims</span>
                <Activity className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">0.0%</div>
                <div className="text-xs text-slate-500 mt-1">Unsupported claim ratio</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm shadow-slate-200/70">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Research Runs</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">142</div>
                <div className="text-xs text-slate-500 mt-1">Completed in last 30 days</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
