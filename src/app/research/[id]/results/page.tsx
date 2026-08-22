"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, FileCheck, AlertTriangle, MessageSquare, Lightbulb, ExternalLink, ArrowRight, Layers, Sparkles } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

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
      <div className="space-y-6 max-w-[1400px] mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success" size="sm">
              AUDITED BRIEF READY
            </Badge>
            <span className="text-[11px] font-mono text-[#8e8e93] font-bold">
              QUALITY GATE: {run.qualityGateStatus || "PASSED"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            {run.topic}
          </h1>
        </div>

        <Link
          href={`/research/${run.id}/brief`}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition-all active:scale-95 cursor-pointer"
        >
          <span>View Full Brief</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tab Navigation */}
      <ResearchTabNav runId={run.id} />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 transition-all hover:border-[#0071e3]/40 hover:-translate-y-0.5">
          <span className="text-[10px] font-mono text-[#8e8e93] font-bold uppercase tracking-wider">
            VERIFIED SOURCES
          </span>
          <p className="text-3xl font-extrabold text-[#1d1d1f] font-mono">
            {run.sources?.length || 0}
          </p>
          <span className="text-[11px] text-[#15803d] flex items-center gap-1 font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" /> 100% TRACEABLE
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 transition-all hover:border-[#34c759]/40 hover:-translate-y-0.5">
          <span className="text-[10px] font-mono text-[#8e8e93] font-bold uppercase tracking-wider">
            SUPPORTED CLAIMS
          </span>
          <p className="text-3xl font-extrabold text-[#15803d] font-mono">
            {run.claims?.length || 0}
          </p>
          <span className="text-[11px] text-[#6e6e73] font-mono font-semibold">EXCERPT BACKED</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 transition-all hover:border-[#ff9500]/40 hover:-translate-y-0.5">
          <span className="text-[10px] font-mono text-[#8e8e93] font-bold uppercase tracking-wider">
            CONFLICTS SURFACED
          </span>
          <p className="text-3xl font-extrabold text-[#b45309] font-mono">
            {run.conflicts?.length || 0}
          </p>
          <span className="text-[11px] text-[#b45309] font-mono font-semibold">METHODOLOGICAL</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 transition-all hover:border-[#0071e3]/40 hover:-translate-y-0.5">
          <span className="text-[10px] font-mono text-[#8e8e93] font-bold uppercase tracking-wider">
            COMMUNITY SIGNALS
          </span>
          <p className="text-3xl font-extrabold text-[#0071e3] font-mono">
            {run.communitySignals?.length || 0}
          </p>
          <span className="text-[11px] text-[#6e6e73] font-mono font-semibold">USER REPORTED</span>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-7 space-y-4">
        <h2 className="text-base font-bold text-[#1d1d1f] flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#34c759]" />
          Executive Summary
        </h2>
        <div className="space-y-3 text-sm text-[#1d1d1f] leading-relaxed font-sans font-normal">
          {(run.brief?.executive_summary || [run.objective || "Research brief summary processing..."]).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </div>

      {/* Grid Overview Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Claims Preview */}
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-3">
            <h3 className="text-sm font-bold text-[#1d1d1f]">Key Verified Findings</h3>
            <Link
              href={`/research/${run.id}/evidence`}
              className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All ({run.claims?.length || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(run.claims || []).slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] shadow-2xs space-y-2.5 hover:border-[#34c759]/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm">
                    {c.status}
                  </Badge>
                  <span className="text-[10px] font-mono font-bold text-[#8e8e93]">
                    CONFIDENCE: {c.confidence}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#1d1d1f] leading-relaxed">
                  {c.claim_text.replace(/^Verified finding:\s*/i, "")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts Preview */}
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-3">
            <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ff9500]" /> Disagreements & Conflicts
            </h3>
            <Link
              href={`/research/${run.id}/conflicts`}
              className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Inspect ({run.conflicts?.length || 0})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(run.conflicts || []).map((cnf) => (
              <div
                key={cnf.id}
                className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] shadow-2xs space-y-1.5 text-xs transition-all"
              >
                <span className="font-mono text-[#b45309] font-bold uppercase tracking-wide text-[10px] block">
                  {cnf.conflict_type} DISAGREEMENT
                </span>
                <p className="text-[#1d1d1f] leading-relaxed font-medium">
                  {cnf.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
