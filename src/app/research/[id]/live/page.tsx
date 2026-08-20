"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Activity, XCircle, FileCheck, Layers } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";

const STAGES = [
  { id: "PLANNING", label: "Deconstructing Objective & Queries", desc: "Formulating search vectors and target parameters." },
  { id: "DISCOVERING", label: "Discovering Independent & Official Sources", desc: "Searching documentation, hardware test databases, and technical blogs." },
  { id: "RETRIEVING", label: "Retrieving Source Documents & Specifications", desc: "Extracting web contents and official specification tables." },
  { id: "EXTRACTING", label: "Extracting Granular Evidence Excerpts", desc: "Isolating factual excerpts, measured benchmarks, and manufacturer quotes." },
  { id: "CLAIMING", label: "Formulating Atomic Technical Claims", desc: "Structuring verifiable technical findings with confidence ratings." },
  { id: "VERIFYING", label: "Verifying Claims & Corroborating Sources", desc: "Cross-referencing multiple lab tests to corroborate hardware claims." },
  { id: "CONFLICT_ANALYSIS", label: "Surfacing Disagreements & Methodological Conflicts", desc: "Detecting variant mismatches, ambient room temp test variances, and spec discrepancies." },
  { id: "COMMUNITY_ANALYSIS", label: "Analyzing Community Forum Signals & User Reports", desc: "Parsing user reports for PWM flicker, thermal limits, and real-world complaints." },
  { id: "AUDIENCE_ANALYSIS", label: "Identifying Unanswered Audience Question Gaps", desc: "Scoring viewer question gaps missed by standard hardware reviews." },
  { id: "OPPORTUNITY_ANALYSIS", label: "Scoring Evidence-Backed Content Opportunities", desc: "Generating high-demand YouTube title angles backed by verified evidence." },
  { id: "QUALITY_CHECK", label: "Executing Pre-Brief Quality Gate Audit", desc: "Validating minimum source thresholds and claim traceability matrix." },
  { id: "GENERATING_BRIEF", label: "Synthesizing Final Structured Research Brief", desc: "Assembling executive summary, key findings, and markdown export document." },
];

const STAGE_PROGRESS_MAP: Record<string, number> = {
  CREATED: 2,
  PLANNING: 5,
  PLAN_READY: 10,
  DISCOVERING: 15,
  RETRIEVING: 30,
  EXTRACTING: 45,
  CLAIMING: 55,
  VERIFYING: 65,
  CORRELATING: 70,
  CONFLICT_ANALYSIS: 75,
  COMMUNITY_ANALYSIS: 80,
  AUDIENCE_ANALYSIS: 85,
  OPPORTUNITY_ANALYSIS: 90,
  QUALITY_CHECK: 95,
  GENERATING_BRIEF: 98,
  COMPLETED: 100,
  PARTIAL: 100,
  FAILED: 0,
  CANCELLED: 0,
};

export default function LiveResearchTrackerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/research/${params.id}/status`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRun(data.run);
            if (data.run.status === "COMPLETED" || data.run.status === "PARTIAL" || data.run.status === "FAILED" || data.run.status === "CANCELLED") {
              clearInterval(interval);
            }
          }
        });
    }, 800);

    return () => clearInterval(interval);
  }, [params.id]);

  const handleCancelRun = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/research/${params.id}/cancel`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.run) {
        setRun(data.run);
      }
    } catch (err) {
      console.error("Cancellation request error:", err);
    } finally {
      setCancelling(false);
    }
  };

  if (!run) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
        <p className="text-sm font-mono text-slate-400">Connecting to real-time research state stream...</p>
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED" || run.status === "PARTIAL";
  const isCancelled = run.status === "CANCELLED";
  const currentStageIndex = STAGES.findIndex((s) => s.id === run.status);
  const progressPercent = STAGE_PROGRESS_MAP[run.status] ?? 0;
  const currentStageDetail = STAGES.find((s) => s.id === run.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Header Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 flex items-center gap-1.5 font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            LIVE BACKEND STATE STREAM
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Research Execution Pipeline</h1>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && !isCancelled && run.status !== "FAILED" && (
            <button
              onClick={handleCancelRun}
              disabled={cancelling}
              className="flex items-center gap-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 px-4 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-sm"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  Cancel Run
                </>
              )}
            </button>
          )}

          {isCompleted && (
            <button
              onClick={() => router.push(`/research/${params.id}/results`)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-emerald-600/20 transform hover:-translate-y-0.5"
            >
              View Research Results
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Target Topic Header Card */}
      <div className="slate-card p-5 space-y-1.5 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase tracking-wider">ACTIVE RESEARCH TOPIC</span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">{run.contentType}</span>
        </div>
        <p className="text-lg font-bold text-slate-100">{run.topic}</p>
      </div>

      {/* Progress Bar & Percentage Readout */}
      {!isCancelled && run.status !== "FAILED" && (
        <div className="slate-card p-6 space-y-3 border-indigo-950 bg-slate-900/80">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Research Progress
            </span>
            <span className="font-mono font-bold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Stage {Math.max(1, currentStageIndex + 1)} of {STAGES.length}</span>
            <span>{isCompleted ? "COMPLETED" : "PROCESSING..."}</span>
          </div>
        </div>
      )}

      {/* Cancellation Notice Banner */}
      {isCancelled && (
        <div className="slate-card p-5 bg-red-950/40 border-red-900/60 flex items-center gap-3.5 text-red-200">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-base block text-red-300">Research Run Cancelled</span>
            <p className="text-xs text-red-200/90 leading-relaxed">
              Execution was safely aborted by the user. Subsequent pipeline stages were halted and background execution was terminated.
            </p>
          </div>
        </div>
      )}

      {/* Active Stage Detail Highlight Card */}
      {currentStageDetail && !isCompleted && !isCancelled && (
        <div className="slate-card p-5 bg-indigo-950/30 border-indigo-900/60 space-y-1.5">
          <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">CURRENT ACTIVE STAGE</span>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            {currentStageDetail.label}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">{currentStageDetail.desc}</p>
        </div>
      )}

      {/* Completion Summary Highlight Card */}
      {isCompleted && (
        <div className="slate-card p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-900/60 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-100">Research Completed & Audited</h3>
              <p className="text-xs text-slate-300">Every technical claim is verified and grounded in primary source evidence.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
            <div className="slate-card p-3 bg-slate-950/60">
              <span className="text-xs text-slate-400 block">SOURCES</span>
              <span className="text-lg font-bold text-slate-100">{run.sources?.length || 0}</span>
            </div>
            <div className="slate-card p-3 bg-slate-950/60">
              <span className="text-xs text-slate-400 block">CLAIMS</span>
              <span className="text-lg font-bold text-slate-100">{run.claims?.length || 0}</span>
            </div>
            <div className="slate-card p-3 bg-slate-950/60">
              <span className="text-xs text-slate-400 block">CONFLICTS</span>
              <span className="text-lg font-bold text-amber-400">{run.conflicts?.length || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Honest Stage Progress Tracker Timeline */}
      <div className="slate-card p-6 space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-b border-slate-850 pb-2">
          Pipeline Execution Stage Timeline
        </h2>

        <div className="space-y-2.5">
          {STAGES.map((stg, idx) => {
            const isDone = currentStageIndex > idx || isCompleted;
            const isCurrent = currentStageIndex === idx && !isCompleted && !isCancelled;

            return (
              <div
                key={stg.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent ? 'border-indigo-500/80 bg-indigo-950/40 text-indigo-200 shadow-md shadow-indigo-950/50' :
                  isDone ? 'border-slate-850 bg-slate-950/60 text-slate-300' :
                  'border-slate-900/60 bg-slate-950/30 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  ) : isCancelled && currentStageIndex === idx ? (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
                  )}
                  <span className="text-xs font-semibold">{stg.label}</span>
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING' : isCancelled && currentStageIndex === idx ? 'ABORTED' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="slate-card p-4 bg-slate-900/80 border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Real backend state representation (No fake percentages)
        </span>
        <span className={isCancelled ? "text-red-400 font-bold" : "text-indigo-400 font-bold"}>STATUS: {run.status}</span>
      </div>
    </div>
  );
}


