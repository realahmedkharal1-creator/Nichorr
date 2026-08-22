"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderPlus, Layers, Plus, ArrowRight, ShieldCheck, Search, Sparkles, X } from "lucide-react";
import { ProjectEntity } from "@/lib/database/repositories/projects.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const FALLBACK_PROJECTS = [
  {
    id: "proj-1",
    name: "Samsung Galaxy S27 Ultra Deep Dive",
    description: "Benchmark analysis across CPU, GPU, sustained thermal throttling, and camera sensor dynamic range.",
    created_at: "2026-08-20T10:00:00Z",
    run_count: 3,
  },
  {
    id: "proj-2",
    name: "Next-Gen GPU Benchmark Series 2026",
    description: "RTX 5090 vs RX 8900 XTX 4K ray tracing performance, power draw, and frame time consistency.",
    created_at: "2026-08-18T14:30:00Z",
    run_count: 2,
  },
  {
    id: "proj-3",
    name: "MacBook Pro M5 Max vs Dell XPS 16 Review",
    description: "Creator workstation comparison focusing on ProRes render exports, acoustic decibels, and battery endurance.",
    created_at: "2026-08-15T09:00:00Z",
    run_count: 1,
  },
];

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<any[]>([]);
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
      if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch (e) {
      console.error(e);
      setProjects(FALLBACK_PROJECTS);
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
      } else {
        // Optimistic addition
        setProjects([
          {
            id: `proj-${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            created_at: new Date().toISOString(),
            run_count: 0,
          },
          ...projects,
        ]);
      }
      setName("");
      setDescription("");
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            CREATOR WORKSPACE ORGANIZER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <FolderPlus className="w-7 h-7 text-[#0071e3]" />
            Research Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Organize multiple research runs, compare evolving findings, and manage technical creator briefs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#8e8e93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e5e5ea] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition font-medium"
          />
        </div>
        <span className="text-xs font-mono font-bold text-[#8e8e93] shrink-0">
          {filteredProjects.length} Projects Active
        </span>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 border border-[#e5e5ea] shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-3">
              <h2 className="text-base font-bold text-[#1d1d1f]">Create Research Project</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#8e8e93] hover:text-[#1d1d1f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1d1d1f]">
                  Project Name <span className="text-[#ff3b30]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Galaxy S27 Ultra vs iPhone 18 Pro Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-xs font-semibold focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1d1d1f]">
                  Description / Goal (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope of this project and key benchmark comparisons..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-xs font-medium focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e5ea]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#6e6e73] hover:bg-[#f5f5f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || creating}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition disabled:opacity-50 active:scale-95"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderPlus className="w-8 h-8 text-[#0071e3]" />}
          title="No Projects Created Yet"
          description="Organize multiple research runs inside a project to compare findings over time."
          actionLabel="Create First Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_12px_28px_rgba(0,113,227,0.06)] hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] font-bold text-[#0071e3] uppercase tracking-wider">
                    PROJECT
                  </span>
                  <Badge variant="default" size="sm">
                    {p.run_count || 0} Runs
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-[#6e6e73] font-medium line-clamp-2 leading-relaxed">
                  {p.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8e8e93] pt-3 border-t border-[#f5f5f7]">
                <span>
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : "Active"}
                </span>
                <span className="flex items-center gap-1 text-[#0071e3] font-bold group-hover:translate-x-1 transition-transform">
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
