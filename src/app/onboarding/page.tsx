"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight, Building, Video, Cpu } from "lucide-react";
import { InfoTooltip } from "@/components/ui/Tooltip";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 max-w-xl w-full bg-white border border-slate-200 space-y-6 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> WELCOME TO NICHORR
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set Up Your Research Workspace</h1>
          <p className="text-xs text-slate-500">Step {step} of 3 — Configure your evidence-first creator intelligence environment.</p>
        </div>

        {/* Step 1: Workspace Name */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="text-xs font-mono text-slate-500 block mb-2">
              Workspace Name
              <InfoTooltip content="A descriptive name for your workspace, like your YouTube channel or publication name." />
            </label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Step 2: Use Case Selection */}
        {step === 2 && (
          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-500 block mb-2">
              Select Primary Use Case
              <InfoTooltip content="What primary topics do you cover? This helps pre-configure the research engine." />
            </label>

            <button
              onClick={() => setUseCase("TECH_CREATOR")}
              className={`w-full p-4 rounded-xl text-left border flex items-center gap-3 transition ${
                useCase === "TECH_CREATOR" ? "bg-indigo-50 border-indigo-500" : "bg-slate-50 border-slate-200"
              }`}
            >
              <Video className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Tech Video & Content Creator</span>
                <span className="text-[11px] text-slate-500">Compare hardware specs, benchmarks, script outlines, and fact checks.</span>
              </div>
            </button>

            <button
              onClick={() => setUseCase("RESEARCH_ANALYST")}
              className={`w-full p-4 rounded-xl text-left border flex items-center gap-3 transition ${
                useCase === "RESEARCH_ANALYST" ? "bg-indigo-50 border-indigo-500" : "bg-slate-50 border-slate-200"
              }`}
            >
              <Cpu className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Technology Analyst & Engineer</span>
                <span className="text-[11px] text-slate-500">Deep technical research, knowledge graph, and evidence tracking.</span>
              </div>
            </button>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Workspace Ready!</h2>
            <p className="text-xs text-slate-500">Your workspace "{wsName}" is initialized with Pro Tier intelligence features.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="text-xs font-mono text-slate-500 hover:text-slate-700 disabled:opacity-30"
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
