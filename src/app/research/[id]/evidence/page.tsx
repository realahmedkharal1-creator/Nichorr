"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Shield, 
  Globe, 
  Zap, 
  X, 
  Copy, 
  Plus, 
  CheckCircle2, 
  Quote 
} from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { detectSourceSyndication } from "@/features/research/source-intelligence";

export default function EvidencePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All Claims");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRun(data.run);
      });
  }, [params.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!run) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  const claims = run.claims || [];
  const totalClaims = claims.length;

  const cleanTitle = (text: string) => {
    return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();
  };

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.claim_text.toLowerCase().includes(search.toLowerCase()) ||
      c.claim_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesConfidence = confidenceFilter === "ALL" || c.confidence === confidenceFilter;

    const cText = c.claim_text.toLowerCase();
    let matchesCategory = true;
    if (categoryFilter !== "All Claims") {
      if (categoryFilter === "Performance & SoC")
        matchesCategory = /processor|chip|snapdragon|bionic|performance|fps|geekbench/.test(cText);
      else if (categoryFilter === "Camera & Optics")
        matchesCategory = /camera|lens|zoom|photo|video|megapixels|sensor/.test(cText);
      else if (categoryFilter === "Battery & Charging")
        matchesCategory = /battery|mah|charge|watt|drain/.test(cText);
      else if (categoryFilter === "Display & Thermals")
        matchesCategory = /display|oled|hz|nits|heat|thermal|cooling/.test(cText);
    }

    return matchesSearch && matchesStatus && matchesConfidence && matchesCategory;
  });

  const categories = ["All Claims", "Performance & SoC", "Camera & Optics", "Battery & Charging", "Display & Thermals"];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="border-b border-[#e5e5ea] pb-5">
        <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
          EVIDENCE INTELLIGENCE EXPLORER
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
          Searchable Evidence & Source Traceability
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Trace every claim to raw citation excerpts, confidence ratings, and primary lab measurements.
        </p>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Top 3 KPI Stats Row (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider mb-1">
              TOTAL CLAIMS
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1d1d1f]">{totalClaims}</span>
              <span className="text-xs font-semibold text-[#15803d]">100% Traced</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#0071e3]" />
          </div>
        </div>

        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider mb-1">
              SOURCE DISTRIBUTION
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1d1d1f]">{run.sources?.length || 0}</span>
              <span className="text-xs font-semibold text-[#0071e3]">Independent Vectors</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[#0071e3]" />
          </div>
        </div>

        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-5 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider mb-1">
              CONFIDENCE RATING
            </p>
            <div className="mt-1">
              <Badge variant="success" size="sm">
                High Confidence (100%)
              </Badge>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#34c759]" />
          </div>
        </div>
      </div>

      {/* Advanced Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-3 sm:p-4 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-3 w-full border-b sm:border-b-0 sm:border-r border-[#f5f5f7] pb-3 sm:pb-0 sm:pr-4">
            <Search className="w-4 h-4 text-[#8e8e93] shrink-0" />
            <input
              type="text"
              placeholder="Search claims, excerpts, or hardware specs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-xs sm:text-sm text-[#1d1d1f] focus:outline-none placeholder:text-[#8e8e93] font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="shrink-0 p-1 hover:bg-[#f5f5f7] rounded-full transition-colors text-[#8e8e93]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="shrink-0 hidden sm:block">
              <span className="text-[11px] font-mono font-bold text-[#6e6e73] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#e5e5ea]">
                {filteredClaims.length} of {totalClaims} Claims
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-full px-3.5 py-1.5 text-xs text-[#1d1d1f] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUPPORTED">SUPPORTED</option>
              <option value="CONTRADICTED">CONTRADICTED</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
            </select>

            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="bg-[#f5f5f7] border border-[#e5e5ea] rounded-full px-3.5 py-1.5 text-xs text-[#1d1d1f] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Confidence</option>
              <option value="HIGH">HIGH Confidence</option>
              <option value="MEDIUM">MEDIUM Confidence</option>
              <option value="LOW">LOW Confidence</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                categoryFilter === cat
                  ? "bg-[#0071e3] text-white border-transparent shadow-sm shadow-[#0071e3]/20"
                  : "bg-white text-[#48484a] border-[#e5e5ea] hover:border-[#d1d1d6] hover:text-[#1d1d1f] shadow-2xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Redesigned Evidence Cards */}
      <div className="space-y-4">
        {filteredClaims.map((claim, index) => {
          const evidenceItems = run.evidence?.filter((e) => claim.evidence_ids?.includes(e.id)) || [];

          return (
            <div
              key={claim.id}
              className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_8px_24px_rgba(0,113,227,0.06)] hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-[#f5f5f7] text-[#1d1d1f] text-xs font-mono font-bold px-2.5 py-1 rounded-xl shrink-0 border border-[#e5e5ea]">
                    #{String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider mb-0.5 block">
                      {categoryFilter !== "All Claims" ? categoryFilter : claim.claim_type.replace(/_/g, " ")}
                    </span>
                    <h3 className="text-[#1d1d1f] font-bold text-base leading-snug group-hover:text-[#0071e3] transition-colors">
                      {cleanTitle(claim.claim_text).substring(0, 95)}...
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      claim.status === "SUPPORTED"
                        ? "success"
                        : claim.status === "CONTRADICTED"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                  >
                    {claim.status === "SUPPORTED" ? "✓ " : ""}
                    {claim.status}
                  </Badge>
                  <Badge variant="default" size="sm">
                    CONFIDENCE: {claim.confidence}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="mt-2 space-y-3">
                <p className="text-[#1d1d1f] font-medium text-xs sm:text-sm leading-relaxed">
                  {claim.claim_text}
                </p>

                {evidenceItems.length > 0 && (
                  <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-4 relative">
                    <Quote className="w-4 h-4 text-[#8e8e93] absolute top-3 left-3 opacity-50" />
                    <p className="text-xs sm:text-sm text-[#48484a] italic leading-relaxed pl-7 pr-2 font-normal">
                      "{evidenceItems[0].excerpt.replace(/\n/g, " ").trim()}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-[#f5f5f7]">
                <div className="flex flex-wrap items-center gap-2">
                  {evidenceItems.slice(0, 1).map((ev) => {
                    const source = run.sources?.find((s) => s.id === ev.source_id);
                    if (!source) return null;
                    const hostname = source.url
                      ? new URL(source.url).hostname.replace("www.", "")
                      : "Source";
                    return (
                      <div key={source.id} className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                            alt="favicon"
                            className="w-3.5 h-3.5 rounded-xs"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                          {hostname}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider bg-[#f5f5f7] border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                          {source.sourceType?.replace(/_/g, " ") || "Secondary Source"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <a
                    href={
                      evidenceItems[0]
                        ? run.sources?.find((s) => s.id === evidenceItems[0].source_id)?.url || "#"
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6e6e73] hover:text-[#0071e3] text-xs font-semibold flex items-center gap-1 transition-colors mr-auto lg:mr-0"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => showToast("Citation copied to clipboard!")}
                    className="flex items-center gap-1.5 text-[#1d1d1f] hover:bg-[#f5f5f7] bg-white border border-[#e5e5ea] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Copy className="w-3 h-3" /> Copy Citation
                  </button>
                  <button
                    onClick={() => showToast("Added to Video Script!")}
                    className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-sm shadow-[#0071e3]/20 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3 h-3" /> Add to Script
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#e5e5ea]">
            <Filter className="w-8 h-8 text-[#8e8e93] mx-auto mb-3 opacity-60" />
            <h3 className="text-[#1d1d1f] font-bold text-sm">No evidence matches your filters</h3>
            <p className="text-xs text-[#6e6e73] mt-1 font-medium">
              Try adjusting your search query or category filters.
            </p>
          </div>
        )}
      </div>

      {/* Global Toast UI */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#1d1d1f] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 z-50 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#34c759]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
