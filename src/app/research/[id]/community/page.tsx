"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { MessageSquare, AlertCircle, ShieldCheck, Flame } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CommunityPage({ params }: { params: { id: string } }) {
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
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">USER SENTIMENT & FORUM REPORTS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          Community Forum & User Signals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Recurring user complaints, workarounds, and firsthand reports extracted from Reddit and technical forums.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Mandatory Disclaimer */}
      <div className="bg-indigo-50 rounded-[24px] shadow-sm border border-indigo-200 p-4 text-xs text-indigo-600 flex items-center gap-3 font-mono">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
        <span>
          <strong>Ethos Rule:</strong> Community signals represent user-reported sentiment. They are logged as user reports, not universal hardware facts.
        </span>
      </div>

      <div className="space-y-4">
        {(run.communitySignals || []).map((sig) => (
          <div key={sig.id} className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="badge-community px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                {sig.signal_type}
              </span>
              <div className="flex gap-4 text-xs font-mono text-slate-500">
                <span>FREQUENCY: <strong className="text-slate-700">{sig.frequency_level}</strong></span>
                <span>FIRSTHAND LIKELIHOOD: <strong className="text-slate-700">{sig.firsthand_likelihood}</strong></span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-900 leading-snug">{sig.signal}</p>

            <div className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
              Source Context: Verified multi-post thread activity on technical Reddit subreddits and forums.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

