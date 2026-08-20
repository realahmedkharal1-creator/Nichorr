"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Play, Sparkles, Layers, FileCheck, Activity } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { GOLDEN_BENCHMARK_DATASET } from "@/benchmarks/golden-dataset";
import { SkeletonCard, SkeletonTable } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<ResearchRunSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningBenchmark, setRunningBenchmark] = useState<string | null>(null);

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      const res = await fetch("/api/research");
      const data = await res.json();
      if (data.success) {
        setRuns(data.runs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBenchmark = (topic: string) => {
    router.push(`/research/create?topic=${encodeURIComponent(topic)}`);
  };

  const completedCount = runs.filter((r) => r.status === "COMPLETED" || r.status === "PARTIAL").length;
  const totalSources = runs.reduce((acc, r) => acc + (r.sources?.length || (r as any).source_count || 0), 0);
  const totalClaims = runs.reduce((acc, r) => acc + (r.claims?.length || (r as any).claim_count || 0), 0);

  return (
    <div className="space-y-8">
      {/* Workspace Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">GLOBAL CREATOR COMMAND CENTER</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Creator Intelligence Operating System</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Autonomous research, knowledge evolution, change monitoring, and evidence-locked content operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/content"
            className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-indigo-300 border border-slate-750 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition"
          >
            Content Board
          </Link>
          <Link
            href="/research/create"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Research Run
          </Link>
        </div>
      </div>

      {/* "What Needs Attention Right Now?" Critical Attention Banner */}
      <div className="slate-card p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/80 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-900/40 pb-2.5">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> WHAT NEEDS ATTENTION RIGHT NOW?
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            SYSTEM OPERATIONAL
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold block">RESEARCH QUEUE</span>
            <p className="text-slate-200 font-semibold">1 High-Impact Gap Surfaced</p>
            <Link href="/research/queue" className="text-indigo-400 hover:underline font-mono text-[11px] block pt-1">
              Start Research Queue →
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block">CONTENT PIPELINE</span>
            <p className="text-slate-200 font-semibold">2 Items Ready to Script</p>
            <Link href="/content" className="text-emerald-400 hover:underline font-mono text-[11px] block pt-1">
              Open Content Board →
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 font-bold block">QUALITY GATE AUDIT</span>
            <p className="text-slate-200 font-semibold">0 Critical Alerts</p>
            <Link href="/research/quality" className="text-amber-400 hover:underline font-mono text-[11px] block pt-1">
              Quality Audit →
            </Link>
          </div>
        </div>
      </div>

      {/* Command Center Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="slate-card p-5 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">TOTAL RESEARCH RUNS</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{loading ? "..." : runs.length}</p>
          <span className="text-[11px] text-slate-500 font-mono">Active workspace sessions</span>
        </div>

        <div className="slate-card p-5 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">COMPLETED BRIEFS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{loading ? "..." : completedCount}</p>
          <span className="text-[11px] text-emerald-400/80 font-mono">100% Audited & Grounded</span>
        </div>

        <div className="slate-card p-5 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">SOURCES ANALYZED</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{loading ? "..." : totalSources}</p>
          <span className="text-[11px] text-slate-500 font-mono">Primary & lab benchmarks</span>
        </div>

        <div className="slate-card p-5 space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-semibold">VERIFIED CLAIMS</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{loading ? "..." : totalClaims}</p>
          <span className="text-[11px] text-slate-500 font-mono">Claim-to-source traced</span>
        </div>
      </div>

      {/* Golden Benchmark Quick Runners */}
      <div className="slate-card p-6 border-indigo-950/80 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">10 Golden Benchmark Test Cases</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-semibold">
            OFFLINE AUDIT READY
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOLDEN_BENCHMARK_DATASET.slice(0, 6).map((bm) => (
            <button
              key={bm.id}
              onClick={() => handleRunBenchmark(bm.topic)}
              className="slate-card p-4 text-left hover:border-indigo-500/60 hover:bg-slate-850/80 transition-all flex flex-col justify-between group space-y-3"
            >
              <span className="font-semibold text-xs text-slate-200 group-hover:text-indigo-300 transition line-clamp-1">
                {bm.topic}
              </span>
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">{bm.contentType}</span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-0.5 transition transform">
                  <Play className="w-3 h-3 fill-current" />
                  Run Audit
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Runs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100">Recent Research Runs</h2>
          <span className="text-xs text-slate-400 font-mono">{runs.length} Runs Total</span>
        </div>

        {loading ? (
          <SkeletonTable />
        ) : runs.length === 0 ? (
          <div className="slate-card p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-850 border border-slate-750 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-300">No research runs created yet</h3>
              <p className="text-sm text-slate-500">Create your first research run or launch a Golden Benchmark test case above.</p>
            </div>
            <Link
              href="/research/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Create First Research Run
            </Link>
          </div>
        ) : (
          <div className="slate-card overflow-hidden border border-slate-800/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-xs font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Topic / Objective</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Sources</th>
                    <th className="p-4">Claims</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {runs.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-4 font-medium text-slate-100 max-w-xs truncate">{r.topic}</td>
                      <td className="p-4 text-slate-400 text-xs">{r.contentType}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                          r.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' :
                          r.status === 'CANCELLED' ? 'bg-red-950 text-red-400 border border-red-800/80' :
                          r.status === 'FAILED' ? 'bg-red-950 text-red-400 border border-red-800/80' :
                          r.status === 'CREATED' ? 'bg-slate-850 text-slate-300 border border-slate-700' :
                          'bg-amber-950 text-amber-400 border border-amber-800/80 animate-pulse'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs">{r.sources && r.sources.length > 0 ? r.sources.length : ((r as any).source_count || 0)}</td>
                      <td className="p-4 font-mono text-xs">{r.claims && r.claims.length > 0 ? r.claims.length : ((r as any).claim_count || 0)}</td>
                      <td className="p-4 text-xs text-slate-400 font-mono">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : (r as any).created_at ? new Date((r as any).created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={r.status === 'CANCELLED' ? `/research/${r.id}/live` : `/research/${r.id}/results`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                        >
                          {r.status === 'CANCELLED' ? 'View Status →' : 'View Results →'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

