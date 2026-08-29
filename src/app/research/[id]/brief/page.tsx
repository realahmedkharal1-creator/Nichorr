"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { FileText, Download, ShieldCheck, Printer, Copy, Check } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function BriefPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) { setRun(data.run); } else { setNotFound(true); }
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
    return `# NICHORR RESEARCH BRIEF
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
    a.download = `nichorr-brief-${run.id}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-xs font-mono text-verified font-bold flex items-center gap-1.5 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> AUDITED RESEARCH BRIEF DOCUMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">{run.topic}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 bg-card hover:bg-paper text-ink/80 border border-line px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-verified" /> : <Copy className="w-4 h-4 text-citation" />}
            {copied ? "Copied Markdown!" : "Copy Markdown"}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-citation hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-card transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Export Brief (.md)
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Structured Brief Document Card */}
      <div
        dir={run.outputLanguage === "ar" ? "rtl" : "ltr"}
        className="bg-card rounded-2xl shadow-card border border-line p-6 sm:p-10 space-y-8 font-sans"
      >
        {/* Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-citation" />
            1. Executive Summary
          </h2>
          <div className="space-y-3 text-sm text-ink/80 leading-relaxed font-sans">
            {(brief.executive_summary || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2">2. Key Findings & Verified Facts</h2>
          <div className="space-y-2.5">
            {(brief.key_findings || []).map((f, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-paper border border-line text-sm flex items-start justify-between gap-4">
                <span className="text-ink/80 leading-relaxed">{f.finding}</span>
                <span className="badge-verified px-2.5 py-1 rounded-md text-xs font-mono font-bold shrink-0">
                  {f.confidence} CONFIDENCE
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Disagreements & Conflicts */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2">3. Conflicting Evidence & Disagreements</h2>
          <div className="space-y-2.5">
            {(brief.conflicts || []).length === 0 && (
              <p className="text-sm text-muted m-0">No conflicting reports — independent sources agree on the primary findings.</p>
            )}
            {(brief.conflicts || []).map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-warning-bg border border-warning/25 text-xs text-warning space-y-1.5">
                <span className="font-bold uppercase font-mono tracking-wider">[{c.conflict_type} DISAGREEMENT]</span>
                <p className="leading-relaxed text-ink/80">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Audience */}
        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-ink border-b border-line pb-2">4. Community Signals</h2>
            <div className="space-y-2">
              {(brief.community_signals || []).length === 0 && (
                <p className="text-xs text-muted m-0">No recurring community signals.</p>
              )}
              {(brief.community_signals || []).map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-paper border border-line text-xs text-ink/80">
                  <span className="font-mono text-citation font-semibold uppercase block mb-0.5">{s.signal_type}</span>
                  <p>{s.signal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-ink border-b border-line pb-2">5. Unanswered Audience Questions</h2>
            <div className="space-y-2">
              {(brief.audience_questions || []).length === 0 && (
                <p className="text-xs text-muted m-0">No unanswered audience questions surfaced.</p>
              )}
              {(brief.audience_questions || []).map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-paper border border-line text-xs text-ink/80 flex justify-between items-start gap-2">
                  <p>{q.question}</p>
                  <span className="font-mono text-[10px] bg-paper px-2 py-0.5 rounded text-citation shrink-0 font-semibold">{q.coverage_gap} GAP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Opportunities */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2">6. High-Demand Content Opportunities</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {(brief.content_opportunities || []).map((o, idx) => (
              <div key={idx} className="bg-paper rounded-xl border border-line p-4 space-y-1.5">
                <span className="font-bold text-citation text-sm block">{o.title}</span>
                <p className="text-xs text-muted leading-relaxed">{o.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-3 pt-2 border-t border-line">
          <h2 className="text-sm font-bold text-ink/80 font-mono uppercase">7. Audited Sources & Citations</h2>
          <ul className="space-y-1 text-xs font-mono text-muted divide-y divide-line">
            {(run.sources || []).map((s, idx) => (
              <li key={idx} className="pt-2 flex justify-between items-center gap-4">
                <span className="text-ink/80 truncate">{s.title} ({s.publisher})</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-citation hover:underline shrink-0 text-[11px]">
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
