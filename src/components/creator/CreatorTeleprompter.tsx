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
  Sliders,
  Video,
  VideoOff,
  Save,
  Camera
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
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [textWidth, setTextWidth] = useState<"narrow" | "normal" | "wide">("normal");
  const [isMirrored, setIsMirrored] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Webcam & Recording State
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Elapsed timer. Derived from wall-clock deltas rather than a "+1 per tick" counter, so
  // it can't drift or double-count if an interval is ever left running.
  const playStartRef = useRef<number | null>(null);
  const baseElapsedRef = useRef(0);
  useEffect(() => {
    if (!isPlaying) {
      playStartRef.current = null;
      return;
    }
    playStartRef.current = performance.now();
    const id = setInterval(() => {
      if (playStartRef.current != null) {
        const secs = baseElapsedRef.current + (performance.now() - playStartRef.current) / 1000;
        setElapsedSeconds(Math.floor(secs));
      }
    }, 500);
    return () => {
      if (playStartRef.current != null) {
        baseElapsedRef.current += (performance.now() - playStartRef.current) / 1000;
        playStartRef.current = null;
      }
      clearInterval(id);
    };
  }, [isPlaying]);

  // Cleanup Webcam on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Keep the live speed in a ref so changing it doesn't tear down / restart the
  // scroll loop (which previously spawned a second rAF and made speed changes erratic).
  const scrollSpeedRef = useRef(scrollSpeed);
  useEffect(() => {
    scrollSpeedRef.current = scrollSpeed;
  }, [scrollSpeed]);

  // px/sec for scroll speeds 1..5 (index 0 unused). Each step is a clear jump,
  // and 2x is exactly twice 1x so the difference is unmistakable.
  const SPEED_PX_PER_SEC = [0, 60, 120, 200, 320, 480];

  // Smooth auto-scroll — one stable loop, started/stopped only by isPlaying.
  // Position is accumulated in a float (`pos`) and written to scrollTop each frame,
  // so slow speeds don't get lost to integer rounding of scrollTop.
  useEffect(() => {
    if (!isPlaying) return;

    let raf = 0;
    let last = performance.now();
    let pos = scrollContainerRef.current?.scrollTop ?? 0;

    const step = (now: number) => {
      const el = scrollContainerRef.current;
      if (!el) {
        raf = requestAnimationFrame(step);
        return;
      }

      // If something else moved the scroll (manual scroll, section jump), resync.
      if (Math.abs(el.scrollTop - pos) > 4) pos = el.scrollTop;

      const dt = Math.min(now - last, 100); // clamp so a backgrounded tab doesn't jump
      last = now;

      const pxPerSec = SPEED_PX_PER_SEC[scrollSpeedRef.current] || 120;
      pos += (pxPerSec * dt) / 1000;
      el.scrollTop = pos;

      const scrollPos = el.scrollTop + 150;
      el.querySelectorAll<HTMLElement>("[data-section-index]").forEach((sec) => {
        const idx = Number(sec.getAttribute("data-section-index"));
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          setActiveSectionIndex(idx);
        }
      });

      if (el.scrollHeight - el.scrollTop <= el.clientHeight + 2) {
        setIsPlaying(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is interacting with webcam controls
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) return;

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
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
    setActiveSectionIndex(0);
    baseElapsedRef.current = 0;
    playStartRef.current = null;
    setElapsedSeconds(0);
  };

  const jumpToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`[data-section-index="${index}"]`);
    if (el) {
      container.scrollTo({ top: Math.max(0, el.offsetTop - 50), behavior: "smooth" });
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

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
      setMediaStream(null);
      setIsWebcamActive(false);
      if (isRecording) {
        stopRecording();
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        setIsWebcamActive(true);
        // Wait for the video element to render
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 100);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Please allow webcam and microphone permissions to use the recording feature.");
      }
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;
    recordedChunksRef.current = [];
    
    // Ensure we start scroll automatically when recording starts
    if (!isPlaying) setIsPlaying(true);
    
    const options = { mimeType: 'video/webm' };
    try {
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPlaying(false); // Auto-pause script when recording stops
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Explicit px so the SM/MD/LG/XL buttons visibly change the reading text
  // regardless of Tailwind class inheritance.
  const readingFontPx = { sm: 20, md: 30, lg: 42, xl: 58 }[fontSize];

  const textWidthClass = {
    narrow: "max-w-2xl",
    normal: "max-w-4xl",
    wide: "max-w-6xl",
  }[textWidth];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-black text-slate-100 font-sans select-none overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen" : "relative rounded-2xl border border-slate-800 h-[88vh] max-h-[820px]"
      }`}
    >
      {/* Floating Webcam Recorder */}
      {isWebcamActive && (
        <div className="absolute top-20 right-8 w-72 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-40 bg-black flex flex-col">
          <div className="relative bg-slate-900 flex-1 aspect-video flex items-center justify-center">
            {recordedVideoUrl ? (
              <video 
                src={recordedVideoUrl} 
                controls 
                className="w-full h-full object-cover" 
              />
            ) : (
              <>
                {!mediaStream && <Camera className="w-8 h-8 text-slate-700 animate-pulse" />}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={`w-full h-full object-cover ${isMirrored ? '' : 'scale-x-[-1]'}`} 
                />
                {isRecording && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-rose-600/90 text-white px-2 py-0.5 rounded shadow text-[10px] font-bold font-mono animate-pulse tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div> REC
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-2 bg-slate-800 flex items-center justify-between border-t border-slate-700">
            {!recordedVideoUrl ? (
              !isRecording ? (
                <button 
                  onClick={startRecording} 
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" /> Start Record
                </button>
              ) : (
                <button 
                  onClick={stopRecording} 
                  className="flex-1 bg-slate-900 border border-rose-500 hover:bg-slate-950 text-rose-500 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" /> Stop Record
                </button>
              )
            ) : (
              <div className="flex w-full gap-2">
                <button 
                  onClick={() => setRecordedVideoUrl(null)} 
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
                <a 
                  href={recordedVideoUrl} 
                  download={`teleprompter-recording-${Date.now()}.webm`} 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-950/90 border-b border-slate-850 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-citation/15 text-citation border border-citation/40">
            TELEPROMPTER PRO
          </span>
          <h2 className="text-sm font-bold text-slate-200 truncate max-w-xs sm:max-w-md">{topic}</h2>
          <span className="text-xs font-mono text-slate-400">~{targetDurationMinutes}m Target</span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-citation" />
            <span>{formatTimer(elapsedSeconds)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">~{targetDurationMinutes}:00</span>
          </div>

          <button
            onClick={toggleWebcam}
            className={`p-1.5 rounded-lg transition ${
              isWebcamActive 
                ? "bg-rose-950/80 text-rose-400 hover:bg-rose-900" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
            title="Toggle Webcam Recording"
          >
            {isWebcamActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>

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
      <div className="flex items-center gap-1.5 px-6 py-2 bg-slate-950/70 border-b border-slate-850 overflow-x-auto text-[11px] font-mono z-10" style={{ scrollbarWidth: 'none' }}>
        <span className="text-slate-500 uppercase font-semibold mr-1">Section:</span>
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => jumpToSection(idx)}
            className={`px-2.5 py-1 rounded transition shrink-0 font-medium ${
              activeSectionIndex === idx
                ? "bg-citation text-white font-bold shadow-sm"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
            }`}
          >
            {sec.estimatedTimestamp} {sec.title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Reading Eye Guide Line (Horizontal Overlay) */}
      <div className="absolute top-[35%] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-citation/40 to-transparent pointer-events-none z-10" />

      {/* Main Script Scrollable Viewport.
          NOTE: no `scroll-smooth` here — the rAF auto-scroll writes scrollTop every frame,
          and CSS smooth-scrolling turns each of those into a ~300ms animation that never
          settles, so the prompter appears frozen. jumpToSection() opts into smooth
          explicitly via scrollTo({ behavior: "smooth" }). */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-6 sm:px-12 py-24 ${
          isMirrored ? "scale-x-[-1]" : ""
        }`}
        style={{ scrollbarWidth: 'none' }}
      >
        <div className={`mx-auto ${textWidthClass} space-y-16`}>
          {sections.length === 0 && (
            <p
              className="text-slate-400 text-center leading-relaxed"
              style={{ fontSize: readingFontPx }}
            >
              This run has no generated script yet. Open Creator Studio &rarr; Script and generate one,
              then reopen the teleprompter.
            </p>
          )}
          {sections.map((sec, secIdx) => (
            <div
              key={sec.id}
              data-section-index={secIdx}
              className={`transition-opacity duration-300 ${
                activeSectionIndex === secIdx ? "opacity-100" : "opacity-40"
              }`}
            >
              {/* Section Header Marker */}
              <div className="border-b-2 border-citation/50 pb-2 mb-6 flex items-center justify-between">
                <span className="font-mono text-sm uppercase tracking-widest text-citation font-bold">
                  {sec.estimatedTimestamp}  {sec.title}
                </span>
                <span className="font-mono text-xs text-slate-500">Goal: {sec.goal}</span>
              </div>

              {/* Script Talking Points to Read */}
              <div className="space-y-8 font-serif tracking-wide">
                {sec.talkingPoints.length === 0 && (
                  <p
                    className="text-slate-300 font-medium leading-relaxed italic"
                    style={{ fontSize: readingFontPx, lineHeight: 1.5, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {sec.goal || "No script lines were generated for this section."}
                  </p>
                )}
                {sec.talkingPoints.map((tp) => (
                  <div key={tp.id} className="space-y-2">
                    <p
                      className="text-slate-100 font-medium leading-relaxed"
                      style={{ fontSize: readingFontPx, lineHeight: 1.5, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      {tp.statement}
                    </p>

                    {/* Teleprompter Cue Notes (Smaller font for eye reference) */}
                    {tp.contextNote && (
                      <div className="font-sans text-xs font-mono text-amber-400/90 bg-amber-950/30 px-3 py-1 rounded border border-amber-800/40 inline-block">
                        CUE: {tp.contextNote}
                      </div>
                    )}

                    {tp.doNotSayWarning && (
                      <div className="font-sans text-xs font-mono text-rose-400/90 bg-rose-950/30 px-3 py-1 rounded border border-rose-800/40 inline-block">
                        DO NOT SAY: {tp.doNotSayWarning}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* B-Roll Video Cue Indicator */}
              {sec.bRollSuggestions.length > 0 && (
                <div className="mt-6 pt-3 border-t border-slate-800/50 flex flex-wrap gap-2 text-xs font-mono text-cyan-400/80">
                  <span className="font-bold text-cyan-300">B-ROLL CUE:</span>
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
          <div className="text-center py-24 text-slate-600 font-mono text-sm uppercase tracking-widest font-bold">
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
            <span className="font-bold text-citation w-4 text-center">{scrollSpeed}x</span>
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
                  fontSize === size ? "bg-citation text-white" : "text-slate-400 hover:text-slate-200"
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
                  textWidth === w ? "bg-citation text-white" : "text-slate-400 hover:text-slate-200"
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
                ? "bg-citation/15 text-citation border-citation"
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

