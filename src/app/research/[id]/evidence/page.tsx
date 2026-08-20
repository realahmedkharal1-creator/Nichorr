"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, ExternalLink, Link2, FileCheck, Search, Filter, Layers, AlertCircle } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { classifySource, detectSourceSyndication } from "@/features/research/source-intelligence";

export default function EvidencePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState("ALL");

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
      });
  }, [params.id]);

  if (!run) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const syndicationMap = detectSourceSyndication(run.sources || []);

  const filteredClaims = (run.claims || []).filter((c) => {
    const matchesSearch =
      c.claim_text.toLowerCase().includes(search.toLowerCase()) ||
      c.claim_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesConfidence = confidenceFilter === "ALL" || c.confidence === confidenceFilter;

    return matchesSearch && matchesStatus && matchesConfidence;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">EVIDENCE INTELLIGENCE EXPLORER</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Searchable Evidence & Source Traceability</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Filter, search, and audit the complete origin chain: Finding → Claim → Verbatim Excerpt → Source Metadata.</p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Explorer Search & Filter Bar */}
      <div className="slate-card p-4 bg-slate-900/90 border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search claims, excerpts, or sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUPPORTED">SUPPORTED</option>
              <option value="CONTRADICTED">CONTRADICTED</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
            </select>

            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Confidence</option>
              <option value="HIGH">HIGH Confidence</option>
              <option value="MEDIUM">MEDIUM Confidence</option>
              <option value="LOW">LOW Confidence</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-850 pt-2">
          <span>Showing {filteredClaims.length} of {run.claims?.length || 0} claims</span>
          <span>{run.sources?.length || 0} Audited Sources</span>
        </div>
      </div>

      {/* Claims & Evidence Explorer List */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="slate-card p-12 text-center text-slate-500 font-mono text-sm space-y-2">
            <Search className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            <p className="text-slate-300 font-sans font-semibold">No claims match your search filter</p>
            <p className="text-xs text-slate-500">Try broadening your search term or status filter.</p>
          </div>
        ) : (
          filteredClaims.map((claim, idx) => {
            const matchingEvidence = (run.evidence || []).filter((ev) => (claim.evidence_ids || []).includes(ev.id));

            return (
              <div key={claim.id} className="slate-card p-6 space-y-4 bg-slate-900/90 border-slate-800">
                {/* Claim Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center border border-indigo-800/80 shrink-0 mt-0.5 shadow-sm">
                      #{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-100 leading-snug">{claim.claim_text}</h3>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase bg-indigo-950/80 border border-indigo-900 px-2 py-0.5 rounded font-semibold">
                        {claim.claim_type} CLAIM
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="badge-verified px-3 py-1 rounded-md text-xs font-mono font-bold">
                      {claim.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400 px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800 font-semibold">
                      CONFIDENCE: {claim.confidence}
                    </span>
                  </div>
                </div>

                {/* Linked Evidence Excerpts & Source Intelligence */}
                <div className="space-y-3">
                  <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase font-semibold">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" /> Linked Verbatim Excerpts ({matchingEvidence.length})
                  </label>

                  {matchingEvidence.length === 0 ? (
                    <p className="text-xs text-amber-400 font-mono italic p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl">
                      No verbatim excerpt found in source text. Categorized as UNSUPPORTED.
                    </p>
                  ) : (
                    matchingEvidence.map((ev) => {
                      const source = (run.sources || []).find((s) => s.id === ev.source_id);
                      const classification = source ? classifySource(source) : null;
                      const isSyndicated = source ? (syndicationMap.get(source.id) || false) : false;

                      return (
                        <div key={ev.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                          <blockquote className="text-xs text-slate-200 font-mono border-l-2 border-indigo-500 pl-3.5 py-1 leading-relaxed bg-slate-900/40 rounded-r-lg">
                            "{ev.excerpt}"
                          </blockquote>

                          {source && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-850 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-100">{source.publisher}</span>
                                <span className="text-slate-600">•</span>
                                {classification && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                                    {classification.sourceCategory}
                                  </span>
                                )}
                                {isSyndicated && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800 font-bold flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-amber-400" /> Syndicated Coverage
                                  </span>
                                )}
                              </div>

                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px] flex items-center gap-1 font-semibold hover:underline"
                              >
                                Inspect Source URL <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


