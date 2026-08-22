"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, FileText, Database, Video, ArrowRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">UNIFIED SAAS SEARCH ENGINE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <SearchIcon className="w-7 h-7 text-indigo-400" />
          Global Production Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Search across Research Runs, Knowledge Base Facts, Content Production Items, and Alerts.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search Galaxy S26, Exynos, benchmarks, video scripts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-750 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-md transition"
        >
          Search System
        </button>
      </form>

      {/* Results View */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !results ? (
        <div className="slate-card p-12 text-center text-slate-500 text-xs italic">
          Enter a query above to search system objects across projects and workspaces.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Research Results */}
          {results.research && results.research.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Research Runs ({results.research.length})
              </h2>
              <div className="space-y-2">
                {results.research.map((r: any) => (
                  <Link key={r.id} href={`/research/${r.id}/results`} className="slate-card p-4 bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 block transition">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-100">{r.topic}</span>
                      <span className="font-mono text-indigo-400">{r.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Results */}
          {results.knowledge && results.knowledge.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" /> Persistent Knowledge Facts ({results.knowledge.length})
              </h2>
              <div className="space-y-2">
                {results.knowledge.map((k: any) => (
                  <div key={k.id} className="slate-card p-4 bg-slate-900/80 border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-slate-100">{k.normalized_claim}</span>
                    <p className="text-xs text-indigo-300 font-mono">{k.current_value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Results */}
          {results.content && results.content.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" /> Content Pipeline Items ({results.content.length})
              </h2>
              <div className="space-y-2">
                {results.content.map((c: any) => (
                  <Link key={c.id} href={`/content/${c.id}`} className="slate-card p-4 bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 block transition">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-100">{c.title}</span>
                      <span className="font-mono text-emerald-400">{c.stage}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
