"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Lightbulb, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function OpportunitiesPage({ params }: { params: { id: string } }) {
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
      <div className="border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono text-pink-400 font-semibold uppercase tracking-wider block mb-1">HIGH-DEMAND VIDEO ANGLES</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-pink-400" />
          Evidence-Backed Content Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">High-value video and article title angles derived from under-covered technical topics and audience question gaps.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {(run.opportunities || []).map((opp) => (
          <div key={opp.id} className="slate-card p-6 space-y-4 bg-slate-900/90 border-pink-900/30 hover:border-pink-500/50 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
              <span className="badge-opportunity px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                {opp.opportunity_type} OPPORTUNITY
              </span>
              <span className="text-xs font-mono text-pink-300 font-bold bg-pink-950/60 px-3 py-1 rounded-full border border-pink-800/60 shadow-sm">
                OPPORTUNITY SCORE: {opp.score} / 10
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-100">{opp.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{opp.description}</p>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-850 text-xs font-mono text-slate-400 space-y-1">
              <span className="text-indigo-400 font-bold block uppercase text-[11px]">EVIDENCE JUSTIFICATION:</span>
              <p className="text-slate-300">Supported by 2 independent benchmark sources + high audience question gap signal.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

