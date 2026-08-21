"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Video, ShieldCheck, CheckCircle2, FileText, ArrowRight, Lock, AlertCircle, Sparkles, Image as ImageIcon, Clock, Eye } from "lucide-react";
import { ContentItemEntity, ContentStage } from "@/lib/database/repositories/content.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";

const MOCK_DATA = [
  {
    id: "mock-1",
    project_id: "default-project",
    title: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max - Ultimate Comparison",
    stage: "PUBLISHED",
    content_type: "YOUTUBE_VIDEO",
    topic: "Smartphone Comparison",
    priority: "HIGH",
    fact_check_status: "PASSED",
    publish_readiness_status: "READY",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    research_run_id: "res-1",
    thumbnail: "placeholder",
    duration: "18:45",
    views: "1.2M",
    hook: "The benchmarks are in, and what we found completely flips the script on which flagship phone you should buy this year.",
    objective: "Compare camera, battery, and gaming performance using empirical data."
  },
  {
    id: "mock-2",
    project_id: "default-project",
    title: "RTX 5080 4K Gaming Benchmark Results",
    stage: "FACT_CHECK",
    content_type: "YOUTUBE_VIDEO",
    topic: "GPU Benchmarks",
    priority: "HIGH",
    fact_check_status: "PENDING",
    publish_readiness_status: "NOT_READY",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    research_run_id: "res-2",
    thumbnail: "placeholder",
    duration: "12:30",
    views: "N/A",
  },
  {
    id: "mock-3",
    project_id: "default-project",
    title: "MacBook Pro M5 Max - Is It Worth $4000?",
    stage: "IDEA",
    content_type: "YOUTUBE_VIDEO",
    topic: "Laptop Review",
    priority: "MEDIUM",
    fact_check_status: "PENDING",
    publish_readiness_status: "NOT_READY",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    research_run_id: "res-3",
    thumbnail: "placeholder",
    duration: "TBD",
    views: "N/A",
  },
  {
    id: "mock-4",
    project_id: "default-project",
    title: "Apple Vision Pro 2 Hands-On Experience",
    stage: "READY_TO_PUBLISH",
    content_type: "YOUTUBE_VIDEO",
    topic: "VR/AR Headset",
    priority: "MEDIUM",
    fact_check_status: "PASSED",
    publish_readiness_status: "READY",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
    research_run_id: "res-4",
    thumbnail: "placeholder",
    duration: "22:15",
    views: "N/A",
  }
];

export default function ContentWorkspacePage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentItem();
  }, [params.id]);

  const fetchContentItem = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      const data = await res.json();
      if (data.success && data.contentItem) {
        setItem(data.contentItem);
      } else {
        // Fallback
        const found = MOCK_DATA.find(m => m.id === params.id) || MOCK_DATA[0];
        setItem(found);
      }
    } catch (e) {
      console.error(e);
      const found = MOCK_DATA.find(m => m.id === params.id) || MOCK_DATA[0];
      setItem(found);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: string) => {
    try {
      // Optimistic update
      setItem((prev: any) => ({ ...prev, stage: newStage }));
      
      const res = await fetch(`/api/content/${params.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetStage: newStage }),
      });
      const data = await res.json();
      if (data.success && data.contentItem) {
        setItem(data.contentItem);
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
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-4 sm:px-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
            <Video className="w-4 h-4" /> CONTENT ITEM WORKSPACE
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 shadow-sm">
            STAGE: <span className="text-indigo-600">{item.stage}</span>
          </span>
        </div>

        <div className="space-y-2 pt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-mono">
             <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">Format: {item.content_type}</span>
             <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200">Topic: {item.topic}</span>
             {item.duration && (
               <span className="bg-slate-50 px-2 py-1 rounded border border-slate-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}</span>
             )}
             {item.views && item.views !== "N/A" && (
               <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.views}</span>
             )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 mt-4">
          <Link
            href={`/content/${item.id}/publish`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Check Publish Readiness
          </Link>

          {item.research_run_id && (
            <Link
              href={`/research/${item.research_run_id}/creator/script`}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <FileText className="w-4 h-4 text-indigo-600" /> Evidence-Locked Script
            </Link>
          )}
        </div>
      </div>

      {/* Stage Control Bar */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <span className="text-xs font-mono text-slate-700 font-bold uppercase whitespace-nowrap">Move Production Stage:</span>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {(["IDEA", "RESEARCH_READY", "OUTLINE_READY", "SCRIPTING", "FACT_CHECK", "READY_TO_RECORD", "READY_TO_PUBLISH", "PUBLISHED"]).map((stg) => (
            <button
              key={stg}
              onClick={() => handleStageChange(stg)}
              className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-mono font-bold transition flex-1 lg:flex-none text-center ${
                item.stage === stg
                  ? "bg-indigo-600 text-white shadow-sm border-indigo-700"
                  : "bg-slate-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              {stg.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Details Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Content Brief & Production Hook
            </h2>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase block">SUGGESTED HOOK</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed italic">
                    "{item.hook || `Why the recent benchmark evidence for ${item.topic} changes everything we thought we knew.`}"
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase block">CONTENT OBJECTIVE</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {item.objective || "Deliver an evidence-grounded technical comparison for creators and technology buyers."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {item.thumbnail && (
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" /> Thumbnail Draft
              </h2>
              <div className="w-full max-w-md aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 group hover:bg-slate-50 hover:border-indigo-300 transition cursor-pointer">
                <ImageIcon className="w-8 h-8 mb-2 group-hover:text-indigo-500 transition" />
                <span className="text-sm font-medium">Click to upload thumbnail</span>
                <span className="text-xs text-slate-400 mt-1">1280 x 720 recommended</span>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Status Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Evidence Audit Status
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-2">
                <span className="text-slate-600 font-semibold">Fact-Check Status:</span>
                <span className={`font-bold px-2 py-1 rounded-lg border ${
                  item.fact_check_status === 'PASSED' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {item.fact_check_status || 'PENDING'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 gap-2">
                <span className="text-slate-600 font-semibold">Publish Readiness:</span>
                <span className={`font-bold px-2 py-1 rounded-lg border ${
                  item.publish_readiness_status === 'READY' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {item.publish_readiness_status || 'NOT_READY'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
               <button onClick={() => alert("Export initiated!")} className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Run Automated Audit
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

