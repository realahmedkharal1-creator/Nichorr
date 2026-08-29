"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CommunityPage({ params }: { params: { id: string } }) {
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

  const signals = run.communitySignals || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-[10.5px] font-mono text-citation font-bold uppercase tracking-[0.4px] block mb-1.5">
          User sentiment &amp; forum reports
        </span>
        <h1 className="text-2xl sm:text-[30px] font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-citation" />
          Community &amp; User Signals
        </h1>
        <p className="text-[13px] text-muted mt-1.5">
          Recurring complaints and firsthand reports pulled from the comment sets and forums in this run.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="bg-citation-bg border border-citation/20 rounded-2xl p-4 text-[12.5px] text-citation flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Ethos rule:</strong> these are user-reported sentiment, logged as reports — not verified hardware facts.
        </span>
      </div>

      {signals.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center">
          <MessageSquare className="w-9 h-9 text-muted-2 mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-ink font-serif">No community signals for this run</h3>
          <p className="text-[13px] text-muted mt-1 max-w-sm mx-auto">
            No recurring viewer-reported issue surfaced across the sources gathered for this topic.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {signals.map((sig) => (
            <div key={sig.id} className="bg-card border border-line rounded-2xl shadow-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge-community px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase">
                  {sig.signal_type.replace(/_/g, " ")}
                </span>
                <span className="font-mono text-[10.5px] text-muted-2">
                  frequency: <strong className="text-ink/80">{sig.frequency_level}</strong>
                </span>
                <span className="font-mono text-[10.5px] text-muted-2">
                  firsthand likelihood: <strong className="text-ink/80">{sig.firsthand_likelihood}</strong>
                </span>
              </div>
              <p className="text-[14px] leading-[1.6] text-ink m-0">{sig.signal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
