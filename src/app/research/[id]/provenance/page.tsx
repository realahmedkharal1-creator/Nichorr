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
  ArrowRight
} from "lucide-react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ResearchProvenanceReport, ProvenanceLineageChain } from "@/lib/provenance/provenance.types";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

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
      <div className="max-w-[1400px] mx-auto py-4 space-y-6">
        <ResearchTabNav runId={params.id} />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-[1400px] mx-auto py-4 space-y-6 font-sans">
        <ResearchTabNav runId={params.id} />
        <div className="bg-white rounded-3xl shadow-sm border border-[#e5e5ea] p-12 text-center space-y-4 max-w-2xl mx-auto my-12">
          <AlertTriangle className="w-12 h-12 text-[#ff9500] mx-auto" />
          <h2 className="text-lg font-bold text-[#1d1d1f]">Provenance Data Unavailable</h2>
          <p className="text-xs text-[#6e6e73] font-medium">{error || "Unable to trace evidence lineage for this research run."}</p>
          <Link
            href={`/research/${params.id}/results`}
            className="inline-flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 rounded-full text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
        </div>
      </div>
    );
  }

  const auth = report.sourceAuthoritySummary;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Top Navigation */}
      <ResearchTabNav runId={params.id} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            EXPLAINABLE AI PROVENANCE & AUDIT LINEAGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <GitBranch className="w-7 h-7 text-[#0071e3]" />
            Evidence Lineage & Provenance Graph
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Unbroken multi-hop verification linking Creator Script Talking Points → Claims → Measured Evidence → Primary Source URLs.
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheet")}
          className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition active:scale-95 cursor-pointer"
        >
          {copiedSection === "proofSheet" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSection === "proofSheet" ? "Proof Sheet Copied!" : "Copy Proof Sheet"}</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 hover:border-[#34c759]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-wider font-bold">GROUNDING SCORE</span>
            <ShieldCheck className="w-4 h-4 text-[#34c759]" />
          </div>
          <p className="text-3xl font-extrabold text-[#15803d] font-mono">{report.overallGroundingScore}%</p>
          <span className="text-[11px] font-mono text-[#15803d] block font-bold">
            {report.verifiedChainsCount} / {report.totalTalkingPoints} Verified Chains
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 hover:border-[#0071e3]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-wider font-bold">PRIMARY OEM SOURCES</span>
            <Cpu className="w-4 h-4 text-[#0071e3]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1d1d1f] font-mono">{auth.tier1PrimaryCount}</p>
          <span className="text-[11px] font-mono text-[#6e6e73] block">Tier 1 Specs</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 hover:border-[#0071e3]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-wider font-bold">INDEPENDENT LABS</span>
            <Layers className="w-4 h-4 text-[#0071e3]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1d1d1f] font-mono">{auth.tier2IndependentLabCount}</p>
          <span className="text-[11px] font-mono text-[#0071e3] block">Lab Benchmarks</span>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-5 sm:p-6 space-y-1.5 hover:border-[#34c759]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-wider font-bold">INDEPENDENCE SCORE</span>
            <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1d1d1f] font-mono">{auth.averageIndependenceScore} / 10</p>
          <span className="text-[11px] font-mono text-[#15803d] block font-bold">
            {auth.syndicatedCount > 0 ? `⚠️ ${auth.syndicatedCount} Syndicated` : "Zero Copied PR"}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-[#e5e5ea] pb-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab("lineage")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
            activeTab === "lineage"
              ? "bg-[#0071e3] text-white shadow-sm"
              : "bg-white text-[#48484a] border border-[#e5e5ea] hover:border-[#d1d1d6]"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 inline mr-1.5" />
          Multi-Hop Lineage Chains ({report.lineageChains.length})
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
            activeTab === "sources"
              ? "bg-[#0071e3] text-white shadow-sm"
              : "bg-white text-[#48484a] border border-[#e5e5ea] hover:border-[#d1d1d6]"
          }`}
        >
          <Database className="w-3.5 h-3.5 inline mr-1.5" />
          Source Authority Matrix
        </button>

        <button
          onClick={() => setActiveTab("proofsheet")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
            activeTab === "proofsheet"
              ? "bg-[#0071e3] text-white shadow-sm"
              : "bg-white text-[#48484a] border border-[#e5e5ea] hover:border-[#d1d1d6]"
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          Citation Proof Sheet
        </button>

        <button
          onClick={() => setActiveTab("safety")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
            activeTab === "safety"
              ? "bg-[#0071e3] text-white shadow-sm"
              : "bg-white text-[#48484a] border border-[#e5e5ea] hover:border-[#d1d1d6]"
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
              <span className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-wider font-bold block mb-1">
                SCRIPT TALKING POINTS:
              </span>
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {report.lineageChains.map((chain) => {
                  const isSelected = selectedChain?.chainId === chain.chainId;
                  return (
                    <button
                      key={chain.chainId}
                      onClick={() => setSelectedChain(chain)}
                      className={`w-full text-left p-4 rounded-2xl border transition flex flex-col gap-1.5 shadow-2xs ${
                        isSelected
                          ? "bg-white border-[#0071e3] shadow-md ring-2 ring-[#0071e3]/20"
                          : "bg-white border-[#e5e5ea] hover:border-[#d1d1d6] hover:bg-[#fbfbfd]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <Badge
                          variant={
                            chain.verificationStatus === "VERIFIED"
                              ? "success"
                              : chain.verificationStatus === "NEEDS_CONTEXT"
                              ? "warning"
                              : "danger"
                          }
                          size="sm"
                        >
                          {chain.verificationStatus}
                        </Badge>
                        <span className="text-[#8e8e93] truncate max-w-[100px] font-semibold">{chain.publisher}</span>
                      </div>
                      <p className="text-xs font-bold text-[#1d1d1f] line-clamp-2 leading-snug">
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
                <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#e5e5ea] p-6 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-[#0071e3]" />
                      <h3 className="text-sm font-bold text-[#1d1d1f]">Evidence Lineage Hop Chain</h3>
                    </div>
                    <Badge variant={selectedChain.verificationStatus === "VERIFIED" ? "success" : "warning"} size="sm">
                      {selectedChain.verificationStatus === "VERIFIED" ? "✅ Unbroken Evidence Lineage" : selectedChain.verificationStatus}
                    </Badge>
                  </div>

                  {/* Hop 1 */}
                  <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-1">
                    <span className="text-[10px] font-mono text-[#0071e3] uppercase font-bold block">
                      HOP 1: CREATOR STUDIO SCRIPT STATEMENT
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#1d1d1f] italic">
                      "{selectedChain.talkingPointStatement}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-2">
                    <ArrowRight className="w-4 h-4 text-[#0071e3] rotate-90" />
                  </div>

                  {/* Hop 2 */}
                  <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#0071e3] uppercase font-bold">
                      <span>HOP 2: STRUCTURED VERIFIED CLAIM</span>
                      <span className="text-[#8e8e93]">{selectedChain.claimId}</span>
                    </div>
                    <p className="text-xs text-[#1d1d1f] leading-relaxed font-medium">
                      {selectedChain.claimText}
                    </p>
                  </div>

                  <div className="flex justify-center -my-2">
                    <ArrowRight className="w-4 h-4 text-[#0071e3] rotate-90" />
                  </div>

                  {/* Hop 3 */}
                  <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#15803d] uppercase font-bold">
                      <span>HOP 3: MEASURED LABORATORY EVIDENCE</span>
                      <span className="text-[#8e8e93]">{selectedChain.evidenceId}</span>
                    </div>
                    {selectedChain.benchmarkOrTranscriptRef && (
                      <div className="p-2.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-mono text-[#15803d] flex items-center justify-between">
                        <span>[{selectedChain.benchmarkOrTranscriptRef.type}] {selectedChain.benchmarkOrTranscriptRef.name}</span>
                        <span className="font-bold">{selectedChain.benchmarkOrTranscriptRef.scoreOrText}</span>
                      </div>
                    )}
                    <p className="text-xs text-[#48484a] italic leading-relaxed">
                      "{selectedChain.evidenceExcerpt}"
                    </p>
                  </div>

                  <div className="flex justify-center -my-2">
                    <ArrowRight className="w-4 h-4 text-[#0071e3] rotate-90" />
                  </div>

                  {/* Hop 4 */}
                  <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#6e6e73] uppercase font-bold">
                      <span>HOP 4: PRIMARY SOURCE PROVENANCE</span>
                      <Badge variant="default" size="sm">
                        {selectedChain.authorityTier}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <div>
                        <h4 className="text-xs font-bold text-[#1d1d1f]">{selectedChain.publisher}</h4>
                        <p className="text-[11px] text-[#6e6e73] truncate max-w-md">{selectedChain.sourceTitle}</p>
                      </div>
                      <a
                        href={selectedChain.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] hover:underline shrink-0"
                      >
                        <span>Original Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-[#e5e5ea] p-12 text-center text-[#8e8e93] font-mono text-xs">
                  Select a talking point to inspect its unbroken evidence chain.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOURCE AUTHORITY MATRIX */}
      {activeTab === "sources" && (
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-[#1d1d1f]">Source Authority Tiers & Independence Ratings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap min-w-[650px]">
              <thead className="bg-[#fbfbfd] border-b border-[#e5e5ea]">
                <tr className="text-[10px] font-mono text-[#8e8e93] uppercase font-bold">
                  <th className="px-4 py-3">Publisher</th>
                  <th className="px-4 py-3">Authority Tier</th>
                  <th className="px-4 py-3">Independence Score</th>
                  <th className="px-4 py-3">Syndication Flag</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f7]">
                {report.nodes.filter((n) => n.type === "SOURCE").map((src) => (
                  <tr key={src.id} className="hover:bg-[#fbfbfd] transition">
                    <td className="px-4 py-3 font-semibold text-[#1d1d1f]">{src.publisher || src.label}</td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <Badge variant="default" size="sm">
                        {src.authorityTier || "TIER_3_SECONDARY"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[#15803d]">
                      {src.independenceScore || 8.0} / 10
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      {src.isSyndicated ? (
                        <span className="text-[#b45309] font-bold">⚠️ Syndicated PR</span>
                      ) : (
                        <span className="text-[#15803d] font-bold">✅ Independent</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {src.sourceUrl && (
                        <a
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0071e3] hover:underline inline-flex items-center gap-1 font-semibold text-xs"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
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
          <div className="bg-white rounded-3xl shadow-sm border border-[#e5e5ea] p-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1d1d1f]">Paste-Ready Citation Proof Sheet</h2>
              <p className="text-xs text-[#6e6e73] font-medium mt-0.5">Use this audit document to defend your review claims against sponsor or manufacturer pushback.</p>
            </div>
            <button
              onClick={() => copyToClipboard(report.citationProofSheetMarkdown, "proofSheetTab")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0071e3] bg-[#eef2ff] px-4 py-2 rounded-full border border-[#c7d2fe]/80 hover:bg-[#e0e7ff] transition"
            >
              {copiedSection === "proofSheetTab" ? <Check className="w-3.5 h-3.5 text-[#34c759]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === "proofSheetTab" ? "Copied!" : "Copy Proof Sheet"}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-8 font-mono text-xs text-[#1d1d1f] max-h-[550px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {report.citationProofSheetMarkdown}
          </div>
        </div>
      )}

      {/* TAB 4: FACT-CHECK & SAFETY AUDIT */}
      {activeTab === "safety" && (
        <div className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34c759]" /> Script On-Camera Safety & Overstatement Audit
          </h2>
          <p className="text-xs text-[#6e6e73] leading-relaxed font-medium">
            VeritasTech AI enforces real-time guardrails to ensure content creators never make definitive statements without corroborating primary laboratory data.
          </p>

          <div className="space-y-3 pt-2">
            {report.lineageChains.map((chain) => (
              <div key={chain.chainId} className="p-4 rounded-2xl bg-[#fbfbfd] border border-[#e5e5ea] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1d1d1f]">"{chain.talkingPointStatement}"</span>
                  <Badge
                    variant={
                      chain.verificationStatus === "VERIFIED"
                        ? "success"
                        : chain.verificationStatus === "NEEDS_CONTEXT"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                  >
                    {chain.verificationStatus}
                  </Badge>
                </div>
                <div className="text-[11px] text-[#8e8e93] font-mono flex items-center gap-4">
                  <span>Source: {chain.publisher}</span>
                  <span>Independence: {chain.independenceScore}/10</span>
                  <span>Tier: {chain.authorityTier}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
