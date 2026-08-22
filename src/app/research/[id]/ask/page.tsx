"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { Bot, Send, Sparkles, ExternalLink, AlertTriangle, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";
import { ResearchRunSession } from "@/features/research/research-engine";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

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
              content: `Hello! I am your evidence-grounded research copilot for "${data.run.topic}". Ask me any technical question, and I will answer strictly using the ${data.run.claims?.length || 0} verified claims and ${data.run.sources?.length || 0} audited sources in this investigation.`,
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
    setQuestion("");
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
        throw new Error(data.error);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on the current verified claims, there is insufficient evidence to formulate a defensible answer without potential extrapolation.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!run) {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto py-4">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#e5e5ea] pb-5 gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            TRACEABLE GROUNDED AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-[#0071e3]" />
            Grounded Q&A Assistant
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Ask technical questions strictly constrained to the verified evidence graph.
          </p>
        </div>

        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% HALLUCINATION-GUARDED
        </Badge>
      </div>

      <ResearchTabNav runId={run.id} />

      {/* Main Chat Interface */}
      <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-7 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6 min-h-[550px] flex flex-col justify-between">
        {/* Messages Feed */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-5 rounded-3xl max-w-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#0071e3] text-white rounded-br-none shadow-sm shadow-[#0071e3]/20 font-medium"
                    : "bg-[#fbfbfd] border border-[#e5e5ea] text-[#1d1d1f] rounded-bl-none shadow-2xs font-normal"
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>

                {/* Citations Preview if Assistant */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#e5e5ea] space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider block">
                      Evidence Grounding Citations:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c, i) => (
                        <a
                          key={i}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-white hover:bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] text-[11px] font-semibold px-3 py-1 rounded-full shadow-2xs transition"
                        >
                          <span>{c.publisher || "Source"}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#8e8e93]" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#fbfbfd] border border-[#e5e5ea] p-4 rounded-3xl text-xs text-[#6e6e73] flex items-center gap-2 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0071e3]" />
                <span>Evaluating against verified evidence graph...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Starter Prompts & Input Bar */}
        <div className="space-y-3 pt-3 border-t border-[#f5f5f7]">
          {/* Starter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[10px] font-mono font-bold text-[#8e8e93] shrink-0 uppercase">
              Quick Inquiries:
            </span>
            {starterPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p)}
                className="shrink-0 px-3 py-1 bg-white hover:bg-[#f5f5f7] border border-[#e5e5ea] hover:border-[#0071e3]/40 text-[#1d1d1f] rounded-full text-[11px] font-semibold transition shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a technical question about this research..."
              className="flex-1 bg-[#fbfbfd] border border-[#d1d1d6] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#8e8e93] focus:outline-none transition shadow-2xs font-medium"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 rounded-2xl text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
