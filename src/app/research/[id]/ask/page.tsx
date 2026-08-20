"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Bot, Send, Sparkles, ExternalLink, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ id: string; title: string; publisher: string; url: string }>;
  hasSufficientEvidence?: boolean;
}

export default function AskAssistantPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const starterPrompts = [
    "What are the strongest verified claims?",
    "What conflicting evidence was found?",
    "What should I be careful about saying in a video?",
    "What are the most important audience question gaps?",
  ];

  useEffect(() => {
    fetch(`/api/research/${params.id}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRun(data.run);
          setMessages([
            {
              role: "assistant",
              content: `Hello! I am your research-grounded assistant for "${data.run.topic}". Ask me any technical question, and I will answer strictly using the ${data.run.claims?.length || 0} verified claims and ${data.run.sources?.length || 0} audited sources in this investigation.`,
              citations: [],
            },
          ]);
        }
      });
  }, [params.id]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || question;
    if (!q.trim() || loading || !run) return;

    const userMsg: Message = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`/api/research/${run.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            citations: data.citations || [],
            hasSufficientEvidence: data.hasSufficientEvidence,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error querying research assistant: " + data.error },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error connecting to research assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!run) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const [mode, setMode] = useState<"RUN" | "PROJECT">("RUN");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">GROUNDED AI INTERROGATION</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-400" />
            Research-Grounded AI Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Interrogate this research investigation with zero hallucinations. Answers are strictly backed by verified claims & sources.</p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setMode("RUN")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              mode === "RUN" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Run Session Mode
          </button>
          <button
            onClick={() => setMode("PROJECT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              mode === "PROJECT" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Project Knowledge Mode
          </button>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Starter Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 font-semibold uppercase mr-1">Suggested Prompts:</span>
        {starterPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs font-medium bg-slate-900 hover:bg-slate-850 text-indigo-300 border border-slate-800 px-3 py-1.5 rounded-xl transition shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="slate-card p-6 bg-slate-900/90 border-slate-800 min-h-[380px] space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-850 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm space-y-2 leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white font-medium shadow-md"
                    : msg.hasSufficientEvidence === false
                    ? "bg-amber-950/20 border border-amber-900/40 text-amber-200"
                    : "bg-slate-950 border border-slate-850 text-slate-200"
                }`}
              >
                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Citations block */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">CITED RESEARCH SOURCES:</span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c) => (
                        <a
                          key={c.id}
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-850 flex items-center gap-1 hover:underline"
                        >
                          {c.publisher || c.title} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-850 flex items-center justify-center text-indigo-400 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs font-mono text-indigo-400 animate-pulse">
                Synthesizing evidence-backed response...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-4 border-t border-slate-850"
        >
          <input
            type="text"
            placeholder="Ask a technical question grounded in this research..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
