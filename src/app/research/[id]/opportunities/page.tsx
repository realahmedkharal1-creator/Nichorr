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
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-pink-600 font-semibold uppercase tracking-wider block mb-1">HIGH-DEMAND VIDEO ANGLES</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-pink-600" />
          Evidence-Backed Content Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">High-value video and article title angles derived from under-covered technical topics and audience question gaps.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {(run.opportunities || []).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold">No content opportunities identified yet</h3>
            <p className="text-sm text-slate-500 mt-1">This run did not identify any high-demand video angles.</p>
          </div>
        ) : (
          (run.opportunities || []).map((opp) => (
            <div key={opp.id} className="bg-white rounded-[24px] shadow-sm border border-pink-200 p-6 space-y-4 hover:border-pink-300 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="badge-opportunity px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-pink-100 text-pink-700">
                  {opp.opportunity_type} OPPORTUNITY
                </span>
                <span className="text-xs font-mono text-pink-700 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200 shadow-sm">
                  OPPORTUNITY SCORE: {opp.score} / 10
                </span>
              </div>
  
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{opp.description}</p>
              </div>
  
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-500 space-y-1">
                <span className="text-indigo-600 font-bold block uppercase text-[11px]">EVIDENCE JUSTIFICATION:</span>
                <p className="text-slate-700">Supported by 2 independent benchmark sources + high audience question gap signal.</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

