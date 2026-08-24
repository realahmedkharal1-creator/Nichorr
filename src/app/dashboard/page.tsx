"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [exploreTopic, setExploreTopic] = useState("");

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
          <span className="text-[12.5px] font-semibold text-muted bg-card border border-line px-[14px] py-[8px] rounded-[9px]">Jan 01 – Jul 31</span>
          <span className="text-[12.5px] font-semibold text-muted bg-card border border-line px-[14px] py-[8px] rounded-[9px]">Daily ▾</span>
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
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Research Velocity</div>
          <svg viewBox="0 0 460 172" style={{ width: '100%', height: 'auto', marginTop: '6px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="barPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3D63A0"/>
                <stop offset="100%" stopColor="#22385A"/>
              </linearGradient>
              <linearGradient id="barSoft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D7E1EC"/>
                <stop offset="100%" stopColor="#E9EEF4"/>
              </linearGradient>
            </defs>
            <line x1="16" y1="140" x2="444" y2="140" stroke="#E8EAE7" strokeWidth="1"/>
            <rect x="31" y="101.5" width="48" height="38.5" rx="7" fill="url(#barSoft)"/>
            <rect x="101" y="82.8" width="48" height="57.2" rx="7" fill="url(#barSoft)"/>
            <rect x="171" y="54.2" width="48" height="85.8" rx="7" fill="url(#barPeak)"/>
            <rect x="241" y="74" width="48" height="66" rx="7" fill="url(#barSoft)"/>
            <rect x="311" y="91.6" width="48" height="48.4" rx="7" fill="url(#barSoft)"/>
            <rect x="381" y="65.2" width="48" height="74.8" rx="7" fill="url(#barSoft)"/>
            <polyline points="55,101.5 125,82.8 195,54.2 265,74 335,91.6 405,65.2" fill="none" stroke="#1E7A5F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.55" strokeDasharray="1 6"/>
            <circle cx="55" cy="101.5" r="3" fill="#1E7A5F" opacity="0.7"/>
            <circle cx="125" cy="82.8" r="3" fill="#1E7A5F" opacity="0.7"/>
            <circle cx="195" cy="54.2" r="3.5" fill="#1E7A5F"/>
            <circle cx="265" cy="74" r="3" fill="#1E7A5F" opacity="0.7"/>
            <circle cx="335" cy="91.6" r="3" fill="#1E7A5F" opacity="0.7"/>
            <circle cx="405" cy="65.2" r="3" fill="#1E7A5F" opacity="0.7"/>
            <line x1="195" y1="42" x2="195" y2="52" stroke="#2C4A73" strokeWidth="1.5"/>
            <rect x="160" y="12" width="70" height="26" rx="13" fill="#12161C"/>
            <text x="195" y="29" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fontWeight="600" fill="#F3F5F4">18 runs</text>
            <text x="55" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8A8F96">JAN</text>
            <text x="125" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8A8F96">FEB</text>
            <text x="195" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#2C4A73" fontWeight="600">MAR</text>
            <text x="265" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8A8F96">APR</text>
            <text x="335" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8A8F96">MAY</text>
            <text x="405" y="156" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#8A8F96">JUN</text>
          </svg>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Verified Claims</div>
          <div className="font-serif font-semibold text-[34px] leading-none text-ink">106</div>
          <div className="text-[12.5px] text-muted mt-[8px]"><span className="text-verified font-semibold">+24</span> vs last week</div>
        </Card>
        <Card>
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Active Research Runs</div>
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
          <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-[#9AA4AF] mb-[10px]">Quality Gate & Audit</div>
          <div className="font-serif font-semibold text-[44px]">96.8%</div>
          <div className="bg-white/15 rounded-[6px] h-[6px] w-full max-w-[280px] overflow-hidden mt-[10px]">
            <div className="h-full bg-verified rounded-[6px]" style={{ width: '96.8%' }}></div>
          </div>
        </div>
        <div className="max-w-[280px] text-[13px] text-[#C4C8CD]">
          All evidence claims passed multi-source verification. 0 critical contradictions detected.
        </div>
        <Button onClick={() => router.push('/content')} className="bg-paper text-ink hover:opacity-90">
          Content Board →
        </Button>
      </div>
    </div>
  );
}
