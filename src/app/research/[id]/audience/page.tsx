"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AudiencePage({ params }: { params: { id: string } }) {
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
        <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">VIEWER INTENT & CONTENT GAPS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-citation" />
          Unanswered Audience Question Gaps
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">Key questions repeatedly asked by viewers that standard hardware reviews fail to address effectively.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {(run.audienceQuestions || []).length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-line">
            <HelpCircle className="w-8 h-8 text-muted-2 mx-auto mb-3" />
            <h3 className="text-ink font-bold">No audience question gaps identified yet</h3>
            <p className="text-sm text-muted mt-1">This run did not identify any unanswered questions from the audience.</p>
          </div>
        ) : (
          (run.audienceQuestions || []).map((q, idx) => (
            <div key={q.id} className="bg-card rounded-[24px] shadow-sm border border-line p-6 space-y-3.5">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-xs font-mono text-citation font-bold">AUDIENCE GAP #{idx + 1}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  q.coverage_gap === 'HIGH' ? 'bg-conflict-bg text-conflict border border-conflict/25' : 'bg-verified-bg text-verified border border-verified/25'
                }`}>
                  {q.coverage_gap === 'HIGH' ? 'HIGH UNDERSERVED GAP' : 'COVERED'}
                </span>
              </div>
  
              <h3 className="text-base font-bold text-ink leading-snug">{q.question}</h3>
  
              <div className="flex items-center gap-6 text-xs font-mono text-muted bg-paper p-3 rounded-xl border border-line">
                <span>IMPORTANCE: <strong className="text-ink/80">{q.importance}</strong></span>
                <span>GAP SCORE: <strong className="text-citation">{q.coverage_gap === 'HIGH' ? '8.8 / 10' : '4.2 / 10'}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

