const fs = require('fs');
const content = "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ShieldCheck, ArrowRight, Layers, Globe, Filter, Loader2, Check } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ConfigPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [depth, setDepth] = useState("Standard");
  const [region, setRegion] = useState("US");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(\/api/research/\/status\)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRun(data.run);
          setDepth(data.run.requestedDepth || "Standard");
        } else {
          setError(data.error || "Research run configuration not found.");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch research configuration.");
      });
  }, [params.id]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-slate-200/90 shadow-sm rounded-3xl text-center space-y-4">
        <h2 className="text-lg font-bold text-rose-600">Configuration Load Error</h2>
        <p className="text-xs font-mono text-slate-500">{error}</p>
        <button
          onClick={() => router.push("/research/create")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold">
          Create New Research Run
        </button>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <SkeletonCard />
      </div>
    );
  }

  const handleProceed = () => {
    router.push(\/research/\/plan\);
  };

  const steps = [
    { num: 1, label: "Topic & Goal", done: true },
    { num: 2, label: "Configuration & Scope", active: true },
    { num: 3, label: "Question Plan" },
    { num: 4, label: "Execute" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-4 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-3">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all " + 
              (s.active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : s.done ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 border border-slate-200")
            }>
              {s.done ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={"text-sm font-bold hidden sm:inline " + (s.active || s.done ? "text-slate-900" : "text-slate-400")}>{s.label}</span>
            {idx < steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:inline ml-1" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 mb-2 inline-block">STAGE 1 / SCOPE & PARAMETERS</span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Scope & Protocol Settings</h1>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 shadow-inner">
          ID: <span className="text-slate-900">{run.id.slice(0, 14)}</span>
        </span>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-lg shadow-slate-200/50 p-6 sm:p-8 space-y-8">
        <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-inner">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> ACTIVE TARGET TOPIC</label>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">{run.topic}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 tracking-tight">Research Depth Tier</label>
            <div className="space-y-3">
              {[
                { name: "Quick", desc: "3-5 key queries, 10 primary sources. (~10s)" },
                { name: "Standard", desc: "8-12 queries, multi-vector search & synthesis. (~25s)" },
                { name: "Deep", desc: "Full audit, contrarian queries, community forum signals. (~45s)" }
              ].map((d) => (
                <label
                  key={d.name}
                  className={"flex items-start gap-4 p-4 rounded-[16px] border-2 cursor-pointer transition-all " + 
                    (depth === d.name ? "border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100" : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50")
                  }
                >
                  <input
                    type="radio"
                    name="depth"
                    value={d.name}
                    checked={depth === d.name}
                    onChange={(e) => setDepth(e.target.value)}
                    className="mt-1 accent-indigo-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className={"font-extrabold text-sm block " + (depth === d.name ? "text-indigo-950" : "text-slate-900")}>{d.name}</span>
                    <span className={"text-xs mt-1 block leading-relaxed font-medium " + (depth === d.name ? "text-indigo-700/80" : "text-slate-500")}>{d.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" /> Target Market / Regional Spec Aware
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-[16px] px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm cursor-pointer"
              >
                <option value="US">United States (Tier-1 Labs)</option>
                <option value="UK">United Kingdom / EU</option>
                <option value="Global">Global / Regional Variant Aware (Exynos vs Snapdragon)</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-5 space-y-3 shadow-inner">
              <div className="font-extrabold text-slate-700 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                <Filter className="w-4 h-4 text-indigo-500" /> Grounded Source Inclusions
              </div>
              <ul className="space-y-2 list-disc list-outside ml-4 text-slate-600 font-medium text-xs leading-relaxed">
                <li>Official manufacturer specs & whitepapers</li>
                <li>Independent lab benchmarks & thermal tests</li>
                <li>Reputable tech publications (AnandTech, GSMArena)</li>
                <li>Reddit & forum technical complaints</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-2 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 tracking-widest uppercase shadow-sm">
            <ShieldCheck className="w-4 h-4" /> REPRODUCIBLE RESEARCH PROTOCOL
          </span>
          <button
            onClick={handleProceed}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-extrabold text-sm shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            Review Question Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
fs.writeFileSync('src/app/research/[id]/config/page.tsx', content);
