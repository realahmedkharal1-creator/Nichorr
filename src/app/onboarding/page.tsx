"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight, Building, Video, Cpu } from "lucide-react";

export default function ProductOnboardingPage() {
  const [step, setStep] = useState(1);
  const [wsName, setWsName] = useState("My Tech Creator Workspace");
  const [useCase, setUseCase] = useState("TECH_CREATOR");
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="slate-card p-8 max-w-xl w-full bg-slate-900 border border-slate-800 space-y-6 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-850 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> WELCOME TO VERITASTECH AI
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Set Up Your Research Workspace</h1>
          <p className="text-xs text-slate-400">Step {step} of 3 — Configure your evidence-first creator intelligence environment.</p>
        </div>

        {/* Step 1: Workspace Name */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-xs font-mono text-slate-400 block">Workspace Name</label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Step 2: Use Case Selection */}
        {step === 2 && (
          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-400 block">Select Primary Use Case</label>

            <button
              onClick={() => setUseCase("TECH_CREATOR")}
              className={`w-full p-4 rounded-xl text-left border flex items-center gap-3 transition ${
                useCase === "TECH_CREATOR" ? "bg-indigo-950/60 border-indigo-500" : "bg-slate-950 border-slate-800"
              }`}
            >
              <Video className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">Tech Video & Content Creator</span>
                <span className="text-[11px] text-slate-400">Compare hardware specs, benchmarks, script outlines, and fact checks.</span>
              </div>
            </button>

            <button
              onClick={() => setUseCase("RESEARCH_ANALYST")}
              className={`w-full p-4 rounded-xl text-left border flex items-center gap-3 transition ${
                useCase === "RESEARCH_ANALYST" ? "bg-indigo-950/60 border-indigo-500" : "bg-slate-950 border-slate-800"
              }`}
            >
              <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">Technology Analyst & Engineer</span>
                <span className="text-[11px] text-slate-400">Deep technical research, knowledge graph, and evidence tracking.</span>
              </div>
            </button>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center p-6 bg-slate-950/80 rounded-xl border border-slate-850 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">Workspace Ready!</h2>
            <p className="text-xs text-slate-400">Your workspace "{wsName}" is initialized with Pro Tier intelligence features.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-850">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 disabled:opacity-30"
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition"
          >
            {step === 3 ? "Launch Dashboard" : "Continue"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
