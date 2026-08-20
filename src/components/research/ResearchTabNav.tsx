"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck, AlertTriangle, MessageSquare, HelpCircle, Lightbulb, FileText, Sparkles, Bot, Video, GitBranch } from "lucide-react";

export function ResearchTabNav({ runId }: { runId: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/research/${runId}/results`, label: "Overview", icon: LayoutDashboard },
    { href: `/research/${runId}/youtube`, label: "YouTube Intelligence", icon: Video },
    { href: `/research/${runId}/evidence`, label: "Evidence Explorer", icon: FileCheck },
    { href: `/research/${runId}/provenance`, label: "Provenance & Lineage", icon: GitBranch },
    { href: `/research/${runId}/conflicts`, label: "Conflict Matrix", icon: AlertTriangle },
    { href: `/research/${runId}/creator`, label: "Creator Studio", icon: Sparkles },
    { href: `/research/${runId}/ask`, label: "Ask AI", icon: Bot },
    { href: `/research/${runId}/community`, label: "Community Signals", icon: MessageSquare },
    { href: `/research/${runId}/audience`, label: "Audience Questions", icon: HelpCircle },
    { href: `/research/${runId}/opportunities`, label: "Opportunities", icon: Lightbulb },
    { href: `/research/${runId}/brief`, label: "Final Brief", icon: FileText },
  ];

  return (
    <div className="border-b border-slate-800/80 flex overflow-x-auto gap-1.5 pb-2 mb-6 no-scrollbar">
      {tabs.map((t) => {
        const isActive = pathname === t.href;
        const Icon = t.icon;

        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isActive
                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 shadow-sm shadow-indigo-950/50"
                : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

