"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { FactCheckResult } from "@/lib/intelligence/fact-checker";

export default function FactCheckPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [draftStatement, setDraftStatement] = useState("");
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
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

  if (!run) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">CREATOR FACT-CHECK AUDITOR</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Interactive Script & Statement Fact Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit draft script sentences against verified project knowledge before recording or publishing.</p>
        </div>

        {/* Fact Check Input Card  */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase font-mono">
              Paste Draft Script Statement to Audit <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions..."
              value="Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions "
              readOnly
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div className="flex justify-end">
            <button
              disabled
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition opacity-50"
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
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">CREATOR FACT-CHECK AUDITOR</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-indigo-600" />
          Interactive Script & Statement Fact Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Audit draft script sentences against verified project knowledge before recording or publishing.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Fact Check Input Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-4">
        <form onSubmit={handleFactCheck} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase font-mono">
              Paste Draft Script Statement to Audit <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Snapdragon 8 Gen 5 delivers 3.2GHz clock speeds across all thermal test conditions..."
              value={draftStatement}
              onChange={(e) => setDraftStatement(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!draftStatement.trim() || checking}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {checking ? "Auditing Evidence..." : "Audit Statement"}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Result Display */}
      {result && (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">AUDIT VERDICT</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                result.verdict === "SUPPORTED"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : result.verdict === "CONTRADICTED"
                  ? "bg-rose-50 text-rose-600 border border-rose-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}
            >
              VERDICT: {result.verdict}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm font-sans">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-500 uppercase block">EXPLANATION & ANALYSIS</span>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {result.explanation}
              </p>
            </div>

            {result.supportingFact && (
              <div className="space-y-1">
                <span className="text-xs font-mono text-indigo-600 uppercase block">SUPPORTING VERIFIED FACT</span>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-mono text-xs">
                  "{result.supportingFact}"
                </p>
              </div>
            )}

            {result.saferWording && (
              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-600 uppercase block font-bold">RECOMMENDED EVIDENCE-SAFE ALTERNATIVE WORDING</span>
                <p className="text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-900/50 leading-relaxed font-sans font-medium">
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
