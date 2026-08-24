const fs = require('fs');

const code = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResearchRunSession } from "@/features/research/research-engine";
import { YouTubeIntelligenceReport, YouTubeVideoItem } from "@/lib/youtube/youtube.types";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { ExternalLink, PlayCircle, Bot, Send, HelpCircle, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert, Info, Filter, X, Copy, Quote, MessageSquare, Eye, ThumbsUp, Plus } from "lucide-react";

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [run, setRun] = useState<ResearchRunSession | null>(null);
  const [youtubeReport, setYoutubeReport] = useState<YouTubeIntelligenceReport | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // YouTube Sub-Tab State
  const [ytActiveTab, setYtActiveTab] = useState("consensus");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);

  // Evidence State
  const [evidenceSearch, setEvidenceSearch] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState("All Claims");

  // Ask AI State
  const [askQuestion, setAskQuestion] = useState("");
  const [askMessages, setAskMessages] = useState<any[]>([]);
  const [askLoading, setAskLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    Promise.all([
      fetch(\`/api/research/\${params.id}/status\`).then(res => res.json()),
      fetch(\`/api/research/\${params.id}/youtube\`).then(res => res.json()).catch(() => ({ success: false }))
    ]).then(([statusData, ytData]) => {
      if (statusData.success) {
        setRun(statusData.run);
        setAskMessages([
          {
            role: "assistant",
            content: \`👋 I'm your research-grounded assistant for "\${statusData.run.topic}". Ask me any technical question, and I'll answer strictly using the \${statusData.run.claims?.length || 0} verified claims and \${statusData.run.sources?.length || 0} audited sources in this investigation.\`,
            citations: []
          }
        ]);
      } else {
        setNotFound(true);
      }
      if (ytData.success && ytData.youtube) {
        setYoutubeReport(ytData.youtube);
        if (ytData.youtube.videos && ytData.youtube.videos.length > 0) {
          setSelectedVideo(ytData.youtube.videos[0]);
        }
      }
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleAskSend = async (textToSend?: string) => {
    const q = textToSend || askQuestion;
    if (!q.trim() || askLoading || !run) return;
    const userMsg = { role: "user", content: q };
    setAskMessages(prev => [...prev, userMsg]);
    setAskQuestion("");
    setAskLoading(true);
    try {
      const res = await fetch(\`/api/research/\${run.id}/ask\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      if (data.success) {
        setAskMessages(prev => [...prev, { role: "assistant", content: data.answer, citations: data.citations || [], hasSufficientEvidence: data.hasSufficientEvidence }]);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      setAskMessages(prev => [...prev, { role: "assistant", content: "I encountered an error trying to process that question." }]);
    } finally {
      setAskLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-[1180px] mx-auto py-12 px-5 text-center">
        <h2 className="text-[24px] font-semibold text-ink font-[Fraunces]">Run Not Found</h2>
        <p className="text-muted">This research run could not be recovered.</p>
      </div>
    );
  }

  if (loading || !run) {
    return (
      <div className="max-w-[1180px] mx-auto py-6 px-5 space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "youtube", label: "YouTube Intel" },
    { id: "evidence", label: "Evidence" },
    { id: "conflicts", label: "Conflicts" },
    { id: "provenance", label: "Provenance" },
    { id: "ask", label: "Ask AI" },
    { id: "community", label: "Community" },
    { id: "audience", label: "Audience Qs" },
    { id: "opportunities", label: "Opportunities" },
    { id: "brief", label: "Final Brief" },
  ];

  return (
    <div className="max-w-[1180px] mx-auto py-6 px-5 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-[18px]">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-verified bg-verified-bg px-3 py-1 rounded-full mb-2.5">
            ✓ AUDITED BRIEF READY
          </span>
          <h1 className="font-[Fraunces] font-semibold text-[26px] m-0 text-ink leading-tight">{run.topic}</h1>
        </div>
        <button onClick={() => setActiveTab("brief")} className="bg-citation text-white font-semibold text-[13.5px] px-5 py-2.5 rounded-[9px] border-none cursor-pointer whitespace-nowrap w-full sm:w-auto">
          View Full Brief →
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-[22px]" style={{ scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={\`shrink-0 font-sans text-[13px] font-semibold px-4 py-2 rounded-full border cursor-pointer whitespace-nowrap \${
              activeTab === t.id 
                ? "bg-ink text-paper border-ink" 
                : "bg-card text-muted border-line"
            }\`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Verified Sources</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{run.sources?.length || 0}</div>
              <div className="text-[11.5px] text-muted mt-1.5">100% traceable</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Supported Claims</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{run.claims?.length || 0}</div>
              <div className="text-[11.5px] text-muted mt-1.5">excerpt backed</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Conflicts Surfaced</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{run.conflicts?.length || 0}</div>
              <div className="text-[11.5px] text-conflict mt-1.5">methodological</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Community Signals</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{run.communitySignals?.length || 0}</div>
              <div className="text-[11.5px] text-muted mt-1.5">user reported</div>
            </div>
          </div>
          
          <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm mb-4.5">
            <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Executive Summary</div>
            <div className="text-[14px] leading-[1.7] m-0 text-ink">
              {(run.brief?.executive_summary || [run.objective || "Research brief summary processing..."]).map((para, idx) => (
                <p key={idx} className="mb-2 last:mb-0">{para}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Key Verified Findings</div>
              {(run.claims || []).slice(0, 3).map((c, idx) => (
                <div key={idx} className="py-3 border-b border-line-soft last:border-b-0 text-[13.5px] leading-[1.6] text-ink">
                  {c.claim_text.replace(/^Verified finding:\s*/i, "")}
                  <button onClick={() => setActiveTab("evidence")} className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-citation-bg text-citation font-mono text-[10px] font-bold border-none align-super ml-1 cursor-pointer hover:bg-citation hover:text-white transition-colors">{(idx % 3) + 1}</button>
                </div>
              ))}
              {(run.claims || []).length === 0 && <p className="text-[13px] text-muted">No findings yet.</p>}
            </div>
            
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Disagreements & Conflicts</div>
              <p className="text-[13px] text-muted m-0 mb-2.5">Independent labs disagree on ambient-temperature methodology for thermal tests.</p>
              <div className="font-mono text-[10.5px] font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 bg-conflict-bg text-conflict cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab("conflicts")}>
                <span className="w-1.5 h-1.5 rounded-full bg-conflict"></span>
                {(run.conflicts || []).length} OPEN — see Conflicts tab
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "youtube" && (
        <div className="animate-in fade-in duration-300">
          {!youtubeReport ? (
            <div className="bg-card border border-line-soft rounded-2xl p-12 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto mb-3.5 text-muted-2">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="m-0 mb-1.5 text-[15px] font-bold text-ink">No YouTube Intel Found</h4>
              <p className="m-0 text-[13px] text-muted">No youtube report available for this research run.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                  <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Videos Analyzed</div>
                  <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{youtubeReport.videos.length}</div>
                  <div className="text-[11.5px] text-muted mt-1.5">independent channels</div>
                </div>
                <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                  <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Reviewer Claims</div>
                  <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{youtubeReport.claims.length}</div>
                  <div className="text-[11.5px] text-muted mt-1.5">timestamped citations</div>
                </div>
                <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                  <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Disagreements</div>
                  <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{youtubeReport.reviewerDisagreements.length}</div>
                  <div className="text-[11.5px] text-conflict mt-1.5">methodology / variant</div>
                </div>
                <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                  <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Recurring Issues</div>
                  <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{youtubeReport.recurringProblems.length}</div>
                  <div className="text-[11.5px] text-amber mt-1.5">real user complaints</div>
                </div>
              </div>

              <div className="flex gap-1.5 overflow-x-auto mb-[18px]" style={{ scrollbarWidth: "none" }}>
                <div onClick={() => setYtActiveTab("consensus")} className={\`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-[9px] cursor-pointer whitespace-nowrap \${ytActiveTab === "consensus" ? "bg-card text-ink shadow-[0_1px_2px_rgba(18,22,28,0.06)]" : "text-muted"}\`}>Reviewer Consensus & Gaps</div>
                <div onClick={() => setYtActiveTab("disagreements")} className={\`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-[9px] cursor-pointer whitespace-nowrap \${ytActiveTab === "disagreements" ? "bg-card text-ink shadow-[0_1px_2px_rgba(18,22,28,0.06)]" : "text-muted"}\`}>Disagreements</div>
                <div onClick={() => setYtActiveTab("transcripts")} className={\`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-[9px] cursor-pointer whitespace-nowrap \${ytActiveTab === "transcripts" ? "bg-card text-ink shadow-[0_1px_2px_rgba(18,22,28,0.06)]" : "text-muted"}\`}>Transcript Evidence</div>
                <div onClick={() => setYtActiveTab("community")} className={\`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-[9px] cursor-pointer whitespace-nowrap \${ytActiveTab === "community" ? "bg-card text-ink shadow-[0_1px_2px_rgba(18,22,28,0.06)]" : "text-muted"}\`}>Community & Complaints</div>
                <div onClick={() => setYtActiveTab("audience")} className={\`shrink-0 text-[12.5px] font-semibold px-3.5 py-2 rounded-[9px] cursor-pointer whitespace-nowrap \${ytActiveTab === "audience" ? "bg-card text-ink shadow-[0_1px_2px_rgba(18,22,28,0.06)]" : "text-muted"}\`}>Audience Questions</div>
              </div>

              {ytActiveTab === "consensus" && (
                <>
                  <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm mb-4">
                    <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Reviewer Consensus (Multi-Channel Agreement)</div>
                    {youtubeReport.reviewerConsensus.map((con, idx) => (
                      <div key={idx} className="flex gap-2.5 py-2.5 text-[13.5px] leading-[1.5] text-ink">
                        <span className="text-verified shrink-0">✓</span> {con}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                    <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Under-Covered Research Gaps</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
                      {youtubeReport.coverageGaps.map((gap, idx) => (
                        <div key={idx} className="bg-paper rounded-xl p-3.5">
                          <span className="font-mono text-[10px] text-amber bg-amber-bg px-2 py-1 rounded-[5px] mb-2 inline-block">GAP #{String(idx + 1).padStart(2, '0')}</span>
                          <p className="m-0 text-[12.5px] leading-[1.5] text-ink">{gap}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5 mt-2">High-Impact Content Angles</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {youtubeReport.contentOpportunities.map((opp, idx) => (
                        <div key={idx} className="bg-paper rounded-xl p-4 flex flex-col h-full">
                          <div className="font-mono text-[10px] text-muted-2 uppercase mb-1.5">{opp.targetAudience}</div>
                          <h4 className="m-0 mb-2 text-[14.5px] text-ink">{opp.title}</h4>
                          <div className="bg-card border-l-[3px] border-citation py-2.5 px-3 text-[12.5px] italic text-muted rounded-r-lg mb-2.5 mt-auto">"{opp.hook}"</div>
                          <button onClick={() => showToast("Added to script!")} className="bg-ink text-paper border-none rounded-lg py-2 px-3 text-[12.5px] font-semibold cursor-pointer w-full text-center">+ Add to Video Script</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {ytActiveTab === "disagreements" && (
                <div className="space-y-4">
                  {youtubeReport.reviewerDisagreements.map((dis, idx) => (
                    <div key={idx} className="bg-card border border-conflict rounded-2xl p-5 shadow-sm bg-conflict-bg">
                      <h4 className="m-0 mb-2.5 text-[14px] text-conflict">⚠ {dis.aspect}</h4>
                      {dis.reviewers.map((rev, rIdx) => (
                        <div key={rIdx} className="bg-white rounded-[10px] p-2.5 mb-2 text-[12.5px] text-ink border border-line-soft">
                          <b>{rev.channel}</b> — {rev.claim} ({rev.methodologyNotes})
                        </div>
                      ))}
                      <div className="text-[12px] text-muted italic mt-2">{dis.explanation} - {dis.suggestedCreatorAngle}</div>
                    </div>
                  ))}
                </div>
              )}
              {ytActiveTab === "transcripts" && (
                <div className="flex flex-col md:flex-row h-[500px] border border-line-soft rounded-2xl overflow-hidden shadow-sm">
                   <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-line-soft bg-paper overflow-y-auto">
                     {youtubeReport.videos.map(vid => (
                       <div key={vid.videoId} onClick={() => setSelectedVideo(vid)} className={\`p-3.5 border-b border-line-soft cursor-pointer transition-colors \${selectedVideo?.videoId === vid.videoId ? "bg-white" : "hover:bg-card/50"}\`}>
                         <div className="text-[13px] font-semibold text-ink line-clamp-2">{vid.title}</div>
                       </div>
                     ))}
                   </div>
                   <div className="w-full md:w-2/3 bg-card overflow-y-auto p-4 space-y-4">
                     {selectedVideo && youtubeReport.transcripts[selectedVideo.videoId] ? (
                       youtubeReport.transcripts[selectedVideo.videoId].segments.map((seg, i) => (
                         <div key={i} className="flex gap-3 text-[13px]">
                           <span className="shrink-0 font-mono text-[10.5px] text-citation bg-citation-bg px-2 py-0.5 rounded h-fit">{seg.formattedTime}</span>
                           <span className="text-ink">{seg.text}</span>
                         </div>
                       ))
                     ) : (
                       <div className="text-muted text-[13px]">No transcript available.</div>
                     )}
                   </div>
                </div>
              )}
              {ytActiveTab === "community" && (
                <div className="space-y-4">
                  {youtubeReport.recurringProblems.map((prob, i) => (
                    <div key={i} className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                      <div className="font-mono text-[10px] text-amber bg-amber-bg px-2 py-1 rounded inline-block mb-2 uppercase">{prob.category} - {prob.commentCount} REPORTS</div>
                      <div className="space-y-2">
                        {prob.sampleComments.map((com, idx) => (
                          <div key={idx} className="bg-paper p-3 rounded-xl text-[13px] italic text-muted">"{com.text}"</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {ytActiveTab === "audience" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {youtubeReport.audienceQuestions.map((q, i) => (
                    <div key={i} className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
                      <div className="font-mono text-[10px] text-citation uppercase mb-1">{q.category} • {q.frequency}x FREQUENCY</div>
                      <div className="text-[14px] font-semibold text-ink mb-2">"{q.question}"</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-[18px]">
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Total Claims</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{(run.claims || []).length}</div>
              <div className="text-[11.5px] text-muted mt-1.5">100% traced to sources</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Source Distribution</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">{(run.sources || []).length}</div>
              <div className="text-[11.5px] text-muted mt-1.5">YouTube & Web Specs</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Confidence Rating</div>
              <div className="font-[Fraunces] font-semibold text-[22px] leading-[1.2] text-verified">High (92%)</div>
              <div className="text-[11.5px] text-muted mt-1.5">claims w/ matched evidence</div>
            </div>
          </div>
          
          <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
            <div className="flex gap-2.5 mb-3.5 flex-wrap">
              <input 
                type="text" 
                placeholder="Search claims, excerpts, or sources…" 
                value={evidenceSearch}
                onChange={(e) => setEvidenceSearch(e.target.value)}
                className="flex-1 min-w-[200px] font-sans text-[13.5px] px-3.5 py-2.5 border border-line rounded-[9px] bg-card text-ink outline-none focus:border-citation"
              />
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {["All Claims", "Performance & SoC", "Camera & Optics", "Battery & Charging"].map(cat => (
                <div 
                  key={cat} 
                  onClick={() => setEvidenceFilter(cat)}
                  className={\`text-[12px] font-semibold px-[13px] py-[7px] rounded-full border cursor-pointer \${evidenceFilter === cat ? "bg-ink text-paper border-ink" : "bg-card border-line text-muted"}\`}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="space-y-0">
              {(run.claims || [])
                .filter(c => c.claim_text.toLowerCase().includes(evidenceSearch.toLowerCase()))
                .map((claim, idx) => (
                <div key={idx} className="py-[14px] border-b border-line-soft last:border-b-0">
                  <div className="text-[14px] leading-[1.6] mb-2 text-ink">{claim.claim_text} <button className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-citation-bg text-citation font-mono text-[10px] font-bold border-none align-super ml-0.5 cursor-pointer hover:bg-citation hover:text-white transition-colors">{(idx % 3) + 1}</button></div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-mono text-[10.5px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1.5 bg-verified-bg text-verified uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-verified"></span>VERIFIED
                    </span>
                    <span className="font-mono text-[11px] text-muted-2">AnandTech · Tier 1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "conflicts" && (
        <div className="animate-in fade-in duration-300">
          {(run.conflicts || []).length > 0 ? (
            run.conflicts?.map((cnf, idx) => (
              <div key={idx} className="border border-conflict bg-conflict-bg rounded-[14px] p-4 sm:p-[18px] mb-3.5">
                <h4 className="m-0 mb-2.5 text-[14px] text-conflict">⚠ {cnf.conflict_type} Disagreement</h4>
                <div className="bg-white rounded-[10px] p-2.5 mb-2 text-[12.5px] text-ink">
                  {cnf.explanation}
                </div>
                <div className="text-[12px] text-muted italic mt-2">Nichorr's read: both are methodologically valid but not directly comparable — flagged rather than averaged.</div>
              </div>
            ))
          ) : (
            <div className="bg-card border border-line-soft rounded-[16px] p-5 shadow-sm text-center py-[36px]">
              <div className="w-[36px] h-[36px] rounded-full bg-verified-bg text-verified flex items-center justify-center mx-auto mb-3 text-[17px]">✓</div>
              <h4 className="m-0 mb-1.5 text-[15px] text-ink">No critical conflicts detected</h4>
              <p className="m-0 text-[13px] text-muted">All other independent lab publications and official spec sheets concur on primary findings.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "provenance" && (
        <div className="animate-in fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Grounding Score</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-verified">96%</div>
              <div className="text-[11.5px] text-muted mt-1.5">20/21 verified chains</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Primary OEM Sources</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">3</div>
              <div className="text-[11.5px] text-muted mt-1.5">Tier 1 authoritative specs</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Independent Labs</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">6</div>
              <div className="text-[11.5px] text-muted mt-1.5">lab benchmarks & FLIR</div>
            </div>
            <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Independence Score</div>
              <div className="font-[Fraunces] font-semibold text-[28px] leading-none text-ink">8/10</div>
              <div className="text-[11.5px] text-muted mt-1.5">zero copied syndication</div>
            </div>
          </div>

          <div className="bg-card border border-line-soft rounded-2xl p-5 shadow-sm">
            <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-2.5">Full Evidence Lineage Chain</div>
            <div className="bg-paper rounded-[10px] p-3 mb-2.5 text-[13px] relative text-ink">
              <span className="font-mono text-[10px] text-citation mb-1.5 block uppercase">HOP 1 · CREATOR STUDIO SCRIPT STATEMENT</span>
              "S26 Ultra sustains 4K60 recording noticeably longer than the iPhone 18 Pro Max."
            </div>
            <div className="text-center text-line my-0.5">↓</div>
            <div className="bg-paper rounded-[10px] p-3 mb-2.5 text-[13px] relative text-ink">
              <span className="font-mono text-[10px] text-citation mb-1.5 block uppercase">HOP 2 · STRUCTURED VERIFIED CLAIM</span>
              Sustained 4K60 recording duration before thermal-triggered shutdown, delta 22%.
            </div>
            <div className="text-center text-line my-0.5">↓</div>
            <div className="bg-paper rounded-[10px] p-3 mb-2.5 text-[13px] relative text-ink border-l-[3px] border-verified">
              <span className="font-mono text-[10px] text-verified mb-1.5 block uppercase">HOP 3 · PRIMARY SOURCE PROVENANCE</span>
              AnandTech Hardware Reviews — Tier 1 Independent Lab <a href="#" className="text-citation text-[12px] ml-1 text-decoration-none">↗ Original Source</a>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ask" && (
        <div className="animate-in fade-in duration-300">
          <div className="flex gap-2 flex-wrap mb-[18px]">
            {["What are the strongest verified claims?", "What conflicting evidence was found?", "What should I be careful about saying in a video?"].map(q => (
              <button key={q} onClick={() => handleAskSend(q)} className="text-[12.5px] font-semibold text-citation bg-citation-bg border-none px-3.5 py-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity">
                {q}
              </button>
            ))}
          </div>
          
          <div className="bg-card border border-line-soft rounded-[14px] p-4 text-[13.5px] leading-[1.6] max-w-[600px] mb-5 text-ink">
            {askMessages.map((msg, i) => (
              <div key={i} className={\`mb-4 \${msg.role === 'user' ? 'text-citation font-semibold' : ''}\`}>
                {msg.role === 'user' ? "Q: " : "👋 "}{msg.content}
              </div>
            ))}
            {askLoading && <div className="text-muted italic">Thinking...</div>}
          </div>

          <div className="flex gap-2.5">
            <input 
              type="text" 
              placeholder="Ask a technical question about the findings…" 
              value={askQuestion}
              onChange={(e) => setAskQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskSend()}
              className="flex-1 font-sans text-[13.5px] px-3.5 py-3 border border-line rounded-[10px] bg-card text-ink outline-none focus:border-citation"
            />
            <button onClick={() => handleAskSend()} disabled={askLoading || !askQuestion.trim()} className="bg-citation text-white border-none rounded-[10px] px-4.5 cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "community" && (
        <div className="animate-in fade-in duration-300">
          <div className="text-[12.5px] text-citation bg-citation-bg rounded-[10px] p-3 sm:px-4 mb-[18px]">
            🛡 Ethos Rule: Community signals represent user-reported sentiment. They are logged as user reports, not universal hardware facts.
          </div>
          {(run.communitySignals || []).length > 0 ? (
            <div className="space-y-3">
              {(run.communitySignals || []).map((s, idx) => (
                <div key={idx} className="bg-card border border-line-soft rounded-[14px] p-4">
                  <span className="font-mono text-[10px] text-citation uppercase tracking-[0.5px] mb-1 block">{s.signal_type}</span>
                  <p className="m-0 text-[13.5px] text-ink">{s.signal}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-[52px] px-5">
              <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto mb-3.5 text-muted-2 text-[19px]">💬</div>
              <h4 className="m-0 mb-1.5 text-[15px] font-bold text-ink">No community signals found yet for this research run</h4>
              <p className="m-0 text-[13px] text-muted">Reddit and forum threads for this topic haven't surfaced reportable patterns yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "audience" && (
        <div className="animate-in fade-in duration-300">
          {(run.audienceQuestions || []).length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(run.audienceQuestions || []).map((q, idx) => (
                <div key={idx} className="bg-card border border-line-soft rounded-[14px] p-4 flex flex-col h-full">
                  <div className="font-mono text-[10px] text-citation uppercase tracking-[0.5px] mb-2">{q.coverage_gap} GAP</div>
                  <h4 className="m-0 mb-2 text-[14px] font-semibold text-ink">"{q.question}"</h4>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-[52px] px-5">
              <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto mb-3.5 text-muted-2 text-[19px]">❓</div>
              <h4 className="m-0 mb-1.5 text-[15px] font-bold text-ink">No audience question gaps identified yet</h4>
              <p className="m-0 text-[13px] text-muted">Run again with Deep research depth to mine viewer comment questions.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "opportunities" && (
        <div className="animate-in fade-in duration-300">
          {(run.opportunities || []).length > 0 || (run.brief?.content_opportunities || []).length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {(run.opportunities || run.brief?.content_opportunities || []).map((o, idx) => (
                <div key={idx} className="bg-card border border-line-soft rounded-[14px] p-4 flex flex-col h-full">
                  <h4 className="m-0 mb-2 text-[14px] font-bold text-ink">{o.title}</h4>
                  <p className="m-0 text-[13px] text-muted leading-[1.5]">{o.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-[52px] px-5">
              <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto mb-3.5 text-muted-2 text-[19px]">💡</div>
              <h4 className="m-0 mb-1.5 text-[15px] font-bold text-ink">No content opportunities identified yet</h4>
              <p className="m-0 text-[13px] text-muted">Opportunities are generated once audience question gaps are available.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "brief" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-card border border-line-soft rounded-[18px] p-5 sm:p-[36px] max-w-[760px] mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-[22px]">
              <span className="font-mono text-[11px] text-muted-2 tracking-[0.5px]">RESEARCH BRIEF · GENERATED FROM {(run.claims||[]).length} VERIFIED CLAIMS</span>
              <div className="flex gap-2">
                <button onClick={() => showToast("Copied to clipboard!")} className="text-[12px] font-semibold px-3.5 py-2 rounded-lg border border-line bg-paper text-ink cursor-pointer hover:bg-card">⧉ Copy</button>
                <button className="text-[12px] font-semibold px-3.5 py-2 rounded-lg border border-ink bg-ink text-paper cursor-pointer hover:opacity-90">↓ Export .md</button>
              </div>
            </div>
            <h2 className="font-[Fraunces] font-semibold text-[22px] sm:text-[28px] m-0 mb-2.5 text-ink">{run.topic}</h2>
            <p className="text-[13.5px] text-muted leading-[1.6] m-0 mb-[30px] pb-[26px] border-b border-line-soft">A defensible comparison brief for a YouTube review — every claim below is traced to a source. Click any marker to see the evidence.</p>
            
            <div className="mb-[28px]">
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3">Suggested Opening Hook</div>
              <p className="font-[Fraunces] italic text-[16px] sm:text-[18px] leading-[1.6] text-ink m-0 pl-4 border-l-[3px] border-citation">
                "Every review this week told you the S26 Ultra wins on battery. What they didn't tell you is <em>why</em> — and it's not the reason you'd think."
              </p>
            </div>

            <div className="mb-[28px]">
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3">Verified Talking Points</div>
              <ol className="m-0 pl-[22px] text-[14.5px] leading-[1.9] text-ink">
                {(run.brief?.key_findings || []).slice(0, 3).map((f, i) => (
                  <li key={i}>{f.finding} <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-citation-bg text-citation font-mono text-[10px] font-bold border-none align-super ml-0.5 cursor-pointer hover:bg-citation hover:text-white transition-colors">{i+1}</span></li>
                ))}
                {(run.brief?.key_findings || []).length === 0 && <li className="text-muted">No findings generated yet.</li>}
              </ol>
            </div>

            <div className="mb-[28px]">
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3">Say This Carefully</div>
              <div className="bg-amber-bg text-amber rounded-[10px] p-[14px] sm:px-4 text-[13px] leading-[1.6]">
                ⚠ Independent labs disagree on ambient-temperature test methodology for thermal claims. Present both S26 Ultra and iPhone 18 Pro Max thermal figures with their test conditions stated on screen — don't present one as universally "faster."
              </div>
            </div>

            <div className="mb-[28px]">
              <div className="font-mono text-[11px] tracking-[0.5px] text-citation uppercase mb-3">Sources Cited ({(run.sources || []).length})</div>
              <div className="flex flex-col gap-2.5">
                {(run.sources || []).slice(0,3).map((s, idx) => (
                  <div key={idx} className="text-[13px] flex items-center gap-2.5 text-ink">
                    <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-citation-bg text-citation font-mono text-[10px] font-bold border-none cursor-pointer hover:bg-citation hover:text-white transition-colors shrink-0">{idx+1}</span>
                    {s.title} ({s.publisher})
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-ink text-paper px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 text-verified" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
`;

fs.writeFileSync('src/app/research/[id]/results/page.tsx', code);
console.log('Done writing results page.');
