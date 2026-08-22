"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ShieldCheck, ArrowRight, Layers, Globe, Filter, Loader2, Check } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

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
      <div className="max-w-xl mx-auto my-12 p-6 bg-white border border-[#e5e5ea] shadow-sm rounded-3xl text-center space-y-4">
        <h2 className="text-base font-bold text-[#ff3b30]">Configuration Load Error</h2>
        <p className="text-xs font-mono text-[#8e8e93]">{error}</p>
        <button
          onClick={() => router.push("/research/create")}
          className="px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold"
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
    <div className="max-w-3xl mx-auto space-y-6 py-2 font-sans">
      {/* Stepped Progress Bar */}
      <div className="bg-white rounded-full border border-[#e5e5ea] shadow-[0_2px_10px_rgba(0,0,0,0.03)] px-6 py-3 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                s.active
                  ? "bg-[#0071e3] text-white shadow-sm shadow-[#0071e3]/30"
                  : s.done
                  ? "bg-[#34c759] text-white shadow-2xs"
                  : "bg-[#f5f5f7] text-[#8e8e93] border border-[#e5e5ea]"
              }`}
            >
              {s.done ? <Check className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                s.active || s.done ? "text-[#1d1d1f]" : "text-[#8e8e93]"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-[#d1d1d6] hidden sm:inline ml-1" />
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#e5e5ea] pb-4 gap-3">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            STAGE 2 / SCOPE & PROTOCOL
          </span>
          <h1 className="text-2xl font-extrabold text-[#1d1d1f] tracking-tight">
            Research Scope & Parameters
          </h1>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-white border border-[#e5e5ea] rounded-full text-[#6e6e73] shadow-2xs">
          RUN: <strong className="text-[#1d1d1f]">{run.id.slice(0, 8)}</strong>
        </span>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-5">
          <label className="text-[10px] font-mono text-[#8e8e93] uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0071e3]" /> ACTIVE TARGET TOPIC
          </label>
          <p className="text-lg sm:text-xl font-bold text-[#1d1d1f] leading-snug">
            {run.topic}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 border-t border-[#f5f5f7] pt-6">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#1d1d1f]">
              Research Depth Tier
            </label>
            <div className="space-y-2.5">
              {[
                { name: "Quick", desc: "3-5 key queries, 10 primary sources. (~10s)" },
                { name: "Standard", desc: "8-12 queries, multi-vector search & synthesis. (~25s)" },
                { name: "Deep", desc: "Full audit, contrarian queries, community forum signals. (~45s)" },
              ].map((d) => (
                <label
                  key={d.name}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    depth === d.name
                      ? "border-[#0071e3] bg-[#eef2ff]/40 shadow-sm"
                      : "border-[#e5e5ea] hover:border-[#d1d1d6] bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="depth"
                    value={d.name}
                    checked={depth === d.name}
                    onChange={(e) => setDepth(e.target.value)}
                    className="mt-0.5 accent-[#0071e3] w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#1d1d1f] block">{d.name}</span>
                    <span className="text-[11px] mt-0.5 block leading-relaxed text-[#6e6e73]">
                      {d.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0071e3]" /> Target Market / Region Spec Aware
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-xs text-[#1d1d1f] font-semibold focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 cursor-pointer shadow-2xs"
              >
                <option value="US">United States (Tier-1 Labs)</option>
                <option value="UK">United Kingdom / EU</option>
                <option value="Global">Global / Regional Variant Aware (Exynos vs Snapdragon)</option>
              </select>
            </div>

            <div className="bg-[#fbfbfd] border border-[#e5e5ea] rounded-2xl p-4 space-y-2.5">
              <div className="font-bold text-[#1d1d1f] flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-[#0071e3]" /> Grounded Source Inclusions
              </div>
              <ul className="space-y-1.5 list-disc list-outside ml-4 text-[#6e6e73] font-medium text-xs leading-relaxed">
                <li>Official manufacturer specs & whitepapers</li>
                <li>Independent lab benchmarks & thermal tests</li>
                <li>Reputable tech publications (AnandTech, GSMArena)</li>
                <li>Reddit & forum technical complaints</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f5f5f7] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Badge variant="success" size="sm">
            <ShieldCheck className="w-3.5 h-3.5" /> REPRODUCIBLE RESEARCH PROTOCOL
          </Badge>
          <button
            onClick={handleProceed}
            className="flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full font-semibold text-xs shadow-sm shadow-[#0071e3]/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>Review Question Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
