"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getLanguageByCode } from "@/lib/constants/languages";
import { Stepper, Step } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";

export default function ConfigPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [depth, setDepth] = useState("Standard");
  const [region, setRegion] = useState("United States (Tier-1 Labs)");
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
      <div className="max-w-[880px] mx-auto my-12 p-6 bg-card border border-line-soft shadow-sm rounded-3xl text-center space-y-4">
        <h2 className="text-lg font-bold text-conflict">Configuration Load Error</h2>
        <p className="text-xs font-mono text-muted">{error}</p>
        <Button onClick={() => router.push("/research/create")}>
          Create New Research Run
        </Button>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-[880px] mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-ink">Run Not Found</h2>
        <p className="text-muted">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-[880px] mx-auto py-8">
        <SkeletonCard />
      </div>
    );
  }

  const handleProceed = () => {
    router.push(`/research/${params.id}/plan`);
  };

  const steps: Step[] = [
    { num: "✓", label: "Topic & Goal", status: "done" },
    { num: 2, label: "Configuration", status: "active" },
    { num: 3, label: "Question Plan", status: "pending" },
    { num: 4, label: "Execute", status: "pending" },
  ];

  return (
    <div className="max-w-[880px] mx-auto px-5 py-8 pb-20">
      <Stepper steps={steps} />

      <span className="block font-mono text-[11px] font-semibold text-citation tracking-[0.5px] mb-2 uppercase">
        STAGE 1 · SCOPE & PARAMETERS
      </span>
      <h1 className="font-serif font-semibold text-[23px] sm:text-[28px] m-0 mb-5">Research Scope & Protocol Settings</h1>

      <div className="bg-ink text-paper rounded-2xl p-5 sm:px-[22px] sm:py-[20px] mb-6">
        <div className="font-mono text-[11px] text-white/50 tracking-[0.5px] mb-1.5 uppercase">
          ACTIVE TARGET TOPIC (Language: {getLanguageByCode(run.outputLanguage).englishName})
        </div>
        <div className="font-serif font-semibold text-[21px]">{run.topic}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr] gap-[22px] items-start">
        <div>
          <h3 className="text-[13.5px] font-bold m-0 mb-3">Research Depth Tier</h3>
          
          {[ 
            { name: "Quick", desc: "3–5 key queries, 10 primary sources. (~10s)" },
            { name: "Standard", desc: "8–12 queries, multi-vector search & synthesis. (~25s)" },
            { name: "Deep", desc: "Full audit, contrarian queries, community forum signals. (~45s)" }
          ].map((d) => (
            <label
              key={d.name}
              className={`block bg-card border-[1.5px] rounded-[14px] px-[18px] py-[16px] mb-3 cursor-pointer flex gap-3 items-start transition-colors duration-150 ${
                depth === d.name ? "border-citation bg-citation-bg" : "border-line-soft hover:border-citation"
              }`}
            >
              <input
                type="radio"
                name="depth"
                value={d.name}
                checked={depth === d.name}
                onChange={(e) => setDepth(e.target.value)}
                className="mt-[3px]"
              />
              <div>
                <div className="font-bold text-[14.5px] mb-[3px]">{d.name}</div>
                <div className="text-[12.5px] text-muted leading-[1.5]">{d.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="bg-card border border-line-soft rounded-[14px] p-[18px]">
          <h3 className="text-[13.5px] font-bold m-0 mb-3">Target Market</h3>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full font-sans text-[14px] px-3 py-[11px] border border-line rounded-[9px] bg-paper text-ink mb-[18px] focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg"
          >
            <option>United States (Tier-1 Labs)</option>
            <option>United Kingdom</option>
            <option>Global</option>
          </select>

          <h3 className="text-[13.5px] font-bold m-0 mb-3">Grounded Source Inclusions</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {[
              "Official manufacturer specs & whitepapers",
              "Independent lab benchmarks & thermal tests",
              "Reputable tech publications (AnandTech, GSMArena)",
              "Reddit & forum technical complaints"
            ].map((item, idx) => (
              <li key={idx} className="flex gap-2 text-[12.5px] text-ink leading-[1.4]">
                <span className="text-verified flex-shrink-0">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between mt-6 gap-4">
        <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 font-mono text-[11px] font-semibold text-verified bg-verified-bg px-3 py-1.5 rounded-full uppercase">
          ✓ REPRODUCIBLE RESEARCH PROTOCOL
        </span>
        <Button onClick={handleProceed} variant="primary" className="w-full sm:w-auto">
          Review Question Plan →
        </Button>
      </div>
    </div>
  );
}
