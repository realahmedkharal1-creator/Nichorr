"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Minimize, 
  FastForward, 
  Rewind, 
  Type, 
  FlipHorizontal, 
  Clock, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders 
} from "lucide-react";
import { ScriptSection, TalkingPoint } from "@/lib/creator/creator-studio.types";

interface CreatorTeleprompterProps {
  topic: string;
  targetDurationMinutes: number;
  sections: ScriptSection[];
  onClose?: () => void;
}

export function CreatorTeleprompter({
  topic,
  targetDurationMinutes,
  sections,
  onClose,
}: CreatorTeleprompterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 (slow) to 5 (fast)
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [textWidth, setTextWidth] = useState<"narrow" | "normal" | "wide">("normal");
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Timer effect when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Smooth Auto-scroll animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const scrollStep = (currentTime: number) => {
      if (!isPlaying || !scrollContainerRef.current) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // scroll pixels per second based on speed (1x = 25px/s, 2x = 45px/s, 3x = 70px/s, 4x = 100px/s, 5x = 140px/s)
      const speedMultiplier = [0, 25, 45, 70, 100, 140][scrollSpeed] || 45;
      const scrollDelta = (speedMultiplier * deltaTime) / 1000;

      scrollContainerRef.current.scrollTop += scrollDelta;

      // Track active section based on scroll position
      const scrollPos = scrollContainerRef.current.scrollTop + 150;
      const sectionElements = scrollContainerRef.current.querySelectorAll<HTMLElement>("[data-section-index]");
      sectionElements.forEach((el) => {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const idx = Number(el.getAttribute("data-section-index"));
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSectionIndex(idx);
        }
      });

      // Check if reached bottom
      const isAtBottom =
        scrollContainerRef.current.scrollHeight - scrollContainerRef.current.scrollTop <=
        scrollContainerRef.current.clientHeight + 5;

      if (isAtBottom) {
        setIsPlaying(false);
      } else {
        animationFrameRef.current = requestAnimationFrame(scrollStep);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(scrollStep);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  // Keyboard Shortcuts: Space (Play/Pause), R (Restart), ArrowUp (Faster), ArrowDown (Slower), Esc (Exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "KeyR") {
        e.preventDefault();
        restartTeleprompter();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setScrollSpeed((prev) => Math.min(prev + 1, 5));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setScrollSpeed((prev) => Math.max(prev - 1, 1));
      } else if (e.code === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onClose]);

  const restartTeleprompter = () => {
    setIsPlaying(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setActiveSectionIndex(0);
    setElapsedSeconds(0);
  };

  const jumpToSection = (index: number) => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current.querySelector<HTMLElement>(`[data-section-index="${index}"]`);
    if (el) {
      scrollContainerRef.current.scrollTop = el.offsetTop - 50;
      setActiveSectionIndex(index);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fontSizeClass = {
    sm: "text-lg leading-relaxed",
    md: "text-2xl leading-relaxed",
    lg: "text-3xl sm:text-4xl leading-relaxed",
    xl: "text-4xl sm:text-5xl leading-loose",
  }[fontSize];

  const textWidthClass = {
    narrow: "max-w-2xl",
    normal: "max-w-4xl",
    wide: "max-w-6xl",
  }[textWidth];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-black text-slate-100 font-sans select-none overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "relative rounded-2xl border border-slate-800 h-[750px]"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-950/90 border-b border-slate-850 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
            TELEPROMPTER PRO
          </span>
          <h2 className="text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">{topic}</h2>
          <span className="text-xs font-mono text-slate-400">~{targetDurationMinutes}m Target</span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">~{targetDurationMinutes}:00</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition"
              title="Close Teleprompter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Section Quick Jump Bar */}
      <div className="flex items-center gap-1.5 px-6 py-2 bg-slate-950/70 border-b border-slate-850 overflow-x-auto text-[11px] font-mono z-10">
        <span className="text-slate-500 uppercase font-semibold mr-1">Section:</span>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => jumpToSection(idx)}
            className={`px-2.5 py-1 rounded transition shrink-0 font-medium ${
              activeSectionIndex === idx
                ? "bg-indigo-600 text-white font-bold shadow-sm"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
            }`}
          >
            {sec.estimatedTimestamp} {sec.title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Reading Eye Guide Line (Horizontal Overlay) */}
      <div className="absolute top-[35%] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none z-10" />

      {/* Main Script Scrollable Viewport */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-6 sm:px-12 py-24 scroll-smooth ${
          isMirrored ? "scale-x-[-1]" : ""
        }`}
      >
        <div className={`mx-auto ${textWidthClass} space-y-16`}>
          {sections.map((sec, secIdx) => (
            <div
              key={sec.id}
              data-section-index={secIdx}
              className={`transition-opacity duration-300 ${
                activeSectionIndex === secIdx ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Section Header Marker */}
              <div className="border-b-2 border-indigo-500/50 pb-2 mb-6 flex items-center justify-between">
                <span className="font-mono text-sm uppercase tracking-widest text-indigo-400 font-bold">
                  {sec.estimatedTimestamp} • {sec.title}
                </span>
                <span className="font-mono text-xs text-slate-500">Goal: {sec.goal}</span>
              </div>

              {/* Script Talking Points to Read */}
              <div className={`space-y-8 ${fontSizeClass} font-serif tracking-wide`}>
                {sec.talkingPoints.map((tp) => (
                  <div key={tp.id} className="space-y-2">
                    <p className="text-slate-100 font-medium leading-relaxed">
                      {tp.statement}
                    </p>

                    {/* Teleprompter Cue Notes (Smaller font for eye reference) */}
                    {tp.contextNote && (
                      <div className="font-sans text-xs font-mono text-amber-400/90 bg-amber-950/30 px-3 py-1 rounded border border-amber-800/40 inline-block">
                        💡 CUE: {tp.contextNote}
                      </div>
                    )}

                    {tp.doNotSayWarning && (
                      <div className="font-sans text-xs font-mono text-rose-400/90 bg-rose-950/30 px-3 py-1 rounded border border-rose-800/40 inline-block">
                        ⚠️ DO NOT SAY: {tp.doNotSayWarning}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* B-Roll Video Cue Indicator */}
              {sec.bRollSuggestions.length > 0 && (
                <div className="mt-6 pt-3 border-t border-slate-800/50 flex flex-wrap gap-2 text-xs font-mono text-cyan-400/80">
                  <span className="font-bold text-cyan-300">🎥 B-ROLL CUE:</span>
                  {sec.bRollSuggestions.map((b) => (
                    <span key={b.id} className="bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                      {b.visualTitle} ({b.durationSeconds}s)
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* End of Script Indicator */}
          <div className="text-center py-24 text-slate-600 font-mono text-sm">
            — END OF SCRIPT —
          </div>
        </div>
      </div>

      {/* Floating Bottom Controls Console */}
      <div className="px-6 py-4 bg-slate-950/95 border-t border-slate-850 backdrop-blur flex flex-wrap items-center justify-between gap-4 z-20">
        {/* Play/Pause & Speed */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold font-mono text-sm transition shadow-lg ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-slate-950 shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? "PAUSE" : "START SCROLL"}</span>
          </button>

          <button
            onClick={restartTeleprompter}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-mono border border-slate-800 transition"
            title="Restart to top (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-slate-500 mr-1">Speed:</span>
            <button
              onClick={() => setScrollSpeed((prev) => Math.max(prev - 1, 1))}
              className="p-1 hover:text-white transition"
              title="Slower (ArrowDown)"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-indigo-400 w-4 text-center">{scrollSpeed}x</span>
            <button
              onClick={() => setScrollSpeed((prev) => Math.min(prev + 1, 5))}
              className="p-1 hover:text-white transition"
              title="Faster (ArrowUp)"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Presentation Controls: Font Size, Width, Mirror */}
        <div className="flex items-center gap-2">
          {/* Font Size */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(["sm", "md", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 rounded uppercase transition font-bold ${
                  fontSize === size ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Width */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(["narrow", "normal", "wide"] as const).map((w) => (
              <button
                key={w}
                onClick={() => setTextWidth(w)}
                className={`px-2 py-1 rounded uppercase transition font-bold ${
                  textWidth === w ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {w[0]}
              </button>
            ))}
          </div>

          {/* Mirror Toggle */}
          <button
            onClick={() => setIsMirrored((prev) => !prev)}
            className={`p-2 rounded-lg border transition ${
              isMirrored
                ? "bg-indigo-950 text-indigo-400 border-indigo-700"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Mirror Text (for teleprompter glass)"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
