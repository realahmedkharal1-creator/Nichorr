"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderPlus, Layers, Plus, ArrowRight, ShieldCheck, Search, Sparkles } from "lucide-react";
import { ProjectEntity } from "@/lib/database/repositories/projects.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || creating) return;

    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProjects([data.project, ...projects]);
        setName("");
        setDescription("");
        setShowCreateModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">CREATOR WORKSPACE ORGANIZER</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <FolderPlus className="w-7 h-7 text-indigo-400" />
            Research Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Organize multiple research runs, compare evolving findings, and manage technical creator briefs.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 shrink-0">{filteredProjects.length} Projects Active</span>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="slate-card p-6 max-w-md w-full space-y-4 bg-slate-900 border-indigo-900/60 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2">Create Research Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">Project Name <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Galaxy S27 Ultra vs iPhone 18 Pro Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">Description / Goal (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope of this project and key benchmark comparisons..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || creating}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="slate-card p-12 text-center space-y-4 bg-slate-900/60">
          <FolderPlus className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No Projects Created Yet</h3>
            <p className="text-xs text-slate-400">Organize multiple research runs inside a project to compare findings over time.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="slate-card p-6 space-y-4 hover:border-indigo-500/60 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                  <span className="font-semibold uppercase tracking-wider">PROJECT</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-850 font-bold">
                    {p.run_count || 0} Runs
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-850">
                <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "Active"}</span>
                <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition transform">
                  Open Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
