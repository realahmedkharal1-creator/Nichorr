"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Lightbulb, Sparkles } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function OpportunitiesPage({ params }: { params: { id: string } }) {
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

  const opps = run.opportunities || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <span className="text-[10.5px] font-mono text-citation font-bold uppercase tracking-[0.4px] block mb-1.5">
          High-demand video angles
        </span>
        <h1 className="text-2xl sm:text-[30px] font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-6 h-6 text-citation" />
          Content Opportunities
        </h1>
        <p className="text-[13px] text-muted mt-1.5">
          Video angles this research supports — built from the disagreements, complaints and unanswered questions above.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {opps.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center">
          <Lightbulb className="w-9 h-9 text-muted-2 mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-ink font-serif">No content opportunities yet</h3>
          <p className="text-[13px] text-muted mt-1 max-w-sm mx-auto">
            These are generated from reviewer disagreements, recurring complaints and unanswered audience questions.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {opps.map((opp) => (
            <div
              key={opp.id}
              className="bg-card border border-line rounded-2xl shadow-card p-5 sm:p-6 flex flex-col gap-3 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-citation-bg text-citation inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {opp.opportunity_type.replace(/_/g, " ")}
                </span>
                {typeof opp.score === "number" && (
                  <span className="font-mono text-[10.5px] text-muted-2">score {opp.score}/10</span>
                )}
              </div>
              <h3 className="text-[16px] font-semibold text-ink font-serif leading-snug m-0">{opp.title}</h3>
              <p className="text-[13px] text-muted leading-[1.55] m-0">{opp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
