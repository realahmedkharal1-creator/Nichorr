"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GitBranch, 
  ShieldCheck, 
  ArrowLeft, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  Video, 
  Share2, 
  Lock,
  ArrowRight
} from "lucide-react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ResearchProvenanceReport, ProvenanceLineageChain } from "@/lib/provenance/provenance.types";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ResearchProvenancePage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<ResearchProvenanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"lineage" | "sources" | "proofsheet" | "safety">("lineage");
  const [selectedChain, setSelectedChain] = useState<ProvenanceLineageChain | null>(null);

  useEffect(() => {
    fetch(`/api/research/${params.id}/provenance`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.provenanceReport) {
          setReport(data.provenanceReport);
          if (data.provenanceReport.lineageChains.length > 0) {
            setSelectedChain(data.provenanceReport.lineageChains[0]);
          }
        } else {
          setError(data.error || "Failed to load provenance report");
        }
      })
      .catch(() => setError("Network error fetching provenance data"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-4 space-y-6">
        <ResearchTabNav runId={params.id} />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-6xl mx-auto py-4 space-y-6 font-sans">
        <ResearchTabNav runId={params.id} />
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-12 text-center space-y-4 max-w-2xl mx-auto my-12 bg-card border-line">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto" />
          <h2 className="text-lg font-bold text-ink">Provenance Data Unavailable</h2>
          <p className="text-xs text-muted">{error || "Unable to trace evidence lineage for this research run."}</p>
          <Link
            href={`/research/${params.id}/results`}
            className="inline-flex items-center gap-2 bg-citation hover:bg-citation text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
        </div>
      </div>
    );
  }

  const auth = report.sourceAuthoritySummary;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Top Navigation */}
      <ResearchTabNav runId={params.id} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">
            EXPLAINABLE AI PROVENANCE & AUDIT LINEAGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-7 h-7 text-citation" />
            Research Evidence Lineage Tree
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Unbroken multi-hop verification linking Creator Script Talking Points → Claims → Measured Evidence → Primary Source URLs.
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheet")}
          className="flex items-center gap-2 bg-citation hover:bg-citation text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          {copiedSection === "proofSheet" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copiedSection === "proofSheet" ? "Proof Sheet Copied!" : "Copy Citation Proof Sheet"}
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Overall Grounding Score */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-5 bg-card border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">GROUNDING SCORE</span>
            <ShieldCheck className="w-4 h-4 text-verified" />
          </div>
          <p className="text-2xl font-bold text-ink font-mono">{report.overallGroundingScore}%</p>
          <span className="text-[10px] font-mono text-verified block font-semibold">
            {report.verifiedChainsCount} / {report.totalTalkingPoints} Verified Chains
          </span>
        </div>

        {/* Metric 2: Primary OEM Sources */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-5 bg-card border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">PRIMARY OEM SOURCES</span>
            <Cpu className="w-4 h-4 text-citation" />
          </div>
          <p className="text-2xl font-bold text-ink font-mono">{auth.tier1PrimaryCount}</p>
          <span className="text-[10px] font-mono text-muted block">Tier 1 Authoritative Specs</span>
        </div>

        {/* Metric 3: Independent Labs */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-5 bg-card border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">INDEPENDENT LABS</span>
            <Layers className="w-4 h-4 text-citation" />
          </div>
          <p className="text-2xl font-bold text-ink font-mono">{auth.tier2IndependentLabCount}</p>
          <span className="text-[10px] font-mono text-citation block">Lab Benchmarks & FLIR Data</span>
        </div>

        {/* Metric 4: Avg Independence Score */}
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-5 bg-card border-line space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold">INDEPENDENCE SCORE</span>
            <CheckCircle2 className="w-4 h-4 text-verified" />
          </div>
          <p className="text-2xl font-bold text-ink font-mono">{auth.averageIndependenceScore} / 10</p>
          <span className="text-[10px] font-mono text-muted block">
            {auth.syndicatedCount > 0 ? `⚠️ ${auth.syndicatedCount} Syndicated` : "Zero Copied Syndication"}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-line pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("lineage")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "lineage" ? "bg-citation text-white" : "bg-card text-muted hover:text-ink/80"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 inline mr-1.5" />
          Multi-Hop Lineage Chains ({report.lineageChains.length})
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "sources" ? "bg-citation text-white" : "bg-card text-muted hover:text-ink/80"
          }`}
        >
          <Database className="w-3.5 h-3.5 inline mr-1.5" />
          Source Authority Matrix
        </button>

        <button
          onClick={() => setActiveTab("proofsheet")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "proofsheet" ? "bg-citation text-white" : "bg-card text-muted hover:text-ink/80"
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          Citation Proof Sheet
        </button>

        <button
          onClick={() => setActiveTab("safety")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "safety" ? "bg-citation text-white" : "bg-card text-muted hover:text-ink/80"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
          Fact-Check & Safety Audit
        </button>
      </div>

      {/* TAB 1: MULTI-HOP LINEAGE EXPLORER */}
      {activeTab === "lineage" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Left: Talking Points Selector */}
            <div className="sm:col-span-1 space-y-2">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider font-bold block mb-1">
                SCRIPT TALKING POINTS:
              </span>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {report.lineageChains.map((chain) => {
                  const isSelected = selectedChain?.chainId === chain.chainId;
                  return (
                    <button
                      key={chain.chainId}
                      onClick={() => setSelectedChain(chain)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-citation-bg border-citation text-citation/20 shadow-sm"
                          : "bg-card border-line text-ink/80 hover:bg-paper hover:border-muted-2"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          chain.verificationStatus === 'VERIFIED' ? 'bg-verified-bg text-verified border border-verified/25' :
                          chain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-warning-bg text-warning border border-warning/25' :
                          'bg-conflict-bg text-conflict border border-conflict/25'
                        }`}>
                          {chain.verificationStatus}
                        </span>
                        <span className="text-muted truncate max-w-[100px]">{chain.publisher}</span>
                      </div>
                      <p className="text-xs font-semibold line-clamp-2 leading-snug">
                        "{chain.talkingPointStatement}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Unbroken Multi-Hop Trace Card */}
            <div className="sm:col-span-2 space-y-4">
              {selectedChain ? (
                <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-card border-line space-y-6">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-citation" />
                      <h3 className="text-sm font-bold text-ink">Full Evidence Lineage Chain</h3>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded font-bold border ${
                      selectedChain.verificationStatus === 'VERIFIED' ? 'bg-verified-bg text-verified border-verified/25' :
                      selectedChain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-warning-bg text-warning border-warning/25' :
                      'bg-conflict-bg text-conflict border-conflict/25'
                    }`}>
                      {selectedChain.verificationStatus === 'VERIFIED' ? '✅ Unbroken Evidence Lineage' : selectedChain.verificationStatus}
                    </span>
                  </div>

                  {/* Hop 1: Creator Script Statement */}
                  <div className="p-4 rounded-xl bg-paper border border-line space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-citation uppercase font-bold">
                      <span>HOP 1: CREATOR STUDIO SCRIPT STATEMENT</span>
                    </div>
                    <p className="text-sm font-semibold text-ink italic">
                      "{selectedChain.talkingPointStatement}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-citation rotate-90" />
                  </div>

                  {/* Hop 2: Verified Claim */}
                  <div className="p-4 rounded-xl bg-paper border border-line space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-citation uppercase font-bold">
                      <span>HOP 2: STRUCTURED VERIFIED CLAIM</span>
                      <span className="text-muted font-mono">{selectedChain.claimId}</span>
                    </div>
                    <p className="text-xs text-ink/80 leading-relaxed font-sans">
                      {selectedChain.claimText}
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-citation rotate-90" />
                  </div>

                  {/* Hop 3: Evidence Excerpt / Laboratory Benchmark */}
                  <div className="p-4 rounded-xl bg-paper border border-line space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-verified uppercase font-bold">
                      <span>HOP 3: MEASURED LABORATORY EVIDENCE</span>
                      <span className="text-muted font-mono">{selectedChain.evidenceId}</span>
                    </div>
                    
                    {selectedChain.benchmarkOrTranscriptRef && (
                      <div className="p-2.5 rounded-lg bg-verified-bg border border-verified/25 text-xs font-mono text-verified flex items-center justify-between">
                        <span>[{selectedChain.benchmarkOrTranscriptRef.type}] {selectedChain.benchmarkOrTranscriptRef.name}</span>
                        <span className="font-bold">{selectedChain.benchmarkOrTranscriptRef.scoreOrText}</span>
                      </div>
                    )}

                    <p className="text-xs text-ink/80 leading-relaxed font-sans">
                      "{selectedChain.evidenceExcerpt}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-verified rotate-90" />
                  </div>

                  {/* Hop 4: Original Source Provenance */}
                  <div className="p-4 rounded-xl bg-paper border border-line space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-citation uppercase font-bold">
                      <span>HOP 4: PRIMARY SOURCE PROVENANCE</span>
                      <span className="px-2 py-0.5 rounded bg-citation-bg text-citation border border-citation/20">
                        {selectedChain.authorityTier}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <div>
                        <h4 className="text-xs font-bold text-ink/80">{selectedChain.publisher}</h4>
                        <p className="text-[11px] text-muted truncate max-w-md">{selectedChain.sourceTitle}</p>
                      </div>
                      <a
                        href={selectedChain.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-citation hover:text-citation bg-citation-bg px-3 py-1.5 rounded-lg border border-citation/20 transition shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Original Source
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-[24px] shadow-sm border border-line p-12 text-center text-muted font-mono text-xs">
                  Select a talking point to inspect its unbroken evidence chain.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCE AUTHORITY MATRIX */}
      {activeTab === "sources" && (
        <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-card border-line space-y-4">
          <h2 className="text-sm font-bold text-ink">Source Authority Tiers & Independence Ratings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-line text-[10px] font-mono text-muted uppercase">
                  <th className="pb-3">Publisher</th>
                  <th className="pb-3">Authority Tier</th>
                  <th className="pb-3">Independence Score</th>
                  <th className="pb-3">Syndication Flag</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-ink/80 font-sans">
                {report.nodes.filter(n => n.type === "SOURCE").map((src) => (
                  <tr key={src.id} className="hover:bg-paper">
                    <td className="py-3 font-semibold text-ink">{src.publisher || src.label}</td>
                    <td className="py-3 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded border ${
                        src.authorityTier === 'TIER_1_PRIMARY' ? 'bg-citation-bg text-citation border-citation/20' :
                        src.authorityTier === 'TIER_2_INDEPENDENT_LAB' ? 'bg-citation-bg text-citation border-citation/20' :
                        src.authorityTier === 'TIER_4_COMMUNITY' ? 'bg-warning-bg text-warning border-warning/25' :
                        'bg-paper text-muted border-line'
                      }`}>
                        {src.authorityTier || "TIER_3_SECONDARY"}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-verified">
                      {src.independenceScore || 8.0} / 10
                    </td>
                    <td className="py-3 font-mono text-[11px]">
                      {src.isSyndicated ? (
                        <span className="text-warning font-bold">⚠️ Syndicated PR Story</span>
                      ) : (
                        <span className="text-verified">✅ Independent</span>
                      )}
                    </td>
                    <td className="py-3">
                      {src.sourceUrl && (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-citation hover:text-citation inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CITATION PROOF SHEET */}
      {activeTab === "proofsheet" && (
        <div className="space-y-4">
          <div className="bg-card rounded-[24px] shadow-sm border border-line p-4 bg-card border-line flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">Paste-Ready Citation Proof Sheet</h2>
              <p className="text-xs text-muted mt-0.5">Use this audit document to defend your review claims against sponsor or manufacturer pushback.</p>
            </div>
            <button
              onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheetTab")}
              className="flex items-center gap-1.5 text-xs font-mono text-citation bg-citation-bg px-3 py-1.5 rounded-lg border border-citation/20 hover:bg-citation-bg transition"
            >
              {copiedSection === "proofSheetTab" ? <Check className="w-3.5 h-3.5 text-verified" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === "proofSheetTab" ? "Copied!" : "Copy Proof Sheet"}
            </button>
          </div>

          <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-paper border-line font-mono text-xs text-ink/80 max-h-[550px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {report.citationProofSheetMarkdown}
          </div>
        </div>
      )}

      {/* TAB 4: FACT-CHECK & SAFETY AUDIT */}
      {activeTab === "safety" && (
        <div className="space-y-4">
          <div className="bg-card rounded-[24px] shadow-sm border border-line p-6 bg-card border-line space-y-4">
            <h2 className="text-sm font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-verified" /> Script On-Camera Safety & Overstatement Audit
            </h2>
            <p className="text-xs text-ink/80 leading-relaxed font-sans">
              Nichorr enforces real-time guardrails to ensure content creators never make definitive statements without corroborating primary laboratory data.
            </p>

            <div className="space-y-3 pt-2">
              {report.lineageChains.map((chain) => (
                <div key={chain.chainId} className="p-4 rounded-xl bg-paper border border-line space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">"{chain.talkingPointStatement}"</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      chain.verificationStatus === 'VERIFIED' ? 'bg-verified-bg text-verified border-verified/25' :
                      chain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-warning-bg text-warning border-warning/25' :
                      'bg-conflict-bg text-conflict border-conflict/25'
                    }`}>
                      {chain.verificationStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted font-mono flex items-center gap-4">
                    <span>Source: {chain.publisher}</span>
                    <span>Independence: {chain.independenceScore}/10</span>
                    <span>Tier: {chain.authorityTier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
