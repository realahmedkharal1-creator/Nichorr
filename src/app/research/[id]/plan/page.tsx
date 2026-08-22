"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, Plus, Trash2, Play, ShieldCheck, HelpCircle, Loader2, Check, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { GOLDEN_BENCHMARK_DATASET } from "@/benchmarks/golden-dataset";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export default function ResearchPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [questions, setQuestions] = useState<Array<{ id: string; question: string; type: string }>>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRun(data.run);
          const bm = GOLDEN_BENCHMARK_DATASET.find((b) =>
            data.run.topic.toLowerCase().includes(b.topic.toLowerCase().slice(0, 10))
          );
          if (bm) {
            setQuestions(
              bm.expectedQuestions.map((q, idx) => ({
                id: `q-${idx + 1}`,
                question: q,
                type: "MEASUREMENT",
              }))
            );
          } else {
            setQuestions([
              {
                id: "q-1",
                question: `What are the measured performance & lab benchmark results for ${data.run.topic}?`,
                type: "MEASUREMENT",
              },
              {
                id: "q-2",
                question: "How do sustained thermal throttles compare under continuous workloads?",
                type: "FACT",
              },
              {
                id: "q-3",
                question: "What real-world problems or complaints are users reporting on Reddit & forums?",
                type: "PROBLEM",
              },
              {
                id: "q-4",
                question: "What do independent tech publications disagree about in their reviews?",
                type: "COMMUNITY",
              },
            ]);
          }
        }
      });
  }, [params.id]);

  if (!run) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4">
        <SkeletonCard />
      </div>
    );
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      { id: `q-${Date.now()}`, question: newQuestion.trim(), type: "CUSTOM" },
    ]);
    setNewQuestion("");
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleStartResearch = async () => {
    if (starting) return;
    setStarting(true);
    try {
      fetch(`/api/research/${params.id}/execute`, { method: "POST" });
      router.push(`/research/${params.id}/live`);
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  const steps = [
    { num: 1, label: "Topic & Goal", done: true },
    { num: 2, label: "Configuration", done: true },
    { num: 3, label: "Question Plan", active: true },
    { num: 4, label: "Execute Pipeline" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 font-sans">
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e5e5ea] pb-5 gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            STAGE 3 / QUESTION DECONSTRUCTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            Customize Research Questions
          </h1>
        </div>
        <button
          onClick={handleStartResearch}
          disabled={starting || questions.length === 0}
          className="flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 rounded-full text-xs font-semibold transition-all shadow-sm shadow-[#0071e3]/20 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {starting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Launching Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Research Execution</span>
            </>
          )}
        </button>
      </div>

      {/* Target Overview Card */}
      <div className="bg-white rounded-3xl border border-[#e5e5ea] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-7 space-y-2">
        <label className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-wider">
          TARGET RESEARCH OBJECTIVE
        </label>
        <p className="text-lg sm:text-xl font-bold text-[#1d1d1f] leading-snug">
          {run.topic}
        </p>
        <p className="text-xs sm:text-sm font-medium text-[#6e6e73] leading-relaxed">
          {run.objective}
        </p>
      </div>

      {/* Questions Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#0071e3]" />
            Deconstructed Questions ({questions.length})
          </h2>
          <span className="text-[11px] text-[#8e8e93] font-mono font-bold uppercase">
            EDIT OR ADD VECTORS BEFORE RUNNING
          </span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white border border-[#e5e5ea] hover:border-[#0071e3]/40 rounded-2xl p-5 flex items-start sm:items-center justify-between gap-4 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] group"
            >
              <div className="flex items-start gap-3.5 w-full">
                <span className="w-7 h-7 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-[#e5e5ea] mt-0.5 sm:mt-0">
                  {idx + 1}
                </span>
                <div className="space-y-1.5 w-full">
                  <p className="text-xs sm:text-sm font-bold text-[#1d1d1f] leading-snug">
                    {q.question}
                  </p>
                  <Badge variant="default" size="sm">
                    {q.type} VECTOR
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => handleRemoveQuestion(q.id)}
                className="text-[#8e8e93] hover:text-[#ff3b30] bg-[#f5f5f7] hover:bg-[#fff1f2] p-2 rounded-xl transition border border-[#e5e5ea] shrink-0"
                title="Remove question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <input
            type="text"
            placeholder="Add custom inquiry (e.g. What is the real-world battery drain under continuous 4K video recording?)"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
            className="flex-1 bg-white border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none transition shadow-2xs font-medium"
          />
          <button
            onClick={handleAddQuestion}
            className="flex items-center justify-center gap-1.5 bg-[#1d1d1f] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-semibold transition active:scale-95 cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </div>
  );
}
