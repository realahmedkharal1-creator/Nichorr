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

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
      });
  }, [params.id]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold">
              AUDITED BRIEF READY
            </span>
            <span className="text-xs font-mono text-slate-400">QUALITY GATE: {run.qualityGateStatus}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{run.topic}</h1>
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
        <div className="slate-card p-5 space-y-1.5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30">
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase">VERIFIED SOURCES</span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{run.sources?.length || 0}</p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% TRACEABLE
          </span>
        </div>

        <div className="slate-card p-5 space-y-1.5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30">
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase">SUPPORTED CLAIMS</span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">{run.claims?.length || 0}</p>
          <span className="text-[11px] text-slate-400 font-mono">EXCERPT BACKED</span>
        </div>

        <div className="slate-card p-5 space-y-1.5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30">
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase">CONFLICTS SURFACED</span>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{run.conflicts?.length || 0}</p>
          <span className="text-[11px] text-amber-400 font-mono">METHODOLOGICAL</span>
        </div>

        <div className="slate-card p-5 space-y-1.5 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30">
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase">COMMUNITY SIGNALS</span>
          <p className="text-2xl font-extrabold text-indigo-400 font-mono">{run.communitySignals?.length || 0}</p>
          <span className="text-[11px] text-slate-400 font-mono">USER REPORTED</span>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="slate-card p-6 space-y-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          Executive Summary
        </h2>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
          {(run.brief?.executive_summary || [run.objective || "Research brief summary processing..."]).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Grid Overview Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Claims Preview */}
        <div className="slate-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100">Key Verified Findings</h3>
            <Link href={`/research/${run.id}/evidence`} className="text-xs text-indigo-400 font-semibold hover:underline">
              View All ({run.claims?.length || 0}) →
            </Link>
          </div>
          <div className="space-y-2.5">
            {(run.claims || []).slice(0, 3).map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5 text-xs">
                <span className="font-semibold text-slate-200 block leading-snug">{c.claim_text}</span>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="badge-verified px-2 py-0.5 rounded-md font-bold">{c.status}</span>
                  <span className="text-slate-400">CONFIDENCE: {c.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts Preview */}
        <div className="slate-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Disagreements & Conflicts
            </h3>
            <Link href={`/research/${run.id}/conflicts`} className="text-xs text-indigo-400 font-semibold hover:underline">
              Inspect ({run.conflicts?.length || 0}) →
            </Link>
          </div>
          <div className="space-y-2.5">
            {(run.conflicts || []).map((cnf) => (
              <div key={cnf.id} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1 text-xs">
                <span className="font-mono text-amber-400 font-semibold uppercase">{cnf.conflict_type} DISAGREEMENT</span>
                <p className="text-slate-300 leading-relaxed">{cnf.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

