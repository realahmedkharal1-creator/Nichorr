"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { MessageSquare, ShieldCheck, Sparkles, Flame } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CommunityPage({ params }: { params: { id: string } }) {
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
          USER SENTIMENT & FORUM REPORTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-[#0071e3]" />
          Community Forum & User Signals
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Recurring user complaints, workarounds, and firsthand reports extracted from Reddit and technical forums.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Mandatory Disclaimer */}
      <div className="bg-white rounded-2xl border border-[#e5e5ea] p-4 text-xs text-[#6e6e73] flex items-center gap-3 shadow-2xs font-medium">
        <ShieldCheck className="w-5 h-5 text-[#0071e3] shrink-0" />
        <span>
          <strong className="text-[#1d1d1f]">Ethos Principle:</strong> Community signals represent user-reported sentiment. They are flagged as user experiences, not universal hardware truths.
        </span>
      </div>

      {/* Signals Feed */}
      {(run.communitySignals || []).length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-8 h-8 text-[#0071e3]" />}
          title="No Significant Community Complaints Found"
          description="Community discussion threads did not surface widespread hardware issues for this topic."
        />
      ) : (
        <div className="space-y-4">
          {(run.communitySignals || []).map((sig) => (
            <div
              key={sig.id}
              className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-7 space-y-3.5 hover:border-[#0071e3]/40 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f5f5f7] pb-3">
                <Badge variant="default" size="sm">
                  {sig.signal_type}
                </Badge>
                <div className="flex gap-4 text-xs font-mono text-[#8e8e93]">
                  <span>
                    FREQUENCY: <strong className="text-[#1d1d1f]">{sig.frequency_level}</strong>
                  </span>
                  <span>
                    FIRSTHAND LIKELIHOOD: <strong className="text-[#1d1d1f]">{sig.firsthand_likelihood}</strong>
                  </span>
                </div>
              </div>

              <p className="text-sm font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
                {sig.signal}
              </p>

              <div className="text-xs text-[#6e6e73] font-mono bg-[#fbfbfd] p-3.5 rounded-2xl border border-[#e5e5ea]">
                Source Context: Multi-user discussion thread validation on enthusiast forums and Reddit.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
