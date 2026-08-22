"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileCheck, 
  AlertTriangle, 
  MessageSquare, 
  HelpCircle, 
  Lightbulb, 
  FileText, 
  Sparkles, 
  Bot, 
  Video, 
  GitBranch, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        const isSmoothTrackpad = Math.abs(e.deltaY) < 40;
        if (isSmoothTrackpad) {
          el.scrollLeft += e.deltaY;
        } else {
          el.scrollBy({ left: e.deltaY * 1.5, behavior: "smooth" });
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

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
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 4) {
      setDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="relative mb-6 pb-2 border-b border-[#e5e5ea] group flex items-center">
      {/* Left scroll button */}
      <button
        type="button"
        onClick={scrollLeftBtn}
        aria-label="Scroll sub-tabs left"
        className="absolute -left-2 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pb-1"
      >
        <div className="bg-white border border-[#e5e5ea] shadow-md rounded-full p-1.5 text-[#1d1d1f] hover:text-[#0071e3] hover:border-[#0071e3]/30 hover:bg-[#f5f5f7] cursor-pointer transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </button>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto gap-2 py-1 px-1 w-full scrollbar-hide cursor-grab active:cursor-grabbing select-none"
      >
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? "bg-[#0071e3] text-white shadow-sm shadow-[#0071e3]/20 border border-transparent font-bold"
                  : "bg-white border border-[#e5e5ea] text-[#48484a] hover:text-[#1d1d1f] hover:border-[#d1d1d6] hover:bg-[#fbfbfd] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#8e8e93]"}`} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        type="button"
        onClick={scrollRightBtn}
        aria-label="Scroll sub-tabs right"
        className="absolute -right-2 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pb-1"
      >
        <div className="bg-white border border-[#e5e5ea] shadow-md rounded-full p-1.5 text-[#1d1d1f] hover:text-[#0071e3] hover:border-[#0071e3]/30 hover:bg-[#f5f5f7] cursor-pointer transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
