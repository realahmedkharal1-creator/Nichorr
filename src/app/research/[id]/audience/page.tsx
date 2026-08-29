"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { HelpCircle } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function AudiencePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
        else setNotFound(true);
      });
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-3">
        <h2 className="text-2xl font-bold text-ink">Run not found</h2>
        <p className="text-muted">This research run could not be recovered.</p>
      </div>
    );
  }
  if (!run) return <div className="space-y-6"><SkeletonCard /></div>;

  const questions = run.audienceQuestions || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-[10.5px] font-mono text-citation font-bold uppercase tracking-[0.4px] block mb-1.5">
          Viewer intent &amp; coverage gaps
        </span>
        <h1 className="text-2xl sm:text-[30px] font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-citation" />
          Unanswered Audience Questions
        </h1>
        <p className="text-[13px] text-muted mt-1.5">
          Questions viewers keep asking that the existing coverage does not answer well — each is a topic your video could own.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {questions.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center">
          <HelpCircle className="w-9 h-9 text-muted-2 mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-ink font-serif">No audience question gaps identified</h3>
          <p className="text-[13px] text-muted mt-1 max-w-sm mx-auto">
            No viewer question recurred often enough, or there was not enough reviewer coverage to compare against.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-card border border-line rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-muted-2 uppercase">Gap #{idx + 1}</span>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${
                    q.coverage_gap === "HIGH"
                      ? "bg-conflict-bg text-conflict border-conflict/25"
                      : "bg-verified-bg text-verified border-verified/25"
                  }`}
                >
                  {q.coverage_gap === "HIGH" ? "Wide coverage gap" : "Minor gap"}
                </span>
              </div>
              <p className="text-[14px] leading-[1.55] font-medium text-ink m-0">&ldquo;{q.question}&rdquo;</p>
              <span className="font-mono text-[10.5px] text-muted-2 mt-auto">importance: {q.importance}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
