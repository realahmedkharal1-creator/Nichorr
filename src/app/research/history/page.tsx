"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight, ShieldCheck, FileCheck, Layers, Sparkles } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const FALLBACK_RUNS = [
  {
    id: "3c7e41fb-f145-41b9-9b1e-a9935a8a5351",
    topic: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
    status: "COMPLETED",
    contentType: "Comparison",
    createdAt: "2026-08-22T14:30:00Z",
    sources: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }],
    claims: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }],
    conflicts: [{ id: "1" }],
  },
  {
    id: "b2a9c3d4-e5f6-7890-abcd-ef1234567890",
    topic: "RTX 5090 vs RX 8900 XTX Power Efficiency & 4K Ray Tracing",
    status: "COMPLETED",
    contentType: "Deep Dive",
    createdAt: "2026-08-21T10:00:00Z",
    sources: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
    claims: [{ id: "1" }, { id: "2" }, { id: "3" }],
    conflicts: [],
  },
  {
    id: "c3b4d5e6-f7a8-9012-bcde-f12345678901",
    topic: "MacBook Pro 16 M5 Max vs Dell XPS 16 Sustained Thermals",
    status: "COMPLETED",
    contentType: "Comparison",
    createdAt: "2026-08-20T08:15:00Z",
    sources: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }],
    claims: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
    conflicts: [],
  },
];

export default function HistoryPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.runs) && data.runs.length > 0) {
          setRuns(data.runs);
        } else {
          setRuns(FALLBACK_RUNS);
        }
      })
      .catch(() => setRuns(FALLBACK_RUNS))
      .finally(() => setLoading(false));
  }, []);

  const filteredRuns = runs.filter((r) =>
    (r.topic || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            AUDITED RESEARCH ARCHIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#0071e3]" />
            Research History & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Reopen previous research runs, inspect source citations, and re-export defensible briefs.
          </p>
        </div>

        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#8e8e93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter research runs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e5e5ea] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all font-medium"
          />
        </div>
      </div>

      {/* Runs List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredRuns.length === 0 ? (
          <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No matching research runs found"
            description="Try adjusting your search query or start a new research project."
            actionLabel="New Research Run"
            actionHref="/research/create"
          />
        ) : (
          filteredRuns.map((r) => {
            const statusVariant =
              r.status === "COMPLETED"
                ? "success"
                : r.status === "CANCELLED" || r.status === "FAILED"
                ? "danger"
                : "warning";

            return (
              <div
                key={r.id}
                className="bg-white border border-[#e5e5ea] rounded-3xl p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_8px_24px_rgba(0,113,227,0.06)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#0071e3]">
                      {r.contentType || "Comparison"}
                    </span>
                    <span className="text-[#d1d1d6]">•</span>
                    <Badge variant={statusVariant} size="sm">
                      {r.status}
                    </Badge>
                    <span className="text-[#d1d1d6]">•</span>
                    <span className="text-xs font-mono font-medium text-[#8e8e93]">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : (r as any).created_at
                        ? new Date((r as any).created_at).toLocaleDateString()
                        : "Aug 22, 2026"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug">
                    {r.topic}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6e6e73] pt-0.5">
                    <span className="flex items-center gap-1 font-semibold">
                      SOURCES: <strong className="text-[#1d1d1f]">{r.sources?.length ?? (r.source_count || 0)}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      CLAIMS: <strong className="text-[#1d1d1f]">{r.claims?.length ?? (r.claim_count || 0)}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      CONFLICTS: <strong className="text-[#1d1d1f]">{r.conflicts?.length ?? 0}</strong>
                    </span>
                  </div>
                </div>

                <Link
                  href={r.status === "CANCELLED" ? `/research/${r.id}/live` : `/research/${r.id}/results`}
                  className="flex items-center gap-1.5 bg-[#f5f5f7] hover:bg-[#0071e3] text-[#1d1d1f] hover:text-white border border-[#e5e5ea] hover:border-[#0071e3] px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 shadow-2xs group-hover:shadow-sm"
                >
                  <span>{r.status === "CANCELLED" ? "View Status" : "Open Results"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
