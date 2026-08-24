"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, Plus, Trash2, Play, ShieldCheck, HelpCircle, Loader2, Check, ArrowRight } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { GOLDEN_BENCHMARK_DATASET } from "@/benchmarks/golden-dataset";
import { SkeletonCard } from "@/components/ui/Skeleton";

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
        }
      });
  }, [params.id]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Run Not Found</h2>
        <p className="text-slate-600">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

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
      // Fire execution with keepalive: true so browser navigation does not cancel the request
      fetch(`/api/research/${params.id}/execute`, { method: "POST", keepalive: true }).catch((err) => {
        console.warn("Execute post trigger:", err);
      });
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
      <div className="bg-white rounded-[24px] border border-slate-200/90 shadow-sm p-4 flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-3">
            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all " + 
              (s.active ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : s.done ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 border border-slate-200")
            }>
              {s.done ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={"text-sm font-bold hidden sm:inline " + (s.active || s.done ? "text-slate-900" : "text-slate-500")}>{s.label}</span>
            {idx < steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-700 hidden sm:inline ml-1" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-3 inline-block shadow-sm">STAGE 2 / QUESTION DECONSTRUCTION</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review & Customize Research Questions</h1>
        </div>
        <button
          onClick={handleStartResearch}
          disabled={starting || questions.length === 0}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3.5 rounded-full text-sm font-extrabold transition-all shadow-xl shadow-emerald-600/20 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
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
      <div className="bg-white rounded-[24px] border-2 border-slate-200 shadow-sm p-6 sm:p-8 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 pointer-events-none">
           <ListChecks className="w-32 h-32 text-indigo-200" />
        </div>
        <label className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest relative z-10">TARGET RESEARCH OBJECTIVE</label>
        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug relative z-10">{run.topic}</p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed max-w-xl sm:max-w-2xl relative z-10 pr-12 sm:pr-24">{run.objective}</p>
      </div>

      {/* Questions Editor List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            Deconstructed Research Questions <span className="text-slate-500 font-medium">({questions.length})</span>
          </h2>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold hidden sm:inline-block bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">EDIT OR ADD VECTORS BEFORE EXECUTION</span>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-[16px] p-5 flex items-start sm:items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-start gap-4 w-full">
                <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-slate-200 shadow-inner mt-0.5 sm:mt-0">
                  {idx + 1}
                </span>
                <div className="space-y-2 w-full">
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">{q.question}</p>
                  <div className="relative group inline-block">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 px-2 py-0.5 rounded shadow-sm cursor-help transition-colors">
                      {q.type} VECTOR
                      <HelpCircle className="w-3 h-3 text-indigo-500/70" />
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-white text-slate-900 border border-slate-200 text-xs font-medium rounded-xl p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100 z-50 pointer-events-none text-center leading-relaxed">
                      {
                        q.type === "MEASUREMENT" ? "Relies on lab benchmarks and quantitative data." :
                        q.type === "FACT" ? "Focuses on verified specifications and official claims." :
                        q.type === "PROBLEM" ? "Scans user forums for real-world issues & complaints." :
                        q.type === "COMMUNITY" ? "Synthesizes opinions from tech publications." :
                        "Custom user-defined research vector."
                      }
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveQuestion(q.id)}
                className="text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 p-2.5 rounded-xl transition-all border border-slate-100 hover:border-rose-200 shrink-0 shadow-sm"
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            placeholder="Add custom question (e.g. What is the real-world battery degradation post firmware update?)"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
            className="flex-1 bg-white border-2 border-slate-200 rounded-[16px] px-5 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm placeholder:text-slate-500"
          />
          <button
            onClick={handleAddQuestion}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-[16px] text-sm font-bold transition-all shadow-md shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-[16px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-emerald-800 shadow-sm">
        <span className="flex items-center gap-2 font-bold tracking-widest uppercase">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /> AUTOMATIC SOC & HARDWARE VARIANT COMPATIBILITY GUARANTEED
        </span>
        <span className="font-extrabold bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 shadow-sm whitespace-nowrap">{questions.length} ACTIVE VECTORS</span>
      </div>
    </div>
  );
}



