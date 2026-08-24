"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { ResearchRunSession } from "@/features/research/research-engine";
import { Loader2, CheckCircle2, ShieldCheck, XCircle, ArrowRight, Layers, Activity, AlertCircle, RefreshCw, Sparkles, FileText } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function LiveExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const executionTriggeredRef = useRef(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/research/${params.id}/status`);
        const data = await res.json();
        if (data.success && data.run) {
          setRun(data.run);

          // Self-Healing Auto-Execution: If run was created but execution hasn't started yet, kick it off!
          if (data.run.status === "CREATED" && !executionTriggeredRef.current) {
            executionTriggeredRef.current = true;
            fetch(`/api/research/${params.id}/execute`, { method: "POST" })
              .then((r) => r.json())
              .then((execData) => {
                if (execData.success && execData.run) {
                  setRun(execData.run);
                }
              })
              .catch((err) => console.error("Auto-execution trigger error:", err));
          }
        }
      } catch (e) {
        console.error("Status polling error:", e);
      }
    };

    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
    }, 1500);

    return () => clearInterval(interval);
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Run Not Found</h2>
        <p className="text-slate-600">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <SkeletonCard />
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED";
  const isCancelled = run.status === "CANCELLED";
  const isFailed = run.status === "FAILED";

  // Map backend status to UI stage
  let activeStageId = run.status;
  if (run.status === "CREATED") activeStageId = "PLANNING";
  if (run.status === "PLAN_READY") activeStageId = "DISCOVERING";
  if (run.status === "CORRELATING") activeStageId = "CONFLICT_ANALYSIS";
  
  let currentStageIndex = STAGES.findIndex((s) => s.id === activeStageId);
  if (isCompleted) currentStageIndex = STAGES.length;

  const progressPercent = isCompleted ? 100 : (currentStageIndex === -1 ? 0 : Math.round((currentStageIndex / STAGES.length) * 100));
  const currentStageDetail = STAGES[currentStageIndex];

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      await fetch(`/api/research/${params.id}/execute`, { method: "DELETE" });
      const res = await fetch(`/api/research/${params.id}/status`);
      const data = await res.json();
      if (data.success) setRun(data.run);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      const res = await fetch(`/api/research/${params.id}/execute`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.run) {
        setRun(data.run);
      }
    } catch (e) {
      console.error("Retry error:", e);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5" /> LIVE BACKEND STATE STREAM
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Research Execution Pipeline</h1>
        </div>

        <div className="flex items-center gap-3">
          {!isCompleted && !isCancelled && !isFailed && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-5 py-2.5 rounded-full text-sm font-bold transition-colors border border-rose-200 shadow-sm"
            >
              {cancelling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel Run
                </>
              )}
            </button>
          )}

          {isFailed && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
            >
              {retrying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Retrying Pipeline...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retry Execution
                </>
              )}
            </button>
          )}

          {isCompleted && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push(`/research/${params.id}/creator`)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Creator Studio
              </button>
              <button
                onClick={() => router.push(`/research/${params.id}/brief`)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Brief (.md)
              </button>
              <button
                onClick={() => router.push(`/research/${params.id}/results`)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-xl shadow-emerald-600/20 transform hover:-translate-y-0.5 active:scale-95"
              >
                View Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Target Topic Header Card - Premium Solid Light Bento */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[24px] border-2 border-indigo-200 shadow-sm p-6 sm:p-8 space-y-4 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 relative z-10">
          <span className="uppercase tracking-widest font-bold text-indigo-700">ACTIVE RESEARCH TOPIC</span>
          <span className="px-3 py-1 rounded-full bg-white border-2 border-indigo-100 text-indigo-800 font-extrabold tracking-widest shadow-sm">{run.contentType}</span>
        </div>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight relative z-10">{run.topic}</p>
      </div>

      {/* Progress Bar & Percentage Readout */}
      {!isCancelled && run.status !== "FAILED" && (
        <div className="bg-white rounded-[24px] border-2 border-indigo-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
              <Layers className="w-5 h-5 text-indigo-600" />
              Research Progress
            </span>
            <span className="font-mono font-extrabold text-indigo-600 text-lg">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 transform -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">
            <span>Stage {Math.max(1, currentStageIndex + 1)} of {STAGES.length}</span>
            <span>{isCompleted ? "COMPLETED" : "PROCESSING..."}</span>
          </div>
        </div>
      )}

      
              {/* Warning Notice Banner */}
        {isCompleted && run?.failureReason && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[24px] p-6 sm:p-8 flex items-start gap-4 text-amber-900 shadow-sm mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <span className="font-extrabold text-lg block text-amber-900 tracking-tight">Demo Mode Activated</span>
              <p className="text-sm text-amber-700 font-medium leading-relaxed max-w-2xl">
                {run.failureReason}
              </p>
            </div>
          </div>
        )}

        {/* Failure Notice Banner */}
      {isFailed && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-[24px] p-6 sm:p-8 flex items-start gap-4 text-rose-900 shadow-sm mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="font-extrabold text-lg block text-rose-900 tracking-tight">Research Run Failed</span>
            <p className="text-sm text-rose-700 font-medium leading-relaxed max-w-2xl">
              Execution encountered an error and was halted. <br/>
              <strong>Reason:</strong> {run.failureReason || "Unknown pipeline error"}
            </p>
          </div>
        </div>
      )}

      {/* Cancellation Notice Banner */}
      {isCancelled && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-[24px] p-6 sm:p-8 flex items-start gap-4 text-rose-900 shadow-sm">
          <AlertCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="font-extrabold text-lg block text-rose-900 tracking-tight">Research Run Cancelled</span>
            <p className="text-sm text-rose-700 font-medium leading-relaxed max-w-2xl">
              Execution was safely aborted by the user. Subsequent pipeline stages were halted and background execution was terminated.
            </p>
          </div>
        </div>
      )}

      {/* Active Stage Detail Highlight Card */}
      {currentStageDetail && !isCompleted && !isCancelled && !isFailed && (
        <div className="bg-indigo-50 rounded-[24px] border-2 border-indigo-200 p-6 sm:p-8 space-y-3 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <Loader2 className="w-48 h-48 animate-spin text-indigo-900" />
          </div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest relative z-10">CURRENT ACTIVE STAGE</span>
          <h3 className="text-xl font-extrabold text-indigo-900 flex items-center gap-3 relative z-10 tracking-tight">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            {currentStageDetail.label}
          </h3>
          <p className="text-sm font-medium text-indigo-700/80 leading-relaxed max-w-2xl relative z-10">{currentStageDetail.desc}</p>
        </div>
      )}

      {/* Completion Summary Highlight Card */}
      {isCompleted && (
        <div className="bg-emerald-900 rounded-[24px] border-2 border-emerald-200 p-6 sm:p-8 space-y-6 shadow-xl shadow-emerald-900/10">
          <div className="flex items-center gap-4 text-emerald-600">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Research Completed & Audited</h3>
              <p className="text-sm font-medium text-emerald-200/80">Every technical claim is verified and grounded in primary source evidence.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-emerald-100 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-slate-900 mb-1">{run.sources?.length || 0}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">SOURCES</span>
            </div>
            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-emerald-100 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-slate-900 mb-1">{run.claims?.length || 0}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">CLAIMS</span>
            </div>
            <div className="bg-white rounded-[16px] p-5 shadow-sm border border-emerald-100 flex flex-col justify-center">
              <span className="text-3xl font-extrabold text-amber-500 mb-1">{run.conflicts?.length || 0}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">CONFLICTS</span>
            </div>
          </div>
        </div>
      )}

      {/* Honest Stage Progress Tracker Timeline */}
      <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono border-b border-slate-100 pb-3">
          Pipeline Execution Stage Timeline
        </h2>

        <div className="space-y-3">
          {STAGES.map((stg, idx) => {
            const isDone = currentStageIndex > idx || isCompleted;
            const isCurrent = currentStageIndex === idx && !isCompleted && !isCancelled && !isFailed;

            return (
              <div
                key={stg.id}
                className={`flex items-center justify-between p-5 sm:px-6 rounded-[16px] transition-all duration-300 ${
                  isCurrent ? 'bg-indigo-100/50 border border-indigo-300 text-indigo-950 shadow-md scale-[1.02]' :
                  isDone ? 'bg-emerald-100/40 border border-emerald-300 hover:bg-emerald-100/60 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 text-emerald-950 shadow-sm' :
                  'bg-slate-50 border border-slate-300 border-dashed text-slate-500 opacity-80'
                }`}
              >
                <div className="flex items-center gap-4">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
                  ) : (isCancelled || isFailed) && currentStageIndex === idx ? (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  <span className="text-sm font-extrabold tracking-tight">{stg.label}</span>
                </div>

                <span className={`text-[10px] font-mono font-bold tracking-widest hidden sm:inline-block ${
                  isDone ? 'text-emerald-600' : isCurrent ? 'text-indigo-600' : (isCancelled || isFailed) && currentStageIndex === idx ? 'text-rose-500' : 'text-slate-400'
                }`}>
                  {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING' : isCancelled && currentStageIndex === idx ? 'ABORTED' : (isFailed && currentStageIndex === idx ? 'FAILED' : 'QUEUED')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono font-bold shadow-sm">
        <span className="flex items-center gap-2 text-emerald-700 tracking-widest uppercase">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Real backend state representation (No fake percentages)
        </span>
        <span className={`${(isCancelled || isFailed) ? "text-rose-600" : "text-indigo-600"} tracking-widest uppercase bg-white px-3 py-1 rounded-md shadow-sm border ${(isCancelled || isFailed) ? "border-rose-100" : "border-indigo-100"}`}>
          STATUS: {run.status}
        </span>
      </div>
    </div>
  );
}

