"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Video, Plus, ArrowRight, ShieldCheck, CheckCircle2, Clock, Layers, Sparkles } from "lucide-react";
import { ContentItemEntity, ContentStage } from "@/lib/database/repositories/content.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";

const PIPELINE_COLUMNS: Array<{ stage: ContentStage; title: string }> = [
  { stage: "IDEA", title: "Ideas" },
  { stage: "RESEARCH_READY", title: "Research Ready" },
  { stage: "OUTLINE_READY", title: "Outline Ready" },
  { stage: "SCRIPTING", title: "Scripting" },
  { stage: "FACT_CHECK", title: "Fact Check" },
  { stage: "READY_TO_RECORD", title: "Ready to Record" },
  { stage: "READY_TO_PUBLISH", title: "Ready to Publish" },
  { stage: "PUBLISHED", title: "Published" },
];

export default function ContentPipelinePage() {
  const [contentItems, setContentItems] = useState<ContentItemEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.success) {
        setContentItems(data.contentItems || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (itemId: string, targetStage: ContentStage) => {
    try {
      const res = await fetch(`/api/content/${itemId}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetStage }),
      });
      const data = await res.json();
      if (data.success) {
        fetchContentItems();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">CREATOR PRODUCTION PIPELINE</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-indigo-400" />
            Content Operations & Production Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Track content items from raw technical research through script generation, fact checking, and publish readiness.</p>
        </div>

        <Link
          href="/projects/default-project/content/ideas"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
        >
          <Sparkles className="w-4 h-4" /> Content Ideas Generator
        </Link>
      </div>

      {/* Board Kanban Columns */}
      {loading ? (
        <div className="grid sm:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const itemsInStage = contentItems.filter((i) => i.stage === col.stage);
            return (
              <div key={col.stage} className="slate-card p-4 bg-slate-900/80 border-slate-800 space-y-3 flex flex-col justify-between min-h-[360px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">{col.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-bold">
                      {itemsInStage.length}
                    </span>
                  </div>

                  {itemsInStage.length === 0 ? (
                    <p className="text-[11px] font-mono text-slate-600 italic text-center py-8">No items in stage</p>
                  ) : (
                    <div className="space-y-3">
                      {itemsInStage.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-indigo-500/50 transition">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-indigo-400 font-semibold">{item.content_type}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                              item.priority === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-slate-900 text-slate-400'
                            }`}>
                              {item.priority}
                            </span>
                          </div>

                          <Link href={`/content/${item.id}`} className="block text-xs font-bold text-slate-100 hover:text-indigo-300 transition">
                            {item.title}
                          </Link>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-500">
                            <span>Fact Check: <strong className="text-indigo-400">{item.fact_check_status || 'PENDING'}</strong></span>
                            <Link href={`/content/${item.id}`} className="text-indigo-400 hover:underline font-bold flex items-center gap-0.5">
                              Open <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
