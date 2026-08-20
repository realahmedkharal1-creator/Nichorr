"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { ContentItemEntity } from "@/lib/database/repositories/content.repo";
import { PublishReadinessChecklist } from "@/lib/intelligence/publish-readiness";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function PublishReadinessPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<ContentItemEntity | null>(null);
  const [readiness, setReadiness] = useState<PublishReadinessChecklist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadiness();
  }, [params.id]);

  const fetchReadiness = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}/readiness`);
      const data = await res.json();
      if (data.success) {
        setReadiness(data.readiness);
        // Fetch item details
        const itemRes = await fetch(`/api/content/${params.id}`);
        const itemData = await itemRes.json();
        if (itemData.success) setItem(itemData.contentItem);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !readiness || !item) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  const checklistItems = [
    { label: "Linked Evidence Coverage", passed: readiness.evidenceCoverage },
    { label: "Script Fact-Check Audit Completed", passed: readiness.factCheckCompleted },
    { label: "Contradictory Claims Reviewed", passed: readiness.contradictionsReviewed },
    { label: "Source Classifications Verified", passed: readiness.sourcesVerified },
    { label: "Evidence Freshness Verified (<30 days)", passed: readiness.knowledgeFreshnessChecked },
    { label: "Script Outline & Wording Reviewed", passed: readiness.scriptReviewed },
    { label: "Claim-Level Evidence Lock Confirmed", passed: readiness.claimsReviewed },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">PUBLISH READINESS ENGINE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-indigo-400" />
          8-Point Publish Readiness Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit evidence integrity, script safety, and claim verification before publishing content for "{item.title}".</p>
      </div>

      {/* Overall Verdict Card */}
      <div className={`slate-card p-6 border flex items-center justify-between gap-4 ${
        readiness.finalReadiness === "READY"
          ? "bg-emerald-950/30 border-emerald-800/80 text-emerald-300"
          : readiness.finalReadiness === "READY_WITH_WARNINGS"
          ? "bg-amber-950/30 border-amber-800/80 text-amber-300"
          : "bg-rose-950/30 border-rose-800/80 text-rose-300"
      }`}>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase">FINAL READINESS VERDICT</span>
          <h2 className="text-2xl font-extrabold">{readiness.finalReadiness}</h2>
        </div>

        <button
          onClick={fetchReadiness}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-750 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" /> Re-Audit Readiness
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 border-b border-slate-850 pb-3">Automated Publish Checklist</h3>
        <div className="space-y-3">
          {checklistItems.map((chk, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-850 text-xs font-mono">
              <span className="text-slate-200 font-semibold">{chk.label}</span>
              {chk.passed ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-850">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-950/80 px-2.5 py-1 rounded border border-rose-850">
                  <XCircle className="w-3.5 h-3.5" /> ACTION NEEDED
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
