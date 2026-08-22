"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ConflictsPage({ params }: { params: { id: string } }) {
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
        <span className="text-[10px] font-mono text-[#ff9500] font-bold uppercase tracking-widest block mb-1">
          HONEST METHODOLOGICAL DISAGREEMENTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-[#ff9500]" />
          Disagreements & Conflict Matrix
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Veritas surfaces legitimate conflicting reports from independent labs without forcing artificial consensus.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {(run.conflicts || []).length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-[#34c759]" />}
          title="Zero Critical Conflicts Detected"
          description="All independent lab publications and official spec sheets concur on primary findings."
        />
      ) : (
        <div className="space-y-4">
          {(run.conflicts || []).map((cnf) => (
            <div
              key={cnf.id}
              className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#fde68a] p-6 sm:p-7 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f5f5f7] pb-3">
                <Badge variant="warning" size="sm">
                  {cnf.conflict_type} DISAGREEMENT
                </Badge>
                <span className="text-[11px] font-mono text-[#8e8e93] font-bold">
                  STATUS: UNRESOLVED (HONEST UNCERTAINTY)
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1d1d1f]">
                  Conflict Cause & Root Analysis
                </h3>
                <div className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed font-mono bg-[#fbfbfd] p-4 rounded-2xl border border-[#e5e5ea]">
                  {cnf.explanation}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#b45309] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-[#92400e] font-bold">Creator Scripting Advice:</strong>
                  <span className="leading-relaxed font-medium">
                    Highlight both test conditions (e.g., ambient 21°C room vs 25°C room) in your video to build high trust with technical viewers.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
