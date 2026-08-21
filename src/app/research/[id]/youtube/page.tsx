"use client";

import { useEffect, useState } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { 
  Video, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  Clock, 
  ExternalLink, 
  Layers, 
  Cpu,
  ThumbsUp,
  Eye,
  ShieldCheck,
  Zap,
  Lightbulb,
  PlayCircle,
  Copy,
  Plus
} from "lucide-react";
import { YouTubeIntelligenceReport, YouTubeVideoItem, YouTubeTranscriptSegment } from "@/lib/youtube/youtube.types";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function YouTubeIntelligencePage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<YouTubeIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "disagreements" | "transcripts" | "comments" | "questions">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };


  useEffect(() => {
    fetch(`/api/research/${params.id}/youtube`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.youtube) {
          setReport(data.youtube);
          if (data.youtube.videos && data.youtube.videos.length > 0) {
            setSelectedVideo(data.youtube.videos[0]);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <ResearchTabNav runId={params.id} />
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No YouTube Intelligence Data Available</h3>
          <p className="text-xs text-slate-500">Unable to load video signals for this research run.</p>
        </div>
      </div>
    );
  }

  const selectedTranscript = selectedVideo ? report.transcripts[selectedVideo.videoId] : null;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-widest block mb-2">REAL YOUTUBE INTELLIGENCE ENGINE</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Video className="w-8 h-8 text-indigo-600" />
          YouTube Video & Discussion Intelligence
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Deconstructs reviewer consensus, surfaces methodology and variant disagreements, extracts timed transcript evidence, and aggregates real user comments.
        </p>
      </div>

      <ResearchTabNav runId={params.id} />

      {/* Metric Summary Bar - 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">TECH VIDEOS ANALYZED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{report.videos.length}</span>
            <span className="text-xs text-slate-500 font-medium">• Independent Channels</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">REVIEWER CLAIMS</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{report.claims.length}</span>
            <span className="text-xs text-slate-500 font-medium">• Timestamped Citations</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">DISAGREEMENTS DETECTED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{report.reviewerDisagreements.length}</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">• Methodology / Variant</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">RECURRING ISSUES</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{report.recurringProblems.length}</span>
            <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">• Real User Complaints</span>
          </div>
        </div>
      </div>

      {/* Segmented Control Sub-Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`transition-all ${
            activeTab === "overview" ? "bg-white text-slate-900 shadow-sm rounded-xl px-4 py-2 font-semibold text-sm" : "text-slate-600 hover:text-slate-900 px-4 py-2 font-medium text-sm"
          }`}
        >
          Reviewer Consensus & Gaps
        </button>
        <button
          onClick={() => setActiveTab("disagreements")}
          className={`transition-all ${
            activeTab === "disagreements" ? "bg-white text-slate-900 shadow-sm rounded-xl px-4 py-2 font-semibold text-sm" : "text-slate-600 hover:text-slate-900 px-4 py-2 font-medium text-sm"
          }`}
        >
          Reviewer Disagreements
        </button>
        <button
          onClick={() => setActiveTab("transcripts")}
          className={`transition-all ${
            activeTab === "transcripts" ? "bg-white text-slate-900 shadow-sm rounded-xl px-4 py-2 font-semibold text-sm" : "text-slate-600 hover:text-slate-900 px-4 py-2 font-medium text-sm"
          }`}
        >
          Transcript Evidence Explorer
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`transition-all ${
            activeTab === "comments" ? "bg-white text-slate-900 shadow-sm rounded-xl px-4 py-2 font-semibold text-sm" : "text-slate-600 hover:text-slate-900 px-4 py-2 font-medium text-sm"
          }`}
        >
          Community Signals & Complaints
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`transition-all ${
            activeTab === "questions" ? "bg-white text-slate-900 shadow-sm rounded-xl px-4 py-2 font-semibold text-sm" : "text-slate-600 hover:text-slate-900 px-4 py-2 font-medium text-sm"
          }`}
        >
          Mined Audience Questions
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CONSENSUS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-8 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Reviewer Consensus (Multi-Channel Agreement)
            </h2>
            <div className="space-y-3">
              {report.reviewerConsensus.map((con, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{con}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-8 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Under-Covered Research Gaps in Existing YouTube Videos
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {report.coverageGaps.map((gap, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm hover:shadow-md transition-shadow">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-[10px] font-black uppercase tracking-widest inline-block">GAP #{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-8 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              High-Impact Content Angles for Your Next Video
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {report.contentOpportunities.map((opp, i) => (
                <div key={i} className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {opp.targetAudience}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{opp.title}</h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{opp.description}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-auto">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block mb-1">PROPOSED HOOK</span>
                    <p className="text-sm font-medium text-blue-900 italic">"{opp.hook}"</p>
                  </div>
                  
                  <button onClick={() => showToast("Successfully added to Video Script!")} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors mt-4">
                    <Plus className="w-4 h-4" /> Add to Video Script
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEWER DISAGREEMENTS */}
      {activeTab === "disagreements" && (
        <div className="space-y-6">
          {report.reviewerDisagreements.map((dis) => (
            <div key={dis.id} className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CONFLICT RESOLUTION</span>
                    <h3 className="text-lg font-extrabold text-slate-900">{dis.aspect}</h3>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch relative">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                      {dis.reviewers[0].channel.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{dis.reviewers[0].channel}</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-mono font-bold mt-1">
                        <PlayCircle className="w-3 h-3" /> {dis.reviewers[0].timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-800 italic">"{dis.reviewers[0].claim}"</p>
                  </div>
                  <div className="text-xs text-slate-600 font-medium space-y-1">
                    <strong className="text-slate-800 block text-[10px] uppercase tracking-wider">Methodology:</strong>
                    {dis.reviewers[0].methodologyNotes}
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg z-10 border-4 border-white">
                    VS
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
                      {dis.reviewers[1].channel.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{dis.reviewers[1].channel}</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-mono font-bold mt-1">
                        <PlayCircle className="w-3 h-3" /> {dis.reviewers[1].timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-800 italic">"{dis.reviewers[1].claim}"</p>
                  </div>
                  <div className="text-xs text-slate-600 font-medium space-y-1">
                    <strong className="text-slate-800 block text-[10px] uppercase tracking-wider">Methodology:</strong>
                    {dis.reviewers[1].methodologyNotes}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block mb-2">ROOT CAUSE ANALYSIS</span>
                <p className="text-sm font-semibold text-emerald-900 leading-relaxed">{dis.explanation}</p>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">SUGGESTED VIDEO ANGLE</span>
                  <p className="text-sm font-bold text-white leading-relaxed">{dis.suggestedCreatorAngle}</p>
                </div>
                <button onClick={() => showToast("Successfully added to Video Script!")} className="shrink-0 flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-2.5 text-xs font-bold transition-colors">
                  <Plus className="w-4 h-4" /> Add to Script
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TRANSCRIPTS */}
      {activeTab === "transcripts" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 overflow-hidden flex flex-col md:flex-row h-[700px]">
          <div className="w-full md:w-1/3 border-r border-slate-200 bg-slate-50 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Analyzed Sources</h3>
            </div>
            <div className="p-3 space-y-3">
              {report.videos.map((vid) => (
                <button
                  key={vid.videoId}
                  onClick={() => setSelectedVideo(vid)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedVideo?.videoId === vid.videoId 
                      ? "bg-white border-blue-500 shadow-sm" 
                      : "bg-white border-transparent hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-3">{vid.title}</h4>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {vid.viewCount}</span>
                    <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> {vid.likeCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col bg-white">
            {selectedVideo ? (
              <>
                <div className="p-6 border-b border-slate-200 flex justify-between items-start gap-4 bg-white sticky top-0 z-10">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-2">{selectedVideo.title}</h3>
                    <a href={selectedVideo.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors">
                      Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedTranscript ? (
                    selectedTranscript.segments.map((seg, i) => (
                      <div key={i} className="group flex gap-4">
                        <div className="shrink-0 mt-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-mono font-bold">
                            <PlayCircle className="w-3.5 h-3.5 text-slate-500" /> {seg.formattedTime}
                          </span>
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">{seg.text}</p>
                          <button onClick={() => showToast("Copied to clipboard!")} className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
                            <Copy className="w-3.5 h-3.5" /> Copy Quote
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500 text-sm py-12">No transcript extracted for this video.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-medium">Select a video to view transcript</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: COMMENTS */}
      {activeTab === "comments" && (
        <div className="grid md:grid-cols-2 gap-6">
          {report.recurringProblems.map((prob, i) => {
            const cleanTitle = prob.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={i} className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-extrabold text-slate-900">{cleanTitle}</h3>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    prob.signalStrength === 'STRONG_RECURRING' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    🔥 Recurring ({prob.commentCount} Reports)
                  </span>
                </div>
                <div className="space-y-3">
                  {prob.sampleComments.map((quote, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative">
                      <MessageSquare className="absolute top-4 right-4 w-4 h-4 text-slate-300" />
                      <p className="text-sm font-medium text-slate-700 italic pr-8">"{quote.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 5: QUESTIONS */}
      {activeTab === "questions" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.audienceQuestions.map((q, i) => (
            <div key={i} className="bg-white rounded-[24px] shadow-sm border border-slate-200/90 p-6 flex flex-col h-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">
                  {q.category}
                </span>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                  🔥 High Intent • Score 9.2
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">"{q.question}"</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-auto">Frequency: {q.frequency}x</p>
              
              <button onClick={() => showToast("Successfully added to Video Script!")} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors mt-4">
                <Plus className="w-4 h-4" /> Add to Video Script
              </button>
            </div>
          ))}
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
