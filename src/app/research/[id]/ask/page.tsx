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
  const [notFound, setNotFound] = useState(false);
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
            hasSufficientEvidence: data.hasSufficientEvidence
          }
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "I encountered an error trying to process that question against the evidence graph." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-ink">Run Not Found</h2>
        <p className="text-ink/80">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <Bot className="w-8 h-8 text-citation" /> Grounded Q&A Assistant
          </h1>
          <p className="text-sm text-muted mt-1 font-medium">Ask questions strictly constrained to the verified evidence in this research session.</p>
        </div>
      </div>

      <ResearchTabNav runId={run.id} />

      <div className="bg-card rounded-[24px] shadow-sm border border-line overflow-hidden flex flex-col min-h-[500px]">
        {/* Starter Prompts */}
        <div className="bg-paper border-b border-line p-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-muted font-mono tracking-widest uppercase mr-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-citation" /> STARTER PROMPTS:</span>
          {starterPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs font-bold bg-card hover:bg-citation-bg text-citation border border-citation/20 hover:border-citation/20 px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-paper/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-[20px] p-5 shadow-sm ${
                msg.role === "user" 
                  ? "bg-citation text-white rounded-br-none" 
                  : "bg-card border border-line text-ink rounded-bl-none"
              }`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line">
                    <Bot className="w-4 h-4 text-citation" />
                    <span className="text-xs font-bold text-muted uppercase tracking-widest font-mono">EVIDENCE ENGINE</span>
                    {msg.hasSufficientEvidence === false && (
                      <span className="ml-auto flex items-center gap-1 text-[10px] font-mono font-bold bg-warning-bg text-warning px-2 py-0.5 rounded-md border border-warning/25">
                        <AlertTriangle className="w-3 h-3" /> LOW EVIDENCE COVERAGE
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>

                {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-line space-y-2">
                    <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-verified" /> TRACEABLE CITATIONS ({msg.citations.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cit, i) => (
                        <a 
                          key={i} 
                          href={cit.url} 
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-citation-bg hover:bg-citation/20 text-citation border border-citation/20 px-2.5 py-1 rounded-md transition-colors font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {cit.publisher}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-line rounded-[20px] rounded-bl-none p-5 shadow-sm flex items-center gap-3 text-sm font-bold text-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-citation/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-citation/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-citation/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Querying verification graph...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-line">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <HelpCircle className="w-5 h-5 text-muted absolute left-4" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a technical question about the findings..."
              className="w-full bg-paper border-2 border-line rounded-[16px] pl-12 pr-14 py-4 text-sm font-bold text-ink focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all placeholder:text-muted placeholder:font-medium"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="absolute right-3 bg-citation hover:bg-citation text-white p-2.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
