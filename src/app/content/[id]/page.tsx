"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Video, ShieldCheck, CheckCircle2, FileText, ArrowRight, Lock, AlertCircle, Sparkles } from "lucide-react";
import { ContentItemEntity, ContentStage } from "@/lib/database/repositories/content.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ContentWorkspacePage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<ContentItemEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentItem();
  }, [params.id]);

  const fetchContentItem = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setItem(data.contentItem);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: ContentStage) => {
    try {
      const res = await fetch(`/api/content/${params.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetStage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setItem(data.contentItem);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !item) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Workspace Header */}
      <div className="slate-card p-6 sm:p-8 space-y-4 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
            <Video className="w-4 h-4" /> CONTENT ITEM WORKSPACE
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
            STAGE: {item.stage}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{item.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">Format: {item.content_type} • Topic: {item.topic}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-850">
          <Link
            href={`/content/${item.id}/publish`}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Check Publish Readiness
          </Link>

          {item.research_run_id && (
            <Link
              href={`/research/${item.research_run_id}/creator/script`}
              className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-indigo-300 border border-slate-750 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              <FileText className="w-4 h-4 text-indigo-400" /> Evidence-Locked Script
            </Link>
          )}
        </div>
      </div>

      {/* Stage Control Bar */}
      <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Move Production Stage:</span>
        <div className="flex flex-wrap gap-2">
          {(["IDEA", "RESEARCH_READY", "OUTLINE_READY", "SCRIPTING", "FACT_CHECK", "READY_TO_RECORD", "READY_TO_PUBLISH", "PUBLISHED"] as ContentStage[]).map((stg) => (
            <button
              key={stg}
              onClick={() => handleStageChange(stg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                item.stage === stg
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {stg}
            </button>
          ))}
        </div>
      </div>

      {/* Content Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Content Brief & Production Hook
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase block">SUGGESTED HOOK</span>
              <p className="text-sm font-semibold text-slate-100 bg-slate-950 p-4 rounded-xl border border-slate-850 leading-relaxed">
                "{item.hook || `Why the recent benchmark evidence for ${item.topic} changes everything we thought we knew.`}"
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase block">CONTENT OBJECTIVE</span>
              <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-850 leading-relaxed font-sans">
                {item.objective || "Deliver an evidence-grounded technical comparison for creators and technology buyers."}
              </p>
            </div>
          </div>
        </div>

        {/* Intelligence Status Sidebar */}
        <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Evidence Audit Status
          </h2>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-400">Fact-Check Status:</span>
              <span className="font-bold text-indigo-400">{item.fact_check_status || 'PENDING'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
              <span className="text-slate-400">Publish Readiness:</span>
              <span className="font-bold text-emerald-400">{item.publish_readiness_status || 'NOT_READY'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
