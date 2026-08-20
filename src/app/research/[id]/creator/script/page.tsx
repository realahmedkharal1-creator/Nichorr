"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { FileText, Copy, Check, ArrowLeft, ShieldCheck, Video, Lock } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ScriptOutlinePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [scriptOutline, setScriptOutline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRun(data.run);
          fetchScriptOutline();
        }
      });
  }, [params.id]);

  const fetchScriptOutline = async () => {
    try {
      const res = await fetch(`/api/research/${params.id}/creator/script`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setScriptOutline(data.scriptOutline);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyScript = () => {
    if (!scriptOutline) return;
    const text = `VIDEO SCRIPT OUTLINE: ${run?.topic}

1. HOOK:
${scriptOutline.hook}

2. CONTEXT:
${scriptOutline.context}

3. EVIDENCE-LOCKED KEY CLAIMS:
${(scriptOutline.keyClaimBlocks || []).map((b: any) => `${b.sectionTitle}:n${b.claimText} [Status: ${b.status}]`).join("nn")}

4. COUNTERARGUMENTS & SCRIPT WARNINGS:
${(scriptOutline.counterarguments || []).map((c: any) => `• [${c.type}] ${c.advice}`).join("n")}

5. CONCLUSION:
${scriptOutline.conclusion}

6. CALL TO ACTION:
${scriptOutline.callToAction}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !run || !scriptOutline) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">CREATOR PRODUCTION PIPELINE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-indigo-400" />
            Evidence-Locked Video Script Outline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Structured video script outline strictly locked to verified research claims & evidence.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4.5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Script Outline!" : "Copy Full Outline"}
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Script Outline Card */}
      <div className="slate-card p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6 font-sans">
        {/* Section 1: Hook */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">1. ATTENTION HOOK</span>
          <p className="text-sm font-semibold text-slate-100 bg-slate-950 p-4 rounded-xl border border-slate-850 leading-relaxed">
            "{scriptOutline.hook}"
          </p>
        </div>

        {/* Section 2: Context */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">2. BENCHMARK CONTEXT</span>
          <p className="text-xs sm:text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-850 leading-relaxed font-sans">
            {scriptOutline.context}
          </p>
        </div>

        {/* Section 3: Evidence-Locked Claim Blocks */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> 3. EVIDENCE-LOCKED CLAIM BLOCKS ({scriptOutline.keyClaimBlocks.length})
          </span>
          <div className="space-y-3">
            {scriptOutline.keyClaimBlocks.map((block: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2 text-xs font-mono">
                  <span className="font-bold text-indigo-300">{block.sectionTitle}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                    {block.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{block.claimText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Counterargument Scripting Warnings */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">4. SCRIPTING WARNINGS & COUNTERARGUMENTS</span>
          <div className="space-y-2">
            {scriptOutline.counterarguments.map((cnf: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300 space-y-1">
                <span className="font-bold font-mono uppercase">[{cnf.type}] WARNING:</span>
                <p className="text-slate-200">{cnf.advice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Conclusion & CTA */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-850">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">5. CONCLUSION SUMMARY</span>
            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-850 leading-relaxed">
              {scriptOutline.conclusion}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">6. AUDIENCE CALL TO ACTION</span>
            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-850 leading-relaxed">
              {scriptOutline.callToAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
