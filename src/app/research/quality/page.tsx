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
          <h1 className="text-3xl font-mono font-semibold tracking-tight text-ink flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-citation text-white flex items-center justify-center  ">
              <ShieldCheck className="w-5 h-5" />
            </div>
            Evidence-First Research Quality Governance
          </h1>
          <p className="text-sm text-muted-2 font-medium">Monitor source diversity, independent source ratios, and evidence grounding scores across research runs.</p>
        </div>

        <button
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 300); }}
          className="flex items-center gap-2 bg-card border border-line-soft hover:bg-slate-50 text-ink px-5 py-2.5 rounded-full text-xs font-semibold transition  "
        >
          <RefreshCw className="w-4 h-4 text-muted-2" /> Refresh Quality Metrics
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
            <div className="bg-card border border-line-soft rounded-[16px] p-6  ">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-muted-2 uppercase">Independent Sources</span>
                <Database className="w-4 h-4 text-citation" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-ink">85%</div>
                <div className="text-xs text-muted-2 mt-1">Ratio of non-vendor sources</div>
              </div>
            </div>

            <div className="bg-card border border-line-soft rounded-[16px] p-6  ">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-muted-2 uppercase">Evidence Grounding</span>
                <ShieldCheck className="w-4 h-4 text-verified" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-ink">100%</div>
                <div className="text-xs text-muted-2 mt-1">Claims mapped to raw citations</div>
              </div>
            </div>

            <div className="bg-card border border-line-soft rounded-[16px] p-6  ">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-muted-2 uppercase">Unsupported Claims</span>
                <Activity className="w-4 h-4 text-conflict" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-ink">0.0%</div>
                <div className="text-xs text-muted-2 mt-1">Unsupported claim ratio</div>
              </div>
            </div>

            <div className="bg-card border border-line-soft rounded-[16px] p-6  ">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-muted-2 uppercase">Research Runs</span>
                <FileText className="w-4 h-4 text-citation" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-ink">142</div>
                <div className="text-xs text-muted-2 mt-1">Completed in last 30 days</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
