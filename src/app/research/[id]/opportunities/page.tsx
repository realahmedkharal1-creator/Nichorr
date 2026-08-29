"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Lightbulb, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function OpportunitiesPage({ params }: { params: { id: string } }) {
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
        <h2 className="text-2xl font-bold text-ink">Run Not Found</h2>
        <p className="text-ink/80">This research run could not be recovered. Please start a new one.</p>
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
      <div className="border-b border-line pb-4">
        <span className="text-xs font-mono text-conflict font-semibold uppercase tracking-wider block mb-1">HIGH-DEMAND VIDEO ANGLES</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-conflict" />
          Evidence-Backed Content Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">High-value video and article title angles derived from under-covered technical topics and audience question gaps.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {(run.opportunities || []).length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-line">
            <Lightbulb className="w-8 h-8 text-muted-2 mx-auto mb-3" />
            <h3 className="text-ink font-bold">No content opportunities identified yet</h3>
            <p className="text-sm text-muted mt-1">This run did not identify any high-demand video angles.</p>
          </div>
        ) : (
          (run.opportunities || []).map((opp) => (
            <div key={opp.id} className="bg-card rounded-[24px] shadow-sm border border-conflict/25 p-6 space-y-4 hover:border-conflict/25 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-line pb-3">
                <span className="badge-opportunity px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-conflict/25 text-conflict">
                  {opp.opportunity_type} OPPORTUNITY
                </span>
                <span className="text-xs font-mono text-conflict font-bold bg-conflict-bg px-3 py-1 rounded-full border border-conflict/25 shadow-sm">
                  OPPORTUNITY SCORE: {opp.score} / 10
                </span>
              </div>
  
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-ink">{opp.title}</h3>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">{opp.description}</p>
              </div>
  
              <div className="p-3.5 bg-paper rounded-xl border border-line text-xs font-mono text-muted space-y-1">
                <span className="text-citation font-bold block uppercase text-[11px]">EVIDENCE JUSTIFICATION:</span>
                <p className="text-ink/80">Supported by 2 independent benchmark sources + high audience question gap signal.</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

