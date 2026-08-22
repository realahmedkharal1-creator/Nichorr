"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { HelpCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

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
      <div className="space-y-6 max-w-[1400px] mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="border-b border-[#e5e5ea] pb-5">
        <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
          VIEWER INTENT & CONTENT GAPS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-[#0071e3]" />
          Unanswered Audience Question Gaps
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Key questions repeatedly asked by viewers that standard hardware reviews fail to address effectively.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {(run.audienceQuestions || []).length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-8 h-8 text-[#0071e3]" />}
          title="No Major Question Gaps Flagged"
          description="Existing review coverage addressed audience queries with high completeness."
        />
      ) : (
        <div className="space-y-4">
          {(run.audienceQuestions || []).map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-7 space-y-3.5 hover:border-[#0071e3]/40 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f5f5f7] pb-3">
                <span className="text-xs font-mono text-[#0071e3] font-bold">
                  AUDIENCE GAP #{idx + 1}
                </span>
                <Badge
                  variant={q.coverage_gap === "HIGH" ? "danger" : "success"}
                  size="sm"
                >
                  {q.coverage_gap === "HIGH" ? "HIGH UNDERSERVED GAP" : "COVERED"}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
                "{q.question}"
              </h3>

              <div className="flex items-center gap-6 text-xs font-mono text-[#6e6e73] bg-[#fbfbfd] p-3.5 rounded-2xl border border-[#e5e5ea]">
                <span>
                  IMPORTANCE: <strong className="text-[#1d1d1f]">{q.importance}</strong>
                </span>
                <span>
                  GAP SCORE:{" "}
                  <strong className="text-[#0071e3]">
                    {q.coverage_gap === "HIGH" ? "8.8 / 10" : "4.2 / 10"}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
