"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight, ShieldCheck, FileCheck, Layers } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function HistoryPage() {
  const [runs, setRuns] = useState<ResearchRunSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRuns(data.runs);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRuns = runs.filter((r) => r.topic.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">AUDITED RESEARCH ARCHIVE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-400" />
            Research History & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Reopen previous research runs, inspect source citations, and re-export defensible briefs.</p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter research runs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ink border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="slate-card p-12 text-center text-slate-500 font-mono text-sm space-y-2">
            <Search className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            <p className="text-slate-300 font-sans font-semibold">No matching research runs found</p>
            <p className="text-xs text-slate-500 font-mono">Try adjusting your search query filter.</p>
          </div>
        ) : (
          filteredRuns.map((r) => (
            <div key={r.id} className="slate-card p-5 hover:border-citation/60 hover:bg-slate-900/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{r.contentType || "Comparison"}</span>
                  <span className="text-slate-700">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    r.status === 'COMPLETED' ? 'bg-verified text-emerald-400 border border-verified/80' :
                    r.status === 'CANCELLED' ? 'bg-conflict text-red-400 border border-red-800/80' :
                    r.status === 'FAILED' ? 'bg-conflict text-red-400 border border-red-800/80' :
                    'bg-warning text-amber-400 border border-amber-800/80'
                  }`}>
                    {r.status}
                  </span>
                  <span className="text-slate-700">•</span>
                  <span className="text-xs font-mono text-slate-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : (r as any).created_at ? new Date((r as any).created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition">{r.topic}</h3>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-0.5">
                  <span>SOURCES: {r.sources && r.sources.length > 0 ? r.sources.length : ((r as any).source_count || 0)}</span>
                  <span>CLAIMS: {r.claims && r.claims.length > 0 ? r.claims.length : ((r as any).claim_count || 0)}</span>
                  <span>CONFLICTS: {r.conflicts?.length ?? 0}</span>
                </div>
              </div>

              <Link
                href={r.status === 'CANCELLED' ? `/research/${r.id}/live` : `/research/${r.id}/results`}
                className="flex items-center gap-1.5 bg-slate-850 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-slate-750 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 shadow-sm group-hover:border-indigo-500"
              >
                {r.status === 'CANCELLED' ? 'View Status' : 'Open Results'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

