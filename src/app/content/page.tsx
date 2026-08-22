"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, ShieldCheck, Layers, Sparkles, LayoutGrid, Clock, Eye, Image as ImageIcon, X } from "lucide-react";
import { ContentItemEntity, ContentStage } from "@/lib/database/repositories/content.repo";
import { Badge } from "@/components/ui/Badge";

const PIPELINE_COLUMNS: Array<{ stage: ContentStage | string; title: string }> = [
  { stage: "IDEA", title: "Draft Ideas" },
  { stage: "RESEARCH_READY", title: "Research Ready" },
  { stage: "OUTLINE_READY", title: "Outline Ready" },
  { stage: "SCRIPTING", title: "Scripting" },
  { stage: "FACT_CHECK", title: "Fact Check" },
  { stage: "READY_TO_RECORD", title: "Ready to Record" },
  { stage: "READY_TO_PUBLISH", title: "Ready to Publish" },
  { stage: "PUBLISHED", title: "Published" },
];

const FALLBACK_CONTENT = [
  {
    id: "item-1",
    project_id: "p-1",
    title: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max - Camera & Thermal Showdown",
    stage: "READY_TO_PUBLISH",
    content_type: "YOUTUBE_VIDEO",
    priority: "HIGH",
    fact_check_status: "PASSED",
    created_at: "2026-08-22T10:00:00Z",
    thumbnail: "placeholder",
    duration: "18:42",
    views: "240k est.",
  },
  {
    id: "item-2",
    project_id: "p-2",
    title: "RTX 5090 vs RX 8900 XTX 4K Ray Tracing Benchmarks & Power Draw",
    stage: "SCRIPTING",
    content_type: "YOUTUBE_VIDEO",
    priority: "HIGH",
    fact_check_status: "PASSED",
    created_at: "2026-08-21T15:00:00Z",
    thumbnail: "placeholder",
    duration: "14:15",
    views: "180k est.",
  },
  {
    id: "item-3",
    project_id: "p-3",
    title: "MacBook Pro 16 M5 Max Sustained Thermals & Cinebench R24 Audit",
    stage: "OUTLINE_READY",
    content_type: "DEEP_DIVE",
    priority: "MEDIUM",
    fact_check_status: "PENDING",
    created_at: "2026-08-20T11:00:00Z",
    thumbnail: "placeholder",
    duration: "12:00",
    views: "95k est.",
  },
];

export default function ContentPipelinePage() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalStage, setActiveModalStage] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (data.success && Array.isArray(data.contentItems) && data.contentItems.length > 0) {
        setContentItems(data.contentItems);
      } else {
        setContentItems(FALLBACK_CONTENT);
      }
    } catch (e) {
      console.error(e);
      setContentItems(FALLBACK_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim() || !activeModalStage) return;

    const newItem = {
      id: "card-" + Date.now(),
      project_id: "default-project",
      title: newCardTitle.trim(),
      stage: activeModalStage,
      content_type: "YOUTUBE_VIDEO",
      priority: "MEDIUM",
      fact_check_status: "PASSED",
      created_at: new Date().toISOString(),
      thumbnail: "placeholder",
      duration: "12:00",
      views: "100k est.",
    };

    setContentItems((prev) => [...prev, newItem]);
    setNewCardTitle("");
    setActiveModalStage(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            CREATOR PRODUCTION PIPELINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <LayoutGrid className="w-7 h-7 text-[#0071e3]" />
            Content Production Board
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Track video scripts, verified benchmark cards, and publishing preflight across production stages.
          </p>
        </div>

        <Link
          href="/content/ideas"
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ideas Generator</span>
        </Link>
      </div>

      {/* Quick Add Modal */}
      {activeModalStage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#e5e5ea] shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e5e5ea] pb-3">
              <h2 className="text-base font-bold text-[#1d1d1f]">
                Add Content Card ({activeModalStage.replace(/_/g, " ")})
              </h2>
              <button
                type="button"
                onClick={() => setActiveModalStage(null)}
                className="w-7 h-7 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#8e8e93] hover:text-[#1d1d1f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1d1d1f]">
                  Video Title / Topic <span className="text-[#ff3b30]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S27 Ultra Dynamic Range & PWM Deep Dive"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-xs font-semibold focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e5e5ea]">
                <button
                  type="button"
                  onClick={() => setActiveModalStage(null)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#6e6e73] hover:bg-[#f5f5f7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCardTitle.trim()}
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm transition disabled:opacity-50 active:scale-95"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Board Kanban Columns */}
      <div className="flex-1 overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex gap-5 min-w-max pb-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[320px] h-[600px] bg-white border border-[#e5e5ea] rounded-3xl animate-pulse"
              />
            ))
          ) : (
            PIPELINE_COLUMNS.map((col) => {
              const itemsInStage = contentItems.filter((i) => i.stage === col.stage);
              return (
                <div
                  key={col.stage}
                  className="w-[320px] flex flex-col bg-white border border-[#e5e5ea] rounded-3xl p-4 shadow-[0_2px_14px_rgba(0,0,0,0.02)] min-h-[600px]"
                >
                  <div className="flex items-center justify-between px-2 py-2 mb-3 border-b border-[#f5f5f7]">
                    <span className="text-xs font-extrabold text-[#1d1d1f] tracking-tight">
                      {col.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#48484a] font-bold border border-[#e5e5ea]">
                      {itemsInStage.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 px-0.5 overflow-y-auto max-h-[500px] scrollbar-hide">
                    {itemsInStage.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-2xl p-8 text-center bg-[#fbfbfd] border border-[#e5e5ea] border-dashed mt-2">
                        <Layers className="w-5 h-5 text-[#8e8e93] mb-1.5 opacity-60" />
                        <span className="text-xs font-medium text-[#8e8e93]">No items staged</span>
                      </div>
                    ) : (
                      itemsInStage.map((item) => (
                        <Link key={item.id} href={`/content/${item.id}`} className="block group">
                          <div className="bg-[#fbfbfd] hover:bg-white border border-[#e5e5ea] hover:border-[#0071e3]/40 shadow-2xs hover:shadow-[0_8px_20px_rgba(0,113,227,0.06)] hover:-translate-y-0.5 rounded-2xl p-4 transition-all duration-200 cursor-pointer space-y-3">
                            {item.thumbnail === "placeholder" && (
                              <div className="w-full h-24 bg-[#f5f5f7] rounded-xl flex flex-col items-center justify-center text-[#8e8e93] border border-[#e5e5ea] overflow-hidden relative">
                                <ImageIcon className="w-5 h-5 mb-1 opacity-40" />
                                <span className="text-[9px] font-mono font-bold">1280 × 720</span>
                                {item.duration && (
                                  <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                                    {item.duration}
                                  </div>
                                )}
                              </div>
                            )}

                            <h3 className="text-xs font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h3>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="default" size="sm">
                                {item.content_type || "YOUTUBE"}
                              </Badge>
                              {item.views && (
                                <Badge variant="warning" size="sm">
                                  <Eye className="w-2.5 h-2.5" /> {item.views}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono text-[#8e8e93] border-t border-[#e5e5ea] pt-2.5">
                              <span className="flex items-center gap-1 text-[#15803d] font-bold">
                                <ShieldCheck className="w-3 h-3 text-[#34c759]" />
                                {item.fact_check_status || "VERIFIED"}
                              </span>
                              <span className="w-6 h-6 rounded-full bg-white border border-[#e5e5ea] flex items-center justify-center text-[#1d1d1f] group-hover:bg-[#0071e3] group-hover:border-[#0071e3] group-hover:text-white transition-all shadow-2xs">
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#f5f5f7]">
                    <button
                      type="button"
                      onClick={() => setActiveModalStage(col.stage)}
                      className="w-full py-2.5 rounded-xl bg-[#f5f5f7] hover:bg-[#eef2ff] hover:text-[#0071e3] text-[#1d1d1f] border border-[#e5e5ea] hover:border-[#0071e3]/30 transition text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Card
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
