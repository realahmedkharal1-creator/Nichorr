"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, ArrowRight, ShieldCheck, Layers, Loader2, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

function CreateResearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";

  const [topic, setTopic] = useState(initialTopic);
  const [objective, setObjective] = useState("");
  const [contentType, setContentType] = useState("Comparison");
  const [targetAudience, setTargetAudience] = useState("Technology Content Creators");
  const [requestedDepth, setRequestedDepth] = useState("Standard");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTopic && !topic) {
      setTopic(initialTopic);
      setObjective(`Perform in-depth technical evidence extraction and comparative analysis on ${initialTopic}.`);
    }
  }, [initialTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          objective: objective.trim() || topic.trim(),
          contentType,
          targetAudience,
          requestedDepth,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/research/${data.run.id}/config`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const setExample = (exTopic: string, exObj: string, type: string) => {
    setTopic(exTopic);
    setObjective(exObj);
    setContentType(type);
  };

  const steps = [
    { num: 1, label: "Topic & Goal" },
    { num: 2, label: "Extraction Plan" },
    { num: 3, label: "Evidence Ingestion" },
    { num: 4, label: "Intelligence Brief" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Step Progress Indicator Bar */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 sm:gap-4 bg-white border border-[#e5e5ea] rounded-full px-5 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-mono font-bold transition-all ${
                  s.num === 1
                    ? "bg-[#0071e3] text-white shadow-sm shadow-[#0071e3]/30"
                    : "bg-[#f5f5f7] text-[#8e8e93] border border-[#e5e5ea]"
                }`}
              >
                {s.num}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  s.num === 1 ? "text-[#1d1d1f]" : "text-[#8e8e93]"
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <span className="text-[#d1d1d6] mx-1 text-xs">/</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center space-y-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#15803d] text-[10px] font-mono font-bold border border-[#a7f3d0] uppercase tracking-widest mb-1 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" /> GUIDED INTELLIGENCE SETUP
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
          Create Research Run
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium max-w-xl mx-auto leading-relaxed">
          Define your research topic. Veritas will formulate multi-vector search plans, extract verified lab benchmarks, and construct traceable evidence graphs.
        </p>
      </div>

      {/* Preset Examples */}
      <div className="space-y-3">
        <label className="text-xs font-mono text-[#8e8e93] flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" /> Quick Start Benchmark Presets
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setExample(
              "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
              "Compare camera dynamic range, sustained thermal throttling under 4K video, battery endurance, and real-world value for a YouTube comparison video.",
              "Comparison"
            )}
            className="bg-white border border-[#e5e5ea] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_8px_20px_rgba(0,113,227,0.08)] hover:-translate-y-0.5 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-3 transition-all duration-200"
          >
            <span className="font-bold text-sm text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
              Galaxy S27 Ultra vs iPhone 18 Pro Max
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#8e8e93] border-t border-[#f5f5f7] pt-2 w-full">
              <span>FLAGSHIP SHOWDOWN</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#0071e3]" />
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setExample(
              "RTX 5090 vs RX 8900 XTX Power Efficiency & 4K Ray Tracing",
              "Measure wattage draw, DLSS 4 vs FSR 4 image quality, and 1% low frame time stability.",
              "Deep Dive"
            )}
            className="bg-white border border-[#e5e5ea] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_8px_20px_rgba(0,113,227,0.08)] hover:-translate-y-0.5 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-3 transition-all duration-200"
          >
            <span className="font-bold text-sm text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
              RTX 5090 vs RX 8900 XTX Power Efficiency
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#8e8e93] border-t border-[#f5f5f7] pt-2 w-full">
              <span>GPU BENCHMARKS</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#0071e3]" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setExample(
              "MacBook Pro 16 M5 Max vs Dell XPS 16 Sustained Thermals",
              "Audit Cinebench R24 multi-core power limits and fan acoustic decibels.",
              "Comparison"
            )}
            className="bg-white border border-[#e5e5ea] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_8px_20px_rgba(0,113,227,0.08)] hover:-translate-y-0.5 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-3 transition-all duration-200"
          >
            <span className="font-bold text-sm text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2">
              MacBook Pro M5 Max Sustained Thermals
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#8e8e93] border-t border-[#f5f5f7] pt-2 w-full">
              <span>LAPTOP THERMALS</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#0071e3]" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Creation Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#1d1d1f]">
            Primary Tech Topic <span className="text-[#ff3b30]">*</span>
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-[#8e8e93] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Apple M4 iPad Pro OLED Display Calibration & PWM..."
              className="w-full bg-[#fbfbfd] border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#1d1d1f]">
            Specific Research Objective & Focus Areas
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            placeholder="Specify what technical questions you need answered (e.g. wattage curves, throttling thresholds, frame time 1% lows)..."
            className="w-full bg-[#fbfbfd] border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 focus:bg-white rounded-2xl px-4 py-3 text-sm text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none transition-all shadow-2xs leading-relaxed"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-5 pt-4 border-t border-[#e5e5ea]">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-[#8e8e93]">
              Content Archetype
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-white border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option>Comparison</option>
              <option>Deep Dive</option>
              <option>Buying Guide</option>
              <option>News Analysis</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-[#8e8e93]">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-white border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option>Technology Content Creators</option>
              <option>Enthusiast / Prosumer</option>
              <option>General Consumer</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-[#8e8e93]">
              Research Depth
            </label>
            <select
              value={requestedDepth}
              onChange={(e) => setRequestedDepth(e.target.value)}
              className="w-full bg-white border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option>Standard</option>
              <option>Comprehensive (Lab Data)</option>
              <option>Forensic (Exhaustive)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e5e5ea]">
          <p className="text-xs text-[#6e6e73] flex items-center gap-2 font-medium">
            <Compass className="w-4 h-4 text-[#0071e3]" />
            Multi-vector search formulation takes ~30-60s.
          </p>
          <button
            type="submit"
            disabled={!topic.trim() || submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-sm shadow-[#0071e3]/20 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Pipeline...</span>
              </>
            ) : (
              <>
                <span>Continue to Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateResearchPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateResearchForm />
    </Suspense>
  );
}
