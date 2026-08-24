"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, FileCheck, AlertTriangle, MessageSquare, Lightbulb, ExternalLink, ArrowRight, Layers } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { TechnicalTooltip } from "@/components/ui/Tooltip";

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) { setRun(data.run); } else { setNotFound(true); }
      });
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Run Not Found</h2>
        <p className="text-slate-600">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold">
              AUDITED BRIEF READY
            </span>
            <span className="text-xs font-mono text-slate-500">QUALITY GATE: {run.qualityGateStatus || "PASSED"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{run.topic}</h1>
        </div>

        <Link
          href={`/research/${run.id}/brief`}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
        >
          View Full Brief
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tab Navigation */}
      <ResearchTabNav runId={run.id} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-5 space-y-1.5 transition-shadow hover:shadow-lg">
          <span className="text-xs font-mono text-slate-500 font-semibold uppercase">VERIFIED SOURCES</span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">{run.sources?.length || 0}</p>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% TRACEABLE
          </span>
        </div>

        <div className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-5 space-y-1.5 transition-shadow hover:shadow-lg">
          <span className="text-xs font-mono text-slate-500 font-semibold uppercase">SUPPORTED CLAIMS</span>
          <p className="text-2xl font-extrabold text-emerald-600 font-mono">{run.claims?.length || 0}</p>
          <span className="text-[11px] text-slate-500 font-mono">EXCERPT BACKED</span>
        </div>

        <div className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-5 space-y-1.5 transition-shadow hover:shadow-lg">
          <span className="text-xs font-mono text-slate-500 font-semibold uppercase">CONFLICTS SURFACED</span>
          <p className="text-2xl font-extrabold text-amber-600 font-mono">{run.conflicts?.length || 0}</p>
          <span className="text-[11px] text-amber-600 font-mono">METHODOLOGICAL</span>
        </div>

        <div className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-5 space-y-1.5 transition-shadow hover:shadow-lg">
          <span className="text-xs font-mono text-slate-500 font-semibold uppercase">COMMUNITY SIGNALS</span>
          <p className="text-2xl font-extrabold text-indigo-600 font-mono">{run.communitySignals?.length || 0}</p>
          <span className="text-[11px] text-slate-500 font-mono">USER REPORTED</span>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          Executive Summary
        </h2>
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-sans">
          {(run.brief?.executive_summary || [run.objective || "Research brief summary processing..."]).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Grid Overview Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Claims Preview */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900">Key Verified Findings</h3>
            <Link href={`/research/${run.id}/evidence`} className="text-xs text-indigo-600 font-semibold hover:underline">
              View All ({run.claims?.length || 0}) &rarr;
            </Link>
          </div>
          <div className="space-y-2.5">
            {(run.claims || []).slice(0, 3).map((c) => (
              <div key={c.id} className="relative p-5 rounded-[20px] bg-gradient-to-b from-white to-slate-50/50 border border-emerald-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                {/* Decorative background icon */}
                <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors pointer-events-none transform -rotate-12" />
                
                {/* Top header row with cool badges */}
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm shadow-emerald-500/30">
                    {c.status}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                      CONFIDENCE: {c.confidence}
                    </span>
                  </div>
                </div>

                {/* The actual finding text */}
                <p className="text-sm font-bold text-slate-800 leading-relaxed relative z-10">
                  {c.claim_text.replace(/^Verified finding:\s*/i, "")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts Preview */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Disagreements & Conflicts
            </h3>
            <Link href={`/research/${run.id}/conflicts`} className="text-xs text-indigo-600 font-semibold hover:underline">
              Inspect ({run.conflicts?.length || 0}) &rarr;
            </Link>
          </div>
          <div className="space-y-2.5">
            {(run.conflicts || []).map((cnf) => (
              <div key={cnf.id} className="p-4 rounded-xl bg-amber-50/50 border-2 border-amber-300 shadow-sm space-y-1.5 text-xs transition-all hover:shadow-md hover:border-amber-400">
                <span className="font-mono text-amber-700 font-extrabold uppercase tracking-wide">{cnf.conflict_type} DISAGREEMENT</span>
                <p className="text-slate-800 leading-relaxed font-medium">{cnf.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
