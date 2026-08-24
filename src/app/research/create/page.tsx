"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUPPORTED_RESEARCH_LANGUAGES, DEFAULT_RESEARCH_LANGUAGE } from "@/lib/constants/languages";
import { Stepper, Step } from "@/components/ui/Stepper";
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

  const steps: Step[] = [
    { num: 1, label: "Topic & Goal", status: "active" },
    { num: 2, label: "Configuration", status: "pending" },
    { num: 3, label: "Question Plan", status: "pending" },
    { num: 4, label: "Execute", status: "pending" },
  ];

  return (
    <div className="max-w-[820px] mx-auto px-5 py-8 pb-20">
      <Stepper steps={steps} />

      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-citation bg-citation-bg px-3.5 py-1.5 rounded-full mb-4">
          ◇ GUIDED SETUP
        </span>
        <h1 className="font-serif font-semibold text-[26px] sm:text-[34px] m-0 mb-2.5">Create Research Run</h1>
        <p className="text-muted text-[15px] max-w-[520px] mx-auto mb-8 leading-relaxed">
          Define your research topic. Nichorr will deconstruct entities, formulate multi-vector search plans, and extract verified evidence.
        </p>
      </div>

      <div className="font-mono text-[11px] tracking-[0.5px] text-muted-2 text-center mb-3 uppercase">QUICK START BENCHMARK TEMPLATES</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <button
          type="button"
          onClick={() => setExample(
            "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
            "Compare camera dynamic range, sustained thermal throttling under 4K video, battery endurance, and real-world value for a YouTube comparison video.",
            "Comparison"
          )}
          className="bg-card border border-line-soft rounded-[14px] p-4 text-left cursor-pointer transition-colors duration-150 hover:border-citation flex flex-col group"
        >
          <div className="font-mono text-[10px] text-muted-2 tracking-[0.4px] mb-2 uppercase">FLAGSHIP SHOWDOWN</div>
          <div className="font-semibold text-[13.5px] leading-snug">Galaxy S27 Ultra vs iPhone 18 Pro Max</div>
          <div className="text-citation text-[13px] mt-2 font-mono">→</div>
        </button>
        
        <button
          type="button"
          onClick={() => setExample(
            "RTX 5090 vs RX 8900 XTX Power Efficiency & 4K Ray Tracing",
            "Measure wattage draw, DLSS 4 vs FSR 4 image quality, and 1% low frame time stability.",
            "Deep Dive"
          )}
          className="bg-card border border-line-soft rounded-[14px] p-4 text-left cursor-pointer transition-colors duration-150 hover:border-citation flex flex-col group"
        >
          <div className="font-mono text-[10px] text-muted-2 tracking-[0.4px] mb-2 uppercase">GPU EFFICIENCY</div>
          <div className="font-semibold text-[13.5px] leading-snug">RTX 5090 vs RX 8900 XTX Power Efficiency</div>
          <div className="text-citation text-[13px] mt-2 font-mono">→</div>
        </button>

        <button
          type="button"
          onClick={() => setExample(
            "MacBook Pro 16 M5 Max vs Dell XPS 16 Sustained Thermals",
            "Audit Cinebench R24 multi-core power limits and fan acoustic decibels.",
            "Comparison"
          )}
          className="bg-card border border-line-soft rounded-[14px] p-4 text-left cursor-pointer transition-colors duration-150 hover:border-citation flex flex-col group"
        >
          <div className="font-mono text-[10px] text-muted-2 tracking-[0.4px] mb-2 uppercase">LAPTOP THERMALS</div>
          <div className="font-semibold text-[13.5px] leading-snug">MacBook Pro M5 Max Sustained Thermals</div>
          <div className="text-citation text-[13px] mt-2 font-mono">→</div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-line-soft rounded-[18px] p-5 sm:p-7">
        <div className="mb-[22px]">
          <label className="block text-[13px] font-bold mb-2">
            Primary Tech Topic <span className="text-conflict">*</span>
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Apple M4 iPad Pro OLED Display Calibration…"
            className="w-full font-sans text-[14.5px] px-3.5 py-3 border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
          />
        </div>

        <div className="mb-[22px]">
          <label className="block text-[13px] font-bold mb-2">
            Specific Content Objective
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="I want to know if the tandem OLED screen exhibits PWM flickering at low brightness levels and how it compares to…"
            className="w-full font-sans text-[14.5px] px-3.5 py-3 border border-line rounded-[10px] bg-paper text-ink resize-y min-h-[80px] focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="mb-[22px]">
            <label className="block font-mono text-[10.5px] tracking-[0.4px] text-muted-2 uppercase mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full font-sans text-[14.5px] px-3.5 py-3 border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
            >
              <option>Comparison</option>
              <option>Deep Dive</option>
              <option>Buying Guide</option>
              <option>News Analysis</option>
            </select>
          </div>

          <div className="mb-[22px]">
            <label className="block font-mono text-[10.5px] tracking-[0.4px] text-muted-2 uppercase mb-2">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full font-sans text-[14.5px] px-3.5 py-3 border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
            >
              <option>Technology Content Creators</option>
              <option>Enthusiast / Prosumer</option>
              <option>General Consumer</option>
            </select>
          </div>

          <div className="mb-[22px]">
            <label className="block font-mono text-[10.5px] tracking-[0.4px] text-muted-2 uppercase mb-2">Output Language</label>
            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
              className="w-full font-sans text-[14.5px] px-3.5 py-3 border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
            >
              {SUPPORTED_RESEARCH_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.englishName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-6 gap-4">
          <div className="flex items-center gap-2 text-[12.5px] text-muted">
            <span className="font-mono">◷</span> Research typically takes 30–90 seconds.
          </div>
          <Button type="submit" disabled={!topic || submitting} variant="accent" className="w-full sm:w-auto">
            {submitting ? "Initializing..." : "Continue to Plan →"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateResearchPage() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-citation border-t-transparent rounded-full animate-spin"></div></div>}>
      <CreateResearchForm />
    </Suspense>
  );
}
