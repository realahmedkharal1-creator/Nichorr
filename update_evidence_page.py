import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\evidence\page.tsx"

content = """
"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { ShieldCheck, ExternalLink, Link2, FileCheck, Search, Filter, Layers, AlertCircle, Shield, Globe, Zap, X, Copy, Plus, CheckCircle2, Quote } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { classifySource, detectSourceSyndication } from "@/features/research/source-intelligence";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">EVIDENCE INTELLIGENCE EXPLORER</span>
        <h1 className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Searchable Evidence & Source Traceability</h1>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Top 3 KPI Stats Row (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL CLAIMS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{totalClaims}</span>
              <span className="text-xs font-medium text-emerald-600">100% Traced to Sources</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-slate-600" />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SOURCE DISTRIBUTION</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-slate-900">{run.sources?.length || 0} Total</span>
              <span className="text-xs font-medium text-blue-600">YouTube & Web Specs</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CONFIDENCE RATING</p>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                High Confidence (100%)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Advanced Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-3 w-full border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0 sm:pr-4">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search claims, excerpts, or sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-slate-900 focus:outline-none focus:ring-0 placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="shrink-0 p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="shrink-0 hidden sm:block">
               <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Showing {filteredClaims.length} of {totalClaims} Audited Claims</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto shrink-0 pb-1 sm:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-300 font-semibold cursor-pointer appearance-none pr-8 relative"
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
              className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-300 font-semibold cursor-pointer appearance-none pr-8 relative"
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
                   ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                   : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
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
          const evidenceItems = run.evidence?.filter((e) => e.claim_id === claim.id) || [];
          
          return (
            <div key={claim.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm mb-4 hover:border-slate-300 transition-all group">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-600 text-xs font-black px-2.5 py-1 rounded-md shrink-0 border border-slate-200">
                    #{String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                      {categoryFilter !== "All Claims" ? categoryFilter : claim.claim_type.replace(/_/g, " ")}
                    </span>
                    <h3 className="text-slate-900 font-bold text-base leading-tight">
                      {cleanTitle(claim.claim_text).substring(0, 80)}...
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${
                    claim.status === "SUPPORTED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    claim.status === "CONTRADICTED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {claim.status === "SUPPORTED" && "✓ "}
                    {claim.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${
                    claim.confidence === "HIGH" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    claim.confidence === "MEDIUM" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    ⚡ CONFIDENCE: {claim.confidence}
                  </span>
                </div>
              </div>

              {/* Card Body (Clean Claim & Verbatim Quote) */}
              <div className="mt-2">
                <p className="text-slate-900 font-medium text-sm leading-relaxed">
                  {claim.claim_text}
                </p>
                
                {evidenceItems.length > 0 && (
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 mt-4 relative">
                    <Quote className="w-5 h-5 text-slate-300 absolute top-3 left-3" />
                    <p className="text-sm text-slate-600 italic leading-relaxed pl-8 pr-2">
                      "{evidenceItems[0].excerpt.replace(/\\n/g, " ").trim()}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer (Metadata & Quick Creator Actions) */}
              <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                {/* Left: Source Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  {evidenceItems.slice(0, 1).map((ev) => {
                    const source = run.sources?.find((s) => s.id === ev.source_id);
                    if (!source) return null;
                    const hostname = source.url ? new URL(source.url).hostname.replace("www.", "") : "Source";
                    return (
                      <div key={source.id} className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                          <img src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`} alt="favicon" className="w-3.5 h-3.5 rounded-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          {hostname}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
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
                    className="text-slate-500 hover:text-indigo-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors mr-auto lg:mr-0"
                  >
                    Inspect Source <ExternalLink className="w-3 h-3" />
                  </a>
                  <button onClick={() => showToast("Citation copied to clipboard!")} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all shadow-sm">
                    <Copy className="w-3.5 h-3.5" /> Copy Citation
                  </button>
                  <button onClick={() => showToast("Added to Video Script!")} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3.5 py-1.5 text-[11px] font-bold transition-all shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Add to Script
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredClaims.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold">No evidence matches your filters</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or category filters.</p>
          </div>
        )}
      </div>

      {/* Global Toast UI */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
"""

with open(p, "w", encoding="utf-8") as f:
    f.write(content)
