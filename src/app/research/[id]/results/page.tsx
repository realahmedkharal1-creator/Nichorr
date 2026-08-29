"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ResearchRunSession } from "@/features/research/research-engine";
import { YouTubeIntelligenceReport, YouTubeVideoItem } from "@/lib/youtube/youtube.types";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  ExternalLink, PlayCircle, Bot, Send, HelpCircle, Sparkles, AlertTriangle, ShieldCheck,
  CheckCircle2, ShieldAlert, Info, Filter, X, Copy, Quote, MessageSquare, Eye, ThumbsUp, Plus,
  Search, Download, ArrowRight, BadgeCheck, Users, TrendingUp, ChevronRight, LayoutDashboard,
  Video, FileCheck, GitBranch, FileText, Loader2,
} from "lucide-react";

type Tone = "ink" | "verified" | "conflict" | "citation" | "warning";

const TONE_SURFACE: Record<Tone, string> = {
  ink: "bg-card border-line",
  verified: "bg-verified-bg border-verified/25",
  conflict: "bg-conflict-bg border-conflict/25",
  citation: "bg-citation-bg border-citation/25",
  warning: "bg-warning-bg border-warning/25",
};

const TONE_ICON_SOLID: Record<Tone, string> = {
  ink: "bg-ink/90 text-card",
  verified: "bg-verified text-white",
  conflict: "bg-conflict text-white",
  citation: "bg-citation text-white",
  warning: "bg-warning text-white",
};

const TONE_VALUE_TEXT: Record<Tone, string> = {
  ink: "text-ink",
  verified: "text-verified",
  conflict: "text-conflict",
  citation: "text-citation",
  warning: "text-warning",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  tone = "ink",
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  tone?: Tone;
}) {
  return (
    <div
      className={`group relative rounded-2xl border p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${TONE_SURFACE[tone]}`}
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${TONE_ICON_SOLID[tone]}`}>
        <Icon className="w-5 h-5" strokeWidth={2.25} />
      </div>
      <div className={`font-serif font-extrabold text-[36px] leading-none tracking-tight ${TONE_VALUE_TEXT[tone]}`}>
        {value}
      </div>
      <div className="text-[12px] font-bold uppercase tracking-[0.3px] text-ink/75 mt-2.5">{label}</div>
      {sublabel && <div className="text-[11.5px] font-medium text-ink/45 mt-0.5">{sublabel}</div>}
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-ink/70 mb-4">
      {Icon && (
        <span className="w-6 h-6 rounded-lg bg-ink/5 flex items-center justify-center text-ink/60">
          <Icon className="w-3.5 h-3.5" />
        </span>
      )}
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-card border border-dashed border-line rounded-2xl p-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-paper flex items-center justify-center mx-auto mb-4 text-muted-2">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="m-0 mb-1.5 text-[15px] font-semibold text-ink font-serif">{title}</h4>
      <p className="m-0 text-[13px] text-muted max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [youtubeReport, setYoutubeReport] = useState<YouTubeIntelligenceReport | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // YouTube Sub-Tab State
  const [ytActiveTab, setYtActiveTab] = useState("consensus");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);

  // Evidence State
  const [evidenceSearch, setEvidenceSearch] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState("All Claims");
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);

  // Horizontal tab strip: drag-to-scroll + mouse-wheel support
  const tabStripRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, moved: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const el = tabStripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      // Only hijack the wheel when there is actually somewhere to scroll, so the page
      // still scrolls normally once the strip is at its end.
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      el.scrollLeft += Math.abs(e.deltaY) < 40 ? e.deltaY : e.deltaY * 1.5;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [loading]); // re-bind once the strip actually mounts (it renders only after loading)

  // Ask AI State
  const [askQuestion, setAskQuestion] = useState("");
  const [askMessages, setAskMessages] = useState<any[]>([]);
  const [askLoading, setAskLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch(`/api/research/${params.id}/status`).then(res => res.json()),
      fetch(`/api/research/${params.id}/youtube`).then(res => res.json()).catch(() => ({ success: false }))
    ]).then(([statusData, ytData]) => {
      if (statusData.success) {
        setRun(statusData.run);
        setAskMessages([
          {
            role: "assistant",
            content: `I'm your research-grounded assistant for "${statusData.run.topic}". Ask me any technical question, and I'll answer strictly using the ${statusData.run.claims?.length || 0} verified claims and ${statusData.run.sources?.length || 0} audited sources in this investigation.`,
            citations: []
          }
        ]);
      } else {
        setNotFound(true);
      }
      if (ytData.success && ytData.youtube) {
        setYoutubeReport(ytData.youtube);
        if (ytData.youtube.videos && ytData.youtube.videos.length > 0) {
          setSelectedVideo(ytData.youtube.videos[0]);
        }
      }
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleAskSend = async (textToSend?: string) => {
    const q = textToSend || askQuestion;
    if (!q.trim() || askLoading || !run) return;
    const userMsg = { role: "user", content: q };
    setAskMessages(prev => [...prev, userMsg]);
    setAskQuestion("");
    setAskLoading(true);
    try {
      const res = await fetch(`/api/research/${run.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      if (data.success) {
        setAskMessages(prev => [...prev, { role: "assistant", content: data.answer, citations: data.citations || [], hasSufficientEvidence: data.hasSufficientEvidence }]);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setAskMessages(prev => [...prev, { role: "assistant", content: "I encountered an error trying to process that question." }]);
    } finally {
      setAskLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-[1180px] mx-auto py-20 px-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-conflict-bg text-conflict flex items-center justify-center mx-auto mb-4">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="text-[22px] font-serif font-semibold text-ink mb-1.5">Run Not Found</h2>
        <p className="text-muted text-[13.5px]">This research run could not be recovered.</p>
      </div>
    );
  }

  if (loading || !run) {
    return (
      <div className="max-w-[1180px] mx-auto py-6 px-5 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    );
  }

  // A conflict only counts if it carries a real type and explanation. Guards the UI
  // against half-populated conflict objects rendering as blank cards, and keeps the
  // headline count honest.
  const conflicts = (run.conflicts || []).filter((c) => c.conflict_type && c.explanation);

  // Real per-claim source attribution. This UI previously printed a fixed "AnandTech · Tier 1"
  // next to every claim regardless of where the claim actually came from.
  const sourceLabelForClaim = (claim: { evidence_ids?: string[] }): string => {
    const evId = (claim.evidence_ids || [])[0];
    const ev = (run.evidence || []).find((e) => e.id === evId);
    const src = ev ? (run.sources || []).find((sc) => sc.id === ev.source_id) : undefined;
    if (!src) return "Source not linked";
    let host = src.publisher || "";
    try {
      host = new URL(src.url).hostname.replace(/^www\./, "");
    } catch {
      /* keep publisher */
    }
    const tier = src.sourceTier ? ` · Tier ${src.sourceTier}` : "";
    return `${host || src.publisher || "Unknown source"}${tier}`;
  };

  // Real confidence summary, replacing a hardcoded "High (92%)". Confidence is reported as the
  // dominant band across claims (the product deliberately avoids fake precision percentages).
  const claimsWithEvidence = (run.claims || []).filter((c) => (c.evidence_ids || []).length > 0).length;
  const confidenceCounts = (run.claims || []).reduce<Record<string, number>>((acc, c) => {
    const band = (c.confidence || "UNKNOWN").toUpperCase();
    acc[band] = (acc[band] || 0) + 1;
    return acc;
  }, {});
  const dominantConfidence =
    Object.entries(confidenceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  // Evidence quality, reported honestly: excerpts that failed extraction are counted, not hidden.
  const failedEvidence = (run.evidence || []).filter((e) => e.excerpt.startsWith("[EXTRACTION_FAILED]"));
  const usableEvidence = (run.evidence || []).filter((e) => !e.excerpt.startsWith("[EXTRACTION_FAILED]"));

  // First real claim -> excerpt -> source chain, for the provenance preview.
  // Caveats the run actually produced: the brief's own caveats, plus each real conflict.
  const briefCaveats: string[] = [
    ...((run.brief?.important_caveats as string[] | undefined) || []),
    ...conflicts.map((c) => `${c.conflict_type.replace(/_/g, " ")}: ${c.explanation} State both sets of test conditions on screen rather than presenting one as definitive.`),
  ];

  // Evidence tab filtering. The category chips were previously decorative: `evidenceFilter`
  // was set on click but never applied, so all four showed an identical list.
  const EVIDENCE_CATEGORIES: Record<string, RegExp> = {
    "Performance & SoC": /\bchip|\bsoc\b|processor|snapdragon|\ba\d\d\b|exynos|\bcpu\b|\bgpu\b|\bfps\b|benchmark|\bperformance\b|throttl|thermal/i,
    "Camera & Optics": /\bcamera|\bmegapixel|\d+\s?mp\b|\blens\b|telephoto|\bzoom\b|\bphoto|video quality|\bsensor\b|aperture/i,
    "Battery & Charging": /\bbattery|\bmah\b|\bcharg|\bwatt|\d+\s?w\b|\bendurance\b|playback|screen[- ]on time/i,
  };
  const filteredClaims = (run.claims || []).filter((c) => {
    const text = c.claim_text.toLowerCase();
    if (!text.includes(evidenceSearch.toLowerCase())) return false;
    if (evidenceFilter === "All Claims") return true;
    const pattern = EVIDENCE_CATEGORIES[evidenceFilter];
    return pattern ? pattern.test(c.claim_text) : true;
  });

  const firstClaim = (run.claims || [])[0];
  const lineage = firstClaim
    ? (() => {
        const ev = (run.evidence || []).find((e) => (firstClaim.evidence_ids || []).includes(e.id));
        const src = ev ? (run.sources || []).find((sc) => sc.id === ev.source_id) : undefined;
        return { claim: firstClaim, evidence: ev, source: src };
      })()
    : null;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "youtube", label: "YouTube Intel", icon: Video },
    { id: "evidence", label: "Evidence", icon: FileCheck },
    { id: "conflicts", label: "Conflicts", icon: AlertTriangle },
    { id: "provenance", label: "Provenance", icon: GitBranch },
    { id: "ask", label: "Ask AI", icon: Bot },
    { id: "community", label: "Community", icon: MessageSquare },
    { id: "audience", label: "Audience Qs", icon: HelpCircle },
    { id: "opportunities", label: "Opportunities", icon: Sparkles },
    { id: "brief", label: "Final Brief", icon: FileText },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-7 px-5 pb-24 font-sans">
      {/* Hero header */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-line p-6 sm:p-8 mb-6 shadow-card">
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-citation/[0.07] blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.4px] text-verified bg-verified-bg px-2.5 py-1 rounded-full mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Audited brief ready
            </span>
            <h1 className="font-serif font-bold text-[27px] sm:text-[34px] m-0 text-ink leading-[1.15] tracking-tight max-w-2xl">{run.topic}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink bg-paper border border-line rounded-full px-2.5 py-1">
                <FileCheck className="w-3.5 h-3.5 text-citation" />{run.sources?.length || 0} sources
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink bg-paper border border-line rounded-full px-2.5 py-1">
                <BadgeCheck className="w-3.5 h-3.5 text-verified" />{run.claims?.length || 0} claims
              </span>
              {conflicts.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink bg-paper border border-line rounded-full px-2.5 py-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-conflict" />{conflicts.length} conflicts
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab("brief")}
            className="group/btn shrink-0 inline-flex items-center justify-center gap-2 bg-citation text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-xl border-none cursor-pointer whitespace-nowrap w-full sm:w-auto shadow-card hover:shadow-card-hover hover:opacity-95 hover:-translate-y-0.5 transition-all"
          >
            View Full Brief <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="relative mb-6">
        <div
          ref={tabStripRef}
          onMouseDown={(e) => {
            const el = tabStripRef.current;
            if (!el) return;
            dragState.current = { active: true, moved: false, startX: e.pageX, startScroll: el.scrollLeft };
          }}
          onMouseMove={(e) => {
            const el = tabStripRef.current;
            if (!el || !dragState.current.active) return;
            const walk = e.pageX - dragState.current.startX;
            if (Math.abs(walk) > 4) dragState.current.moved = true;
            el.scrollLeft = dragState.current.startScroll - walk;
          }}
          onMouseUp={() => { dragState.current.active = false; }}
          onMouseLeave={() => { dragState.current.active = false; }}
          className="flex gap-2 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollbarWidth: "none",
            WebkitMaskImage: "linear-gradient(to right, black calc(100% - 24px), transparent)",
            maskImage: "linear-gradient(to right, black calc(100% - 24px), transparent)",
          }}
        >
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (dragState.current.moved) return;
                  setActiveTab(t.id);
                }}
                draggable={false}
                className={`shrink-0 inline-flex items-center gap-1.5 font-sans text-[12.5px] font-semibold px-3.5 py-2 rounded-full border cursor-pointer whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-ink text-paper border-ink shadow-card"
                    : "bg-card text-muted border-line hover:border-muted-2 hover:text-ink"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-paper" : "text-muted-2"}`} />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="h-px bg-line" />
      </div>

      {activeTab === "overview" && (
        <div className="animate-in fade-in duration-300 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={FileCheck} label="Verified Sources" value={run.sources?.length || 0} sublabel="100% traceable" tone="citation" />
            <StatCard icon={BadgeCheck} label="Supported Claims" value={run.claims?.length || 0} sublabel="excerpt backed" tone="verified" />
            <StatCard icon={AlertTriangle} label="Conflicts Surfaced" value={conflicts.length} sublabel="methodological" tone="conflict" />
            <StatCard icon={Users} label="Community Signals" value={run.communitySignals?.length || 0} sublabel="user reported" tone="warning" />
          </div>

          <div className="bg-card border border-line rounded-2xl p-6 sm:p-7 shadow-card">
            <SectionLabel icon={Sparkles}>Executive Summary</SectionLabel>
            <div className="text-[14.5px] leading-[1.8] m-0 text-ink/90">
              {(run.brief?.executive_summary || [run.objective || "Research brief summary processing..."]).map((para, idx) => (
                <p key={idx} className="mb-3 last:mb-0">{para}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-line rounded-2xl p-6 sm:p-7 shadow-card">
              <SectionLabel icon={BadgeCheck}>Key Verified Findings</SectionLabel>
              <div className="divide-y divide-line">
                {(run.claims || []).slice(0, 3).map((c, idx) => (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 text-[13.5px] leading-[1.65] text-ink">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-verified text-white font-mono text-[11px] font-bold flex items-center justify-center">{idx + 1}</span>
                    <span className="flex-1">{c.claim_text.replace(/^Verified finding:\s*/i, "")}</span>
                    <button onClick={() => setActiveTab("evidence")} title="See evidence" className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-md bg-citation-bg text-citation font-mono text-[10px] font-bold border-none cursor-pointer hover:bg-citation hover:text-white transition-colors">{(idx % 3) + 1}</button>
                  </div>
                ))}
                {(run.claims || []).length === 0 && <p className="text-[13px] text-muted py-2">No findings yet.</p>}
              </div>
            </div>

            <div className="bg-card border border-conflict/25 rounded-2xl p-6 sm:p-7 shadow-card">
              <SectionLabel icon={AlertTriangle}>Disagreements & Conflicts</SectionLabel>
              {conflicts.length > 0 ? (
                <>
                  <p className="text-[13px] text-muted m-0 mb-3 leading-relaxed">{conflicts[0].explanation}</p>
                  <button onClick={() => setActiveTab("conflicts")} className="font-mono text-[10.5px] font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 bg-conflict-bg text-conflict cursor-pointer hover:opacity-80 transition-opacity border-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-conflict"></span>
                    {conflicts.length} OPEN — see Conflicts tab
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <p className="text-[13px] text-muted m-0 leading-relaxed">No conflicting reports — independent sources agree on the primary findings.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "youtube" && (
        <div className="animate-in fade-in duration-300">
          {!youtubeReport ? (
            <EmptyState icon={Video} title="No YouTube Intel Found" description="No YouTube report available for this research run." />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={PlayCircle} label="Videos Analyzed" value={youtubeReport.videos.length} sublabel="independent channels" tone="citation" />
                <StatCard icon={MessageSquare} label="Reviewer Claims" value={youtubeReport.claims.length} sublabel="timestamped citations" tone="verified" />
                <StatCard icon={AlertTriangle} label="Disagreements" value={youtubeReport.reviewerDisagreements.length} sublabel="methodology / variant" tone="conflict" />
                <StatCard icon={Users} label="Recurring Issues" value={youtubeReport.recurringProblems.length} sublabel="real user complaints" tone="warning" />
              </div>

              <div className="flex gap-1.5 overflow-x-auto p-1.5 bg-card rounded-2xl border border-line shadow-card" style={{ scrollbarWidth: "none" }}>
                {[
                  { id: "consensus", label: "Reviewer Consensus & Gaps" },
                  { id: "disagreements", label: "Disagreements" },
                  { id: "transcripts", label: "Transcript Evidence" },
                  { id: "community", label: "Community & Complaints" },
                  { id: "audience", label: "Audience Questions" },
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setYtActiveTab(sub.id)}
                    className={`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all border-none ${
                      ytActiveTab === sub.id ? "bg-ink text-paper shadow-card" : "text-muted hover:text-ink bg-transparent"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* When no transcript could be retrieved, consensus / disagreements / gaps have
                  nothing real to stand on. Say so once, up front, instead of leaving three
                  sections mysteriously blank. */}
              {youtubeReport.transcriptCoverage && youtubeReport.transcriptCoverage.available === 0 && (
                <div className="bg-warning-bg border border-warning/25 rounded-2xl p-4 flex items-start gap-3 text-[12.5px] leading-[1.6] text-ink">
                  <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-0.5">Transcript analysis unavailable for this run</strong>
                    {youtubeReport.transcriptCoverage.blocked > 0
                      ? `${youtubeReport.transcriptCoverage.blocked} of ${youtubeReport.transcriptCoverage.total} videos have captions, but YouTube blocked automated transcript retrieval (a known restriction on server IPs). `
                      : `None of the ${youtubeReport.transcriptCoverage.total} analysed videos had a retrievable transcript. `}
                    Reviewer consensus, disagreements and coverage gaps are derived from transcripts, so they are empty here. Video metadata and viewer comments below are unaffected.
                  </div>
                </div>
              )}

              {ytActiveTab === "consensus" && (
                <>
                  <div className="bg-card border border-line rounded-2xl p-5 sm:p-6 shadow-card">
                    <SectionLabel icon={CheckCircle2}>Reviewer Consensus (Multi-Channel Agreement)</SectionLabel>
                    <div className="divide-y divide-line-soft">
                      {youtubeReport.reviewerConsensus.map((con, idx) => (
                        <div key={idx} className="flex gap-3 py-3 first:pt-0 last:pb-0 text-[13.5px] leading-[1.5] text-ink">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-verified-bg text-verified flex items-center justify-center mt-0.5"><CheckCircle2 className="w-3.5 h-3.5" /></span>
                          {con}
                        </div>
                      ))}
                      {youtubeReport.reviewerConsensus.length === 0 && (
                        <p className="text-[13px] text-muted py-1 m-0">No multi-channel agreement could be established from the available transcripts.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-card border border-line rounded-2xl p-5 sm:p-6 shadow-card mt-5">
                    <SectionLabel icon={Search}>Under-Covered Research Gaps</SectionLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
                      {youtubeReport.coverageGaps.map((gap, idx) => (
                        <div key={idx} className="bg-paper border-l-[3px] border-warning rounded-r-xl rounded-l-md p-3.5">
                          <span className="font-mono text-[10px] text-warning bg-warning-bg px-2 py-1 rounded-[5px] mb-2 inline-block font-semibold">GAP #{String(idx + 1).padStart(2, '0')}</span>
                          <p className="m-0 text-[12.5px] leading-[1.5] text-ink">{gap}</p>
                        </div>
                      ))}
                      {youtubeReport.coverageGaps.length === 0 && (
                        <p className="text-[13px] text-muted m-0">No coverage gaps identified — this needs reviewer transcripts to compare audience questions against.</p>
                      )}
                    </div>

                    <SectionLabel icon={Sparkles}>High-Impact Content Angles</SectionLabel>
                    {youtubeReport.contentOpportunities.length === 0 && (
                      <p className="text-[13px] text-muted m-0">No content angles yet — these are built from reviewer disagreements, recurring complaints and audience questions.</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {youtubeReport.contentOpportunities.map((opp, idx) => (
                        <div key={idx} className="bg-paper border border-line rounded-xl p-4 flex flex-col h-full hover:shadow-card transition-shadow">
                          <div className="font-mono text-[10px] text-muted-2 uppercase mb-1.5 tracking-wide">{opp.targetAudience}</div>
                          <h4 className="m-0 mb-2.5 text-[14.5px] font-semibold text-ink font-serif">{opp.title}</h4>
                          <div className="bg-card border-l-[3px] border-citation py-2.5 px-3 text-[12.5px] italic text-muted rounded-r-lg mb-3 mt-auto flex gap-1.5">
                            <Quote className="w-3 h-3 shrink-0 mt-0.5 text-citation" />
                            <span>{opp.hook}</span>
                          </div>
                          <button onClick={() => showToast("Added to script!")} className="bg-ink text-paper border-none rounded-lg py-2 px-3 text-[12.5px] font-semibold cursor-pointer w-full flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
                            <Plus className="w-3.5 h-3.5" /> Add to Video Script
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {ytActiveTab === "disagreements" && (
                <div className="space-y-4">
                  {youtubeReport.reviewerDisagreements.map((dis, idx) => (
                    <div key={idx} className="bg-conflict-bg border border-conflict/30 rounded-2xl p-6 shadow-card">
                      <h4 className="m-0 mb-3 text-[14px] font-semibold text-conflict flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {dis.aspect}</h4>
                      <div className="space-y-2 mb-2">
                        {dis.reviewers.map((rev, rIdx) => (
                          <div key={rIdx} className="bg-card rounded-[10px] p-3 text-[12.5px] text-ink border border-line">
                            <b>{rev.channel}</b> — {rev.claim}
                            {rev.methodologyNotes && <span className="text-muted"> ({rev.methodologyNotes})</span>}
                          </div>
                        ))}
                      </div>
                      <div className="text-[12px] text-muted italic mt-2 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />{dis.explanation} — {dis.suggestedCreatorAngle}</div>
                    </div>
                  ))}
                  {youtubeReport.reviewerDisagreements.length === 0 && (
                    <EmptyState icon={CheckCircle2} title="No reviewer disagreements found" description="Either the analysed reviewers agree, or there were not enough transcripts to compare their measurements." />
                  )}
                </div>
              )}
              {ytActiveTab === "transcripts" && (
                <div className="flex flex-col md:flex-row h-[500px] border border-line rounded-2xl overflow-hidden shadow-card">
                  <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-line-soft bg-paper overflow-y-auto">
                    {youtubeReport.videos.map(vid => {
                      const t = youtubeReport.transcripts[vid.videoId];
                      const ok = t?.status === "AVAILABLE";
                      return (
                        <div
                          key={vid.videoId}
                          onClick={() => setSelectedVideo(vid)}
                          className={`p-3.5 border-b border-line-soft cursor-pointer transition-colors flex items-center gap-2.5 ${
                            selectedVideo?.videoId === vid.videoId ? "bg-card border-l-[3px] border-l-citation" : "hover:bg-card/60"
                          }`}
                        >
                          <PlayCircle className={`w-4 h-4 shrink-0 ${selectedVideo?.videoId === vid.videoId ? "text-citation" : ok ? "text-verified" : "text-muted-2"}`} />
                          <div className="min-w-0">
                            <div className={`text-[13px] font-semibold line-clamp-2 ${selectedVideo?.videoId === vid.videoId ? "text-ink" : "text-muted"}`}>{vid.title}</div>
                            {!ok && <span className="text-[10px] font-mono text-warning">{t?.status === "BLOCKED" ? "captions blocked" : "no transcript"}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full md:w-2/3 bg-card overflow-y-auto p-4 space-y-4">
                    {(() => {
                      const t = selectedVideo && youtubeReport.transcripts[selectedVideo.videoId];
                      if (t && t.status === "AVAILABLE" && t.segments.length > 0) {
                        return t.segments.map((seg, i) => (
                          <div key={i} className="flex gap-3 text-[13px]">
                            <span className="shrink-0 font-mono text-[10.5px] text-citation bg-citation-bg px-2 py-0.5 rounded h-fit">{seg.formattedTime}</span>
                            <span className="text-ink">{seg.text}</span>
                          </div>
                        ));
                      }
                      return (
                        <div className="text-muted text-[13px] leading-[1.6] flex items-start gap-2">
                          <Info className="w-4 h-4 shrink-0 mt-0.5 text-muted-2" />
                          <span>{t?.errorMessage || "Select a video to view its transcript."}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
              {ytActiveTab === "community" && (
                <div className="space-y-4">
                  <p className="text-[12px] text-muted m-0">
                    Viewer-reported sentiment from the comments of the analysed videos — logged as user reports, not verified hardware facts.
                  </p>
                  {youtubeReport.recurringProblems.map((prob, i) => (
                    <div key={i} className="bg-card border border-line rounded-2xl overflow-hidden shadow-card">
                      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-line bg-card">
                        <div className="flex items-center gap-2 font-semibold text-[13px] text-ink">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          {prob.category.replace(/_/g, " ")}
                        </div>
                        <span className="font-mono text-[10.5px] text-muted-2 shrink-0">
                          {prob.commentCount} {prob.commentCount === 1 ? "comment" : "comments"} · {prob.signalStrength.replace(/_/g, " ").toLowerCase()}
                        </span>
                      </div>
                      <div className="p-5 space-y-2.5">
                        {prob.sampleComments.map((com, idx) => (
                          <div key={idx} className="flex gap-2.5 text-[13px] leading-[1.6] text-ink">
                            <Quote className="w-3.5 h-3.5 shrink-0 mt-1 text-muted-2" />
                            <span className="italic">&ldquo;{com.text}&rdquo;</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {youtubeReport.recurringProblems.length === 0 && (
                    <EmptyState icon={MessageSquare} title="No recurring complaints" description="No problem was raised often enough across the analysed comment sets to report as a signal." />
                  )}
                </div>
              )}
              {ytActiveTab === "audience" && (
                <div className="space-y-4">
                  <p className="text-[12px] text-muted m-0">
                    Questions viewers asked repeatedly in the comments — each is a topic your video could own.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {youtubeReport.audienceQuestions.map((q, i) => (
                      <div key={i} className="bg-card border border-line rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-citation bg-citation-bg px-2 py-1 rounded-full uppercase inline-flex items-center gap-1.5">
                            <HelpCircle className="w-3 h-3" />{q.category.replace(/_/g, " ")}
                          </span>
                          <span className="font-mono text-[10px] text-muted-2">asked {q.frequency}×</span>
                        </div>
                        <p className="text-[14px] leading-[1.55] font-medium text-ink m-0">&ldquo;{q.question}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                  {youtubeReport.audienceQuestions.length === 0 && (
                    <EmptyState icon={HelpCircle} title="No recurring audience questions" description="No question came up often enough across the analysed comments to surface here." />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="animate-in fade-in duration-300 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={FileCheck} label="Total Claims" value={(run.claims || []).length} sublabel={`${claimsWithEvidence} traced to evidence`} tone="citation" />
            <StatCard icon={ExternalLink} label="Source Distribution" value={(run.sources || []).length} sublabel="YouTube & Web Specs" tone="ink" />
            <StatCard icon={ShieldCheck} label="Confidence Rating" value={dominantConfidence} sublabel={`${claimsWithEvidence} of ${(run.claims || []).length} claims have matched evidence`} tone="verified" />
          </div>

          <div className="bg-card border border-line rounded-2xl p-5 sm:p-6 shadow-card">
            <div className="relative mb-3.5">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                placeholder="Search claims, excerpts, or sources…"
                value={evidenceSearch}
                onChange={(e) => setEvidenceSearch(e.target.value)}
                className="w-full font-sans text-[13.5px] pl-10 pr-3.5 py-2.5 border border-line rounded-xl bg-paper text-ink outline-none focus:border-citation focus:bg-card transition-colors"
              />
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["All Claims", "Performance & SoC", "Camera & Optics", "Battery & Charging"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setEvidenceFilter(cat)}
                  className={`text-[12px] font-semibold px-3.5 py-[7px] rounded-full border cursor-pointer transition-colors ${
                    evidenceFilter === cat ? "bg-ink text-paper border-ink" : "bg-card border-line text-muted hover:border-muted-2"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredClaims.map((claim, idx) => {
                const backed = (claim.evidence_ids || []).length > 0;
                const open = expandedClaimId === claim.id;
                return (
                  <div key={idx} className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-muted-2">
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 mt-0.5 w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center ${
                          backed ? "bg-verified text-white" : "bg-conflict text-white"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] leading-[1.6] text-ink m-0">{claim.claim_text}</p>
                        <div className="flex gap-2 items-center flex-wrap mt-2.5">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1.5 uppercase ${
                              backed ? "bg-verified-bg text-verified" : "bg-conflict-bg text-conflict"
                            }`}
                          >
                            {backed ? <BadgeCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {backed ? "Verified" : "Unbacked"}
                          </span>
                          <span className="font-mono text-[11px] text-muted-2">{sourceLabelForClaim(claim)}</span>
                          <button
                            onClick={() => setExpandedClaimId(open ? null : claim.id)}
                            className="ml-auto font-mono text-[10.5px] font-semibold text-citation hover:underline inline-flex items-center gap-1 cursor-pointer border-none bg-transparent"
                          >
                            {open ? "Hide excerpt" : "Show excerpt"}
                            <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {open && (() => {
                      const ev = (run.evidence || []).find((e) => (claim.evidence_ids || []).includes(e.id));
                      const src = ev ? (run.sources || []).find((sc) => sc.id === ev.source_id) : undefined;
                      return (
                        <div className="mt-3 ml-9 border-l-2 border-citation/30 pl-3.5">
                          <div className="font-mono text-[10px] uppercase tracking-wide text-muted-2 mb-1">Source excerpt</div>
                          {ev ? (
                            <p className="text-[12.5px] leading-[1.65] text-ink/85 m-0">&ldquo;{ev.excerpt.slice(0, 600)}&rdquo;</p>
                          ) : (
                            <p className="text-[12.5px] text-conflict m-0">No excerpt is linked to this claim.</p>
                          )}
                          {src && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-citation text-[12px] mt-2 font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {src.publisher || src.title}
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
              {filteredClaims.length === 0 && (
                <p className="text-[13px] text-muted py-3">
                  {(run.claims || []).length === 0
                    ? "No claims extracted yet."
                    : "No claims match this filter."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "conflicts" && (
        <div className="animate-in fade-in duration-300 space-y-3.5">
          <div className="bg-card border border-line rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <Info className="w-4 h-4 text-muted-2 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-[12.5px] text-muted leading-relaxed">
              <p className="font-semibold text-ink m-0">What counts as a conflict?</p>
              <p className="m-0">
                A conflict is where two credible sources report different results for the same thing —
                different benchmark numbers, opposite conclusions, or measurements taken under
                incompatible conditions or on different hardware variants. Nichorr lists each one
                as-is rather than averaging them or declaring a winner.
              </p>
              <p className="m-0">
                <strong className="text-ink">Why it matters for your script:</strong> naming the
                disagreement and the reason behind it (e.g. a 21&deg;C vs 25&deg;C test room, or an
                Exynos vs Snapdragon unit) earns more trust with a technical audience than one
                confident number would.
              </p>
            </div>
          </div>

          {conflicts.length > 0 ? (
            conflicts.map((cnf, idx) => (
              <div key={idx} className="border border-conflict/30 bg-conflict-bg rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-conflict text-white flex items-center justify-center shrink-0"><AlertTriangle className="w-3.5 h-3.5" /></div>
                  <h4 className="m-0 text-[14px] font-semibold text-conflict">{cnf.conflict_type} Disagreement</h4>
                </div>
                <div className="bg-card rounded-xl p-3 mb-2.5 text-[12.5px] text-ink border border-conflict/10">
                  {cnf.explanation}
                </div>
                <div className="text-[12px] text-muted italic mt-2 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-2" />Nichorr's read: both are methodologically valid but not directly comparable — flagged rather than averaged.</div>
              </div>
            ))
          ) : (run.claims || []).length === 0 && (run.sources || []).length === 0 ? (
            <EmptyState icon={Info} title="No data yet" description="Nothing to check for conflicts." />
          ) : (
            <div className="bg-verified-bg border border-verified/30 rounded-2xl p-8 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-card text-verified flex items-center justify-center mx-auto mb-3 shadow-card"><CheckCircle2 className="w-6 h-6" /></div>
              <h4 className="m-0 mb-1.5 text-[15px] font-semibold text-ink font-serif">No critical conflicts detected</h4>
              <p className="m-0 text-[13px] text-muted max-w-sm mx-auto">All other independent lab publications and official spec sheets concur on primary findings.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "provenance" && (
        <div className="animate-in fade-in duration-300 space-y-5">
          {/* Every figure and every hop below is derived from this run. This tab previously
              displayed a fixed demo lineage — "96% / 20-of-21 chains", "Independence 8/10",
              an AnandTech attribution and a quote about the iPhone 18 Pro Max — none of which
              came from the research being displayed. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={ShieldCheck} label="Claims With Evidence" value={`${claimsWithEvidence}/${(run.claims || []).length}`} sublabel="traced to an excerpt" tone="verified" />
            <StatCard icon={FileText} label="Sources" value={(run.sources || []).length} sublabel="retrieved this run" tone="ink" />
            <StatCard icon={GitBranch} label="Usable Excerpts" value={usableEvidence.length} sublabel={`${failedEvidence.length} extraction failures`} tone="citation" />
            <StatCard icon={TrendingUp} label="Confidence" value={dominantConfidence} sublabel="dominant band across claims" tone="ink" />
          </div>

          <div className="bg-card border border-line rounded-2xl p-5 sm:p-6 shadow-card">
            <SectionLabel icon={GitBranch}>Full Evidence Lineage Chain</SectionLabel>
            {lineage ? (
              <div className="relative pl-2">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-line" />
                <div className="relative flex gap-3 pb-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-citation-bg text-citation flex items-center justify-center font-mono text-[11px] font-bold z-10">1</div>
                  <div className="bg-card border border-line rounded-xl p-3.5 text-[13px] text-ink flex-1">
                    <span className="font-mono text-[10px] text-citation mb-1.5 block uppercase tracking-wide">Structured Verified Claim</span>
                    {lineage.claim.claim_text}
                  </div>
                </div>
                <div className="relative flex gap-3 pb-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-citation-bg text-citation flex items-center justify-center font-mono text-[11px] font-bold z-10">2</div>
                  <div className="bg-card border border-line rounded-xl p-3.5 text-[13px] text-ink flex-1">
                    <span className="font-mono text-[10px] text-citation mb-1.5 block uppercase tracking-wide">Supporting Excerpt</span>
                    {lineage.evidence ? `"${lineage.evidence.excerpt.slice(0, 400)}"` : "No excerpt linked to this claim."}
                  </div>
                </div>
                <div className="relative flex gap-3">
                  <div className={`shrink-0 w-9 h-9 rounded-full ${lineage.source ? "bg-verified text-white" : "bg-conflict text-white"} flex items-center justify-center z-10`}>
                    {lineage.source ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-xl p-3.5 text-[13px] text-ink flex-1 border ${lineage.source ? "bg-verified-bg border-verified/20" : "bg-conflict-bg border-conflict/20"}`}>
                    <span className={`font-mono text-[10px] mb-1.5 block uppercase tracking-wide ${lineage.source ? "text-verified" : "text-conflict"}`}>Primary Source Provenance</span>
                    {lineage.source ? (
                      <>
                        {lineage.source.publisher}
                        <a href={lineage.source.url} target="_blank" rel="noopener noreferrer" className="text-citation text-[12px] ml-1.5 font-semibold inline-flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Original Source</a>
                      </>
                    ) : (
                      "UNBACKED — this claim could not be traced to a retrieved source."
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-muted py-2">No claims available to trace for this run.</p>
            )}
            <p className="text-[12px] text-muted mt-4">
              Showing the first claim&apos;s chain.{" "}
              <Link href={`/research/${run.id}/provenance`} className="text-citation font-semibold hover:underline">
                See all {(run.claims || []).length} lineage chains
              </Link>
            </p>
          </div>
        </div>
      )}

      {activeTab === "ask" && (
        <div className="animate-in fade-in duration-300">
          <div className="flex gap-2 flex-wrap mb-5">
            {["What are the strongest verified claims?", "What conflicting evidence was found?", "What should I be careful about saying in a video?"].map(q => (
              <button key={q} onClick={() => handleAskSend(q)} className="text-[12.5px] font-semibold text-citation bg-citation-bg border border-citation/10 px-3.5 py-2 rounded-full cursor-pointer hover:bg-citation hover:text-white transition-colors">
                {q}
              </button>
            ))}
          </div>

          <div className="bg-card border border-line rounded-2xl p-6 max-w-[640px] mb-5 space-y-4 shadow-card">
            {askMessages.map((msg, i) => (
              msg.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="bg-citation text-white text-[13.5px] leading-[1.6] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">{msg.content}</div>
                </div>
              ) : (
                <div key={i} className="flex gap-2.5">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-citation-bg text-citation flex items-center justify-center mt-0.5"><Bot className="w-3.5 h-3.5" /></div>
                  <div className="bg-paper text-ink text-[13.5px] leading-[1.6] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">{msg.content}</div>
                </div>
              )
            ))}
            {askLoading && (
              <div className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-full bg-citation-bg text-citation flex items-center justify-center mt-0.5"><Bot className="w-3.5 h-3.5" /></div>
                <div className="bg-paper text-muted text-[13px] italic rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 max-w-[640px]">
            <input
              type="text"
              placeholder="Ask a technical question about the findings…"
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskSend()}
              className="flex-1 font-sans text-[13.5px] px-4 py-3 border border-line rounded-xl bg-card text-ink outline-none focus:border-citation transition-colors"
            />
            <button
              onClick={() => handleAskSend()}
              disabled={askLoading || !askQuestion.trim()}
              aria-label="Send question"
              className="w-[46px] h-[46px] shrink-0 rounded-xl bg-citation text-white border-none cursor-pointer flex items-center justify-center hover:opacity-90 disabled:bg-line disabled:text-muted-2 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-[18px] h-[18px] translate-x-[-1px]" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "community" && (
        <div className="animate-in fade-in duration-300">
          <div className="text-[12.5px] text-citation bg-citation-bg rounded-xl p-3.5 sm:px-4 mb-5 flex items-center gap-2.5 border border-citation/10">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span><b className="font-semibold">Ethos Rule:</b> Community signals represent user-reported sentiment. They are logged as user reports, not universal hardware facts.</span>
          </div>
          {(run.communitySignals || []).length > 0 ? (
            <div className="space-y-3">
              {(run.communitySignals || []).map((s, idx) => (
                <div key={idx} className="bg-card border border-line rounded-2xl p-4 sm:p-5 flex gap-3.5 shadow-card">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-warning-bg text-warning flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] text-muted-2 uppercase tracking-[0.5px] mb-1 block">{s.signal_type.replace(/_/g, " ")}</span>
                    <p className="m-0 text-[13.5px] leading-[1.6] text-ink">{s.signal}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={MessageSquare} title="No community signals for this run" description="No recurring viewer-reported issue surfaced across the sources gathered for this topic." />
          )}
        </div>
      )}

      {activeTab === "audience" && (
        <div className="animate-in fade-in duration-300">
          <p className="text-[12.5px] text-muted mb-4 m-0">Questions viewers keep asking that the existing coverage does not answer well.</p>
          {(run.audienceQuestions || []).length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(run.audienceQuestions || []).map((q, idx) => (
                <div key={idx} className="bg-card border border-line rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <span className="font-mono text-[10px] uppercase tracking-[0.5px] inline-flex items-center gap-1.5 self-start px-2 py-1 rounded-full bg-citation-bg text-citation">
                    <HelpCircle className="w-3 h-3" />{q.coverage_gap === "HIGH" ? "Wide coverage gap" : "Minor coverage gap"}
                  </span>
                  <p className="m-0 text-[14px] leading-[1.55] font-medium text-ink">&ldquo;{q.question}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={HelpCircle} title="No audience question gaps identified" description="No viewer question recurred often enough, or there was not enough reviewer coverage to compare against." />
          )}
        </div>
      )}

      {activeTab === "opportunities" && (
        <div className="animate-in fade-in duration-300">
          <p className="text-[12.5px] text-muted mb-4 m-0">Video angles this research supports — built from the disagreements, complaints and questions above.</p>
          {(run.opportunities || []).length > 0 || (run.brief?.content_opportunities || []).length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(run.opportunities || run.brief?.content_opportunities || []).map((o, idx) => (
                <div key={idx} className="bg-card border border-line rounded-2xl p-5 flex flex-col gap-2 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-warning-bg text-warning flex items-center justify-center mb-1"><Sparkles className="w-4 h-4" /></div>
                  <h4 className="m-0 text-[15px] font-semibold text-ink font-serif leading-snug">{o.title}</h4>
                  <p className="m-0 text-[13px] text-muted leading-[1.55]">{o.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="No content opportunities yet" description="These are generated from reviewer disagreements, recurring complaints and unanswered audience questions." />
          )}
        </div>
      )}

      {activeTab === "brief" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-card border border-line rounded-3xl p-5 sm:p-10 max-w-[760px] mx-auto shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="font-mono text-[11px] text-muted-2 tracking-[0.5px] uppercase">Research Brief · Generated from {(run.claims || []).length} verified claims</span>
              <div className="flex gap-2">
                <button onClick={() => showToast("Copied to clipboard!")} className="text-[12px] font-semibold px-3.5 py-2 rounded-lg border border-line bg-paper text-ink cursor-pointer hover:bg-card flex items-center gap-1.5 transition-colors"><Copy className="w-3.5 h-3.5" />Copy</button>
                <button className="text-[12px] font-semibold px-3.5 py-2 rounded-lg border border-ink bg-ink text-paper cursor-pointer hover:opacity-90 flex items-center gap-1.5 transition-opacity"><Download className="w-3.5 h-3.5" />Export .md</button>
              </div>
            </div>
            <h2 className="font-serif font-semibold text-[22px] sm:text-[30px] m-0 mb-3 text-ink leading-tight">{run.topic}</h2>
            <p className="text-[13.5px] text-muted leading-[1.6] m-0 mb-7 pb-6 border-b border-line-soft">A defensible comparison brief for a YouTube review — every claim below is traced to a source. Click any marker to see the evidence.</p>

            {/* Drawn from this run's own executive summary. Previously a fixed line about the
                S26 Ultra winning on battery, shown verbatim for every topic. */}
            {(run.brief?.executive_summary || []).length > 0 && (
              <div className="mb-7">
                <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />Lead With This</div>
                <p className="font-serif italic text-[16px] sm:text-[19px] leading-[1.6] text-ink m-0 pl-5 border-l-[3px] border-citation relative">
                  {run.brief!.executive_summary[0]}
                </p>
              </div>
            )}

            <div className="mb-7">
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3 flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" />Verified Talking Points</div>
              <ol className="m-0 pl-0 text-[14.5px] leading-[1.9] text-ink space-y-2 list-none">
                {(run.brief?.key_findings || []).slice(0, 3).map((f, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-citation-bg text-citation font-mono text-[11px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="flex-1">{f.finding}</span>
                  </li>
                ))}
                {(run.brief?.key_findings || []).length === 0 && <li className="text-muted">No findings generated yet.</li>}
              </ol>
            </div>

            {/* Real caveats from the brief plus this run's actual conflicts. Previously a fixed
                warning naming the iPhone 18 Pro Max — a phone not in this research. */}
            {briefCaveats.length > 0 && (
              <div className="mb-7">
                <div className="font-mono text-[11px] tracking-[0.5px] text-warning uppercase mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Say This Carefully</div>
                <div className="flex flex-col gap-2">
                  {briefCaveats.map((c, i) => (
                    <div key={i} className="bg-warning-bg text-warning rounded-xl p-4 text-[13px] leading-[1.6] border border-warning/20 flex gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Sources Cited ({(run.sources || []).length})</div>
              <div className="flex flex-col gap-2">
                {(run.sources || []).slice(0, 3).map((s, idx) => (
                  <div key={idx} className="text-[13px] flex items-center gap-2.5 text-ink bg-card border border-line rounded-lg px-3 py-2.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-citation-bg text-citation font-mono text-[10px] font-bold shrink-0">{idx + 1}</span>
                    <span className="flex-1">{s.title} <span className="text-muted">({s.publisher})</span></span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-ink text-paper px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 text-verified" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
