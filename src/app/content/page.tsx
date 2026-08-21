"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, ShieldCheck, Layers, Sparkles, LayoutGrid, Clock, Eye, Image as ImageIcon } from "lucide-react";
import { ContentItemEntity, ContentStage } from "@/lib/database/repositories/content.repo";

const PIPELINE_COLUMNS: Array<{ stage: ContentStage | string; title: string }> = [
  { stage: "IDEA", title: "Draft (Ideas)" },
  { stage: "RESEARCH_READY", title: "Research Ready" },
  { stage: "OUTLINE_READY", title: "Outline Ready" },
  { stage: "SCRIPTING", title: "Scripting" },
  { stage: "FACT_CHECK", title: "In Review (Fact Check)" },
  { stage: "READY_TO_RECORD", title: "Ready to Record" },
  { stage: "READY_TO_PUBLISH", title: "Ready to Publish" },
  { stage: "PUBLISHED", title: "Published" },
];



export default function ContentPipelinePage() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.success && data.contentItems && data.contentItems.length > 0) {
        setContentItems(data.contentItems);
      } else {
        setContentItems([]);
      }
    } catch (e) {
      console.error(e);
      setContentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = (stage: string) => {
    const title = prompt("Enter a title for the new content card:");
    if (!title) return;

    const newItem = {
      id: "temp-" + Date.now(),
      project_id: "default-project",
      title,
      stage,
      content_type: "YOUTUBE_VIDEO",
      priority: "MEDIUM",
      fact_check_status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      thumbnail: "placeholder",
      duration: "00:00",
      views: "0",
    };

    setContentItems(prev => [...prev, newItem]);
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <h1 className="text-3xl font-mono tracking-tight font-semibold flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100">
             <LayoutGrid className="w-5 h-5" />
          </div>
          Content Production Board
        </h1>

        <Link
          href="/content/ideas"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Sparkles className="w-4 h-4" /> Content Ideas Generator
        </Link>
      </div>

      {/* Board Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {loading ? (
             [1,2,3,4,5].map(i => (
                <div key={i} className="w-[340px] h-[80vh] bg-slate-50 border border-slate-200 rounded-[24px] animate-pulse"></div>
             ))
          ) : PIPELINE_COLUMNS.map((col) => {
            const itemsInStage = contentItems.filter((i) => i.stage === col.stage);
            return (
              <div key={col.stage} className="w-[340px] flex flex-col bg-slate-50 border border-slate-200 rounded-[24px] p-3 shadow-sm">
                
                <div className="flex items-center justify-between px-3 py-3 mb-2">
                  <span className="text-sm font-extrabold text-slate-900">{col.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-slate-600 font-bold shadow-sm border border-slate-200">
                    {itemsInStage.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar pb-12">
                  {itemsInStage.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl p-8 text-center bg-white border border-slate-200 border-dashed mt-2">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-2 border border-slate-100">
                        <Layers className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">No items yet</span>
                    </div>
                  ) : (
                    itemsInStage.map((item) => (
                      <Link key={item.id} href={`/content/${item.id}`} className="block">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-[24px] p-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group">
                          
                          {item.thumbnail === "placeholder" && (
                            <div className="w-full h-28 bg-slate-100 rounded-xl mb-3 flex flex-col items-center justify-center text-slate-400 border border-slate-200 overflow-hidden relative">
                                <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                <span className="text-[10px] font-mono font-medium">Thumbnail Placeholder</span>
                                {item.duration && item.duration !== "TBD" && (
                                  <div className="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                    {item.duration}
                                  </div>
                                )}
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-3 gap-2">
                            <span className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-indigo-600 transition line-clamp-2">
                               {item.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                               {item.content_type}
                            </span>
                            {item.views && item.views !== "N/A" && (
                              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {item.views}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-3">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                 <ShieldCheck className="w-3.5 h-3.5" />
                                 <span className={item.fact_check_status === 'PASSED' ? "text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200" : "bg-slate-100 px-1 py-0.5 rounded"}>
                                   {item.fact_check_status || 'PENDING'}
                                 </span>
                              </div>
                            </div>
                            <span className="bg-slate-50 border border-slate-200 rounded-full w-7 h-7 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition">
                               <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                <div className="mt-auto px-1 pt-2">
                  <button 
                    onClick={() => handleAddCard(col.stage)}
                    className="w-full py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 shadow-sm transition text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

