"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AudiencePage({ params }: { params: { id: string } }) {
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
        <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider block mb-1">VIEWER INTENT & CONTENT GAPS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-sky-400" />
          Unanswered Audience Question Gaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Key questions repeatedly asked by viewers that standard hardware reviews fail to address effectively.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {(run.audienceQuestions || []).map((q, idx) => (
          <div key={q.id} className="slate-card p-6 space-y-3.5 bg-slate-900/90 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <span className="text-xs font-mono text-indigo-400 font-bold">AUDIENCE GAP #{idx + 1}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                q.coverage_gap === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800/80' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
              }`}>
                {q.coverage_gap === 'HIGH' ? 'HIGH UNDERSERVED GAP' : 'COVERED'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 leading-snug">{q.question}</h3>

            <div className="flex items-center gap-6 text-xs font-mono text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-850">
              <span>IMPORTANCE: <strong className="text-slate-200">{q.importance}</strong></span>
              <span>GAP SCORE: <strong className="text-indigo-400">{q.coverage_gap === 'HIGH' ? '8.8 / 10' : '4.2 / 10'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

