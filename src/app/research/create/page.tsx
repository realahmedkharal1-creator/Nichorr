"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, HelpCircle, CheckCircle2 } from "lucide-react";

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
    { num: 2, label: "Content Objective" },
    { num: 3, label: "Depth & Audience" },
    { num: 4, label: "Review & Plan" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Step Progress Indicator Bar */}
      <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              s.num === 1 ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}>
              {s.num}
            </div>
            <span className="text-xs font-medium hidden sm:inline text-slate-300">{s.label}</span>
            {idx < steps.length - 1 && <span className="text-slate-700 text-xs hidden sm:inline">→</span>}
          </div>
        ))}
      </div>

      <div>
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">GUIDED SETUP WIZARD</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Create Technology Research Run</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Define your research topic. Veritas will deconstruct entities, formulate multi-vector search plans, and extract verified evidence.</p>
      </div>

      {/* Preset Examples */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> QUICK START BENCHMARK TEMPLATES
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setExample(
              "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
              "Compare camera dynamic range, sustained thermal throttling under 4K video, battery endurance, and real-world value for a YouTube comparison video.",
              "Comparison"
            )}
            className="slate-card p-4 text-left hover:border-indigo-500/60 hover:bg-slate-850/80 transition-all text-xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-indigo-400 font-mono text-[10px]">
              <span>FLAGSHIP SHOWDOWN</span>
              <span className="group-hover:translate-x-0.5 transition transform">Use Template →</span>
            </div>
            <span className="font-bold text-slate-100 block text-sm group-hover:text-indigo-300 transition">Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max</span>
            <p className="text-slate-400 line-clamp-1 text-[11px]">Compare 4K thermal throttling, camera dynamic range, and battery endurance.</p>
          </button>

          <button
            type="button"
            onClick={() => setExample(
              "MacBook Pro 16 M5 Max vs Dell XPS 16 Thermal Throttling",
              "Investigate sustained CPU rendering thermals, fan noise acoustic decibels, and battery drain under multi-core stress workloads.",
              "Review"
            )}
            className="slate-card p-4 text-left hover:border-indigo-500/60 hover:bg-slate-850/80 transition-all text-xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-indigo-400 font-mono text-[10px]">
              <span>LAPTOP THERMALS</span>
              <span className="group-hover:translate-x-0.5 transition transform">Use Template →</span>
            </div>
            <span className="font-bold text-slate-100 block text-sm group-hover:text-indigo-300 transition">MacBook Pro 16 M5 Max vs Dell XPS 16</span>
            <p className="text-slate-400 line-clamp-1 text-[11px]">Investigate CPU thermals, acoustic decibels, and battery drain under stress.</p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="slate-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Research Topic or Primary Question <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Compare RTX 5080 vs RX 8900 XTX 4K Gaming Performance & Power Consumption"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
          <p className="text-[11px] text-slate-500 font-mono">Specify exact device models or technologies for automatic SoC entity resolution.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-200">
            Detailed Research Goal / Specific Questions (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Describe specific questions, key metrics, user complaints, or benchmark expectations you want verified..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase font-mono">Content Objective</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Comparison">Comparison</option>
              <option value="Review">Review</option>
              <option value="Problem investigation">Problem Investigation</option>
              <option value="Explainer">Explainer</option>
              <option value="Buying guide">Buying Guide</option>
              <option value="News">News Analysis</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase font-mono">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Technology Content Creators">Tech Creators (YouTube/Blog)</option>
              <option value="PC Hardware Builders">PC Hardware Enthusiasts</option>
              <option value="Smartphone Buyers">Gadget Buyers</option>
              <option value="Tech Journalists">Independent Researchers</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase font-mono">Research Depth</label>
            <select
              value={requestedDepth}
              onChange={(e) => setRequestedDepth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Quick">Quick (Fast Scan)</option>
              <option value="Standard">Standard (Balanced)</option>
              <option value="Deep">Deep (Multi-Vector Audit)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" /> Traceable evidence extraction enabled
          </div>

          <button
            type="submit"
            disabled={!topic || submitting}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-white" />
                Deconstructing Plan...
              </>
            ) : (
              <>
                Proceed to Research Plan
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
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-slate-500">Loading Research Wizard...</div>}>
      <CreateResearchForm />
    </Suspense>
  );
}
