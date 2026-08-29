"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { AlertTriangle, ShieldAlert, FileText, Info } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ConflictsPage({ params }: { params: { id: string } }) {
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

  // Only render conflicts that carry a real type and explanation. Guards against a
  // half-populated conflict object ever showing as a blank card.
  const conflicts = (run.conflicts || []).filter((c) => c.conflict_type && c.explanation);

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-xs font-mono text-warning font-semibold uppercase tracking-wider block mb-1">HONEST METHODOLOGICAL DISAGREEMENTS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-warning" />
          Disagreements & Conflict Matrix
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">Nichorr surfaces legitimate conflicting reports from independent labs without forcing artificial consensus.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="bg-paper border border-line rounded-2xl p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-muted-2 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs sm:text-sm text-ink/80 leading-relaxed">
          <p className="font-semibold text-ink">What counts as a conflict?</p>
          <p>
            A conflict is where two credible sources report different results for the same thing —
            different benchmark numbers, opposite conclusions, or measurements taken under
            incompatible conditions or on different hardware variants. Nichorr lists each one as-is
            rather than averaging them or declaring a winner.
          </p>
          <p>
            <strong className="text-ink/80">Why it matters for your script:</strong> naming the
            disagreement and the reason behind it (e.g. a 21&deg;C vs 25&deg;C test room, or an
            Exynos vs Snapdragon unit) earns more trust with a technical audience than one confident
            number would.
          </p>
        </div>
      </div>

      {conflicts.length === 0 ? (
        (run.claims || []).length === 0 && (run.sources || []).length === 0 ? (
          <div className="bg-card rounded-[24px] shadow-sm border border-line p-12 text-center space-y-3 bg-card">
            <Info className="w-10 h-10 text-muted-2 mx-auto" />
            <h3 className="text-base font-bold text-ink">No data yet</h3>
            <p className="text-xs text-muted font-mono">Nothing to check for conflicts.</p>
          </div>
        ) : (
          <div className="bg-card rounded-[24px] shadow-sm border border-line p-12 text-center space-y-3 bg-card">
            <ShieldAlert className="w-10 h-10 text-verified mx-auto" />
            <h3 className="text-base font-bold text-ink">Zero Critical Conflicts Detected</h3>
            <p className="text-xs text-muted font-mono">All independent lab publications and official spec sheets concur on primary findings.</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {conflicts.map((cnf) => (
            <div key={cnf.id} className="bg-card rounded-[24px] shadow-sm border border-warning/25 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="badge-conflict px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                  {cnf.conflict_type} DISAGREEMENT
                </span>
                <span className="text-xs font-mono text-muted">STATUS: UNRESOLVED (HONEST UNCERTAINTY)</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-ink">Conflict Cause & Analysis</h3>
                <p className="text-xs text-ink/80 leading-relaxed font-mono bg-paper p-4 rounded-xl border border-line">
                  {cnf.explanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-warning-bg border border-warning/25 text-xs text-warning flex items-start gap-2.5">
                <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-warning">Creator Scripting Advice:</strong>
                  <span className="leading-relaxed">
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

