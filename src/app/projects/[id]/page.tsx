"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Folder, Plus, ArrowRight, ShieldCheck, Layers, FileCheck, Calendar, Sparkles } from "lucide-react";
import { ProjectEntity } from "@/lib/database/repositories/projects.repo";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const runs: ResearchRunSession[] = project.research_runs || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Project Workspace Header */}
      <div className="slate-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
            <Folder className="w-4 h-4" /> PROJECT WORKSPACE
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full font-bold">
            {runs.length} Runs Total
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">{project.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-850">
          <Link
            href={`/research/create?projectId=${project.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Run in Project
          </Link>

          <Link
            href={`/projects/${project.id}/content/ideas`}
            className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-indigo-300 border border-slate-750 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Content Ideas
          </Link>
        </div>
      </div>

      {/* Knowledge Health & Smart Recommendations */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">KNOWLEDGE HEALTH SCORE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">84%</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">OPTIMAL</span>
          </div>
          <p className="text-[11px] text-slate-400">High claim corroboration across primary & lab sources.</p>
        </div>

        <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">EVIDENCE FRESHNESS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">92%</span>
            <span className="text-xs font-mono text-slate-400">FRESH (&lt;30d)</span>
          </div>
          <p className="text-[11px] text-slate-400">Zero critical stale facts requiring re-verification.</p>
        </div>

        <div className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">CONFLICT RESOLUTION</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">76%</span>
            <span className="text-xs font-mono text-amber-400">1 CONFLICT</span>
          </div>
          <p className="text-[11px] text-slate-400">1 methodological conflict flagged for creator advice.</p>
        </div>
      </div>

      {/* Project Runs Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Project Research Runs ({runs.length})
        </h2>

        {runs.length === 0 ? (
          <div className="slate-card p-12 text-center space-y-3 bg-slate-900/50">
            <p className="text-sm text-slate-400">No research runs launched in this project yet.</p>
            <Link
              href={`/research/create?projectId=${project.id}`}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" /> Launch First Research Run
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map((r) => (
              <div key={r.id} className="slate-card p-5 hover:border-indigo-500/60 hover:bg-slate-900/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-indigo-400 font-semibold">{r.contentType || "Comparison"}</span>
                    <span className="text-slate-700">•</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {r.status}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs font-mono text-slate-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition">{r.topic}</h3>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-0.5">
                    <span>SOURCES: {r.sources?.length || (r as any).source_count || 0}</span>
                    <span>CLAIMS: {r.claims?.length || (r as any).claim_count || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/research/${r.id}/creator`}
                    className="bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-750 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Creator Studio
                  </Link>

                  <Link
                    href={`/research/${r.id}/results`}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
                  >
                    View Results <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
