"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Link as LinkIcon, MoreHorizontal, Lightbulb, ArrowRight, ChevronDown, Calendar, Search } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [exploreTopic, setExploreTopic] = useState("");
  
  // State for simple interactive dropdowns
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
      router.push('/research/create');
    }
  };

  const handleQuickTemplate = (topic: string) => {
    router.push(`/research/create?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-12">
      
      {/* Page Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-2 z-20 relative">
        <div className="flex items-center gap-2">
          <h1 className="font-mono text-4xl font-semibold tracking-tight text-slate-900">
            Overview
          </h1>
          <div className="w-6 h-6 rounded-full border border-slate-200/90 flex items-center justify-center -mt-4 shadow-sm bg-white">
             <LinkIcon className="w-3 h-3 text-slate-500" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center bg-white border border-slate-200/90 rounded-xl shadow-sm shadow-slate-200/70">
             
             {/* Dropdown 1 */}
             <div className="relative">
               <button onClick={() => setShowDate1(!showDate1)} className="px-3 py-2 hover:bg-slate-50 rounded-l-xl flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {date1} <ChevronDown className="w-3 h-3 text-slate-500" />
               </button>
               {showDate1 && (
                 <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1">
                   {["Jan 01 - July 31", "Feb 01 - Mar 31", "Year to Date"].map(d => (
                     <button key={d} onClick={() => {setDate1(d); setShowDate1(false);}} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700">{d}</button>
                   ))}
                 </div>
               )}
             </div>

             <div className="px-3 py-2 border-x border-slate-200/90 text-slate-500 bg-slate-50/50">
                compared to
             </div>
             
             {/* Dropdown 2 */}
             <div className="relative">
               <button onClick={() => setShowDate2(!showDate2)} className="px-3 py-2 hover:bg-slate-50 rounded-r-xl flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {date2} <ChevronDown className="w-3 h-3 text-slate-500" />
               </button>
               {showDate2 && (
                 <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1">
                   {["Aug 01 - Dec 31", "Previous Year", "All Time"].map(d => (
                     <button key={d} onClick={() => {setDate2(d); setShowDate2(false);}} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700">{d}</button>
                   ))}
                 </div>
               )}
             </div>
          </div>
          
          {/* Dropdown 3 */}
          <div className="relative">
             <button onClick={() => setShowPeriod(!showPeriod)} className="px-4 py-2 bg-white border border-slate-200/90 rounded-xl shadow-sm shadow-slate-200/70 hover:bg-slate-50 flex items-center gap-2">
                {period} <ChevronDown className="w-3 h-3 text-slate-500" />
             </button>
             {showPeriod && (
               <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1">
                 {["Daily", "Weekly", "Monthly"].map(p => (
                   <button key={p} onClick={() => {setPeriod(p); setShowPeriod(false);}} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700">{p}</button>
                 ))}
               </div>
             )}
          </div>

          <Link href="/research/create" className="px-4 py-2 bg-white border border-slate-200/90 rounded-xl shadow-sm shadow-slate-200/70 hover:bg-slate-50 flex items-center gap-1.5 transition text-slate-700">
             New Research <span className="text-lg leading-none font-light">+</span>
          </Link>
        </div>
      </div>

      {/* 12-Column Bento Grid */}
      <div className="grid grid-cols-12 gap-5 relative z-10">
        
        {/* Card 1: Retention -> Research Velocity */}
        <div 
          onClick={() => router.push('/research/history')}
          className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 shadow-sm shadow-slate-200/70 p-6 flex flex-col justify-between h-[280px] cursor-pointer hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="flex justify-between items-start">
             <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">Research Velocity</span>
             <button onClick={() => alert("Action menu opened.")} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500">
                <MoreHorizontal className="w-3 h-3" />
             </button>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-[2px] mt-6 mb-3">
             {[30,40,45,35,40,60,70,65,75,80,60,65,70,50,45,40,60,50,55].map((h, i) => (
                <div key={i} className="w-full bg-rose-400 rounded-t-sm opacity-90" style={{ height: `${h}%` }}></div>
             ))}
          </div>

          <div className="flex justify-between items-center">
             <div className="flex gap-2 text-[9px] font-mono text-slate-500 uppercase font-semibold">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
             </div>
             <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">100% Audited</span>
          </div>
        </div>

        {/* Card 2 & 3: Double Stacked Stats */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 h-[280px]">
          
          {/* Top: Verified Claims */}
          <div 
            onClick={() => router.push('/research/quality')}
            className="flex-1 bg-white rounded-[24px] border border-slate-200/90 shadow-sm shadow-slate-200/70 p-5 flex flex-col justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start">
               <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">Verified Claims</span>
               <button onClick={() => alert("Action menu opened.")} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500">
                  <MoreHorizontal className="w-3 h-3" />
               </button>
            </div>
            {/* Fixed Alignment: Big number Left, Matrix Center, Delta Right */}
            <div className="flex items-end justify-between mt-2">
               <div className="w-1/3 text-left">
                  <div className="font-mono text-4xl font-bold tracking-tight text-slate-900">106</div>
                  <div className="text-[10px] text-slate-500 font-medium">Claim-to-source traced</div>
               </div>
               
               <div className="w-1/3 flex flex-col items-center pb-1">
                  <span className="text-[8px] font-mono border border-slate-200 bg-slate-50 rounded-full px-2 py-0.5 text-slate-600 mb-2 whitespace-nowrap">Peak: Hardware</span>
                  <div className="flex items-end gap-1">
                    {[1,2,4,3,2,1].map((cols, i) => (
                      <div key={i} className="flex flex-col gap-0.5 justify-end h-7">
                         {Array.from({length: cols}).map((_, j) => (
                           <div key={j} className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         ))}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="w-1/3 text-right">
                  <div className="text-[10px] text-slate-500 mb-0.5">vs last week</div>
                  <div className="text-sm font-bold text-emerald-600">+24 claims</div>
                  <div className="text-[9px] font-bold text-emerald-500 mt-1">0 Hallucinations</div>
               </div>
            </div>
          </div>

          {/* Bottom: Active Research Runs */}
          <div 
            onClick={() => router.push('/projects')}
            className="flex-1 bg-white rounded-[24px] border border-slate-200/90 shadow-sm shadow-slate-200/70 p-5 flex flex-col justify-between cursor-pointer hover:border-indigo-300 hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start">
               <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">Active Research Runs</span>
               <button onClick={() => alert("Action menu opened.")} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500">
                  <MoreHorizontal className="w-3 h-3" />
               </button>
            </div>
            <div className="flex items-end justify-between mt-2">
               <div className="w-1/3 text-left">
                  <div className="font-mono text-4xl font-bold tracking-tight text-slate-900">12</div>
                  <div className="text-[10px] text-slate-500 font-medium">Active creator sessions</div>
               </div>
               
               <div className="w-1/3 flex flex-col items-center pb-1">
                  <span className="text-[8px] font-mono border border-slate-200 bg-slate-50 rounded-full px-2 py-0.5 text-slate-600 mb-2 whitespace-nowrap">Peak: Flagship</span>
                  <div className="flex items-end gap-1">
                    {[1,1,2,3,1,1].map((cols, i) => (
                      <div key={i} className="flex flex-col gap-0.5 justify-end h-7">
                         {Array.from({length: cols}).map((_, j) => (
                           <div key={j} className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                         ))}
                      </div>
                    ))}
                  </div>
               </div>

               <div className="w-1/3 text-right">
                  <div className="text-[10px] text-slate-500 mb-0.5">vs last week</div>
                  <div className="text-sm font-bold text-slate-900">+4</div>
               </div>
            </div>
          </div>
        </div>

        {/* Card 4: Evidence Sources (Col-Span 4) */}
        <Link 
          href="/research/sources"
          className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-sm shadow-slate-200/70 p-6 flex flex-col h-[280px] hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="flex justify-between items-start mb-4">
             <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">Evidence Sources</span>
             <div className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-slate-50">
                <MoreHorizontal className="w-3 h-3" />
             </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-mono">100% Grounded</h2>
            <div className="px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center shadow-sm">
               ▲ 15% Faster
            </div>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-end pb-2">
            <div>
               <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-2">
                 <span>Web Extraction & Tech Specs</span>
                 <span>65%</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full w-[65%] rounded-full pattern-diagonal-stripes-green border-r border-emerald-500"></div>
               </div>
            </div>
            <div>
               <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-2">
                 <span>YouTube Creator Intelligence</span>
                 <span>25%</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full w-[25%] rounded-full pattern-diagonal-stripes-blue border-r border-blue-500"></div>
               </div>
            </div>
            <div>
               <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-2">
                 <span>Primary Lab & Benchmarks</span>
                 <span>10%</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <div className="h-full w-[10%] rounded-full pattern-diagonal-stripes-pink border-r border-pink-500"></div>
               </div>
            </div>
          </div>
        </Link>

        {/* BOTTOM ROW */}
        
        {/* Card 5: Benchmark Activity (Col-Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm shadow-slate-200/70 p-6 flex flex-col justify-between h-[380px] relative">
           
           {/* Top Content */}
           <div className="flex justify-between items-start z-10 relative">
             <span className="font-bold text-slate-900 text-sm">Creator Benchmark Activity</span>
             <button onClick={() => alert("Action menu opened.")} className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 bg-white shadow-sm">
                <MoreHorizontal className="w-3 h-3" />
             </button>
           </div>
           
           {/* The Volume Chart Container - Positioned to not overlap bottom */}
           <div className="flex-1 relative w-full flex items-end justify-center pt-8 pb-4">
               {/* Y-Axis */}
               <div className="absolute left-0 top-4 bottom-4 flex flex-col justify-between text-[9px] font-mono text-slate-500">
                  <span>80k</span><span>70k</span><span>60k</span><span>50k</span><span>40k</span>
               </div>

               {/* Volumetric Blocks */}
               <div className="w-full h-full flex items-end justify-around px-12 pl-16 z-0">
                  <div className="w-[15%] h-[85%] bg-gradient-to-t from-emerald-500 to-lime-300 rounded-t-sm shadow-xl relative border border-emerald-400"><div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/70 rounded-full"></div></div>
                  <div className="w-[15%] h-[55%] bg-gradient-to-t from-emerald-500 to-lime-300 rounded-t-sm shadow-xl relative border border-emerald-400"><div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/70 rounded-full"></div></div>
                  <div className="w-[15%] h-[35%] bg-gradient-to-t from-emerald-500 to-lime-300 pattern-diagonal-stripes-green rounded-t-sm shadow-xl relative border border-emerald-400"><div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/70 rounded-full"></div></div>
                  <div className="w-[15%] h-[20%] bg-gradient-to-t from-emerald-500 to-lime-300 rounded-t-sm shadow-xl relative border border-emerald-400"><div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/70 rounded-full"></div></div>
                  <div className="w-[15%] h-[12%] bg-gradient-to-t from-emerald-500 to-lime-300 rounded-t-sm shadow-xl relative border border-emerald-400"><div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/70 rounded-full"></div></div>
               </div>
           </div>

           {/* Bottom Interaction Area - NO ABSOLUTE OVERLAP */}
           <div className="relative z-20 mt-2 space-y-3 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm shadow-slate-200/50">
              
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleQuickTemplate("Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm transition">
                   Samsung S27 Ultra vs iPhone 18 Pro Max
                </button>
                <button onClick={() => handleQuickTemplate("MacBook Pro 16 M5 Max vs Dell XPS 16")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm transition">
                   MacBook Pro 16 M5 Max vs Dell XPS 16
                </button>
                <button onClick={() => handleQuickTemplate("RTX 5080 vs RX 8900 XTX 4K Gaming")} className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm transition">
                   RTX 5080 vs RX 8900 XTX 4K Gaming
                </button>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-800 mb-1.5 ml-1">What technology topic would you like to research next?</p>
                <form onSubmit={handleExploreSubmit} className="w-full flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                   <Search className="w-3.5 h-3.5 text-slate-500 ml-2 shrink-0" />
                   <input 
                     type="text" 
                     value={exploreTopic}
                     onChange={(e) => setExploreTopic(e.target.value)}
                     placeholder="Enter topic (e.g. RTX 5090 thermals, Galaxy S27 camera benchmark)..."
                     className="flex-1 bg-transparent border-none focus:outline-none px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 font-medium"
                   />
                   <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md transition flex items-center gap-1.5 shrink-0">
                     Explore <ArrowRight className="w-3 h-3" />
                   </button>
                </form>
              </div>
           </div>
        </div>

        {/* Card 6: Quality Gate (Col-Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200/90 text-slate-900 rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between shadow-sm h-[380px]">
           <div className="bg-amber-50 rounded-full px-4 py-1.5 text-xs font-bold self-start flex items-center gap-1.5 border border-amber-200 shadow-sm text-amber-600">
             <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Quality Gate & Audit
           </div>

           <div className="space-y-4 mb-4 mt-8">
             <div className="font-mono text-6xl font-bold tracking-tight text-slate-900">96.8%</div>
             <p className="text-base font-bold leading-relaxed text-slate-700 pr-4">
               All evidence claims passed multi-source verification.
             </p>
             <p className="text-sm text-slate-500 pr-4 leading-relaxed font-medium">
               0 critical contradictions detected. All citations are locked and ready for YouTube script & video production.
             </p>
           </div>

           <div className="flex items-center justify-between mt-auto">
             <div className="flex items-center gap-1.5 w-1/2">
               <div className="h-1.5 bg-emerald-500 rounded-full flex-1 shadow-sm"></div>
               <div className="h-1.5 bg-slate-200 rounded-full w-2"></div>
               <div className="h-1.5 bg-slate-200 rounded-full w-2"></div>
             </div>
             
             <Link href="/content" className="bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-indigo-200 whitespace-nowrap text-indigo-700">
                Content Board <ArrowRight className="w-3.5 h-3.5" />
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
