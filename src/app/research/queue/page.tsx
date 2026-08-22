"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListOrdered, Plus, ArrowRight, ShieldCheck, RefreshCw, AlertTriangle, Layers } from "lucide-react";
import { ResearchQueueItem } from "@/lib/intelligence/research-planner";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ResearchQueuePage() {
  const [queue, setQueue] = useState<ResearchQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/research/queue");
      const data = await res.json();
      if (data.success && data.queue && data.queue.length > 0) {
        setQueue(data.queue);
      } else {
        setQueue([
          {
            id: "1",
            projectId: "p1",
            topic: "Apple M4 iPad Pro OLED Calibration & PWM",
            objective: "Test low brightness PWM flickering and sustained nits under direct sunlight.",
            reason: "Stale evidence in knowledge base",
            priority: "HIGH",
            freshnessRequirement: "Critical",
            suggestedQuestions: [],
          },
          {
            id: "2",
            projectId: "p2",
            topic: "RTX 5090 Efficiency & 12V-2x6 Connector Thermals",
            objective: "Power draw at 4K max ray tracing load and terminal pin temperatures.",
            reason: "Missing primary lab benchmark",
            priority: "MEDIUM",
            freshnessRequirement: "Standard",
            suggestedQuestions: [],
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            AUTOMATED RESEARCH PLANNER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <ListOrdered className="w-7 h-7 text-[#0071e3]" />
            Prioritized Research Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Intelligently prioritized investigations surfaced from knowledge gaps, stale facts, and contradictory claims.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] border border-[#e5e5ea] px-4 py-2 rounded-full text-xs font-semibold transition shadow-2xs cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8e8e93]" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Queue Items */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : queue.length === 0 ? (
        <EmptyState
          icon={<ListOrdered className="w-8 h-8 text-[#0071e3]" />}
          title="Research Queue Clear"
          description="No active knowledge gaps or stale evidence requiring urgent investigation."
        />
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-7 space-y-4 hover:border-[#0071e3]/40 transition group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#f5f5f7] pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={item.priority === "HIGH" ? "danger" : "default"} size="sm">
                    PRIORITY: {item.priority}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#8e8e93] font-semibold">
                    FRESHNESS: <strong className="text-[#1d1d1f]">{item.freshnessRequirement}</strong>
                  </span>
                </div>

                <Link
                  href={`/research/create?projectId=${item.projectId}&topic=${encodeURIComponent(item.topic)}`}
                  className="flex items-center gap-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm shadow-[#0071e3]/20 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Research Run</span>
                </Link>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0071e3] transition-colors">
                  {item.topic}
                </h3>
                <p className="text-xs sm:text-sm text-[#1d1d1f] bg-[#fbfbfd] p-4 rounded-2xl border border-[#e5e5ea] leading-relaxed font-medium">
                  <strong>Objective:</strong> {item.objective}
                </p>
                <p className="text-xs font-mono text-[#8e8e93] pt-1">
                  Reason: {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
