"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { FileText, Download, ShieldCheck, Copy, Check, Sparkles, BookOpen } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export default function BriefPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
      });
  }, [params.id]);

  if (!run || !run.brief) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  const brief = run.brief;

  const generateMarkdownExport = () => {
    return `# VERITASTECH AI RESEARCH BRIEF
Topic: ${run.topic}
Date: ${new Date(run.createdAt).toLocaleDateString()}
Quality Gate: ${run.qualityGateStatus}

## 1. EXECUTIVE SUMMARY
${(brief.executive_summary || []).join("\n\n")}

## 2. KEY FINDINGS & VERIFIED FACTS
${(brief.key_findings || []).map((f, i) => `${i + 1}. ${f.finding} (Confidence: ${f.confidence})`).join("\n")}

## 3. CONFLICTING EVIDENCE
${(brief.conflicts || []).map((c) => `- [${c.conflict_type}] ${c.explanation}`).join("\n")}

## 4. COMMUNITY SIGNALS
${(brief.community_signals || []).map((s) => `- [${s.signal_type}] ${s.signal}`).join("\n")}

## 5. AUDIENCE QUESTIONS
${(brief.audience_questions || []).map((q) => `- ${q.question} (Gap: ${q.coverage_gap})`).join("\n")}

## 6. CONTENT OPPORTUNITIES
${(brief.content_opportunities || []).map((o) => `### ${o.title}\n${o.description}`).join("\n\n")}

## 7. SOURCES
${(run.sources || []).map((s) => `- ${s.title} (${s.publisher}) - ${s.url}`).join("\n")}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([generateMarkdownExport()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veritas-brief-${run.id}.md`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#15803d] font-bold flex items-center gap-1.5 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" /> AUDITED RESEARCH BRIEF DOCUMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            {run.topic}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] px-4 py-2.5 rounded-full text-xs font-semibold transition shadow-2xs cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#34c759]" /> : <Copy className="w-3.5 h-3.5 text-[#0071e3]" />}
            <span>{copied ? "Copied Markdown!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brief (.md)</span>
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Main Document Body */}
      <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-8 max-w-4xl mx-auto">
        {/* Document Header Metadata */}
        <div className="border-b border-[#f5f5f7] pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              QUALITY GATE: {run.qualityGateStatus || "PASSED"}
            </Badge>
            <span className="text-xs font-mono text-[#8e8e93] font-bold">
              {new Date(run.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1d1d1f]">{run.topic}</h2>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-[#0071e3] uppercase tracking-wider">
            1. Executive Summary
          </h3>
          <div className="space-y-3 text-sm text-[#1d1d1f] leading-relaxed font-normal">
            {(brief.executive_summary || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Section 2: Key Findings */}
        <div className="space-y-3 pt-4 border-t border-[#f5f5f7]">
          <h3 className="text-sm font-mono font-bold text-[#0071e3] uppercase tracking-wider">
            2. Verified Findings & Empirical Facts
          </h3>
          <div className="space-y-3">
            {(brief.key_findings || []).map((f, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1d1d1f]">Finding #{idx + 1}</span>
                  <Badge variant="success" size="sm">
                    {f.confidence} Confidence
                  </Badge>
                </div>
                <p className="text-[#1d1d1f] font-medium leading-relaxed">{f.finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Conflicts */}
        {brief.conflicts && brief.conflicts.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#f5f5f7]">
            <h3 className="text-sm font-mono font-bold text-[#ff9500] uppercase tracking-wider">
              3. Methodological Disagreements
            </h3>
            <div className="space-y-2.5">
              {brief.conflicts.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-xs space-y-1"
                >
                  <span className="font-mono font-bold text-[#b45309] block uppercase">
                    [{c.conflict_type}]
                  </span>
                  <p className="text-[#1d1d1f] font-medium leading-relaxed">{c.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Content Opportunities */}
        {brief.content_opportunities && brief.content_opportunities.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#f5f5f7]">
            <h3 className="text-sm font-mono font-bold text-[#0071e3] uppercase tracking-wider">
              4. Video Content Angles & Opportunities
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {brief.content_opportunities.map((o, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-1.5 text-xs"
                >
                  <h4 className="font-bold text-[#1d1d1f]">{o.title}</h4>
                  <p className="text-[#6e6e73] font-medium leading-relaxed">{o.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
