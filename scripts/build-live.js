const fs = require('fs');

const liveCode = `"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck, XCircle, ArrowRight, Layers, Activity, AlertCircle, RefreshCw, Sparkles, FileText, Bot } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

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
        const res = await fetch(\`/api/research/\${params.id}/status\`);
        const data = await res.json();
        if (data.success && data.run) {
          setRun(data.run);
          if (data.run.status === "CREATED" && !executionTriggeredRef.current) {
            executionTriggeredRef.current = true;
            fetch(\`/api/research/\${params.id}/execute\`, { method: "POST" })
              .then((r) => r.json())
              .then((execData) => {
                if (execData.success && execData.run) {
                  setRun(execData.run);
                }
              })
              .catch((err) => console.error("Auto-execution trigger error:", err));
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
      <div className="max-w-3xl mx-auto py-12 px-5 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-[24px] font-[Fraunces] font-semibold text-ink mb-2">Run Not Found</h2>
        <p className="text-[13.5px] text-muted font-medium">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-[760px] mx-auto py-7 px-5">
        <SkeletonCard />
      </div>
    );
  }

  const isCompleted = run.status === "COMPLETED";
  const isCancelled = run.status === "CANCELLED";
  const isFailed = run.status === "FAILED";

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
      await fetch(\`/api/research/\${params.id}/execute\`, { method: "DELETE" });
      const res = await fetch(\`/api/research/\${params.id}/status\`);
      const data = await res.json();
      if (data.success) setRun(data.run);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-[760px] mx-auto py-[28px] px-5 pb-[80px]">
      <div className="flex flex-wrap items-center justify-between mb-1.5 gap-2.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-citation">
          <span className="w-1.5 h-1.5 rounded-full bg-citation animate-pulse"></span>
          LIVE BACKEND STATE STREAM
        </span>
        
        {(!isCompleted && !isCancelled && !isFailed) && (
          <button onClick={handleCancel} disabled={cancelling} className="text-[12.5px] font-semibold text-conflict bg-conflict-bg border-none px-3.5 py-2 rounded-lg cursor-pointer">
            {cancelling ? "Cancelling..." : "⊗ Cancel Run"}
          </button>
        )}
      </div>

      <h1 className="font-[Fraunces] font-semibold text-[20px] sm:text-[24px] mt-1.5 mb-[22px] text-ink">Research Execution Pipeline</h1>

      {isFailed && (
        <div className="bg-conflict-bg border border-conflict rounded-2xl p-5 mb-[18px] text-conflict text-sm font-medium">
          <AlertCircle className="w-5 h-5 mb-2" />
          <p>Execution encountered an error and was halted.</p>
          <p className="mt-1 font-mono text-xs opacity-80">{run.failureReason || "Unknown pipeline error"}</p>
        </div>
      )}
      
      {isCancelled && (
        <div className="bg-conflict-bg border border-conflict rounded-2xl p-5 mb-[18px] text-conflict text-sm font-medium">
          <p>Execution was safely aborted by the user.</p>
        </div>
      )}

      {isCompleted && (
        <div className="bg-verified-bg border border-verified rounded-2xl p-5 mb-[18px] text-verified text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <p>Research Completed & Audited. Every technical claim is verified and grounded.</p>
          <Button variant="primary" onClick={() => router.push(\`/research/\${params.id}/results\`)} className="ml-auto shrink-0">
            View Results →
          </Button>
        </div>
      )}

      <div className="bg-gradient-to-br from-citation-bg to-card border border-line-soft rounded-2xl p-[18px] sm:px-[22px] mb-[18px] flex justify-between items-center gap-3.5 flex-col sm:flex-row sm:items-center items-start">
        <div>
          <div className="font-mono text-[10px] text-muted-2 tracking-[0.5px] mb-1.5 uppercase">ACTIVE RESEARCH TOPIC</div>
          <div className="font-[Fraunces] font-semibold text-[19px] text-ink">{run.topic}</div>
        </div>
        <span className="text-[11px] font-semibold bg-card px-3 py-1 rounded-full text-muted border border-line whitespace-nowrap">{run.contentType}</span>
      </div>

      {!isCancelled && !isFailed && (
        <div className="bg-card border border-line-soft rounded-2xl p-[18px] sm:px-[22px] mb-[18px]">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-[13.5px] flex items-center gap-2 text-ink">◈ Research Progress</span>
            <span className="font-mono font-bold text-citation text-[13.5px]">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-line-soft rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-citation to-[#4A7CB5] rounded-full transition-all duration-700 ease-out" style={{ width: \`\${progressPercent}%\` }}></div>
          </div>
          <div className="flex justify-between mt-2 font-mono text-[11px] text-muted-2 uppercase">
            <span>STAGE {Math.max(1, currentStageIndex + (isCompleted ? 0 : 1))} OF {STAGES.length}</span>
            <span>{isCompleted ? "COMPLETED" : "PROCESSING…"}</span>
          </div>
        </div>
      )}

      {currentStageDetail && !isCompleted && !isCancelled && !isFailed && (
        <div className="bg-citation-bg border border-citation rounded-[14px] p-4 sm:px-[18px] mb-[22px]">
          <div className="font-mono text-[10px] text-citation tracking-[0.5px] mb-1.5 uppercase">CURRENT ACTIVE STAGE</div>
          <div className="font-bold text-[15px] flex items-center gap-2 mb-1 text-ink">
            <div className="inline-block w-[13px] h-[13px] border-2 border-citation border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]"></div>
            {currentStageDetail.label}
          </div>
          <div className="text-[12.5px] text-muted">{currentStageDetail.desc}</div>
        </div>
      )}

      <div className="font-mono text-[10.5px] text-muted-2 tracking-[0.5px] mb-2.5 uppercase">PIPELINE EXECUTION STAGE TIMELINE</div>
      <ul className="list-none m-0 p-0">
        {STAGES.map((stg, idx) => {
          const isDone = currentStageIndex > idx || isCompleted;
          const isCurrent = currentStageIndex === idx && !isCompleted && !isCancelled && !isFailed;
          let stageClass = "bg-card border-line-soft";
          let iconClass = "bg-line-soft text-muted-2";
          let textClass = "text-muted-2";
          let statusTextClass = "text-muted-2";
          let statusText = "QUEUED";

          if (isDone) {
            stageClass = "bg-verified-bg border-transparent";
            iconClass = "bg-verified text-white";
            textClass = "text-ink";
            statusTextClass = "text-verified";
            statusText = "COMPLETED";
          } else if (isCurrent) {
            stageClass = "bg-citation-bg border-citation";
            iconClass = "bg-citation text-white";
            textClass = "text-ink";
            statusTextClass = "text-citation";
            statusText = "PROCESSING";
          }

          return (
            <li key={stg.id} className={\`flex items-center gap-3.5 p-[13px] sm:px-4 rounded-xl mb-2 border \${stageClass}\`}>
              <div className={\`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] shrink-0 \${iconClass}\`}>
                {isDone ? "✓" : isCurrent ? <div className="w-2.5 h-2.5 border-[1.5px] border-white border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]"></div> : (idx + 1)}
              </div>
              <div className={\`text-[13.5px] font-semibold flex-1 \${textClass}\`}>{stg.label}</div>
              <span className={\`font-mono text-[10.5px] font-semibold \${statusTextClass}\`}>{statusText}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-line-soft rounded-xl p-3 sm:px-4 mt-5 text-[12px] text-muted">
        <span>✓ Real backend state representation — no fabricated percentages</span>
        <span className="font-mono text-[10.5px] font-semibold text-citation bg-citation-bg px-2.5 py-1 rounded-full self-start sm:self-auto">STATUS: {run.status.replace(/_/g, " ")}</span>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/research/[id]/live/page.tsx', liveCode);
console.log('Done writing live page.');
