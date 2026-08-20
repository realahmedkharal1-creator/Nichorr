"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ShieldCheck, ArrowRight, Layers, Globe, Filter, Loader2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ConfigPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [depth, setDepth] = useState("Standard");
  const [region, setRegion] = useState("US");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
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
      <div className="max-w-xl mx-auto my-12 p-6 slate-card text-center space-y-4">
        <h2 className="text-lg font-bold text-rose-400">Configuration Load Error</h2>
        <p className="text-xs font-mono text-slate-400">{error}</p>
        <button
          onClick={() => router.push("/research/create")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
        >
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
    router.push(`/research/${params.id}/plan`);
  };

  const steps = [
    { num: 1, label: "Topic & Goal", done: true },
    { num: 2, label: "Configuration & Scope", active: true },
    { num: 3, label: "Question Plan" },
    { num: 4, label: "Execute" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Step Progress Indicator Bar */}
      <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              s.active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : s.done ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}>
              {s.done ? "✓" : s.num}
            </div>
            <span className="text-xs font-medium hidden sm:inline text-slate-300">{s.label}</span>
            {idx < steps.length - 1 && <span className="text-slate-700 text-xs hidden sm:inline">→</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">STAGE 1 / SCOPE & PARAMETERS</span>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Research Scope & Protocol Settings</h1>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
          ID: {run.id.slice(0, 14)}
        </span>
      </div>

      <div className="slate-card p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">ACTIVE TARGET TOPIC</label>
          <p className="text-xl font-bold text-slate-100 leading-snug">{run.topic}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 border-t border-slate-850 pt-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-200">Research Depth Tier</label>
            <div className="space-y-2.5">
              {[
                { name: "Quick", desc: "3-5 key queries, 10 primary sources. (~10s)" },
                { name: "Standard", desc: "8-12 queries, multi-vector search & synthesis. (~25s)" },
                { name: "Deep", desc: "Full audit, contrarian queries, community forum signals. (~45s)" }
              ].map((d) => (
                <label
                  key={d.name}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    depth === d.name ? 'border-indigo-500/80 bg-indigo-950/40 shadow-sm text-indigo-200' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="depth"
                    value={d.name}
                    checked={depth === d.name}
                    onChange={(e) => setDepth(e.target.value)}
                    className="mt-1 accent-indigo-500"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-200 block">{d.name}</span>
                    <span className="text-xs text-slate-400 leading-normal">{d.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" /> Target Market / Regional Spec Aware
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="US">United States (Tier-1 Labs)</option>
                <option value="UK">United Kingdom / EU</option>
                <option value="Global">Global / Regional Variant Aware (Exynos vs Snapdragon)</option>
              </select>
            </div>

            <div className="slate-card p-4 bg-slate-950/60 border-slate-850 space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono text-[11px] uppercase">
                <Filter className="w-3.5 h-3.5 text-indigo-400" /> Grounded Source Inclusions
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-400 font-mono text-[11px]">
                <li>Official manufacturer specs & whitepapers</li>
                <li>Independent lab benchmarks & thermal tests</li>
                <li>Reputable tech publications (AnandTech, GSMArena)</li>
                <li>Reddit & forum technical complaints</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-850 pt-5 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4" /> REPRODUCIBLE RESEARCH PROTOCOL
          </span>
          <button
            onClick={handleProceed}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
          >
            Review Question Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

