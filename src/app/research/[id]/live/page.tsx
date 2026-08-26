"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, CheckCircle2, ShieldCheck, XCircle, ArrowRight, Layers, Activity, AlertCircle,
  RefreshCw, Sparkles, FileText, Bot, Search, Download, FileSearch, FileCheck, GitBranch,
  MessageSquare, HelpCircle, Lightbulb, Ban,
} from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const STAGES = [
  { id: "PLANNING", label: "Deconstructing Objective & Queries", desc: "Formulating search vectors and target parameters.", icon: Layers },
  { id: "DISCOVERING", label: "Discovering Independent & Official Sources", desc: "Searching documentation, hardware test databases, and technical blogs.", icon: Search },
  { id: "RETRIEVING", label: "Retrieving Source Documents & Specifications", desc: "Extracting web contents and official specification tables.", icon: Download },
  { id: "EXTRACTING", label: "Extracting Granular Evidence Excerpts", desc: "Isolating factual excerpts, measured benchmarks, and manufacturer quotes.", icon: FileSearch },
  { id: "CLAIMING", label: "Formulating Atomic Technical Claims", desc: "Structuring verifiable technical findings with confidence ratings.", icon: FileCheck },
  { id: "VERIFYING", label: "Verifying Claims & Corroborating Sources", desc: "Cross-referencing multiple lab tests to corroborate hardware claims.", icon: ShieldCheck },
  { id: "CONFLICT_ANALYSIS", label: "Surfacing Disagreements & Methodological Conflicts", desc: "Detecting variant mismatches, ambient room temp test variances, and spec discrepancies.", icon: GitBranch },
  { id: "COMMUNITY_ANALYSIS", label: "Analyzing Community Forum Signals & User Reports", desc: "Parsing user reports for PWM flicker, thermal limits, and real-world complaints.", icon: MessageSquare },
  { id: "AUDIENCE_ANALYSIS", label: "Identifying Unanswered Audience Question Gaps", desc: "Scoring viewer question gaps missed by standard hardware reviews.", icon: HelpCircle },
  { id: "OPPORTUNITY_ANALYSIS", label: "Scoring Evidence-Backed Content Opportunities", desc: "Generating high-demand YouTube title angles backed by verified evidence.", icon: Lightbulb },
  { id: "QUALITY_CHECK", label: "Executing Pre-Brief Quality Gate Audit", desc: "Validating minimum source thresholds and claim traceability matrix.", icon: Activity },
  { id: "GENERATING_BRIEF", label: "Synthesizing Final Structured Research Brief", desc: "Assembling executive summary, key findings, and markdown export document.", icon: FileText },
];

export default function LiveExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  // The pipeline now advances one short stage per /execute call (so each request finishes well
  // inside a free-tier serverless function's time limit). This ref guards against firing a second
  // /execute call while one is still in flight — the polling loop keeps nudging the server, one
  // stage at a time, until the run reaches a terminal status.
  const executionInFlightRef = useRef(false);

  useEffect(() => {
    const TERMINAL_STATUSES = ["COMPLETED", "FAILED", "CANCELLED", "PARTIAL"];

    const triggerNextStage = () => {
      if (executionInFlightRef.current) return;
      executionInFlightRef.current = true;
      fetch(`/api/research/${params.id}/execute`, { method: "POST" })
        .then((r) => r.json())
        .then((execData) => {
          if (execData.success && execData.run) {
            setRun(execData.run);
          }
        })
        .catch((err) => console.error("Stage execution error:", err))
        .finally(() => {
          executionInFlightRef.current = false;
        });
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/research/${params.id}/status`);
        const data = await res.json();
        if (data.success && data.run) {
          setRun(data.run);
          if (!TERMINAL_STATUSES.includes(data.run.status)) {
            triggerNextStage();
          } else {
            // Run has reached a terminal state -- stop polling so this tab doesn't keep hammering
            // /execute and /status indefinitely (each stray call re-triggers real API cost).
            clearInterval(interval);
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Status polling error:", e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);
    return () => clearInterval(interval);
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-conflict-bg text-conflict flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-[22px] font-serif font-semibold text-ink mb-1.5">Run Not Found</h2>
        <p className="text-[13.5px] text-muted">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-[760px] mx-auto py-7 px-5 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED";
  const isCancelled = run.status === "CANCELLED";
  const isFailed = run.status === "FAILED";
  const isTerminal = isCompleted || isCancelled || isFailed;

  let activeStageId = run.status;
  if (run.status === "CREATED") activeStageId = "PLANNING";
  if (run.status === "PLAN_READY") activeStageId = "DISCOVERING";
  if (run.status === "CORRELATING") activeStageId = "CONFLICT_ANALYSIS";

  let currentStageIndex = STAGES.findIndex((s) => s.id === activeStageId);
  if (isCompleted) currentStageIndex = STAGES.length;

  const progressPercent = isCompleted ? 100 : (currentStageIndex === -1 ? 0 : Math.round(((currentStageIndex + 1) / STAGES.length) * 100));
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

  return (
    <div className="max-w-[760px] mx-auto py-7 px-5 pb-20 font-sans">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-citation bg-citation-bg px-3 py-1.5 rounded-full">
          <span className="relative flex w-2 h-2">
            {!isTerminal && <span className="absolute inline-flex h-full w-full rounded-full bg-citation opacity-60 animate-ping"></span>}
            <span className="relative inline-flex rounded-full w-2 h-2 bg-citation"></span>
          </span>
          LIVE BACKEND STATE STREAM
        </span>

        {!isTerminal && (
          <button onClick={handleCancel} disabled={cancelling} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-conflict bg-conflict-bg border-none px-3.5 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50">
            <Ban className="w-3.5 h-3.5" />
            {cancelling ? "Cancelling…" : "Cancel Run"}
          </button>
        )}
      </div>

      <h1 className="font-serif font-semibold text-[24px] sm:text-[28px] mt-1.5 mb-6 text-ink">Research Execution Pipeline</h1>

      {isFailed && (
        <div className="bg-conflict-bg border border-conflict/30 rounded-2xl p-5 mb-5 flex gap-3.5">
          <div className="w-9 h-9 rounded-full bg-conflict text-white flex items-center justify-center shrink-0"><XCircle className="w-4.5 h-4.5" /></div>
          <div>
            <p className="m-0 text-conflict font-semibold text-[14px]">Execution encountered an error and was halted.</p>
            <p className="mt-1.5 mb-0 font-mono text-[11.5px] text-conflict/80 bg-white/50 rounded-lg px-2.5 py-1.5 inline-block">{run.failureReason || "Unknown pipeline error"}</p>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-conflict-bg border border-conflict/30 rounded-2xl p-5 mb-5 flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-conflict text-white flex items-center justify-center shrink-0"><Ban className="w-4.5 h-4.5" /></div>
          <p className="m-0 text-conflict font-semibold text-[14px]">Execution was safely aborted by the user.</p>
        </div>
      )}

      {isCompleted && (
        <div className="bg-verified-bg border border-verified/30 rounded-2xl p-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-verified text-white flex items-center justify-center shrink-0"><CheckCircle2 className="w-4.5 h-4.5" /></div>
          <p className="m-0 text-ink font-medium text-[14px] flex-1">Research Completed & Audited. Every technical claim is verified and grounded.</p>
          <Button variant="primary" onClick={() => router.push(`/research/${params.id}/results`)} className="shrink-0 inline-flex items-center gap-1.5">
            View Results <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-citation-bg via-card to-card border border-line-soft rounded-2xl p-5 sm:p-6 mb-5 shadow-sm">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-citation/[0.07] blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="font-mono text-[10px] text-muted-2 tracking-[0.5px] mb-1.5 uppercase">Active Research Topic</div>
            <div className="font-serif font-semibold text-[19px] sm:text-[21px] text-ink leading-snug">{run.topic}</div>
          </div>
          <span className="text-[11px] font-semibold bg-card px-3 py-1.5 rounded-full text-ink border border-line-soft whitespace-nowrap self-start sm:self-auto">{run.contentType}</span>
        </div>
      </div>

      {!isCancelled && !isFailed && (
        <div className="bg-card border border-line-soft rounded-2xl p-5 sm:p-6 mb-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[13.5px] flex items-center gap-2 text-ink">
              <Activity className="w-4 h-4 text-citation" /> Research Progress
            </span>
            <span className="font-mono font-bold text-citation text-[14px]">{progressPercent}%</span>
          </div>
          <div className="h-2.5 bg-line-soft rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-citation to-verified rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              {!isTerminal && <div className="absolute inset-0 bg-white/25 animate-pulse" />}
            </div>
          </div>
          <div className="flex justify-between mt-2.5 font-mono text-[11px] text-muted-2 uppercase tracking-wide">
            <span>Stage {Math.max(1, currentStageIndex + (isCompleted ? 0 : 1))} of {STAGES.length}</span>
            <span className="inline-flex items-center gap-1.5">
              {!isTerminal && <Loader2 className="w-3 h-3 animate-spin" />}
              {isCompleted ? "Completed" : "Processing…"}
            </span>
          </div>
        </div>
      )}

      {currentStageDetail && !isTerminal && (
        <div className="bg-citation-bg border border-citation/30 rounded-2xl p-4 sm:p-5 mb-6 flex gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-citation text-white flex items-center justify-center shrink-0 relative">
            <Loader2 className="w-4.5 h-4.5 animate-spin absolute" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-citation tracking-[0.5px] mb-1 uppercase">Current Active Stage</div>
            <div className="font-semibold text-[15px] text-ink mb-0.5">{currentStageDetail.label}</div>
            <div className="text-[12.5px] text-muted">{currentStageDetail.desc}</div>
          </div>
        </div>
      )}

      <div className="font-mono text-[10.5px] text-muted-2 tracking-[0.5px] mb-3 uppercase">Pipeline Execution Stage Timeline</div>
      <ul className="list-none m-0 p-0 relative">
        <div className="absolute left-[21px] top-3 bottom-3 w-px bg-line-soft" />
        {STAGES.map((stg, idx) => {
          const isDone = currentStageIndex > idx || isCompleted;
          const isCurrent = currentStageIndex === idx && !isTerminal;
          const StageIcon = stg.icon;
          let stageClass = "bg-card border-line-soft";
          let iconClass = "bg-paper text-muted-2";
          let textClass = "text-muted-2";
          let statusTextClass = "text-muted-2";
          let statusText = "QUEUED";

          if (isDone) {
            stageClass = "bg-verified-bg border-verified/20";
            iconClass = "bg-verified text-white";
            textClass = "text-ink";
            statusTextClass = "text-verified";
            statusText = "COMPLETED";
          } else if (isCurrent) {
            stageClass = "bg-citation-bg border-citation/40 shadow-sm";
            iconClass = "bg-citation text-white";
            textClass = "text-ink";
            statusTextClass = "text-citation";
            statusText = "PROCESSING";
          }

          return (
            <li key={stg.id} className={`relative flex items-center gap-3.5 p-3.5 sm:px-4 rounded-xl mb-2 border transition-colors ${stageClass}`}>
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] shrink-0 z-10 ${iconClass}`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : isCurrent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StageIcon className="w-3 h-3" />}
              </div>
              <div className={`text-[13.5px] font-semibold flex-1 ${textClass}`}>{stg.label}</div>
              <span className={`font-mono text-[10.5px] font-semibold shrink-0 ${statusTextClass}`}>{statusText}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-line-soft rounded-xl p-3.5 sm:px-4 mt-6 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-verified shrink-0" />Real backend state representation — no fabricated percentages</span>
        <span className="font-mono text-[10.5px] font-semibold text-citation bg-citation-bg px-2.5 py-1 rounded-full self-start sm:self-auto">STATUS: {run.status.replace(/_/g, " ")}</span>
      </div>
    </div>
  );
}
