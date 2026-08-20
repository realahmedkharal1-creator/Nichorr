"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, ArrowRight, ShieldCheck, Flame, Layers } from "lucide-react";
import { ContentIdea } from "@/lib/intelligence/content-intelligence";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ContentIdeasPage({ params }: { params: { id: string } }) {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, [params.id]);

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/ideas`);
      const data = await res.json();
      if (data.success) {
        setIdeas(data.ideas || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertIdea = async (idea: ContentIdea) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: params.id,
          title: idea.title,
          contentType: idea.recommendedFormat,
          topic: idea.title,
          objective: idea.reasonForRecommendation,
        }),
      });
      const data = await res.json();
      if (data.success && data.contentItem) {
        window.location.href = `/content/${data.contentItem.id}`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">CONTENT INTELLIGENCE ENGINE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          Ranked Content Ideas & Opportunity Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">High-demand content opportunities generated automatically from verified project intelligence and audience signals.</p>
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : ideas.length === 0 ? (
        <div className="slate-card p-12 text-center space-y-3 bg-slate-900/50">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No Content Ideas Generated</p>
          <p className="text-xs text-slate-500">Launch a research run in this project to automatically generate content opportunities.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4 hover:border-indigo-500/60 transition">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase">
                    {idea.recommendedFormat}
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-bold">OPPORTUNITY SCORE: <strong className="text-emerald-400">{idea.score}/100</strong></span>
                </div>

                <button
                  onClick={() => handleConvertIdea(idea)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="w-4 h-4" /> Convert to Content Item
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-100">{idea.title}</h3>
                <p className="text-xs text-indigo-300 bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono">
                  Suggested Hook: "{idea.suggestedHook}"
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">Rationale: {idea.reasonForRecommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
