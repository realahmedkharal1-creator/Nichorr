"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Link as LinkIcon, 
  MoreHorizontal, 
  Lightbulb, 
  ArrowRight, 
  ChevronDown, 
  Calendar, 
  Search,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Clock
} from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";

export default function DashboardPage() {
  const router = useRouter();
  const [exploreTopic, setExploreTopic] = useState("");
  
  // Interactive filters
  const [showDate1, setShowDate1] = useState(false);
  const [showDate2, setShowDate2] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);

  const [date1, setDate1] = useState("Jan 01 - July 31");
  const [date2, setDate2] = useState("Aug 01 - Dec 31");
  const [period, setPeriod] = useState("Daily");

  const handleExploreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exploreTopic.trim()) {
      router.push(`/research/create?topic=${encodeURIComponent(exploreTopic.trim())}`);
    } else {
      router.push("/research/create");
    }
  };

  const handleQuickTemplate = (topic: string) => {
    router.push(`/research/create?topic=${encodeURIComponent(topic)}`);
  };

  const cardActions = [
    { label: "View Detailed Analytics", onClick: () => router.push("/research/quality") },
    { label: "Export Metrics (CSV)", onClick: () => console.log("Exporting CSV...") },
    { label: "Refresh Data", onClick: () => router.refresh() },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Page Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-2 z-20 relative">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
              Research Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[10px] font-mono font-bold text-[#15803d]">
              LIVE
            </span>
          </div>
          <p className="text-xs text-[#6e6e73] font-medium mt-1">
            Real-time multi-source evidence synthesis, claim verification, and creator intelligence telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1d1d1f]">
          {/* Comparison Date Selector */}
          <div className="flex items-center bg-white border border-[#e5e5ea] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Dropdown 1 */}
            <div className="relative">
              <button
                onClick={() => { setShowDate1(!showDate1); setShowDate2(false); setShowPeriod(false); }}
                className="px-3.5 py-2 hover:bg-[#f5f5f7] flex items-center gap-1.5 text-[#1d1d1f] text-xs font-semibold transition"
              >
                <Calendar className="w-3.5 h-3.5 text-[#8e8e93]" /> {date1} <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
              </button>
              {showDate1 && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-[#e5e5ea] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {["Jan 01 - July 31", "Feb 01 - Mar 31", "Year to Date"].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDate1(d); setShowDate1(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#f5f5f7] rounded-xl text-xs font-medium text-[#1d1d1f]"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-2.5 py-2 border-x border-[#e5e5ea] text-[#8e8e93] text-[11px] font-mono bg-[#fbfbfd]">
              vs
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <button
                onClick={() => { setShowDate2(!showDate2); setShowDate1(false); setShowPeriod(false); }}
                className="px-3.5 py-2 hover:bg-[#f5f5f7] flex items-center gap-1.5 text-[#1d1d1f] text-xs font-semibold transition"
              >
                {date2} <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
              </button>
              {showDate2 && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-[#e5e5ea] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {["Aug 01 - Dec 31", "Previous Year", "All Time"].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDate2(d); setShowDate2(false); }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#f5f5f7] rounded-xl text-xs font-medium text-[#1d1d1f]"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Granularity Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowPeriod(!showPeriod); setShowDate1(false); setShowDate2(false); }}
              className="px-3.5 py-2 bg-white border border-[#e5e5ea] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:bg-[#f5f5f7] flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] transition"
            >
              <Clock className="w-3.5 h-3.5 text-[#8e8e93]" />
              <span>{period}</span>
              <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
            </button>
            {showPeriod && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-[#e5e5ea] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.1)] z-50 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                {["Daily", "Weekly", "Monthly"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setShowPeriod(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#f5f5f7] rounded-xl text-xs font-medium text-[#1d1d1f]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <Link
            href="/research/create"
            className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full shadow-sm shadow-[#0071e3]/20 flex items-center gap-1.5 transition-all text-xs font-semibold"
          >
            <span>New Research</span>
            <span className="text-base leading-none font-bold">+</span>
          </Link>
        </div>
      </div>

      {/* 12-Column Modern Bento Grid */}
      <div className="grid grid-cols-12 gap-5 relative z-10">
        
        {/* Card 1: Research Velocity */}
        <div 
          onClick={() => router.push("/research/history")}
          className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between h-[300px] cursor-pointer hover:border-[#0071e3]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block mb-0.5">Throughput</span>
              <span className="font-bold text-[#1d1d1f] text-sm group-hover:text-[#0071e3] transition-colors">Research Velocity</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                trigger={
                  <button className="w-7 h-7 rounded-full border border-[#e5e5ea] flex items-center justify-center hover:bg-[#f5f5f7] text-[#8e8e93]">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                }
                items={cardActions}
              />
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-[3px] mt-6 mb-3 px-1">
            {[30, 42, 45, 35, 40, 62, 70, 65, 78, 85, 60, 68, 72, 50, 48, 42, 65, 55, 60].map((h, i) => (
              <div
                key={i}
                className="w-full bg-[#0071e3]/80 group-hover:bg-[#0071e3] rounded-t-sm transition-all duration-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#f5f5f7]">
            <div className="flex gap-2 text-[10px] font-mono text-[#8e8e93] uppercase font-bold">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#15803d] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
              100% Audited
            </span>
          </div>
        </div>

        {/* Card 2 & 3: Double Stacked Stats */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 h-[300px]">
          
          {/* Top: Verified Claims */}
          <div 
            onClick={() => router.push("/research/quality")}
            className="flex-1 bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between cursor-pointer hover:border-[#34c759]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block mb-0.5">Integrity</span>
                <span className="font-bold text-[#1d1d1f] text-sm group-hover:text-[#34c759] transition-colors">Verified Claims</span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu
                  trigger={
                    <button className="w-7 h-7 rounded-full border border-[#e5e5ea] flex items-center justify-center hover:bg-[#f5f5f7] text-[#8e8e93]">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  }
                  items={cardActions}
                />
              </div>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className="w-1/3 text-left">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#1d1d1f]">106</div>
                <div className="text-[11px] text-[#6e6e73] font-medium">100% Traced</div>
              </div>
              
              <div className="w-1/3 flex flex-col items-center pb-1">
                <span className="text-[9px] font-mono border border-[#e5e5ea] bg-[#f5f5f7] rounded-full px-2 py-0.5 text-[#48484a] font-bold mb-1.5 whitespace-nowrap">
                  Peak: Benchmarks
                </span>
                <div className="flex items-end gap-1">
                  {[1, 2, 4, 3, 2, 1].map((cols, i) => (
                    <div key={i} className="flex flex-col gap-0.5 justify-end h-6">
                      {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/3 text-right">
                <div className="text-[10px] font-mono text-[#8e8e93]">vs last week</div>
                <div className="text-xs font-bold text-[#15803d]">+24 claims</div>
                <div className="text-[10px] font-mono font-bold text-[#34c759] mt-0.5">0 Hallucinations</div>
              </div>
            </div>
          </div>

          {/* Bottom: Active Research Runs */}
          <div 
            onClick={() => router.push("/projects")}
            className="flex-1 bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between cursor-pointer hover:border-[#0071e3]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block mb-0.5">Pipeline</span>
                <span className="font-bold text-[#1d1d1f] text-sm group-hover:text-[#0071e3] transition-colors">Active Research Runs</span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu
                  trigger={
                    <button className="w-7 h-7 rounded-full border border-[#e5e5ea] flex items-center justify-center hover:bg-[#f5f5f7] text-[#8e8e93]">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  }
                  items={cardActions}
                />
              </div>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className="w-1/3 text-left">
                <div className="font-mono text-3xl font-extrabold tracking-tight text-[#1d1d1f]">12</div>
                <div className="text-[11px] text-[#6e6e73] font-medium">Active creator projects</div>
              </div>
              
              <div className="w-1/3 flex flex-col items-center pb-1">
                <span className="text-[9px] font-mono border border-[#e5e5ea] bg-[#f5f5f7] rounded-full px-2 py-0.5 text-[#48484a] font-bold mb-1.5 whitespace-nowrap">
                  Peak: Flagship
                </span>
                <div className="flex items-end gap-1">
                  {[1, 1, 2, 3, 1, 1].map((cols, i) => (
                    <div key={i} className="flex flex-col gap-0.5 justify-end h-6">
                      {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/3 text-right">
                <div className="text-[10px] font-mono text-[#8e8e93]">vs last week</div>
                <div className="text-xs font-bold text-[#1d1d1f]">+4 runs</div>
                <div className="text-[10px] font-mono font-bold text-[#0071e3] mt-0.5">100% Ingested</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Evidence Sources Breakdown */}
        <Link 
          href="/research/sources"
          className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between h-[300px] hover:border-[#34c759]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all group"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block mb-0.5">Telemetry</span>
                <span className="font-bold text-[#1d1d1f] text-sm group-hover:text-[#34c759] transition-colors">Evidence Sources</span>
              </div>
              <span className="px-2 py-0.5 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] text-[#15803d] text-[10px] font-mono font-bold">
                ▲ 15% Faster
              </span>
            </div>
            
            <div className="font-mono text-3xl font-extrabold tracking-tight text-[#1d1d1f] mb-4">
              100% Grounded
            </div>
          </div>

          <div className="space-y-3.5 pb-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1d1d1f] mb-1.5">
                <span>Web Extraction & Tech Specs</span>
                <span className="font-mono">65%</span>
              </div>
              <div className="h-2.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e5e5ea]">
                <div className="h-full w-[65%] rounded-full bg-[#34c759]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1d1d1f] mb-1.5">
                <span>YouTube Creator Intelligence</span>
                <span className="font-mono">25%</span>
              </div>
              <div className="h-2.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e5e5ea]">
                <div className="h-full w-[25%] rounded-full bg-[#0071e3]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-[#1d1d1f] mb-1.5">
                <span>Primary Lab & Benchmarks</span>
                <span className="font-mono">10%</span>
              </div>
              <div className="h-2.5 w-full bg-[#f5f5f7] rounded-full overflow-hidden border border-[#e5e5ea]">
                <div className="h-full w-[10%] rounded-full bg-[#ff9500]" />
              </div>
            </div>
          </div>
        </Link>

        {/* BOTTOM ROW */}
        
        {/* Card 5: Creator Benchmark Activity & Quick Research Launchpad */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-6 sm:p-7 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          
          <div className="flex justify-between items-start z-10 relative mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block mb-0.5">Benchmark Graph</span>
              <h3 className="font-bold text-[#1d1d1f] text-base">Creator Benchmark Activity</h3>
            </div>
            <DropdownMenu
              trigger={
                <button className="w-8 h-8 rounded-full border border-[#e5e5ea] flex items-center justify-center hover:bg-[#f5f5f7] text-[#8e8e93] transition">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
              items={cardActions}
            />
          </div>
          
          {/* Volumetric Visual Chart */}
          <div className="flex-1 relative w-full flex items-end justify-center pt-4 pb-6 min-h-[140px]">
            <div className="absolute left-0 top-2 bottom-6 flex flex-col justify-between text-[10px] font-mono font-semibold text-[#8e8e93]">
              <span>80k</span><span>60k</span><span>40k</span><span>20k</span>
            </div>

            <div className="w-full h-full flex items-end justify-around px-8 pl-14">
              <div className="w-[14%] h-[85%] bg-gradient-to-t from-[#34c759] to-[#86efac] rounded-t-lg shadow-sm relative border border-[#22c55e]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-1 bg-white rounded-full shadow-2xs" />
              </div>
              <div className="w-[14%] h-[60%] bg-gradient-to-t from-[#0071e3] to-[#7dd3fc] rounded-t-lg shadow-sm relative border border-[#0284c7]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-1 bg-white rounded-full shadow-2xs" />
              </div>
              <div className="w-[14%] h-[40%] bg-gradient-to-t from-[#ff9500] to-[#fde047] rounded-t-lg shadow-sm relative border border-[#f59e0b]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-1 bg-white rounded-full shadow-2xs" />
              </div>
              <div className="w-[14%] h-[25%] bg-gradient-to-t from-[#34c759] to-[#86efac] rounded-t-lg shadow-sm relative border border-[#22c55e]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-1 bg-white rounded-full shadow-2xs" />
              </div>
              <div className="w-[14%] h-[15%] bg-gradient-to-t from-[#0071e3] to-[#7dd3fc] rounded-t-lg shadow-sm relative border border-[#0284c7]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-1 bg-white rounded-full shadow-2xs" />
              </div>
            </div>
          </div>

          {/* Quick Launch & Prompt Input */}
          <div className="relative z-20 space-y-3 bg-[#f5f5f7]/80 backdrop-blur-sm rounded-2xl p-4 border border-[#e5e5ea]">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTemplate("Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max")}
                className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[11px] font-semibold text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] shadow-2xs transition"
              >
                Samsung S27 Ultra vs iPhone 18 Pro Max
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate("MacBook Pro 16 M5 Max vs Dell XPS 16")}
                className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[11px] font-semibold text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] shadow-2xs transition"
              >
                MacBook Pro 16 M5 Max vs Dell XPS 16
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate("RTX 5080 vs RX 8900 XTX 4K Gaming")}
                className="px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[11px] font-semibold text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] shadow-2xs transition"
              >
                RTX 5080 vs RX 8900 XTX 4K Gaming
              </button>
            </div>

            <form
              onSubmit={handleExploreSubmit}
              className="w-full flex items-center bg-white border border-[#d1d1d6] rounded-xl px-2.5 py-1.5 shadow-sm focus-within:border-[#0071e3] focus-within:ring-4 focus-within:ring-[#0071e3]/10 transition-all"
            >
              <Search className="w-4 h-4 text-[#8e8e93] ml-1.5 shrink-0" />
              <input 
                type="text" 
                value={exploreTopic}
                onChange={(e) => setExploreTopic(e.target.value)}
                placeholder="Enter topic (e.g. RTX 5090 thermals, Galaxy S27 camera benchmark)..."
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-1.5 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#8e8e93] font-medium"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Card 6: Quality Gate & Audit */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_14px_rgba(0,0,0,0.03)] min-h-[380px]">
          <div>
            <div className="bg-[#fffbeb] rounded-full px-3.5 py-1 text-xs font-bold font-mono inline-flex items-center gap-1.5 border border-[#fde68a] text-[#b45309] mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b45309]" /> Quality Gate & Audit
            </div>

            <div className="space-y-3 mb-6">
              <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1d1d1f]">
                96.8%
              </div>
              <p className="text-sm font-bold leading-relaxed text-[#1d1d1f]">
                All evidence claims passed multi-source verification.
              </p>
              <p className="text-xs text-[#6e6e73] leading-relaxed font-medium">
                0 critical contradictions detected. All citations are locked and ready for YouTube script & video production.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f7]">
            <div className="flex items-center gap-1.5 w-1/3">
              <div className="h-1.5 bg-[#34c759] rounded-full flex-1" />
              <div className="h-1.5 bg-[#e5e5ea] rounded-full w-2" />
              <div className="h-1.5 bg-[#e5e5ea] rounded-full w-2" />
            </div>
            
            <Link
              href="/content"
              className="bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#0071e3] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border border-[#c7d2fe]/80 active:scale-95"
            >
              Content Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
