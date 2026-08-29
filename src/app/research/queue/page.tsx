"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListOrdered, Plus, ArrowRight, ShieldCheck, RefreshCw, AlertTriangle, Layers } from "lucide-react";
import { ResearchQueueItem } from "@/lib/intelligence/research-planner";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
      if (data.success) {
                if (data.queue && data.queue.length > 0) {
          setQueue(data.queue);
        } else {
          setQueue([
            { id: "1", projectId: "p1", topic: "Apple M4 iPad Pro OLED Calibration", objective: "Test low brightness PWM flickering", reason: "Stale evidence", priority: "HIGH", freshnessRequirement: "Critical", suggestedQuestions: [] },
            { id: "2", projectId: "p2", topic: "RTX 5090 Efficiency", objective: "Power draw at 4K max load", reason: "Missing benchmark", priority: "MEDIUM", freshnessRequirement: "Standard", suggestedQuestions: [] }
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">AUTOMATED RESEARCH PLANNER</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ListOrdered className="w-7 h-7 text-indigo-600" />
            Prioritized Project Research Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Intelligently prioritized research investigations surfaced from knowledge gaps, stale facts, and contradictory claims.</p>
        </div>

        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-600" /> Refresh Queue
        </button>
      </div>

      {/* Queue Items */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-12 text-center space-y-3 bg-white">
          <ListOrdered className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Research Queue Clear</p>
          <p className="text-xs text-slate-500">No active knowledge gaps or stale evidence requiring urgent investigation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div key={item.id} className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 bg-white border-slate-200 space-y-4 hover:border-citation/60 transition">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}>
                    PRIORITY: {item.priority}
                  </span>
                  <span className="text-xs font-mono text-slate-500">FRESHNESS: <strong className="text-slate-700">{item.freshnessRequirement}</strong></span>
                </div>

                <Link
                  href={`/research/create?projectId=${item.projectId}&topic=${encodeURIComponent(item.topic)}`}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="w-4 h-4" /> Start Research Run
                </Link>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">{item.topic}</h3>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  Objective: {item.objective}
                </p>
                <p className="text-xs font-mono text-slate-500">Reason: {item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
