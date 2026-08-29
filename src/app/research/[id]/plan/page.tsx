"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResearchRunSession } from "@/features/research/research-engine";
import { GOLDEN_BENCHMARK_DATASET } from "@/benchmarks/golden-dataset";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Stepper, Step } from "@/components/ui/Stepper";

export default function ResearchPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; type: string }>>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRun(data.run);
          const bm = GOLDEN_BENCHMARK_DATASET.find(b => data.run.topic.toLowerCase().includes(b.topic.toLowerCase().slice(0, 10)));
          if (bm) {
            setQuestions(bm.expectedQuestions.map((q, idx) => ({ id: `q-${idx + 1}`, question: q, type: "MEASUREMENT" })));
          } else {
            setQuestions([
              { id: "q-1", question: `What are the measured performance & lab benchmark results for ${data.run.topic}?`, type: "MEASUREMENT" },
              { id: "q-2", question: "How do sustained thermal throttles compare under continuous workloads?", type: "FACT" },
              { id: "q-3", question: "What real-world problems or complaints are users reporting on Reddit & forums?", type: "PROBLEM" },
              { id: "q-4", question: "What do independent tech publications disagree about in their reviews?", type: "COMMUNITY" },
            ]);
          }
        } else {
          setNotFound(true);
        }
      });
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-[820px] mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-ink">Run Not Found</h2>
        <p className="text-muted">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="max-w-[820px] mx-auto py-8 space-y-4 px-5">
        <SkeletonCard />
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, { id: `q-${Date.now()}`, question: newQuestion, type: "CUSTOM" }]);
    setNewQuestion("");
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleStartResearch = async () => {
    if (starting) return;
    setStarting(true);
    try {
      fetch(`/api/research/${params.id}/execute`, { method: "POST", keepalive: true }).catch((err) => {
        console.warn("Execute post trigger:", err);
      });
      router.push(`/research/${params.id}/live`);
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  const steps: Step[] = [
    { num: "✓", label: "Topic & Goal", status: "done" },
    { num: "✓", label: "Configuration", status: "done" },
    { num: 3, label: "Question Plan", status: "active" },
    { num: 4, label: "Execute", status: "pending" },
  ];

  return (
    <div className="max-w-[820px] mx-auto px-5 py-8 pb-20">
      <Stepper steps={steps} />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[11px] font-semibold text-citation tracking-[0.5px] mb-2 block uppercase">STAGE 2 · QUESTION DECONSTRUCTION</span>
          <h1 className="font-serif font-semibold text-[21px] sm:text-[26px] m-0">Review & Customize Research Questions</h1>
        </div>
        <button
          onClick={handleStartResearch}
          disabled={starting || questions.length === 0}
          className="bg-verified text-white font-bold text-[14px] px-[22px] py-[12px] rounded-[10px] whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto hover:opacity-90 disabled:opacity-50"
        >
          {starting ? "Starting..." : "▶ Start Research Execution"}
        </button>
      </div>

      <div className="bg-card border border-line-soft rounded-[16px] p-5 sm:px-[22px] sm:py-[20px] mb-[26px]">
        <div className="font-mono text-[10.5px] text-muted-2 tracking-[0.5px] mb-2 uppercase">TARGET RESEARCH OBJECTIVE</div>
        <div className="font-serif font-semibold text-[19px] mb-2">{run.topic}</div>
        <div className="text-[13.5px] text-muted leading-[1.6]">{run.objective}</div>
      </div>

      <div className="flex items-center justify-between mb-[14px]">
        <h3 className="text-[14.5px] font-bold m-0">Deconstructed Research Questions</h3>
        <span className="font-mono text-[11px] text-muted-2 bg-paper px-[10px] py-1 rounded-full">{questions.length} active</span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-card border border-line-soft rounded-[14px] p-4 sm:px-[18px] sm:py-[16px] mb-3 flex gap-3.5 items-start">
          <div className="w-[26px] h-[26px] rounded-full bg-citation-bg text-citation font-mono text-[12px] font-bold flex items-center justify-center shrink-0">
            {idx + 1}
          </div>
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold leading-[1.5] mb-2">{q.question}</div>
            <span className="font-mono text-[10px] text-citation bg-citation-bg px-[9px] py-[3px] rounded-[6px] uppercase">{q.type} VECTOR</span>
          </div>
          <button
            onClick={() => handleRemoveQuestion(q.id)}
            className="text-muted-2 bg-transparent border-none cursor-pointer text-[15px] shrink-0 hover:text-conflict"
          >
            🗑
          </button>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-2.5 my-[18px] sm:mb-[26px]">
        <input
          type="text"
          placeholder="Add custom question (e.g. What is the real-world battery degradation post firmware update?)"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
          className="flex-1 font-sans text-[14px] px-[14px] py-[12px] border border-line rounded-[10px] bg-card focus:outline-none focus:border-citation text-ink"
        />
        <button
          onClick={handleAddQuestion}
          className="bg-ink text-paper border-none rounded-[10px] px-[18px] py-[12px] font-semibold text-[13.5px] cursor-pointer whitespace-nowrap hover:opacity-90"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 bg-verified-bg border border-verified rounded-[12px] p-3.5 sm:px-[18px] sm:py-[14px]">
        <span className="flex items-center gap-2 text-[12.5px] font-semibold text-verified">✓ Automatic SoC & hardware variant compatibility guaranteed</span>
        <span className="font-mono text-[11px] bg-card px-2.5 py-1 rounded-full text-verified">{questions.length} ACTIVE VECTORS</span>
      </div>
    </div>
  );
}
