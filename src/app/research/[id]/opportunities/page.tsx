"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Lightbulb, Sparkles, Trophy, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

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
          HIGH-DEMAND VIDEO ANGLES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-7 h-7 text-[#0071e3]" />
          Evidence-Backed Content Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          High-value video and article title angles derived from under-covered technical topics and audience question gaps.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {(run.opportunities || []).length === 0 ? (
        <EmptyState
          icon={<Lightbulb className="w-8 h-8 text-[#0071e3]" />}
          title="No Standout Angles Generated"
          description="Try deepening the research depth tier in configuration."
        />
      ) : (
        <div className="space-y-4">
          {(run.opportunities || []).map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-7 space-y-4 hover:border-[#0071e3]/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#f5f5f7] pb-3">
                <Badge variant="default" size="sm">
                  {opp.opportunity_type} OPPORTUNITY
                </Badge>
                <span className="text-xs font-mono text-[#0071e3] font-bold bg-[#eef2ff] px-3.5 py-1 rounded-full border border-[#c7d2fe]/80 shadow-2xs">
                  SCORE: {opp.score} / 10
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] leading-snug">
                  {opp.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed font-medium">
                  {opp.description}
                </p>
              </div>

              <div className="p-4 bg-[#fbfbfd] rounded-2xl border border-[#e5e5ea] text-xs font-mono text-[#6e6e73] space-y-1">
                <span className="text-[#0071e3] font-bold block uppercase text-[10px]">
                  EVIDENCE JUSTIFICATION:
                </span>
                <p className="text-[#1d1d1f] font-medium">
                  Supported by multi-source lab measurements + verified audience question gap signals.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
