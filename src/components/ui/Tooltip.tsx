"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  term: string;
  definition: string;
  importance?: string;
  children?: React.ReactNode;
}

export function TechnicalTooltip({ term, definition, importance, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center group">
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help underline decoration-indigo-500/50 underline-offset-4 font-semibold text-slate-200 hover:text-indigo-300 transition"
      >
        {children || term}
      </span>
      <HelpCircle className="w-3.5 h-3.5 text-indigo-400/70 ml-1 inline shrink-0" />

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-indigo-900/80 rounded-lg shadow-2xl text-xs z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="font-bold text-indigo-300 border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
            <span>{term}</span>
            <span className="text-[10px] font-mono uppercase text-slate-500">TECHNICAL METRIC</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{definition}</p>
          {importance && (
            <p className="mt-1.5 pt-1 border-t border-slate-850 text-[11px] text-amber-400 font-mono">
              ⚡ {importance}
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
}
