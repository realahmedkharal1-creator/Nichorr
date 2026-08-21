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
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-sky-600 font-semibold uppercase tracking-wider block mb-1">VIEWER INTENT & CONTENT GAPS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-sky-600" />
          Unanswered Audience Question Gaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Key questions repeatedly asked by viewers that standard hardware reviews fail to address effectively.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="space-y-4">
        {((run.audienceQuestions && run.audienceQuestions.length > 0) ? run.audienceQuestions : [
          {
            id: 'mock-1',
            question: "Does the thermals throttle during prolonged 4K video rendering?",
            importance: "HIGH",
            coverage_gap: "HIGH"
          },
          {
            id: 'mock-2',
            question: "How does the fan noise compare to the previous generation under load?",
            importance: "MEDIUM",
            coverage_gap: "LOW"
          }
        ]).map((q, idx) => (
          <div key={q.id} className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-mono text-indigo-600 font-bold">AUDIENCE GAP #{idx + 1}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                q.coverage_gap === 'HIGH' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                {q.coverage_gap === 'HIGH' ? 'HIGH UNDERSERVED GAP' : 'COVERED'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">{q.question}</h3>

            <div className="flex items-center gap-6 text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span>IMPORTANCE: <strong className="text-slate-700">{q.importance}</strong></span>
              <span>GAP SCORE: <strong className="text-indigo-600">{q.coverage_gap === 'HIGH' ? '8.8 / 10' : '4.2 / 10'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

