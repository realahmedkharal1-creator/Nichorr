"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";
import { SUPPORTED_RESEARCH_LANGUAGES, DEFAULT_RESEARCH_LANGUAGE } from "@/lib/constants/languages";

function CreateResearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";

  const [topic, setTopic] = useState(initialTopic);
  const [objective, setObjective] = useState("");
  const [contentType, setContentType] = useState("Comparison");
  const [targetAudience, setTargetAudience] = useState("Technology Content Creators");
  const [requestedDepth, setRequestedDepth] = useState("Standard");
  const [outputLanguage, setOutputLanguage] = useState(DEFAULT_RESEARCH_LANGUAGE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTopic && !topic) {
      setTopic(initialTopic);
      setObjective(`Perform in-depth technical evidence extraction and comparative analysis on ${initialTopic}.`);
    }
  }, [initialTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          objective: objective || topic,
          contentType,
          targetAudience,
          requestedDepth,
          outputLanguage,
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
    { num: 2, label: "Objective" },
    { num: 3, label: "Depth" },
    { num: 4, label: "Plan" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Step Progress Indicator Bar */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-1 sm:gap-3 bg-white  border border-slate-200  rounded-full px-4 py-2 shadow-sm">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold transition-all ${
                s.num === 1 ? "bg-indigo-600 text-white   shadow-md" : "bg-slate-100 text-slate-500  "
              }`}>
                {s.num}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold ${s.num === 1 ? "text-slate-900 " : "text-slate-500 "}`}>{s.label}</span>
              {idx < steps.length - 1 && <span className="text-slate-700  mx-1">/</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-2 mb-10">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50  text-indigo-600  text-[10px] font-mono font-bold border border-indigo-200  uppercase tracking-widest mb-2">
          <ShieldCheck className="w-3 h-3" /> GUIDED SETUP
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 ">Create Research Run</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">Define your research topic. Nichorr will deconstruct entities, formulate multi-vector search plans, and extract verified evidence.</p>
      </div>

      {/* Preset Examples */}
      <div className="mb-8">
        <label className="text-xs font-mono text-slate-500  flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> QUICK START BENCHMARK TEMPLATES
        </label>
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setExample(
              "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
              "Compare camera dynamic range, sustained thermal throttling under 4K video, battery endurance, and real-world value for a YouTube comparison video.",
              "Comparison"
            )}
            className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-2 hover:border-slate-300 transition-all"
          >
            <span className="font-bold text-sm text-slate-800  group-hover:text-indigo-600 transition line-clamp-2">
              Galaxy S27 Ultra vs iPhone 18 Pro Max
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100  pt-2">
              <span>FLAGSHIP SHOWDOWN</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setExample(
              "RTX 5090 vs RX 8900 XTX Power Efficiency & 4K Ray Tracing",
              "Measure wattage draw, DLSS 4 vs FSR 4 image quality, and 1% low frame time stability.",
              "Deep Dive"
            )}
            className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-2 hover:border-slate-300 transition-all"
          >
            <span className="font-bold text-sm text-slate-800  group-hover:text-indigo-600 transition line-clamp-2">
              RTX 5090 vs RX 8900 XTX Power Efficiency
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100  pt-2">
              <span>GPU EFFICIENCY</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setExample(
              "MacBook Pro 16 M5 Max vs Dell XPS 16 Sustained Thermals",
              "Audit Cinebench R24 multi-core power limits and fan acoustic decibels.",
              "Comparison"
            )}
            className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-2xl p-5 text-left group flex flex-col justify-between space-y-2 hover:border-slate-300 transition-all"
          >
            <span className="font-bold text-sm text-slate-800  group-hover:text-indigo-600 transition line-clamp-2">
              MacBook Pro M5 Max Sustained Thermals
            </span>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100  pt-2">
              <span>LAPTOP THERMALS</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-3xl p-6 sm:p-8 space-y-8">
        <div className="space-y-2 relative">
          <label className="block text-xs font-semibold text-slate-600 ">
            Primary Tech Topic <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Apple M4 iPad Pro OLED Display Calibration..."
              className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-2xl pl-12 pr-6 py-4 text-sm font-semibold text-slate-900  focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 ">
            Specific Content Objective
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            placeholder="I want to know if the tandem OLED screen exhibits PWM flickering at low brightness levels and how it compares to..."
            className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-2xl px-6 py-4 text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-100 ">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-semibold uppercase text-slate-500">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-xl px-4 py-2.5 text-xs text-slate-800  focus:outline-none"
            >
              <option>Comparison</option>
              <option>Deep Dive</option>
              <option>Buying Guide</option>
              <option>News Analysis</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-semibold uppercase text-slate-500">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-xl px-4 py-2.5 text-xs text-slate-800  focus:outline-none"
            >
              <option>Technology Content Creators</option>
              <option>Enthusiast / Prosumer</option>
              <option>General Consumer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-semibold uppercase text-slate-500">Research Depth</label>
            <select
              value={requestedDepth}
              onChange={(e) => setRequestedDepth(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-xl px-4 py-2.5 text-xs text-slate-800  focus:outline-none"
            >
              <option>Standard</option>
              <option>Comprehensive (Lab Data)</option>
              <option>Forensic (Exhaustive)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-semibold uppercase text-slate-500">Output Language</label>
            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:ring-2 focus:ring-slate-900  rounded-xl px-4 py-2.5 text-xs text-slate-800  focus:outline-none"
            >
              {SUPPORTED_RESEARCH_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.englishName} ({l.nativeName})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 ">
          <p className="text-xs text-slate-500 flex items-center gap-2">
             <Layers className="w-4 h-4 text-indigo-500" />
             Research typically takes 30-90 seconds.
          </p>
          <button
            type="submit"
            disabled={!topic || submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700  px-8 py-3 rounded-full text-sm font-semibold transition disabled:opacity-50 shadow-md"
          >
            {submitting ? "Initializing Engine..." : (
              <>
                Continue to Plan <ArrowRight className="w-4 h-4" />
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
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CreateResearchForm />
    </Suspense>
  );
}


