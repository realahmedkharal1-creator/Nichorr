"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Plus, History, LayoutDashboard, Database, Video, ListOrdered, Globe, FileCheck, BookOpen } from "lucide-react";
import { CommandPalette } from "./CommandPalette";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: Database },
    { href: "/research/history", label: "Research", icon: History },
    { href: "/research/sources", label: "Sources", icon: Globe },
    { href: "/content", label: "Content", icon: Video },
    { href: "/research/quality", label: "Quality", icon: FileCheck },
    { href: "/research/queue", label: "Queue", icon: ListOrdered },
    { href: "/developers/docs", label: "Docs", icon: BookOpen },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-100 tracking-tight">VeritasTech</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 font-mono font-semibold">EVIDENCE-FIRST</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-indigo-300 border border-indigo-900/60 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/research/create"
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/20 transform hover:-translate-y-0.5 ml-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Research</span>
            <span className="sm:hidden">New</span>
          </Link>
        </nav>
      </div>
      <CommandPalette />
    </header>
  );
}


