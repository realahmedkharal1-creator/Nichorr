"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { FileText, Copy, Check, ArrowLeft, ShieldCheck, Video, Lock } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ScriptOutlinePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
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
${(scriptOutline.keyClaimBlocks || []).map((b: any) => `${b.sectionTitle}:\n${b.claimText} [Status: ${b.status}]`).join("\n\n")}

4. COUNTERARGUMENTS & SCRIPT WARNINGS:
${(scriptOutline.counterarguments || []).map((c: any) => `• [${c.type}] ${c.advice}`).join("\n")}

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">CREATOR PRODUCTION PIPELINE</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
              <Video className="w-7 h-7 text-citation" />
              Evidence-Locked Video Script Outline
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">Structured video script outline strictly locked to verified research claims & evidence.</p>
          </div>
        </div>

        {/* Script Outline Card  */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 sm:p-8 space-y-6 font-sans">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-citation uppercase tracking-wider">1. ATTENTION HOOK </span>
            <p className="text-sm font-semibold text-ink bg-paper p-4 rounded-xl border border-line leading-relaxed">
              "hook content..."
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">CREATOR PRODUCTION PIPELINE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-citation" />
            Evidence-Locked Video Script Outline
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">Structured video script outline strictly locked to verified research claims & evidence.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4.5 py-2.5 rounded-xl text-xs font-semibold shadow-card shadow-indigo-600/20 transition"
          >
            {copied ? <Check className="w-4 h-4 text-verified" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied Script Outline!" : "Copy Full Outline"}
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Script Outline Card */}
      <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 sm:p-8 bg-card border-line space-y-6 font-sans">
        {/* Section 1: Hook */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-citation uppercase tracking-wider">1. ATTENTION HOOK</span>
          <p className="text-sm font-semibold text-ink bg-paper p-4 rounded-xl border border-line leading-relaxed">
            "{scriptOutline.hook}"
          </p>
        </div>

        {/* Section 2: Context */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-citation uppercase tracking-wider">2. BENCHMARK CONTEXT</span>
          <p className="text-xs sm:text-sm text-ink/80 bg-paper p-4 rounded-xl border border-line leading-relaxed font-sans">
            {scriptOutline.context}
          </p>
        </div>

        {/* Section 3: Evidence-Locked Claim Blocks */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-citation uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-citation" /> 3. EVIDENCE-LOCKED CLAIM BLOCKS ({scriptOutline.keyClaimBlocks.length})
          </span>
          <div className="space-y-3">
            {scriptOutline.keyClaimBlocks.map((block: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-paper border border-line space-y-2">
                <div className="flex items-center justify-between border-b border-line pb-2 text-xs font-mono">
                  <span className="font-bold text-citation">{block.sectionTitle}</span>
                  <span className="px-2 py-0.5 rounded bg-citation-bg text-citation border border-citation/20 font-bold">
                    {block.status}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">{block.claimText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Counterargument Scripting Warnings */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-warning uppercase tracking-wider">4. SCRIPTING WARNINGS & COUNTERARGUMENTS</span>
          <div className="space-y-2">
            {scriptOutline.counterarguments.map((cnf: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-warning-bg border border-warning/25 text-xs text-warning space-y-1">
                <span className="font-bold font-mono uppercase">[{cnf.type}] WARNING:</span>
                <p className="text-ink/80">{cnf.advice}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Conclusion & CTA */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-line">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-ink/80 uppercase">5. CONCLUSION SUMMARY</span>
            <p className="text-xs text-ink/80 bg-paper p-3.5 rounded-xl border border-line leading-relaxed">
              {scriptOutline.conclusion}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-ink/80 uppercase">6. AUDIENCE CALL TO ACTION</span>
            <p className="text-xs text-ink/80 bg-paper p-3.5 rounded-xl border border-line leading-relaxed">
              {scriptOutline.callToAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
