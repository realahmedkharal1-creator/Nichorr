"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Search, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-verified-bg text-verified border-verified/25",
  FAILED: "bg-conflict-bg text-conflict border-conflict/25",
  CANCELLED: "bg-conflict-bg text-conflict border-conflict/25",
};

export default function HistoryPage() {
  const [runs, setRuns] = useState<ResearchRunSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRuns(data.runs);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = runs.filter((r) => r.topic.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-[10.5px] font-mono text-citation font-bold uppercase tracking-[0.4px] block mb-1.5">
            Audited research archive
          </span>
          <h1 className="text-2xl sm:text-[30px] font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-citation" />
            Research History
          </h1>
          <p className="text-[13px] text-muted mt-1.5">
            Every run you have started — reopen results, re-check sources, or re-export a brief.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-muted-2 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by topic…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-line rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-citation transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center">
          <Search className="w-9 h-9 text-muted-2 mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-ink font-serif">
            {runs.length === 0 ? "No research runs yet" : "No runs match that filter"}
          </h3>
          <p className="text-[13px] text-muted mt-1">
            {runs.length === 0 ? (
              <>Start one from <Link href="/research/create" className="text-citation font-semibold hover:underline">New Research</Link>.</>
            ) : (
              "Try a different topic keyword."
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const created =
              r.createdAt || (r as any).created_at
                ? new Date(r.createdAt || (r as any).created_at).toLocaleDateString()
                : "—";
            const sources = r.sources?.length || (r as any).source_count || 0;
            const claims = r.claims?.length || (r as any).claim_count || 0;
            const contentType = r.contentType || (r as any).content_type || "Research";
            return (
              <div
                key={r.id}
                className="bg-card border border-line rounded-2xl shadow-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-citation/50 hover:-translate-y-0.5 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono">
                    <span className="text-citation font-bold uppercase">{contentType}</span>
                    <span className="text-muted-2">·</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold border ${STATUS_STYLE[r.status] || "bg-warning-bg text-warning border-warning/25"}`}>
                      {r.status}
                    </span>
                    <span className="text-muted-2">·</span>
                    <span className="text-muted-2">{created}</span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-ink font-serif leading-snug m-0">{r.topic}</h3>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-muted-2 pt-0.5">
                    <span>{sources} sources</span>
                    <span>{claims} claims</span>
                  </div>
                </div>

                <Link
                  href={r.status === "CANCELLED" ? `/research/${r.id}/live` : `/research/${r.id}/results`}
                  className="shrink-0 flex items-center gap-1.5 bg-ink text-paper px-4 py-2.5 rounded-xl text-xs font-semibold transition hover:opacity-90"
                >
                  {r.status === "CANCELLED" ? "View status" : "Open results"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
