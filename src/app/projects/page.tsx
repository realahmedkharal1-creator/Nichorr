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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-xs font-mono text-citation font-semibold uppercase tracking-wider block mb-1">CREATOR WORKSPACE ORGANIZER</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <FolderPlus className="w-7 h-7 text-citation" />
            Research Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-muted-2 mt-1">Organize multiple research runs, compare evolving findings, and manage technical creator briefs.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-citation hover:opacity-90 text-white px-5 py-2.5 rounded-[9px] text-sm font-semibold transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-muted-2 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-line rounded-[9px] pl-9 pr-4 py-2.5 text-xs text-ink placeholder:text-muted-2 focus:outline-none focus:border-citation transition"
          />
        </div>
        <span className="text-xs font-mono text-muted-2 shrink-0">{filteredProjects.length} Projects Active</span>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[24px] p-6 max-w-md w-full space-y-4 border border-line-soft ">
            <h2 className="text-lg font-bold text-ink border-b border-line-soft pb-2">Create Research Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">Project Name <span className="text-conflict">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Galaxy S27 Ultra vs iPhone 18 Pro Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-line rounded-[9px] px-4 py-2.5 text-ink placeholder:text-muted-2 text-xs focus:outline-none focus:border-citation focus:ring-1 focus:ring-citation "
                />
              </div>
  
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">Description / Goal (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope of this project and key benchmark comparisons..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-card border border-line rounded-[9px] px-4 py-2.5 text-ink placeholder:text-muted-2 text-xs focus:outline-none focus:border-citation focus:ring-1 focus:ring-citation "
                />
              </div>
  
              <div className="flex justify-end gap-2 pt-2 border-t border-line-soft">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-[9px] text-xs font-semibold text-muted-2 hover:text-ink hover:bg-paper transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || creating}
                  className="bg-citation hover:opacity-90 text-white px-5 py-2 rounded-[9px] text-xs font-semibold  transition disabled:opacity-50"
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
        <div className="bg-card border border-line-soft rounded-[16px] p-12 text-center space-y-4 bg-card">
          <FolderPlus className="w-12 h-12 text-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink">No Projects Created Yet</h3>
            <p className="text-xs text-muted-2">Organize multiple research runs inside a project to compare findings over time.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-citation hover:opacity-90 text-white px-4 py-2 rounded-[9px] text-xs font-semibold transition "
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
              className="bg-card border border-line-soft rounded-[16px] p-6 space-y-4 shadow-card hover:border-citation/50 hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-citation">
                  <span className="font-semibold uppercase tracking-wider">PROJECT</span>
                  <span className="px-2 py-0.5 rounded-full bg-citation-bg text-citation border border-citation/25 font-bold">
                    {p.run_count || 0} Runs
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink group-hover:text-citation transition line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-2 line-clamp-2 leading-relaxed">
                  {p.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-muted-2 pt-3 border-t border-line-soft">
                <span>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "Active"}</span>
                <span className="flex items-center gap-1 text-citation font-semibold group-hover:translate-x-1 transition transform">
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
