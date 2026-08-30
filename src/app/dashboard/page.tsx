"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Layers, ShieldCheck, BookOpen, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InfoTooltip } from "@/components/ui/Tooltip";

const TERMINAL = ["COMPLETED", "FAILED", "CANCELLED", "PARTIAL"];

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-verified-bg text-verified border-verified/25",
  PARTIAL: "bg-verified-bg text-verified border-verified/25",
  FAILED: "bg-conflict-bg text-conflict border-conflict/25",
  CANCELLED: "bg-conflict-bg text-conflict border-conflict/25",
};

type Run = {
  id: string;
  topic: string;
  status: string;
  content_type?: string;
  contentType?: string;
  created_at?: string;
  createdAt?: string;
  source_count?: number;
  claim_count?: number;
  sources?: unknown[];
  claims?: unknown[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [exploreTopic, setExploreTopic] = useState("");
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.runs)) setRuns(data.runs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = runs.length;
    const completed = runs.filter((r) => r.status === "COMPLETED" || r.status === "PARTIAL").length;
    // "In progress" = non-terminal AND touched in the last 24h. A run left mid-pipeline days
    // ago (tab closed before it finished) is abandoned, not running — don't keep counting it.
    const DAY_MS = 24 * 60 * 60 * 1000;
    const active = runs.filter((r) => {
      if (TERMINAL.includes(r.status)) return false;
      const ts = Date.parse((r as any).updated_at || r.created_at || r.createdAt || "");
      return Number.isNaN(ts) ? true : Date.now() - ts < DAY_MS;
    }).length;
    const claims = runs.reduce((sum, r) => sum + (r.claims?.length || r.claim_count || 0), 0);
    const sources = runs.reduce((sum, r) => sum + (r.sources?.length || r.source_count || 0), 0);
    return { total, completed, active, claims, sources };
  }, [runs]);

  const recent = runs.slice(0, 6);

  const handleExploreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = exploreTopic.trim();
    router.push(q ? `/research/create?topic=${encodeURIComponent(q)}` : "/research/create");
  };

  const handleQuickTemplate = (topic: string) => {
    router.push(`/research/create?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto pt-[28px] px-[20px] pb-[60px]">
      <div className="flex items-end justify-between gap-[16px] flex-col md:flex-row mb-[24px]">
        <div className="self-start">
          <h1 className="font-serif font-semibold text-[30px] m-0">Overview</h1>
          <p className="text-[13px] text-muted mt-[4px]">Your research activity at a glance.</p>
        </div>
        <Button
          onClick={() => router.push("/research/create")}
          className="whitespace-nowrap w-full md:w-auto text-center py-[13px] md:py-[10px]"
        >
          + New Research
        </Button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[18px]">
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">
            Total Runs
          </div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">
            {loading ? "—" : stats.total}
          </div>
          <div className="text-[12px] text-muted mt-[8px]">
            {loading ? " " : `${stats.active} in progress`}
          </div>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">
            Completed
          </div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">
            {loading ? "—" : stats.completed}
          </div>
          <div className="text-[12px] text-muted mt-[8px]">
            {loading || stats.total === 0
              ? " "
              : `${Math.round((stats.completed / stats.total) * 100)}% of all runs`}
          </div>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">
            Verified Claims{" "}
            <InfoTooltip content="Evidence-backed claims extracted and verified across all your runs." />
          </div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">
            {loading ? "—" : stats.claims}
          </div>
          <div className="text-[12px] text-muted mt-[8px]">across every run</div>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">
            Sources Analyzed
          </div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">
            {loading ? "—" : stats.sources}
          </div>
          <div className="text-[12px] text-muted mt-[8px]">retrieved &amp; scored</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[18px]">
        {/* Recent research */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-[14px]">
            <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2">
              Recent Research
            </div>
            <Link
              href="/research/history"
              className="text-[12px] font-semibold text-citation inline-flex items-center gap-1 hover:opacity-80"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[58px] w-full skeleton rounded-xl" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-[36px] gap-[10px]">
              <FileText className="w-9 h-9 text-muted-2" />
              <p className="text-[13px] text-muted max-w-[280px]">
                No research runs yet. Start your first one and it will show up here.
              </p>
              <Button variant="accent" onClick={() => router.push("/research/create")}>
                Start research
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-line-soft">
              {recent.map((r) => {
                const created = r.created_at || r.createdAt;
                const type = r.content_type || r.contentType || "Research";
                const cls =
                  STATUS_STYLE[r.status] || "bg-warning-bg text-warning border-warning/25";
                const href =
                  r.status === "CANCELLED"
                    ? `/research/${r.id}/live`
                    : `/research/${r.id}/results`;
                return (
                  <Link
                    key={r.id}
                    href={href}
                    className="flex items-center justify-between gap-3 py-[12px] group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-mono mb-[3px]">
                        <span className="text-citation font-bold uppercase">{type}</span>
                        <span className="text-muted-2">·</span>
                        <span className={`px-1.5 py-0.5 rounded-full border font-bold ${cls}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-semibold text-ink truncate group-hover:text-citation transition">
                        {r.topic}
                      </div>
                      <div className="text-[11px] font-mono text-muted-2 mt-[2px]">
                        {(r.sources?.length || r.source_count || 0)} sources ·{" "}
                        {(r.claims?.length || r.claim_count || 0)} claims
                        {created ? ` · ${new Date(created).toLocaleDateString()}` : ""}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-2 shrink-0 group-hover:text-citation group-hover:translate-x-0.5 transition" />
                  </Link>
                );
              })}
            </div>
          )}
        </Card>

        {/* Quick-start */}
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">
            Quick-Start Research
          </div>
          <div className="flex gap-[8px] flex-wrap mb-[12px]">
            <button
              onClick={() => handleQuickTemplate("Galaxy S27 vs iPhone 18")}
              className="text-[12px] font-semibold text-citation bg-citation-bg px-[12px] py-[7px] rounded-[20px] border-none cursor-pointer"
            >
              Galaxy S27 vs iPhone 18
            </button>
            <button
              onClick={() => handleQuickTemplate("RTX 5090 thermals")}
              className="text-[12px] font-semibold text-citation bg-citation-bg px-[12px] py-[7px] rounded-[20px] border-none cursor-pointer"
            >
              RTX 5090 thermals
            </button>
          </div>
          <form onSubmit={handleExploreSubmit} className="flex gap-[8px]">
            <input
              type="text"
              placeholder="What topic would you like to research?"
              value={exploreTopic}
              onChange={(e) => setExploreTopic(e.target.value)}
              className="flex-1 font-sans text-[13.5px] px-[14px] py-[11px] border border-line rounded-[9px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg placeholder:text-muted-2"
            />
            <Button type="submit" variant="accent">
              Explore &rarr;
            </Button>
          </form>

          {/* How a run works — fills the panel and orients new users */}
          <div className="mt-[20px] pt-[18px] border-t border-line-soft">
            <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[12px]">
              How a run works
            </div>
            <ol className="space-y-[10px] m-0 p-0 list-none">
              {[
                { n: "1", t: "Topic & questions", d: "Describe the video; Nichorr drafts the research questions." },
                { n: "2", t: "Evidence & conflicts", d: "It retrieves live sources, scores each claim, flags disagreements." },
                { n: "3", t: "Script-ready brief", d: "You get a cited brief plus YouTube, community and audience intel." },
              ].map((s) => (
                <li key={s.n} className="flex gap-[10px]">
                  <span className="shrink-0 w-[20px] h-[20px] rounded-full bg-citation-bg text-citation font-mono text-[11px] font-bold flex items-center justify-center mt-[1px]">
                    {s.n}
                  </span>
                  <div>
                    <div className="text-[12.5px] font-semibold text-ink leading-tight">{s.t}</div>
                    <div className="text-[11.5px] text-muted leading-snug mt-[2px]">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-[18px] pt-[16px] border-t border-line-soft grid grid-cols-2 gap-[8px]">
            {[
              { href: "/research/history", label: "History", icon: GitBranch },
              { href: "/research/sources", label: "Sources", icon: ShieldCheck },
              { href: "/content", label: "Content Board", icon: Layers },
              { href: "/docs", label: "Docs", icon: BookOpen },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between gap-2 border border-line rounded-[9px] px-[12px] py-[9px] text-[12px] font-semibold text-ink hover:border-citation hover:bg-paper transition-colors"
              >
                <span className="inline-flex items-center gap-1.5">
                  <l.icon className="w-3.5 h-3.5 text-muted-2 group-hover:text-citation transition-colors" />
                  {l.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-2 group-hover:text-citation group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
