import os

file_path = r"src\components\research\ResearchTabNav.tsx"
content = """"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileCheck, AlertTriangle, MessageSquare, HelpCircle, Lightbulb, FileText, Sparkles, Bot, Video, GitBranch, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export function ResearchTabNav({ runId }: { runId: string }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; 
    if (Math.abs(walk) > 5) {
      setDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-6 border-b border-slate-200 group flex items-center">
      
      {/* Left scroll button (only visible on hover for desktop) */}
      <button 
        onClick={scrollLeftBtn}
        className="absolute left-0 z-10 p-1 bg-gradient-to-r from-white via-white to-transparent h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-white border border-slate-200 shadow-sm rounded-full p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </button>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto gap-2 pb-3 px-2 w-full cursor-grab active:cursor-grabbing scroll-smooth" 
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          const Icon = t.icon;

          return (
            <Link
              key={t.href}
              href={t.href}
              onClick={(e) => {
                if (dragged) e.preventDefault();
              }}
              draggable={false}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Right scroll button (only visible on hover for desktop) */}
      <button 
        onClick={scrollRightBtn}
        className="absolute right-0 z-10 p-1 bg-gradient-to-l from-white via-white to-transparent h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-white border border-slate-200 shadow-sm rounded-full p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
"""

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated ResearchTabNav.tsx")
