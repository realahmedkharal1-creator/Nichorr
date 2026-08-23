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
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-12 text-center space-y-4 max-w-2xl mx-auto my-12 bg-white border-slate-200">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Provenance Data Unavailable</h2>
          <p className="text-xs text-slate-500">{error || "Unable to trace evidence lineage for this research run."}</p>
          <Link
            href={`/research/${params.id}/results`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">
            EXPLAINABLE AI PROVENANCE & AUDIT LINEAGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-7 h-7 text-indigo-600" />
            Research Evidence Lineage Tree
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unbroken multi-hop verification linking Creator Script Talking Points → Claims → Measured Evidence → Primary Source URLs.
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheet")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          {copiedSection === "proofSheet" ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copiedSection === "proofSheet" ? "Proof Sheet Copied!" : "Copy Citation Proof Sheet"}
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Overall Grounding Score */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">GROUNDING SCORE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{report.overallGroundingScore}%</p>
          <span className="text-[10px] font-mono text-emerald-600 block font-semibold">
            {report.verifiedChainsCount} / {report.totalTalkingPoints} Verified Chains
          </span>
        </div>

        {/* Metric 2: Primary OEM Sources */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">PRIMARY OEM SOURCES</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{auth.tier1PrimaryCount}</p>
          <span className="text-[10px] font-mono text-slate-500 block">Tier 1 Authoritative Specs</span>
        </div>

        {/* Metric 3: Independent Labs */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">INDEPENDENT LABS</span>
            <Layers className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{auth.tier2IndependentLabCount}</p>
          <span className="text-[10px] font-mono text-cyan-600 block">Lab Benchmarks & FLIR Data</span>
        </div>

        {/* Metric 4: Avg Independence Score */}
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 bg-white border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">INDEPENDENCE SCORE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">{auth.averageIndependenceScore} / 10</p>
          <span className="text-[10px] font-mono text-slate-500 block">
            {auth.syndicatedCount > 0 ? `⚠️ ${auth.syndicatedCount} Syndicated` : "Zero Copied Syndication"}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("lineage")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "lineage" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 inline mr-1.5" />
          Multi-Hop Lineage Chains ({report.lineageChains.length})
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "sources" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          <Database className="w-3.5 h-3.5 inline mr-1.5" />
          Source Authority Matrix
        </button>

        <button
          onClick={() => setActiveTab("proofsheet")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "proofsheet" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          Citation Proof Sheet
        </button>

        <button
          onClick={() => setActiveTab("safety")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === "safety" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:text-slate-700"
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
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1">
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
                          ? "bg-indigo-50 border-indigo-700 text-indigo-100 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          chain.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          chain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}>
                          {chain.verificationStatus}
                        </span>
                        <span className="text-slate-500 truncate max-w-[100px]">{chain.publisher}</span>
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
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900">Full Evidence Lineage Chain</h3>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded font-bold border ${
                      selectedChain.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      selectedChain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-rose-50 text-rose-600 border-rose-200'
                    }`}>
                      {selectedChain.verificationStatus === 'VERIFIED' ? '✅ Unbroken Evidence Lineage' : selectedChain.verificationStatus}
                    </span>
                  </div>

                  {/* Hop 1: Creator Script Statement */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-600 uppercase font-bold">
                      <span>HOP 1: CREATOR STUDIO SCRIPT STATEMENT</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 italic">
                      "{selectedChain.talkingPointStatement}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-indigo-600 rotate-90" />
                  </div>

                  {/* Hop 2: Verified Claim */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-600 uppercase font-bold">
                      <span>HOP 2: STRUCTURED VERIFIED CLAIM</span>
                      <span className="text-slate-500 font-mono">{selectedChain.claimId}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {selectedChain.claimText}
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-cyan-600 rotate-90" />
                  </div>

                  {/* Hop 3: Evidence Excerpt / Laboratory Benchmark */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 uppercase font-bold">
                      <span>HOP 3: MEASURED LABORATORY EVIDENCE</span>
                      <span className="text-slate-500 font-mono">{selectedChain.evidenceId}</span>
                    </div>
                    
                    {selectedChain.benchmarkOrTranscriptRef && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-600 flex items-center justify-between">
                        <span>[{selectedChain.benchmarkOrTranscriptRef.type}] {selectedChain.benchmarkOrTranscriptRef.name}</span>
                        <span className="font-bold">{selectedChain.benchmarkOrTranscriptRef.scoreOrText}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      "{selectedChain.evidenceExcerpt}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-3">
                    <ArrowRight className="w-5 h-5 text-emerald-600 rotate-90" />
                  </div>

                  {/* Hop 4: Original Source Provenance */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-600 uppercase font-bold">
                      <span>HOP 4: PRIMARY SOURCE PROVENANCE</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200">
                        {selectedChain.authorityTier}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700">{selectedChain.publisher}</h4>
                        <p className="text-[11px] text-slate-500 truncate max-w-md">{selectedChain.sourceTitle}</p>
                      </div>
                      <a
                        href={selectedChain.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Original Source
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-12 text-center text-slate-500 font-mono text-xs">
                  Select a talking point to inspect its unbroken evidence chain.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCE AUTHORITY MATRIX */}
      {activeTab === "sources" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Source Authority Tiers & Independence Ratings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase">
                  <th className="pb-3">Publisher</th>
                  <th className="pb-3">Authority Tier</th>
                  <th className="pb-3">Independence Score</th>
                  <th className="pb-3">Syndication Flag</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-700 font-sans">
                {report.nodes.filter(n => n.type === "SOURCE").map((src) => (
                  <tr key={src.id} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-900">{src.publisher || src.label}</td>
                    <td className="py-3 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded border ${
                        src.authorityTier === 'TIER_1_PRIMARY' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                        src.authorityTier === 'TIER_2_INDEPENDENT_LAB' ? 'bg-cyan-50 text-cyan-600 border-cyan-200' :
                        src.authorityTier === 'TIER_4_COMMUNITY' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {src.authorityTier || "TIER_3_SECONDARY"}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-600">
                      {src.independenceScore || 8.0} / 10
                    </td>
                    <td className="py-3 font-mono text-[11px]">
                      {src.isSyndicated ? (
                        <span className="text-amber-600 font-bold">⚠️ Syndicated PR Story</span>
                      ) : (
                        <span className="text-emerald-600">✅ Independent</span>
                      )}
                    </td>
                    <td className="py-3">
                      {src.sourceUrl && (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-600 inline-flex items-center gap-1 font-mono text-[11px]"
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
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-4 bg-white border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Paste-Ready Citation Proof Sheet</h2>
              <p className="text-xs text-slate-500 mt-0.5">Use this audit document to defend your review claims against sponsor or manufacturer pushback.</p>
            </div>
            <button
              onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheetTab")}
              className="flex items-center gap-1.5 text-xs font-mono text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition"
            >
              {copiedSection === "proofSheetTab" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === "proofSheetTab" ? "Copied!" : "Copy Proof Sheet"}
            </button>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-slate-50 border-slate-100 font-mono text-xs text-slate-700 max-h-[550px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {report.citationProofSheetMarkdown}
          </div>
        </div>
      )}

      {/* TAB 4: FACT-CHECK & SAFETY AUDIT */}
      {activeTab === "safety" && (
        <div className="space-y-4">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Script On-Camera Safety & Overstatement Audit
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Nichorr enforces real-time guardrails to ensure content creators never make definitive statements without corroborating primary laboratory data.
            </p>

            <div className="space-y-3 pt-2">
              {report.lineageChains.map((chain) => (
                <div key={chain.chainId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">"{chain.talkingPointStatement}"</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      chain.verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      chain.verificationStatus === 'NEEDS_CONTEXT' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-rose-50 text-rose-600 border-rose-200'
                    }`}>
                      {chain.verificationStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-4">
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
