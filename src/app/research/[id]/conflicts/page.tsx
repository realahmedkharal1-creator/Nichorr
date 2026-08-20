"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { AlertTriangle, ShieldAlert, FileText, Info } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider block mb-1">HONEST METHODOLOGICAL DISAGREEMENTS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Disagreements & Conflict Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Veritas surfaces legitimate conflicting reports from independent labs without forcing artificial consensus.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {(run.conflicts || []).length === 0 ? (
        <div className="slate-card p-12 text-center space-y-3 bg-slate-900/60">
          <ShieldAlert className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">Zero Critical Conflicts Detected</h3>
          <p className="text-xs text-slate-400 font-mono">All independent lab publications and official spec sheets concur on primary findings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(run.conflicts || []).map((cnf) => (
            <div key={cnf.id} className="slate-card p-6 space-y-4 bg-slate-900/90 border-amber-900/40">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <span className="badge-conflict px-3 py-1 rounded-full text-xs font-mono font-bold uppercase">
                  {cnf.conflict_type} DISAGREEMENT
                </span>
                <span className="text-xs font-mono text-slate-400">STATUS: UNRESOLVED (HONEST UNCERTAINTY)</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-100">Conflict Cause & Analysis</h3>
                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/80 p-4 rounded-xl border border-slate-850">
                  {cnf.explanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-amber-200">Creator Scripting Advice:</strong>
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

