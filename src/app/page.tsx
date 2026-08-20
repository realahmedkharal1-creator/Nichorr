"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Database, 
  Globe, 
  ListOrdered, 
  Video
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [topicInput, setTopicInput] = useState("");

  const handleStartResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      router.push("/research/create");
    } else {
      router.push(`/research/create?topic=${encodeURIComponent(topicInput.trim())}`);
    }
  };

  const templates = [
    {
      title: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
      desc: "Compare 4K thermal throttling, camera dynamic range, and battery endurance.",
      badge: "FLAGSHIP SHOWDOWN",
    },
    {
      title: "RTX 5090 vs RX 8900 XTX Power Efficiency & 4K Ray Tracing",
      desc: "Measure wattage draw, DLSS 4 vs FSR 4, and 1% low frame time stability.",
      badge: "GPU EFFICIENCY",
    },
    {
      title: "MacBook Pro 16 M5 Max vs Dell XPS 16 Sustained Thermals",
      desc: "Audit Cinebench R24 multi-core power limits and fan acoustic decibels.",
      badge: "LAPTOP THERMALS",
    },
    {
      title: "DeepSeek R1 vs Claude 3.5 Sonnet Coding & Reasoning",
      desc: "Benchmark HumanEval pass@1, token economics, and mathematical proofs.",
      badge: "AI REASONING",
    },
  ];

  const workflowSteps = [
    { step: "01", name: "Topic & Goal", desc: "Define device or technology focus" },
    { step: "02", name: "Search Plan", desc: "Multi-vector queries & query expansion" },
    { step: "03", name: "Source Discovery", desc: "Primary docs & lab review tiering" },
    { step: "04", name: "Text Extraction", desc: "Direct text capture & syndication audit" },
    { step: "05", name: "Evidence & Claims", desc: "Grounded claim-to-excerpt mapping" },
    { step: "06", name: "Entity Resolution", desc: "Hardware SoC variant compatibility" },
    { step: "07", name: "Conflict Matrix", desc: "Methodology & thermal delta detection" },
    { step: "08", name: "Community Signals", desc: "Reddit & forum real-world issues" },
    { step: "09", name: "Audience & Gaps", desc: "Viewer questions & video angles" },
    { step: "10", name: "Defensible Brief", desc: "100% evidence-backed script ready" },
  ];

  return (
    <div className="space-y-16 py-6 font-sans">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>EVIDENCE-FIRST TECHNOLOGY RESEARCH INTELLIGENCE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn Scattered Tech Web Data Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
            Defensible Research Briefs
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Tailored for YouTube tech reviewers, hardware analysts, and technology creators. Every claim is verified, source-traced, and cross-audited against independent lab tests, official technical specifications, and community signals.
        </p>

        {/* Instant Topic Input Bar */}
        <form onSubmit={handleStartResearch} className="max-w-2xl mx-auto pt-2">
          <div className="slate-card p-2 bg-slate-900/90 border-slate-750 flex items-center gap-2 shadow-2xl">
            <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Enter tech topic (e.g., Galaxy S27 Ultra Thermals, RTX 5090 Efficiency)..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition shrink-0 transform hover:-translate-y-0.5"
            >
              Start Research Run
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono text-slate-400">
          <Link href="/dashboard" className="hover:text-indigo-300 flex items-center gap-1.5 transition">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            Creator Dashboard
          </Link>
          <span>•</span>
          <Link href="/research/history" className="hover:text-indigo-300 flex items-center gap-1.5 transition">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            Research Archive
          </Link>
          <span>•</span>
          <Link href="/research/sources" className="hover:text-indigo-300 flex items-center gap-1.5 transition">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Source Trust Explorer
          </Link>
          <span>•</span>
          <Link href="/research/queue" className="hover:text-indigo-300 flex items-center gap-1.5 transition">
            <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
            Research Queue
          </Link>
        </div>
      </div>

      {/* Quick Start Benchmark Templates */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> INSTANT BENCHMARK RESEARCH TEMPLATES
          </span>
          <Link href="/research/create" className="text-xs font-mono text-indigo-400 hover:underline">
            Custom Setup Wizard →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                router.push(`/research/create?topic=${encodeURIComponent(tpl.title)}`);
              }}
              className="slate-card p-5 text-left hover:border-indigo-500/60 hover:bg-slate-850/80 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between text-indigo-400 font-mono text-[10px]">
                <span>{tpl.badge}</span>
                <span className="group-hover:translate-x-0.5 transition transform text-indigo-300">Run Research →</span>
              </div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-indigo-300 transition">
                {tpl.title}
              </h3>
              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {tpl.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Veritas Ethos Banner */}
      <div className="slate-card p-6 sm:p-8 border-indigo-900/50 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 relative overflow-hidden max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              The Central Veritas Ethos
            </h3>
            <p className="text-slate-300 font-mono text-sm sm:text-base">
              "Never optimize for an answer that sounds convincing. Optimize for an answer that can be defended."
            </p>
          </div>
          <div className="shrink-0 flex gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold">
              100% TRACEABLE
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 font-bold">
              HONEST CONFLICTS
            </span>
          </div>
        </div>
      </div>

      {/* 10-Step Creator Research Workflow */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">END-TO-END RESEARCH WORKFLOW</span>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">The 10-Stage Evidence-First Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-400">How raw scattered internet specs transform into an authoritative, video-ready research brief.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {workflowSteps.map((ws, i) => (
            <div key={i} className="slate-card p-3.5 bg-slate-900/80 border-slate-800 space-y-1 text-left hover:border-slate-700 transition">
              <span className="text-[10px] font-mono font-bold text-indigo-400">{ws.step}</span>
              <h4 className="text-xs font-bold text-slate-200">{ws.name}</h4>
              <p className="text-[11px] text-slate-400 leading-tight">{ws.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Methodology Pillars */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="slate-card p-6 space-y-3 bg-slate-900/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Claim-to-Source Provenance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Finding → Claim → Verbatim Excerpt → Source URL. Zero ungrounded AI claims allowed without explicit unsupported status alerts.
          </p>
        </div>

        <div className="slate-card p-6 space-y-3 bg-slate-900/80">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Methodological Conflict Matrix</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically surfaces when AnandTech, Tom's Hardware, and GSMArena lab tests disagree due to ambient thermals, hardware variants, or firmware updates.
          </p>
        </div>

        <div className="slate-card p-6 space-y-3 bg-slate-900/80">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Community & Gap Signals</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Parses Reddit and forum posts to detect real-world user complaints, PWM display flickering, and unanswered audience questions for content differentiation.
          </p>
        </div>
      </div>
    </div>
  );
}
