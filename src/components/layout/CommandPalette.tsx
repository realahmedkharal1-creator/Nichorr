"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Database, LayoutDashboard, Video, X, History, Globe, FileCheck, ListOrdered, BookOpen } from "lucide-react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { label: "Create New Technology Research Run", href: "/research/create", icon: Plus },
    { label: "Creator Intelligence Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Research History & Audit Trail", href: "/research/history", icon: History },
    { label: "Source Trust & Laboratory Benchmarks", href: "/research/sources", icon: Globe },
    { label: "Research Quality & Contradiction Audit", href: "/research/quality", icon: FileCheck },
    { label: "Prioritized Research Queue", href: "/research/queue", icon: ListOrdered },
    { label: "Content Production & Script Board", href: "/content", icon: Video },
    { label: "Project Workspaces & Research Projects", href: "/projects", icon: Database },
    
    { label: "Global Technical Search", href: "/search", icon: Search },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 backdrop-blur-sm flex items-start justify-center pt-20 p-4 font-sans">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            placeholder="Search technology topics, commands, or tools... (Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center italic">No matching research commands found.</div>
          ) : (
            filtered.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(action.href)}
                className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 hover:border hover:border-indigo-850 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-3">
                  <action.icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-white">{action.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-600">Open →</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

