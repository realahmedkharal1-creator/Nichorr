"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { FileText, Download, ShieldCheck, Printer, Copy, Check } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
      <div className="space-y-6">
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
${(brief.executive_summary || []).join("nn")}

## 2. KEY FINDINGS & VERIFIED FACTS
${(brief.key_findings || []).map((f, i) => `${i + 1}. ${f.finding} (Confidence: ${f.confidence})`).join("n")}

## 3. CONFLICTING EVIDENCE
${(brief.conflicts || []).map((c) => `- [${c.conflict_type}] ${c.explanation}`).join("n")}

## 4. COMMUNITY SIGNALS
${(brief.community_signals || []).map((s) => `- [${s.signal_type}] ${s.signal}`).join("n")}

## 5. AUDIENCE QUESTIONS
${(brief.audience_questions || []).map((q) => `- ${q.question} (Gap: ${q.coverage_gap})`).join("n")}

## 6. CONTENT OPPORTUNITIES
${(brief.content_opportunities || []).map((o) => `### ${o.title}n${o.description}`).join("nn")}

## 7. SOURCES
${(run.sources || []).map((s) => `- ${s.title} (${s.publisher}) - ${s.url}`).join("n")}
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
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1.5 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> AUDITED RESEARCH BRIEF DOCUMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{run.topic}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
            {copied ? "Copied Markdown!" : "Copy Markdown"}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4.5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Export Brief (.md)
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Structured Brief Document Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8 font-sans">
        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            1. Executive Summary
          </h2>
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-sans">
            {(brief.executive_summary || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">2. Key Findings & Verified Facts</h2>
          <div className="space-y-2.5">
            {(brief.key_findings || []).map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm flex items-start justify-between gap-4">
                <span className="text-slate-700 leading-relaxed">{f.finding}</span>
                <span className="badge-verified px-2.5 py-1 rounded-md text-xs font-mono font-bold shrink-0">
                  {f.confidence} CONFIDENCE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disagreements & Conflicts */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Conflicting Evidence & Disagreements</h2>
          <div className="space-y-2.5">
            {(brief.conflicts || []).map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-600 space-y-1.5">
                <span className="font-bold uppercase font-mono tracking-wider">[{c.conflict_type} DISAGREEMENT]</span>
                <p className="leading-relaxed text-slate-700">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Audience */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">4. Community Signals</h2>
            <div className="space-y-2">
              {(brief.community_signals || []).map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-mono text-indigo-600 font-semibold uppercase block mb-0.5">{s.signal_type}</span>
                  <p>{s.signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">5. Unanswered Audience Questions</h2>
            <div className="space-y-2">
              {(brief.audience_questions || []).map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex justify-between items-start gap-2">
                  <p>{q.question}</p>
                  <span className="font-mono text-[10px] bg-slate-50 px-2 py-0.5 rounded text-indigo-600 shrink-0 font-semibold">{q.coverage_gap} GAP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Opportunities */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">6. High-Demand Content Opportunities</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(brief.content_opportunities || []).map((o, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-4 space-y-1.5">
                <span className="font-bold text-indigo-600 text-sm block">{o.title}</span>
                <p className="text-xs text-slate-500 leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-700 font-mono uppercase">7. Audited Sources & Citations</h2>
          <ul className="space-y-1 text-xs font-mono text-slate-500 divide-y divide-slate-100">
            {(run.sources || []).map((s, idx) => (
              <li key={idx} className="pt-2 flex justify-between items-center gap-4">
                <span className="text-slate-700 truncate">{s.title} ({s.publisher})</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline shrink-0 text-[11px]">
                  View Source ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
