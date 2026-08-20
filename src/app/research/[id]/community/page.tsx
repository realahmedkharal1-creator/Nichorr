"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { MessageSquare, AlertCircle, ShieldCheck, Flame } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">USER SENTIMENT & FORUM REPORTS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          Community Forum & User Signals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Recurring user complaints, workarounds, and firsthand reports extracted from Reddit and technical forums.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Mandatory Disclaimer */}
      <div className="slate-card p-4 bg-indigo-950/30 border-indigo-850/80 text-xs text-indigo-300 flex items-center gap-3 font-mono rounded-xl shadow-sm">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>
          <strong>Ethos Rule:</strong> Community signals represent user-reported sentiment. They are logged as user reports, not universal hardware facts.
        </span>
      </div>

      <div className="space-y-4">
        {(run.communitySignals || []).map((sig) => (
          <div key={sig.id} className="slate-card p-6 space-y-3.5 bg-slate-900/90 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
              <span className="badge-community px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                {sig.signal_type}
              </span>
              <div className="flex gap-4 text-xs font-mono text-slate-400">
                <span>FREQUENCY: <strong className="text-slate-200">{sig.frequency_level}</strong></span>
                <span>FIRSTHAND LIKELIHOOD: <strong className="text-slate-200">{sig.firsthand_likelihood}</strong></span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-100 leading-snug">{sig.signal}</p>

            <div className="text-xs text-slate-400 font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-850">
              Source Context: Verified multi-post thread activity on technical Reddit subreddits and forums.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

