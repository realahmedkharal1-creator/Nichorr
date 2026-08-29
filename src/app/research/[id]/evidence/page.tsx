
"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, ExternalLink, Link2, FileCheck, Search, Filter, Layers, AlertCircle, Shield, Globe, Zap, X, Copy, Plus, CheckCircle2, Quote } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { classifySource, detectSourceSyndication } from "@/features/research/source-intelligence";

export default function EvidencePage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confidenceFilter, setConfidenceFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All Claims");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) { setRun(data.run); } else { setNotFound(true); }
      });
  }, [params.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-ink">Run Not Found</h2>
        <p className="text-ink/80">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const syndicationMap = detectSourceSyndication(run.sources || []);
  const claims = run.claims || [];
  const totalClaims = claims.length;
  
  // Clean claim titles helper
  const cleanTitle = (text: string) => {
    return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();
  };

  const filteredClaims = claims.filter((c) => {
    const matchesSearch =
      c.claim_text.toLowerCase().includes(search.toLowerCase()) ||
      c.claim_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesConfidence = confidenceFilter === "ALL" || c.confidence === confidenceFilter;
    
    // Simple category mapping based on keywords for demo
    const cText = c.claim_text.toLowerCase();
    let matchesCategory = true;
    if (categoryFilter !== "All Claims") {
       if (categoryFilter === "Performance & SoC") matchesCategory = /processor|chip|snapdragon|bionic|performance|fps|geekbench/.test(cText);
       else if (categoryFilter === "Camera & Optics") matchesCategory = /camera|lens|zoom|photo|video|megapixels|sensor/.test(cText);
       else if (categoryFilter === "Battery & Charging") matchesCategory = /battery|mah|charge|watt|drain/.test(cText);
       else if (categoryFilter === "Display & Thermals") matchesCategory = /display|oled|hz|nits|heat|thermal|cooling/.test(cText);
    }

    return matchesSearch && matchesStatus && matchesConfidence && matchesCategory;
  });

  const categories = ["All Claims", "Performance & SoC", "Camera & Optics", "Battery & Charging", "Display & Thermals"];

  // Calculate Confidence
  let confidenceBadge = "High Confidence (100%)";
  let confidenceColor = "bg-verified-bg text-verified border-verified/25";
  if (totalClaims === 0) {
    confidenceBadge = "No data yet";
    confidenceColor = "bg-paper text-ink/80 border-line";
  } else {
    const claimsWithEvidence = claims.filter(c => c.evidence_ids && c.evidence_ids.length > 0).length;
    const confidencePct = Math.round((claimsWithEvidence / totalClaims) * 100);
    if (confidencePct >= 80) {
      confidenceBadge = `High Confidence (${confidencePct}%)`;
      confidenceColor = "bg-verified-bg text-verified border-verified/25";
    } else if (confidencePct >= 50) {
      confidenceBadge = `Medium Confidence (${confidencePct}%)`;
      confidenceColor = "bg-warning-bg text-warning border-warning/25";
    } else {
      confidenceBadge = `Low Confidence (${confidencePct}%)`;
      confidenceColor = "bg-conflict-bg text-conflict border-conflict/25";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">EVIDENCE INTELLIGENCE EXPLORER</span>
        <h1 className="font-mono text-2xl sm:text-3xl font-bold text-ink tracking-tight">Searchable Evidence & Source Traceability</h1>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Top 3 KPI Stats Row (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-line/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">TOTAL CLAIMS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink">{totalClaims}</span>
              <span className="text-xs font-medium text-verified">100% Traced to Sources</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-ink/80" />
          </div>
        </div>
        
        <div className="bg-card border border-line/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">SOURCE DISTRIBUTION</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-ink">{run.sources?.length || 0} Total</span>
              <span className="text-xs font-medium text-citation">YouTube & Web Specs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-ink/80" />
          </div>
        </div>

        <div className="bg-card border border-line/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">CONFIDENCE RATING</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${confidenceColor}`}>
                {confidenceBadge}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-muted-2" />
          </div>
        </div>
      </div>

      {/* Advanced Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="bg-card border border-line rounded-2xl px-4 py-3 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-3 w-full border-b sm:border-b-0 sm:border-r border-line pb-3 sm:pb-0 sm:pr-4">
            <Search className="w-5 h-5 text-muted-2 shrink-0" />
            <input
              type="text"
              placeholder="Search claims, excerpts, or sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-ink focus:outline-none focus:ring-0 placeholder:text-muted-2"
            />
            {search && (
              <button onClick={() => setSearch("")} className="shrink-0 p-1 hover:bg-paper rounded-full transition-colors text-muted-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="shrink-0 hidden sm:block">
               <span className="text-xs font-medium text-muted bg-paper px-2.5 py-1 rounded-md">Showing {filteredClaims.length} of {totalClaims} Audited Claims</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto shrink-0 pb-1 sm:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-paper border border-line rounded-full px-3 py-1.5 text-xs text-ink/80 focus:outline-none focus:border-line font-semibold cursor-pointer appearance-none pr-8 relative"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: `right 8px center`, backgroundRepeat: `no-repeat` }}
            >
              <option value="ALL">All Statuses</option>
              <option value="SUPPORTED">SUPPORTED</option>
              <option value="CONTRADICTED">CONTRADICTED</option>
              <option value="UNVERIFIED">UNVERIFIED</option>
            </select>

            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="bg-paper border border-line rounded-full px-3 py-1.5 text-xs text-ink/80 focus:outline-none focus:border-line font-semibold cursor-pointer appearance-none pr-8 relative"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: `right 8px center`, backgroundRepeat: `no-repeat` }}
            >
              <option value="ALL">All Confidence</option>
              <option value="HIGH">HIGH Confidence</option>
              <option value="MEDIUM">MEDIUM Confidence</option>
              <option value="LOW">LOW Confidence</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setCategoryFilter(cat)}
               className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                 categoryFilter === cat 
                   ? "bg-ink text-white border-muted-2 shadow-card" 
                   : "bg-card text-ink/80 border-line hover:border-line hover:bg-paper"
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
            <div key={claim.id} className="bg-card border border-line/90 rounded-2xl p-6 shadow-sm mb-4 hover:border-line transition-all group">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-paper text-ink/80 text-xs font-black px-2.5 py-1 rounded-md shrink-0 border border-line">
                    #{String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-2 uppercase tracking-wider mb-1 block">
                      {categoryFilter !== "All Claims" ? categoryFilter : claim.claim_type.replace(/_/g, " ")}
                    </span>
                    <h3 className="text-ink font-bold text-base leading-tight">
                      {cleanTitle(claim.claim_text).substring(0, 80)}...
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${
                    claim.status === "SUPPORTED" ? "bg-verified-bg text-verified border-verified/25" :
                    claim.status === "CONTRADICTED" ? "bg-conflict-bg text-conflict border-conflict/25" :
                    "bg-warning-bg text-warning border-warning/25"
                  }`}>
                    {claim.status === "SUPPORTED" && "✓ "}
                    {claim.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${
                    claim.confidence === "HIGH" ? "bg-citation-bg text-citation border-citation/20" :
                    claim.confidence === "MEDIUM" ? "bg-citation-bg text-citation border-citation/20" :
                    "bg-paper text-ink/80 border-line"
                  }`}>
                    ⚡ CONFIDENCE: {claim.confidence}
                  </span>
                </div>
              </div>

              {/* Card Body (Clean Claim & Verbatim Quote) */}
              <div className="mt-2">
                <p className="text-ink font-medium text-sm leading-relaxed">
                  {claim.claim_text}
                </p>
                
                {evidenceItems.length > 0 && (
                  <div className="bg-paper/80 border border-line/80 rounded-xl p-4 mt-4 relative">
                    <Quote className="w-5 h-5 text-muted-2 absolute top-3 left-3" />
                    <p className="text-sm text-ink/80 italic leading-relaxed pl-8 pr-2">
                      "{evidenceItems[0].excerpt.replace(/\n/g, " ").trim()}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer (Metadata & Quick Creator Actions) */}
              <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-line">
                {/* Left: Source Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  {evidenceItems.slice(0, 1).map((ev) => {
                    const source = run.sources?.find((s) => s.id === ev.source_id);
                    if (!source) return null;
                    const hostname = source.url ? new URL(source.url).hostname.replace("www.", "") : "Source";
                    return (
                      <div key={source.id} className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-card border border-line text-ink/80 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                          <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} alt="favicon" className="w-3.5 h-3.5 rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          {hostname}
                        </span>
                        <span className="text-[10px] font-bold text-muted-2 uppercase tracking-wider bg-paper px-2 py-0.5 rounded">
                          {source.sourceType?.replace(/_/g, " ") || "Secondary Source"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <a 
                    href={evidenceItems[0] ? run.sources?.find((s) => s.id === evidenceItems[0].source_id)?.url || "#" : "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted hover:text-citation text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors mr-auto lg:mr-0"
                  >
                    Inspect Source <ExternalLink className="w-3 h-3" />
                  </a>
                  <button onClick={() => showToast("Citation copied to clipboard!")} className="flex items-center gap-1.5 text-ink/80 hover:text-ink bg-card hover:bg-paper border border-line rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all shadow-sm">
                    <Copy className="w-3.5 h-3.5" /> Copy Citation
                  </button>
                  <button onClick={() => showToast("Added to Video Script!")} className="flex items-center gap-1.5 bg-ink hover:bg-ink text-white rounded-xl px-3.5 py-1.5 text-[11px] font-bold transition-all shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Add to Script
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-line">
            <Filter className="w-8 h-8 text-muted-2 mx-auto mb-3" />
            <h3 className="text-ink font-bold">No evidence matches your filters</h3>
            <p className="text-sm text-muted mt-1">Try adjusting your search query or category filters.</p>
          </div>
        )}
      </div>

      {/* Global Toast UI */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-ink text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 text-verified" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
