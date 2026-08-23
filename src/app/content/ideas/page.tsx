"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, ArrowRight, ShieldCheck, ArrowLeft, Layers, RefreshCw } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface StandaloneIdea {
  id: string;
  title: string;
  recommendedFormat: string;
  score: number;
  suggestedHook: string;
  reasonForRecommendation: string;
  targetAudience: string;
}

const DEFAULT_IDEAS: StandaloneIdea[] = [
  {
    id: "idea-1",
    title: "Flagship Camera Sensor Showdown: 1-Inch vs Periscope Zoom Dynamic Range",
    recommendedFormat: "YOUTUBE_DEEP_DIVE",
    score: 96,
    suggestedHook: "Why the latest 200MP camera spec sheet might actually be misleading your purchase.",
    reasonForRecommendation: "High audience question search volume around sustained low-light video stabilization.",
    targetAudience: "Tech Enthusiasts & Creators",
  },
  {
    id: "idea-2",
    title: "Sustained Thermal Throttling: 45-Minute 4K Render Benchmark Comparison",
    recommendedFormat: "COMPARISON_BENCHMARK",
    score: 93,
    suggestedHook: "Peak synthetic scores look great on paper, but here is what happens at minute 30.",
    reasonForRecommendation: "Audience gap detected between synthetic burst testing and continuous real-world workloads.",
    targetAudience: "Hardware Enthusiasts & Video Editors",
  },
  {
    id: "idea-3",
    title: "OLED Display PWM Flicker & Eye Fatigue Audit",
    recommendedFormat: "EXPLAINER",
    score: 89,
    suggestedHook: "If your eyes hurt after 15 minutes of nighttime reading, this hidden display spec is why.",
    reasonForRecommendation: "Rising community forum complaints regarding low-frequency dimming and eye comfort.",
    targetAudience: "Everyday Consumers & Tech Power Users",
  },
];

export default function StandaloneContentIdeasPage() {
  const [ideas, setIdeas] = useState<StandaloneIdea[]>(DEFAULT_IDEAS);
  const [loading, setLoading] = useState(false);

  const handleCreateResearch = (idea: StandaloneIdea) => {
    window.location.href = `/research/create?topic=${encodeURIComponent(idea.title)}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 font-sans">
      <Link
        href="/content"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white border border-slate-200/90 shadow-sm px-4 py-2 rounded-full"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Content Board
      </Link>

      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">CONTENT INTELLIGENCE ENGINE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-indigo-600" />
            Ranked Content Ideas & Opportunity Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            High-demand content angles generated automatically from verified evidence gaps and audience questions.
          </p>
        </div>

        <Link
          href="/research/create"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> New Custom Research
        </Link>
      </div>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div key={idea.id} className="bg-white rounded-[24px] shadow-sm border-2 border-slate-100 hover:border-indigo-200 p-6 space-y-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  {idea.recommendedFormat.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">
                  OPPORTUNITY SCORE: <strong className="text-emerald-600 font-extrabold">{idea.score}/100</strong>
                </span>
              </div>

              <button
                onClick={() => handleCreateResearch(idea)}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-full text-xs font-extrabold shadow-md shadow-indigo-600/20 transition transform hover:-translate-y-0.5"
              >
                Launch Research Investigation
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">{idea.title}</h3>
              <p className="text-xs text-indigo-900 bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 font-medium leading-relaxed">
                <span className="font-bold font-mono uppercase text-[10px] text-indigo-700 block mb-1">SUGGESTED ATTENTION HOOK</span>
                "{idea.suggestedHook}"
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Intelligence Rationale:</strong> {idea.reasonForRecommendation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
