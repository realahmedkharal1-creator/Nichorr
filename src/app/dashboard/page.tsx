"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InfoTooltip } from "@/components/ui/Tooltip";

const chartData = [
  { index: 0, month: 'JAN', runs: 8, x: 31, cx: 55, y: 101.5, height: 38.5 },
  { index: 1, month: 'FEB', runs: 12, x: 101, cx: 125, y: 82.8, height: 57.2 },
  { index: 2, month: 'MAR', runs: 18, x: 171, cx: 195, y: 54.2, height: 85.8, isPeak: true },
  { index: 3, month: 'APR', runs: 14, x: 241, cx: 265, y: 74, height: 66 },
  { index: 4, month: 'MAY', runs: 10, x: 311, cx: 335, y: 91.6, height: 48.4 },
  { index: 5, month: 'JUN', runs: 16, x: 381, cx: 405, y: 65.2, height: 74.8 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [exploreTopic, setExploreTopic] = useState("");
  
  const [dateRange, setDateRange] = useState("Jan 01 – Jul 31");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  
  const [period, setPeriod] = useState("Daily");
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
  
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const handleExploreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exploreTopic.trim()) {
      router.push(`/research/create?topic=${encodeURIComponent(exploreTopic.trim())}`);
    } else {
      router.push('/research/create');
    }
  };

  const handleQuickTemplate = (topic: string) => {
    router.push(`/research/create?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto pt-[28px] px-[20px] pb-[60px]">
      <div className="flex items-end justify-between gap-[16px] flex-col md:flex-row mb-[24px] md:items-end">
        <h1 className="font-serif font-semibold text-[30px] m-0 self-start md:self-auto">Overview</h1>
        <div className="flex gap-[10px] flex-wrap items-center justify-between w-full md:w-auto">
          <div className="relative">
            <button 
              onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsPeriodMenuOpen(false); }}
              className="text-[12.5px] font-semibold text-muted bg-card border border-line px-[14px] py-[8px] rounded-[9px] cursor-pointer"
            >
              {dateRange}
            </button>
            {isDateMenuOpen && (
              <div className="absolute top-full mt-1 w-[140px] bg-card border border-line rounded-[9px] shadow-sm z-10 py-1">
                {["Last 30 days", "Last 90 days", "Jan 01 – Jul 31"].map(opt => (
                  <div key={opt} onClick={() => { setDateRange(opt); setIsDateMenuOpen(false); }} className="px-3 py-2 text-[12.5px] text-ink hover:bg-paper cursor-pointer font-medium">
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => { setIsPeriodMenuOpen(!isPeriodMenuOpen); setIsDateMenuOpen(false); }}
              className="text-[12.5px] font-semibold text-muted bg-card border border-line px-[14px] py-[8px] rounded-[9px] cursor-pointer"
            >
              {period} ▾
            </button>
            {isPeriodMenuOpen && (
              <div className="absolute top-full mt-1 w-[100px] bg-card border border-line rounded-[9px] shadow-sm z-10 py-1">
                {["Daily", "Weekly", "Monthly"].map(opt => (
                  <div key={opt} onClick={() => { setPeriod(opt); setIsPeriodMenuOpen(false); }} className="px-3 py-2 text-[12.5px] text-ink hover:bg-paper cursor-pointer font-medium">
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => router.push('/research/create')} className="whitespace-nowrap w-full md:w-auto text-center py-[13px] md:py-[10px]">
            + New Research
          </Button>
        </div>
      </div>

      <span className="inline-flex items-center gap-[6px] bg-warning-bg text-warning font-mono text-[11px] font-semibold px-[11px] py-[5px] rounded-full mb-[20px]">
        <span className="w-[6px] h-[6px] rounded-full bg-warning"></span>SAMPLE DATA — connect your account to see live numbers
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-[18px] mb-[18px]">
        <Card className="flex flex-col">
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Research Velocity <InfoTooltip content="The number of research runs you complete over time." /></div>
          <svg viewBox="0 0 460 172" style={{ width: '100%', height: 'auto', marginTop: '6px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="barPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2836F"/>
                <stop offset="100%" stopColor="#D94E37"/>
              </linearGradient>
              <linearGradient id="barSoft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F6DDD5"/>
                <stop offset="100%" stopColor="#FDECE7"/>
              </linearGradient>
            </defs>
            <line x1="16" y1="140" x2="444" y2="140" stroke="#E7E4DF" strokeWidth="1"/>
            
            {chartData.map((d) => (
              <g 
                key={d.month}
                onMouseEnter={() => setHoveredBar(d.index)}
                onMouseLeave={() => setHoveredBar(null)}
                className="cursor-pointer transition-opacity outline-none"
                tabIndex={0}
                onFocus={() => setHoveredBar(d.index)}
                onBlur={() => setHoveredBar(null)}
              >
                {/* Transparent overlay for easier hover targets */}
                <rect x={d.x} y={10} width="48" height={130} fill="transparent" />
                <rect x={d.x} y={d.y} width="48" height={d.height} rx="7" fill={d.isPeak ? "url(#barPeak)" : "url(#barSoft)"}/>
              </g>
            ))}

            <polyline points={chartData.map(d => `${d.cx},${d.y}`).join(' ')} fill="none" stroke="#1E8F6B" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.55" strokeDasharray="1 6"/>

            {chartData.map((d) => (
              <circle key={`dot-${d.month}`} cx={d.cx} cy={d.y} r={d.isPeak ? 3.5 : 3} fill="#1E8F6B" opacity={d.isPeak ? 1 : 0.7}/>
            ))}

            {chartData.map((d) => (
              <text key={`label-${d.month}`} x={d.cx} y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill={d.isPeak ? "#EF6351" : "#9A9EA1"} fontWeight={d.isPeak ? "600" : "normal"}>
                {d.month}
              </text>
            ))}

            {/* Static Label for Peak (Always Visible) */}
            <line x1="195" y1="42" x2="195" y2="52" stroke="#EF6351" strokeWidth="1.5"/>
            <rect x="160" y="12" width="70" height="26" rx="13" fill="#121214"/>
            <text x="195" y="29" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fontWeight="600" fill="#FAF9F7">18 runs</text>

            {/* Dynamic Tooltip */}
            {hoveredBar !== null && hoveredBar !== 2 && (
              <g className="pointer-events-none">
                <line x1={chartData[hoveredBar].cx} y1={chartData[hoveredBar].y - 12.2} x2={chartData[hoveredBar].cx} y2={chartData[hoveredBar].y - 2.2} stroke="#EF6351" strokeWidth="1.5"/>
                <rect x={chartData[hoveredBar].cx - 35} y={chartData[hoveredBar].y - 42.2} width="70" height="26" rx="13" fill="#121214"/>
                <text x={chartData[hoveredBar].cx} y={chartData[hoveredBar].y - 25.2} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fontWeight="600" fill="#FAF9F7">
                  {chartData[hoveredBar].runs} runs
                </text>
              </g>
            )}
          </svg>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Verified Claims <InfoTooltip content="Total number of evidence-backed claims successfully extracted and verified." /></div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">106</div>
          <div className="text-[12.5px] text-muted mt-[8px]"><span className="text-verified font-semibold">+24</span> vs last week</div>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Active Research Runs <InfoTooltip content="Research runs that are currently in progress or awaiting review." /></div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">12</div>
          <div className="text-[12.5px] text-muted mt-[8px]"><span className="text-verified font-semibold">+4</span> vs last week</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px] mb-[18px]">
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Evidence Sources</div>
          <div className="flex justify-between items-center mb-[10px] text-[12.5px] text-ink">
            <span>Web Extraction & Tech Specs</span><span className="font-mono">65%</span>
          </div>
          <div className="bg-line-soft rounded-[6px] h-[6px] overflow-hidden mb-[14px]">
            <div className="h-full rounded-[6px] bg-citation" style={{ width: '65%' }}></div>
          </div>
          
          <div className="flex justify-between items-center mb-[10px] text-[12.5px] text-ink">
            <span>YouTube Creator Intelligence</span><span className="font-mono">25%</span>
          </div>
          <div className="bg-line-soft rounded-[6px] h-[6px] overflow-hidden mb-[14px]">
            <div className="h-full rounded-[6px] bg-verified" style={{ width: '25%' }}></div>
          </div>
          
          <div className="flex justify-between items-center mb-[10px] text-[12.5px] text-ink">
            <span>Primary Lab & Benchmarks</span><span className="font-mono">10%</span>
          </div>
          <div className="bg-line-soft rounded-[6px] h-[6px] overflow-hidden">
            <div className="h-full rounded-[6px] bg-warning" style={{ width: '10%' }}></div>
          </div>
        </Card>
        
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Quick-Start Research</div>
          <div className="flex gap-[8px] flex-wrap mb-[12px]">
            <button onClick={() => handleQuickTemplate("Galaxy S27 vs iPhone 18")} className="text-[12px] font-semibold text-citation bg-citation-bg px-[12px] py-[7px] rounded-[20px] border-none cursor-pointer">
              Galaxy S27 vs iPhone 18
            </button>
            <button onClick={() => handleQuickTemplate("RTX 5090 thermals")} className="text-[12px] font-semibold text-citation bg-citation-bg px-[12px] py-[7px] rounded-[20px] border-none cursor-pointer">
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
              Explore →
            </Button>
          </form>
        </Card>
      </div>

      <div className="bg-ink text-paper rounded-[16px] p-[24px] flex items-center justify-between gap-[20px] flex-wrap">
        <div>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-white/50 mb-[10px]">Quality Gate & Audit <InfoTooltip content="Percentage of generated content that passes all automated safety and accuracy checks." /></div>
          <div className="font-serif font-semibold text-[44px]">96.8%</div>
          <div className="bg-white/15 rounded-[6px] h-[6px] w-full max-w-[280px] overflow-hidden mt-[10px]">
            <div className="h-full bg-verified rounded-[6px]" style={{ width: '96.8%' }}></div>
          </div>
        </div>
        <div className="max-w-[280px] text-[13px] text-white/65">
          All evidence claims passed multi-source verification. 0 critical contradictions detected.
        </div>
        <Button onClick={() => router.push('/content')} variant="light">
          Content Board →
        </Button>
      </div>
    </div>
  );
}

