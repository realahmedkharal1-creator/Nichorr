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
  Lightbulb
} from "lucide-react";
import { YouTubeIntelligenceReport, YouTubeVideoItem, YouTubeTranscriptSegment } from "@/lib/youtube/youtube.types";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function YouTubeIntelligencePage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<YouTubeIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "disagreements" | "transcripts" | "comments" | "questions">("overview");

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
        <div className="slate-card p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No YouTube Intelligence Data Available</h3>
          <p className="text-xs text-slate-400">Unable to load video signals for this research run.</p>
        </div>
      </div>
    );
  }

  const selectedTranscript = selectedVideo ? report.transcripts[selectedVideo.videoId] : null;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="border-b border-slate-800/80 pb-4">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">REAL YOUTUBE INTELLIGENCE ENGINE</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Video className="w-7 h-7 text-indigo-400" />
          YouTube Video & Discussion Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deconstructs reviewer consensus, surfaces methodology and variant disagreements, extracts timed transcript evidence, and aggregates real user comments.
        </p>
      </div>

      <ResearchTabNav runId={params.id} />

      {/* Metric Summary Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="slate-card p-4 space-y-1 bg-slate-900/90 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">TECH VIDEOS ANALYZED</span>
          <p className="text-xl font-bold text-slate-100 font-mono">{report.videos.length}</p>
          <span className="text-[11px] text-indigo-400 font-mono">Independent Channels</span>
        </div>

        <div className="slate-card p-4 space-y-1 bg-slate-900/90 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">REVIEWER CLAIMS</span>
          <p className="text-xl font-bold text-slate-100 font-mono">{report.claims.length}</p>
          <span className="text-[11px] text-emerald-400 font-mono">Timestamped Citations</span>
        </div>

        <div className="slate-card p-4 space-y-1 bg-slate-900/90 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">DISAGREEMENTS DETECTED</span>
          <p className="text-xl font-bold text-slate-100 font-mono">{report.reviewerDisagreements.length}</p>
          <span className="text-[11px] text-amber-400 font-mono">Methodology / Variant</span>
        </div>

        <div className="slate-card p-4 space-y-1 bg-slate-900/90 border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">RECURRING ISSUES</span>
          <p className="text-xl font-bold text-slate-100 font-mono">{report.recurringProblems.length}</p>
          <span className="text-[11px] text-rose-400 font-mono">Real User Complaints</span>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "overview" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Reviewer Consensus & Gaps
        </button>
        <button
          onClick={() => setActiveTab("disagreements")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "disagreements" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Reviewer Disagreements ({report.reviewerDisagreements.length})
        </button>
        <button
          onClick={() => setActiveTab("transcripts")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "transcripts" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Transcript Evidence Explorer
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "comments" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Community Signals & Complaints ({report.recurringProblems.length})
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "questions" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-slate-200"
          }`}
        >
          Mined Audience Questions ({report.audienceQuestions.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CONSENSUS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Reviewer Consensus Card */}
          <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">Reviewer Consensus (Multi-Channel Agreement)</h2>
            </div>
            <div className="space-y-2.5">
              {report.reviewerConsensus.map((con, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 flex items-start gap-3">
                  <span className="text-emerald-400 text-xs font-mono font-bold shrink-0 mt-0.5">✓</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{con}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Under-Covered Research Gaps */}
          <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100">Under-Covered Research Gaps in Existing YouTube Videos</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {report.coverageGaps.map((gap, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-850 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold">GAP #{i + 1}</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Video Hooks */}
          <div className="slate-card p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-900/60 space-y-4">
            <div className="flex items-center gap-2 border-b border-indigo-900/40 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-100">High-Impact Content Angles for Your Next Video</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {report.contentOpportunities.map((opp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                    {opp.targetAudience}
                  </span>
                  <h3 className="text-xs font-bold text-slate-100">{opp.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{opp.description}</p>
                  <div className="p-2 rounded bg-indigo-950/60 border border-indigo-800/60 text-[11px] font-mono text-indigo-300">
                    Hook: {opp.hook}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEWER DISAGREEMENTS */}
      {activeTab === "disagreements" && (
        <div className="space-y-4">
          <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Why Do Top Tech Channels Disagree?</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically deconstructs conflicting benchmark claims into ambient temperatures, hardware silicon variants, or testing methods.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
              {report.reviewerDisagreements.length} DISAGREEMENTS AUDITED
            </span>
          </div>

          <div className="space-y-4">
            {report.reviewerDisagreements.map((dis) => (
              <div key={dis.id} className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-100">{dis.aspect}</h3>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    dis.disagreementType === 'HARDWARE_VARIANT' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                    'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    TYPE: {dis.disagreementType}
                  </span>
                </div>

                {/* Side by side reviewers */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {dis.reviewers.map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-400">{rev.channel}</span>
                        {rev.timestamp && (
                          <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" /> {rev.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 italic font-serif">"{rev.claim}"</p>
                      {rev.methodologyNotes && (
                        <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                          Methodology: {rev.methodologyNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanatory Synthesis */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">ROOT CAUSE & SYNTHESIS</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{dis.explanation}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-medium font-mono">Suggested Video Angle: {dis.suggestedCreatorAngle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRANSCRIPT EVIDENCE EXPLORER */}
      {activeTab === "transcripts" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Selector Sidebar */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider block">
              ANALYZED VIDEOS ({report.videos.length})
            </span>
            <div className="space-y-2">
              {report.videos.map((vid) => (
                <button
                  key={vid.videoId}
                  onClick={() => setSelectedVideo(vid)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all space-y-1.5 ${
                    selectedVideo?.videoId === vid.videoId
                      ? "bg-indigo-950/80 border-indigo-600 text-white shadow-md shadow-indigo-950/60"
                      : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400">
                    <span>{vid.channelTitle}</span>
                    <span>{vid.publishedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-2">{vid.title}</h4>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {(vid.viewCount || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {(vid.likeCount || 0).toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Viewer Main Column */}
          <div className="lg:col-span-2 space-y-4">
            {selectedVideo && (
              <div className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{selectedVideo.title}</h3>
                    <p className="text-xs text-indigo-400 font-mono mt-0.5">{selectedVideo.channelTitle}</p>
                  </div>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-mono font-semibold"
                  >
                    Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {selectedTranscript && selectedTranscript.status === "AVAILABLE" ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {selectedTranscript.segments.map((seg) => (
                      <div key={seg.segmentId} className="p-3 rounded-lg bg-slate-950 border border-slate-850 hover:border-indigo-800/60 transition space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <a
                            href={`${selectedVideo.url}&t=${Math.floor(seg.start)}s`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <Clock className="w-3 h-3" /> {seg.formattedTime}
                          </a>
                          <span className="text-slate-500">Segment #{seg.sequence}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2 bg-slate-950 rounded-xl border border-slate-850">
                    <p className="text-xs text-slate-400 font-mono">
                      Transcript status: {selectedTranscript?.status || "TRANSCRIPT_UNAVAILABLE"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Captions were not provided or available for this video track.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNITY SIGNALS & COMPLAINTS */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Recurring Hardware & Software Issues in YouTube Comments</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Parsed from viewer discussions across tested videos. Spam, promo bots, and generic reactions are filtered.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold">
              {report.recurringProblems.length} RECURRING SIGNALS
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {report.recurringProblems.map((prob) => (
              <div key={prob.id} className="slate-card p-5 bg-slate-900/90 border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">{prob.category}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    prob.signalStrength === 'STRONG_RECURRING' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                    prob.signalStrength === 'RECURRING' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-slate-850 text-slate-300 border-slate-700'
                  }`}>
                    {prob.signalStrength} ({prob.commentCount} REPORTS)
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">{prob.signalSummary}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-850">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Sample Viewer Quotes:</span>
                  {prob.sampleComments.map((sc, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 text-[11px] text-slate-300 italic border border-slate-850">
                      "{sc.text}"
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MINED AUDIENCE QUESTIONS */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          <div className="slate-card p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Top Unanswered Audience Questions from Comments</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Extracted from comments across tech review videos. Grouped by buying, variant, performance, and battery dilemmas.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold">
              {report.audienceQuestions.length} QUESTIONS MINED
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.audienceQuestions.map((q) => (
              <div key={q.id} className="slate-card p-4 bg-slate-900/90 border-slate-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                      {q.category}
                    </span>
                    <span className="text-slate-400">Score: {q.importanceScore}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 leading-snug">"{q.question}"</h4>
                </div>
                <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span>Frequency: {q.frequency}x</span>
                  <span className="text-indigo-400">Add to Video Script →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
