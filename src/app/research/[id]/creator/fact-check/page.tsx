"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FactCheckResult } from "@/lib/intelligence/fact-checker";

export default function FactCheckPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [draftStatement, setDraftStatement] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) { setRun(data.run); } else { setNotFound(true); }
      });
  }, [params.id]);

  const handleFactCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftStatement.trim() || checking) return;

    setChecking(true);
    try {
      const res = await fetch(`/api/research/${params.id}/creator/fact-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: draftStatement }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.factCheck);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

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
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header */}
        <div className="border-b border-line pb-4">
          <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">CREATOR FACT-CHECK AUDITOR</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-citation" />
            Interactive Script & Statement Fact Checker
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">Audit draft script sentences against verified project knowledge before recording or publishing.</p>
        </div>

        {/* Fact Check Input Card  */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink/80 uppercase font-mono">
              Paste Draft Script Statement to Audit <span className="text-conflict">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions..."
              value="Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions "
              readOnly
              className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-ink text-xs sm:text-sm focus:outline-none focus:border-citation transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              disabled
              className="flex items-center gap-2 bg-citation text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-card shadow-indigo-600/20 transition opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              Audit Statement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">CREATOR FACT-CHECK AUDITOR</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-citation" />
          Interactive Script & Statement Fact Checker
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">Audit draft script sentences against verified project knowledge before recording or publishing.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Fact Check Input Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-card border-line space-y-4">
        <form onSubmit={handleFactCheck} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink/80 uppercase font-mono">
              Paste Draft Script Statement to Audit <span className="text-conflict">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions..."
              value={draftStatement}
              onChange={(e) => setDraftStatement(e.target.value)}
              className="w-full bg-paper border border-line rounded-xl px-4 py-3 text-ink text-xs sm:text-sm focus:outline-none focus:border-citation transition"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!draftStatement.trim() || checking}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-card shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {checking ? "Auditing Evidence..." : "Audit Statement"}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Result Display */}
      {result && (
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-card border-line space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="text-xs font-mono font-bold text-muted uppercase">AUDIT VERDICT</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                result.verdict === "SUPPORTED"
                  ? "bg-verified-bg text-verified border border-verified/25"
                  : result.verdict === "CONTRADICTED"
                  ? "bg-conflict-bg text-conflict border border-conflict/25"
                  : "bg-warning-bg text-warning border border-warning/25"
              }`}
            >
              VERDICT: {result.verdict}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm font-sans">
            <div className="space-y-1">
              <span className="text-xs font-mono text-muted uppercase block">EXPLANATION & ANALYSIS</span>
              <p className="text-ink/80 leading-relaxed bg-paper p-4 rounded-xl border border-line">
                {result.explanation}
              </p>
            </div>

            {result.supportingFact && (
              <div className="space-y-1">
                <span className="text-xs font-mono text-citation uppercase block">SUPPORTING VERIFIED FACT</span>
                <p className="text-ink/80 bg-paper p-3.5 rounded-xl border border-line font-mono text-xs">
                  "{result.supportingFact}"
                </p>
              </div>
            )}

            {result.saferWording && (
              <div className="space-y-1">
                <span className="text-xs font-mono text-verified uppercase block font-bold">RECOMMENDED EVIDENCE-SAFE ALTERNATIVE WORDING</span>
                <p className="text-verified bg-verified-bg p-4 rounded-xl border border-emerald-900/50 leading-relaxed font-sans font-medium">
                  "{result.saferWording}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
