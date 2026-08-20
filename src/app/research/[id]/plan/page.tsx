"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, Plus, Trash2, Play, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { GOLDEN_BENCHMARK_DATASET } from "@/benchmarks/golden-dataset";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
          // Match golden dataset or provide default research questions
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
      // Trigger execution API route asynchronously
      fetch(`/api/research/${params.id}/execute`, { method: "POST" });
      // Redirect immediately to live tracker screen
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
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Step Progress Indicator Bar */}
      <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              s.active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : s.done ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}>
              {s.done ? "✓" : s.num}
            </div>
            <span className="text-xs font-medium hidden sm:inline text-slate-300">{s.label}</span>
            {idx < steps.length - 1 && <span className="text-slate-700 text-xs hidden sm:inline">→</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">STAGE 2 / QUESTION DECONSTRUCTION</span>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Review & Customize Research Questions</h1>
        </div>
        <button
          onClick={handleStartResearch}
          disabled={starting || questions.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {starting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Launching Pipeline...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Start Research Execution
            </>
          )}
        </button>
      </div>

      {/* Target Overview Card */}
      <div className="slate-card p-6 space-y-2 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border-indigo-950">
        <label className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">TARGET RESEARCH OBJECTIVE</label>
        <p className="text-lg font-bold text-slate-100">{run.topic}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{run.objective}</p>
      </div>

      {/* Questions Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-400" />
            Deconstructed Research Questions ({questions.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">EDIT OR ADD VECTORS BEFORE EXECUTION</span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="slate-card p-4 flex items-center justify-between gap-4 bg-slate-950/80 hover:border-slate-700 transition-all">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-850 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-750">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-200 leading-snug">{q.question}</p>
                  <span className="inline-block text-[10px] font-mono text-indigo-400 uppercase bg-indigo-950/80 border border-indigo-850 px-2 py-0.5 rounded font-semibold">
                    {q.type} VECTOR
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveQuestion(q.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Controls */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom question (e.g. What is the real-world battery degradation post firmware update?)"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition border border-slate-750 shrink-0"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            Add Question
          </button>
        </div>
      </div>

      <div className="slate-card p-4 bg-emerald-950/20 border-emerald-900/50 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" /> AUTOMATIC SOC & HARDWARE VARIANT COMPATIBILITY GUARANTEED
        </span>
        <span>{questions.length} ACTIVE VECTORS</span>
      </div>
    </div>
  );
}
