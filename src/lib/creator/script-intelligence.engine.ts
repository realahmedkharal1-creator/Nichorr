import {
  CreatorStudioReport,
  CreatorHook,
  CreatorTitle,
  ScriptSection,
  TalkingPoint,
  BRollSuggestion,
  BenchmarkVisualCard,
  ChapterSuggestion,
  ScriptSectionType,
  VerificationStatus,
  TargetVideoDuration,
  ScriptOutputMode,
} from "./creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "./production-preferences.types";
import { CreatorScriptTrainingProfile } from "./script-training.types";
import { ScriptTrainingService } from "./script-training.service";
import { ScriptQualityEngine } from "./quality/script-quality.engine";
import { ResearchRunSession } from "@/features/research/research-engine";
import { YouTubeIntelligenceReport } from "@/lib/youtube/youtube.types";

export class ScriptIntelligenceEngine {
  /**
   * Generates a complete, evidence-grounded Creator Studio production report from a research run session.
   * Supports target duration scaling: 8 min, 12 min (default), and 18 min,
   * customizable CreatorProductionPreferences, CreatorScriptTrainingProfile, and ScriptOutputMode.
   */
  static generateStudioReport(
    session: ResearchRunSession,
    targetDurationMinutes: TargetVideoDuration = 12,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    outputMode: ScriptOutputMode = "SCRIPT_READY"
  ): CreatorStudioReport {
    const hw = session.hardwareIntelligence;
    const yt = session.youtubeIntelligence;

    // 1. Determine Video Angle & Theme
    const videoAngle = this.determineVideoAngle(session, hw, yt);

    // 2. Generate Evidence-Grounded Hooks (if enabled)
    let hooks: CreatorHook[] = [];
    if (preferences.generateHooks) {
      hooks = this.generateHooks(session, hw, yt);
      if (profile) {
        hooks = hooks.map((h) => ({
          ...h,
          scriptWording: ScriptTrainingService.applyStyleGuards(h.scriptWording, profile),
        }));
      }
    }

    // 3. Generate Evidence-Grounded Title Options (if enabled)
    let titles: CreatorTitle[] = [];
    if (preferences.generateTitles) {
      titles = this.generateTitles(session, hw, yt);
      if (profile) {
        titles = titles.map((t) => ({
          ...t,
          title: ScriptTrainingService.applyStyleGuards(t.title, profile),
        }));
      }
    }

    // 4. Generate Talking Points with Fact-Check States (if enabled)
    let talkingPoints: TalkingPoint[] = [];
    if (preferences.generateTalkingPoints || preferences.generateScript) {
      talkingPoints = this.generateTalkingPoints(session, hw, yt, targetDurationMinutes);
      if (profile) {
        talkingPoints = talkingPoints.map((tp) => ({
          ...tp,
          statement: ScriptTrainingService.applyStyleGuards(tp.statement, profile),
        }));
      }
    }

    // 5. Generate Benchmark Visual Cards for Video Editors (if enabled)
    const benchmarkCards = preferences.generateBenchmarkCards ? this.generateBenchmarkCards(hw) : [];

    // 6. Generate Structured Script Sections with Timestamping & B-Roll
    let scriptSections: ScriptSection[] = [];
    let bRollList: BRollSuggestion[] = [];
    let chapters: ChapterSuggestion[] = [];

    if (preferences.generateScript) {
      const generated = this.generateScriptOutline(
        session,
        hw,
        yt,
        talkingPoints,
        benchmarkCards,
        targetDurationMinutes
      );
      scriptSections = generated.scriptSections;
      bRollList = preferences.generateBRoll ? generated.bRollList : [];
      chapters = preferences.generateChapters ? generated.chapters : [];

      if (!preferences.generateBRoll) {
        scriptSections = scriptSections.map((sec) => ({
          ...sec,
          bRollSuggestions: [],
        }));
      }
    } else if (preferences.generateChapters) {
      // Standalone chapters when script is OFF
      chapters = [
        { timestamp: "00:00", title: "Introduction & Setup", sectionType: "INTRO" },
        { timestamp: "01:30", title: "Specifications & Architecture", sectionType: "HARDWARE_SPECS" },
        { timestamp: "04:00", title: "Benchmark Performance", sectionType: "BENCHMARKS" },
        { timestamp: "08:00", title: "Thermals & Sustained Stability", sectionType: "THERMALS" },
        { timestamp: "10:30", title: "Final Verdict", sectionType: "VERDICT" },
      ];
    }

    // 7. Compile Fact Check Summary
    let totalVerified = 0;
    let totalNeedsContext = 0;
    let totalConflicted = 0;
    let totalDoNotSay = 0;

    for (const tp of talkingPoints) {
      if (tp.verificationStatus === "SUPPORTED") totalVerified++;
      else if (tp.verificationStatus === "NEEDS_CONTEXT") totalNeedsContext++;
      else if (tp.verificationStatus === "CONFLICTED") totalConflicted++;
      else if (tp.verificationStatus === "DO_NOT_SAY") totalDoNotSay++;
    }

    // 8. Generate Full Spoken Narration Script (when requested or script enabled)
    const fullNarrationScript = this.generateFullNarration(session.topic, scriptSections, profile);

    // 9. Generate Complete Markdown Export
    const rawMarkdownExport = this.generateMarkdownExport(
      session.topic,
      targetDurationMinutes,
      videoAngle,
      hooks,
      titles,
      scriptSections,
      talkingPoints,
      chapters,
      benchmarkCards
    );

    const partialReport: CreatorStudioReport = {
      researchRunId: session.id,
      topic: session.topic,
      targetDurationMinutes,
      outputMode,
      videoAngle,
      hooks,
      titles,
      scriptSections,
      talkingPoints,
      factCheckSummary: {
        totalVerified,
        totalNeedsContext,
        totalConflicted,
        totalDoNotSay,
      },
      bRollList,
      benchmarkCards,
      chapters,
      fullNarrationScript,
      rawMarkdownExport,
    };

    // 10. Run Deterministic Script Quality Review (Phase 69)
    try {
      partialReport.qualityReview = ScriptQualityEngine.reviewScript(session, partialReport, profile);
    } catch (e: any) {
      console.warn("Script quality review warning:", e.message);
    }

    return partialReport;
  }

  private static generateFullNarration(
    topic: string,
    sections: ScriptSection[],
    profile?: CreatorScriptTrainingProfile
  ): string {
    const lines: string[] = [];
    const toneNote = profile?.tone || "Authoritative and engaging";
    lines.push(`# COMPLETE SPOKEN NARRATION SCRIPT: ${topic.toUpperCase()}`);
    lines.push(`> Delivery Tone: ${toneNote} | Cadence: ${profile?.sentenceLengthPreference || "BALANCED"} | Technical Depth: ${profile?.technicalDepth || "ENTHUSIAST_CREATOR"}\n`);

    for (const sec of sections) {
      lines.push(`## [${sec.estimatedTimestamp}] ${sec.title.toUpperCase()}`);
      lines.push(`*(Goal: ${sec.goal})*\n`);

      const validTPs = sec.talkingPoints?.filter((tp) => tp.verificationStatus !== "DO_NOT_SAY") || [];
      if (validTPs.length === 0) {
        lines.push(`Welcome back to the channel. Today we are diving deep into the verified laboratory and real-world findings for ${topic}.\n`);
      } else {
        const spokenParagraph = validTPs.map((tp) => tp.statement).join(" ");
        lines.push(`${spokenParagraph}\n`);
      }

      if (sec.bRollSuggestions && sec.bRollSuggestions.length > 0) {
        lines.push(`> 🎬 **B-Roll Overlay**: ${sec.bRollSuggestions.map((b) => `[${b.visualType}] ${b.visualTitle}`).join(" | ")}\n`);
      }
    }

    return lines.join("\n");
  }

  private static determineVideoAngle(
    session: ResearchRunSession,
    hw?: any,
    yt?: YouTubeIntelligenceReport
  ) {
    const hasHardwareThrottling = hw && hw.thermalFindings?.some((t: any) => t.throttlingPercent > 15);
    const hasReviewerDisagreement = yt && yt.reviewerDisagreements.length > 0;
    const hasVariantConflict = hw && hw.conflicts?.some((c: any) => c.conflictType === "VARIANT_CONFLICT");

    let primaryAngle = "Comprehensive Evidence-Based Deep Dive";
    let narrativeTheme = "Exposing real-world performance, sustained thermal limits, and hardware nuances.";

    if (hasVariantConflict) {
      primaryAngle = "The Regional Silicon Truth: Don't Buy Until You Check Your Chip";
      narrativeTheme = "Uncovering major performance and battery differences between regional SoC variants.";
    } else if (hasHardwareThrottling) {
      primaryAngle = "The Thermal Throttling Reality: 60-Second Bursts vs Sustained Workloads";
      narrativeTheme = "Deconstructing why short synthetic benchmarks don't tell the full story for creators and gamers.";
    } else if (hasReviewerDisagreement) {
      primaryAngle = "Why Top Reviewers Disagree: Testing Methodology Deconstructed";
      narrativeTheme = "Explaining the technical differences behind conflicting review scores.";
    }

    return {
      primaryAngle,
      narrativeTheme,
      targetAudience: "Tech Enthusiasts & Buyers",
      confidenceRating: "HIGH" as const,
    };
  }

  private static generateHooks(
    session: ResearchRunSession,
    hw?: any,
    yt?: YouTubeIntelligenceReport
  ): CreatorHook[] {
    const hooks: CreatorHook[] = [];

    // 1. Data Hook (Benchmark Lead)
    if (hw && hw.comparisons.length > 0) {
      const topComp = hw.comparisons[0];
      const deltaStr = topComp.deltaPercent > 0 ? `+${topComp.deltaPercent}%` : `${topComp.deltaPercent}%`;
      hooks.push({
        id: "hook-data-1",
        category: "DATA_HOOK",
        headline: `The ${topComp.benchmarkName} Delta`,
        scriptWording: `You’ve probably seen the spec sheets, but in verified ${topComp.benchmarkName} laboratory testing, ${topComp.entityA.name} scores ${deltaStr} in ${topComp.metricName}. Here is what that actually means for your daily workflow.`,
        supportingClaimIds: ["cl-hw-1"],
        evidenceExcerpt: `${topComp.scoreA} vs ${topComp.scoreB} ${topComp.metricUnit} (${topComp.comparability})`,
        targetAudience: "Performance Seekers",
        confidence: "HIGH",
      });
    }

    // 2. Problem Hook (Community Complaint)
    if (yt && yt.recurringProblems.length > 0) {
      const topProblem = yt.recurringProblems[0];
      hooks.push({
        id: "hook-prob-1",
        category: "PROBLEM_HOOK",
        headline: `The Hidden ${topProblem.category} Issue`,
        scriptWording: `Before you spend over a thousand dollars, there’s a recurring problem hundreds of early buyers are discussing: ${topProblem.signalSummary.toLowerCase()}`,
        supportingClaimIds: ["cl-yt-prob-1"],
        evidenceExcerpt: `Mined from YouTube user discussions with ${topProblem.commentCount} recurring reports.`,
        targetAudience: "Prospective Buyers",
        confidence: "HIGH",
      });
    }

    // 3. Contradiction Hook (Reviewer Disagreements)
    if (yt && yt.reviewerDisagreements.length > 0) {
      const topDis = yt.reviewerDisagreements[0];
      hooks.push({
        id: "hook-contra-1",
        category: "CONTRADICTION_HOOK",
        headline: "Why Reviewers Can't Agree",
        scriptWording: `Why are major tech channels reporting completely contradictory results for ${topDis.aspect}? We dug into the testing methodology and found the exact technical reason.`,
        supportingClaimIds: ["cl-yt-dis-1"],
        evidenceExcerpt: topDis.explanation,
        targetAudience: "Tech Enthusiasts",
        confidence: "HIGH",
      });
    }

    // 4. Surprise / Thermal Hook
    if (hw && hw.thermalFindings?.length > 0) {
      const worstThermal = hw.thermalFindings.find((t: any) => t.throttlingPercent > 15) || hw.thermalFindings[0];
      hooks.push({
        id: "hook-surp-1",
        category: "SURPRISE_HOOK",
        headline: "The 30-Minute Thermal Drop",
        scriptWording: `Peak benchmark numbers look incredible on paper. But run this machine under sustained load for 30 minutes, and performance drops by ${worstThermal.throttlingPercent}%. Here’s the thermal breakdown.`,
        supportingClaimIds: ["cl-hw-thermal-1"],
        evidenceExcerpt: `${worstThermal.sustainedScore}% stability after ${worstThermal.durationMinutes} minutes.`,
        targetAudience: "Power Users & Creators",
        confidence: "HIGH",
      });
    }

    // Fallback Hook
    if (hooks.length === 0) {
      hooks.push({
        id: "hook-default-1",
        category: "BUYING_HOOK",
        headline: "The Evidence-First Verdict",
        scriptWording: `Is the new ${session.topic} actually worth your money? Let’s cut through the marketing claims and look at the verified laboratory measurements.`,
        supportingClaimIds: ["cl-1"],
        evidenceExcerpt: "Based on verified laboratory test metrics.",
        targetAudience: "General Viewers",
        confidence: "HIGH",
      });
    }

    return hooks;
  }

  private static generateTitles(
    session: ResearchRunSession,
    hw?: any,
    yt?: YouTubeIntelligenceReport
  ): CreatorTitle[] {
    const topic = session.topic;
    return [
      {
        id: "title-1",
        title: `${topic} — The Real Truth After 100 Hours of Testing`,
        style: "HIGH_CURIOSITY",
        keyEvidenceRef: "Evidence from verified laboratory benchmarks and long-term user reports.",
        targetAudience: "Broad Tech Audience",
      },
      {
        id: "title-2",
        title: `${topic}: The Hidden Problem No One Is Talking About`,
        style: "PROBLEM_FOCUSED",
        keyEvidenceRef: yt?.recurringProblems[0]?.signalSummary || "Mined user discussion data.",
        targetAudience: "Buyers considering purchase",
      },
      {
        id: "title-3",
        title: `Don't Buy ${topic} Until You See These Benchmarks!`,
        style: "DIRECT_COMPARISON",
        keyEvidenceRef: hw?.comparisons[0]?.comparabilityNotes || "Laboratory benchmark comparability matrix.",
        targetAudience: "Hardware Enthusiasts",
      },
      {
        id: "title-4",
        title: `Why Top Reviewers Disagree on ${topic}`,
        style: "VERDICT_ORIENTED",
        keyEvidenceRef: yt?.reviewerDisagreements[0]?.explanation || "Reviewer methodology divergence.",
        targetAudience: "Deep-Dive Tech Audience",
      },
    ];
  }

  private static generateTalkingPoints(
    session: ResearchRunSession,
    hw?: any,
    yt?: YouTubeIntelligenceReport,
    targetDurationMinutes: TargetVideoDuration = 12
  ): TalkingPoint[] {
    const points: TalkingPoint[] = [];
    let ptId = 1;

    // 1. Hardware & Benchmark Talking Points
    if (hw) {
      for (const comp of hw.comparisons) {
        const deltaText = comp.deltaPercent > 0 ? `+${comp.deltaPercent}%` : `${comp.deltaPercent}%`;
        const isDirect = comp.comparability === "DIRECTLY_COMPARABLE";
        points.push({
          id: `tp-${ptId++}`,
          section: "BENCHMARKS",
          title: `${comp.benchmarkName} ${comp.metricName} Benchmark`,
          statement: `${comp.entityA.name} achieves ${comp.scoreA} ${comp.metricUnit} compared to ${comp.entityB.name}'s ${comp.scoreB} ${comp.metricUnit} (${deltaText} delta).`,
          importance: "HIGH",
          evidenceIds: [comp.evidenceA.id, comp.evidenceB.id],
          claimIds: [`cl-hw-${ptId}`],
          confidence: "HIGH",
          sourceCount: 2,
          verificationStatus: isDirect ? "SUPPORTED" : "NEEDS_CONTEXT",
          contextNote: isDirect ? undefined : comp.comparabilityNotes,
          doNotSayWarning: isDirect ? undefined : "Do not state this as a flat universal advantage without mentioning test resolution and power settings.",
        });
      }

      for (const th of hw.thermalFindings) {
        points.push({
          id: `tp-${ptId++}`,
          section: "THERMALS",
          title: `${th.entityName} Sustained Thermal Stability`,
          statement: `${th.entityName} maintains ${th.sustainedScore}% of its burst capability after ${th.durationMinutes} minutes of continuous loop testing.`,
          importance: "HIGH",
          evidenceIds: [th.id],
          claimIds: [`cl-th-${ptId}`],
          confidence: "HIGH",
          sourceCount: 1,
          verificationStatus: "SUPPORTED",
          contextNote: th.findingSummary,
        });
      }

      for (const conf of hw.conflicts) {
        points.push({
          id: `tp-${ptId++}`,
          section: "HARDWARE_SPECS",
          title: `Important Hardware Caveat: ${conf.hardwareAspect}`,
          statement: conf.explanation,
          importance: "HIGH",
          evidenceIds: conf.evidenceRefs,
          claimIds: [`cl-conf-${ptId}`],
          confidence: "HIGH",
          sourceCount: 2,
          verificationStatus: "NEEDS_CONTEXT",
          contextNote: conf.suggestedCorrection,
          doNotSayWarning: "Do not generalize benchmark numbers across regional SKU silicon boundaries.",
        });
      }
    }

    // 2. YouTube & Community Talking Points
    if (yt) {
      for (const prob of yt.recurringProblems) {
        points.push({
          id: `tp-${ptId++}`,
          section: "COMMUNITY_PROBLEMS",
          title: `Recurring Real-World Issue: ${prob.category}`,
          statement: `Multiple independent user reports highlight ${prob.signalSummary.toLowerCase()}`,
          importance: prob.signalStrength === "STRONG_RECURRING" ? "HIGH" : "MEDIUM",
          evidenceIds: [prob.id],
          claimIds: [`cl-yt-p-${ptId}`],
          confidence: "HIGH",
          sourceCount: prob.commentCount,
          verificationStatus: "SUPPORTED",
          contextNote: `Corroborated by ${prob.commentCount} distinct viewer comments.`,
        });
      }

      for (const dis of yt.reviewerDisagreements) {
        points.push({
          id: `tp-${ptId++}`,
          section: "REVIEWER_DISAGREEMENTS",
          title: `Reviewer Disagreement on ${dis.aspect}`,
          statement: dis.explanation,
          importance: "MEDIUM",
          evidenceIds: [dis.id],
          claimIds: [`cl-yt-d-${ptId}`],
          confidence: "HIGH",
          sourceCount: dis.reviewers.length,
          verificationStatus: "CONFLICTED",
          contextNote: dis.suggestedCreatorAngle,
        });
      }

      const qLimit = targetDurationMinutes === 8 ? 1 : targetDurationMinutes === 12 ? 3 : 5;
      for (const q of yt.audienceQuestions.slice(0, qLimit)) {
        points.push({
          id: `tp-${ptId++}`,
          section: "AUDIENCE_QUESTIONS",
          title: `Audience Question: ${q.category}`,
          statement: `Viewers frequently ask: "${q.question}"`,
          importance: "MEDIUM",
          evidenceIds: [q.id],
          claimIds: [`cl-aq-${ptId}`],
          confidence: "HIGH",
          sourceCount: q.frequency,
          verificationStatus: "SUPPORTED",
          contextNote: "Directly answer this in the video to maximize viewer retention.",
        });
      }
    }

    // 3. Fallback from generic claims
    if (points.length === 0 && session.claims) {
      for (const c of session.claims.slice(0, targetDurationMinutes === 8 ? 3 : 6)) {
        points.push({
          id: `tp-${ptId++}`,
          section: "CONTEXT",
          title: "Verified Research Finding",
          statement: c.claim_text,
          importance: "HIGH",
          evidenceIds: c.evidence_ids || [],
          claimIds: [c.id],
          confidence: (c.confidence as any) || "HIGH",
          sourceCount: 1,
          verificationStatus: c.status === "SUPPORTED" ? "SUPPORTED" : "NEEDS_CONTEXT",
        });
      }
    }

    // 4. If in 18-minute mode and points are sparse, append strict evidence-boundary note
    if (targetDurationMinutes === 18 && points.length < 5) {
      points.push({
        id: `tp-${ptId++}`,
        section: "CONTEXT",
        title: "Evidence Boundary Notice",
        statement: "Remaining video duration should emphasize verified laboratory conditions rather than unverified speculation.",
        importance: "LOW",
        evidenceIds: [],
        claimIds: [],
        confidence: "HIGH",
        sourceCount: 1,
        verificationStatus: "SUPPORTED",
        contextNote: "No unsupported claims fabricated for 18-minute duration.",
      });
    }

    return points;
  }

  private static generateBenchmarkCards(hw?: any): BenchmarkVisualCard[] {
    const cards: BenchmarkVisualCard[] = [];
    if (!hw) return cards;

    for (const comp of hw.comparisons || []) {
      cards.push({
        id: `card-${comp.id}`,
        title: `${comp.benchmarkName} — ${comp.metricName}`,
        benchmarkName: comp.benchmarkName,
        metric: `${comp.metricName} (${comp.metricUnit})`,
        entityAName: comp.entityA?.name || "Entity A",
        entityAScore: comp.scoreA,
        entityBName: comp.entityB?.name || "Entity B",
        entityBScore: comp.scoreB,
        deltaPercent: comp.deltaPercent,
        comparabilityStatus: comp.comparability,
        testConditions: comp.comparabilityNotes,
        sourcePublisher: comp.evidenceA?.provenance?.publisher || "Laboratory Report",
      });
    }

    return cards;
  }

  private static generateScriptOutline(
    session: ResearchRunSession,
    hw?: any,
    yt?: YouTubeIntelligenceReport,
    talkingPoints: TalkingPoint[] = [],
    benchmarkCards: BenchmarkVisualCard[] = [],
    targetDurationMinutes: TargetVideoDuration = 12
  ) {
    const scriptSections: ScriptSection[] = [];
    const bRollList: BRollSuggestion[] = [];
    const chapters: ChapterSuggestion[] = [];

    // Duration multipliers per target (8m = 480s, 12m = 720s, 18m = 1080s)
    const durations = {
      8: { intro: 35, hw: 60, bench: 90, gaming: 80, thermal: 70, comm: 75, verdict: 70 },
      12: { intro: 45, hw: 90, bench: 140, gaming: 120, thermal: 110, comm: 115, verdict: 100 },
      18: { intro: 60, hw: 150, bench: 210, gaming: 180, thermal: 160, comm: 170, verdict: 150 },
    }[targetDurationMinutes];

    let currentSec = 0;
    const formatTimestamp = (totalSec: number) => {
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // 1. INTRO
    const introTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: introTime, title: "Introduction & Hook", sectionType: "INTRO" });
    scriptSections.push({
      id: "sec-1-intro",
      sectionType: "INTRO",
      title: "Introduction & Opening Hook",
      estimatedTimestamp: introTime,
      durationSeconds: durations.intro,
      goal: "Hook the viewer with the most surprising benchmark or community discovery, frame the comparison, and promise a defensible verdict.",
      talkingPoints: talkingPoints.filter((p) => p.section === "INTRO"),
      bRollSuggestions: [
        {
          id: "broll-intro-1",
          sectionType: "INTRO",
          visualTitle: "High-Energy Product Beauty Shot",
          description: "Close-up macro pan across the camera module and chassis edges.",
          visualType: "PRODUCT_CLOSEUP",
          durationSeconds: 10,
          overlayText: `${session.topic} — Verified Testing`,
        },
      ],
      factCheckCallouts: [
        {
          claim: "Opening hook metric claims",
          status: "SUPPORTED",
          note: "Ground hook in verified lab benchmark delta.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
    currentSec += durations.intro;

    // 2. CONTEXT & HARDWARE SPECS
    const contextTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: contextTime, title: "Hardware Specs & Silicon Variants", sectionType: "HARDWARE_SPECS" });
    scriptSections.push({
      id: "sec-2-hardware",
      sectionType: "HARDWARE_SPECS",
      title: "Hardware Architecture & Regional Variants",
      estimatedTimestamp: contextTime,
      durationSeconds: durations.hw,
      goal: "Clarify the exact processor, GPU TGP limits, and regional SoC differences so viewers understand the hardware matrix.",
      talkingPoints: talkingPoints.filter((p) => p.section === "HARDWARE_SPECS" || p.section === "CONTEXT"),
      bRollSuggestions: [
        {
          id: "broll-hw-1",
          sectionType: "HARDWARE_SPECS",
          visualTitle: "SoC Architecture & Specification Comparison Table",
          description: "Side-by-side graphic showing CPU core clusters, process node, VRAM, and power targets.",
          visualType: "SPEC_COMPARISON",
          durationSeconds: 15,
          overlayText: "Architecture & Regional SKU Comparison",
        },
      ],
      factCheckCallouts: [
        {
          claim: "Regional silicon parity claims",
          status: "NEEDS_CONTEXT",
          note: "Ensure Snapdragon vs Exynos regional variants are not conflated.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
    currentSec += durations.hw;

    // 3. BENCHMARKS
    const benchTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: benchTime, title: "Laboratory Benchmark Results", sectionType: "BENCHMARKS" });
    scriptSections.push({
      id: "sec-3-benchmarks",
      sectionType: "BENCHMARKS",
      title: "Laboratory CPU & GPU Benchmarks",
      estimatedTimestamp: benchTime,
      durationSeconds: durations.bench,
      goal: "Present Geekbench 6, Cinebench R24, and 3DMark scores with transparent delta percentages and test conditions.",
      talkingPoints: talkingPoints.filter((p) => p.section === "BENCHMARKS"),
      bRollSuggestions: [
        {
          id: "broll-bench-1",
          sectionType: "BENCHMARKS",
          visualTitle: "Benchmark Bar Chart Overlay",
          description: "Side-by-side bar chart showing Single-Core and Multi-Core points with delta % highlighted.",
          visualType: "BENCHMARK_CHART",
          durationSeconds: 20,
          overlayText: "Geekbench 6 / Cinebench R24 Lab Scores",
        },
      ],
      factCheckCallouts: [
        {
          claim: "Performance lead percentage",
          status: "SUPPORTED",
          note: "Directly derived from normalized laboratory scores.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
    currentSec += durations.bench;

    // 4. GAMING PERFORMANCE
    if (hw && hw.benchmarkRecords?.some((r: any) => r.benchmarkFamily === "GAMING")) {
      const gamingTime = formatTimestamp(currentSec);
      chapters.push({ timestamp: gamingTime, title: "Gaming FPS & 1% Lows", sectionType: "GAMING" });
      scriptSections.push({
        id: "sec-4-gaming",
        sectionType: "GAMING",
        title: "Real-World Gaming Performance & Frame Pacing",
        estimatedTimestamp: gamingTime,
        durationSeconds: durations.gaming,
        goal: "Analyze 4K/1440p frame rates, 1% low frame time stability, and native vs upscaling image quality.",
        talkingPoints: talkingPoints.filter((p) => p.section === "GAMING"),
        bRollSuggestions: [
          {
            id: "broll-gaming-1",
            sectionType: "GAMING",
            visualTitle: "Side-by-Side Gameplay Capture with FPS Graph",
            description: "Split-screen gameplay showing frametime graph and 1% low drops during combat scenes.",
            visualType: "SPLIT_SCREEN_GAMEPLAY",
            durationSeconds: 25,
            overlayText: "4K Ultra Overdrive / Ray Tracing Test",
          },
        ],
        factCheckCallouts: [
          {
            claim: "Native vs Upscaled FPS",
            status: "NEEDS_CONTEXT",
            note: "Explicitly label whether DLSS or FSR was enabled during the run.",
          },
        ],
      });
      bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
      currentSec += durations.gaming;
    }

    // 5. THERMALS & SUSTAINED PERFORMANCE
    const thermalTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: thermalTime, title: "Thermals & Sustained Throttling", sectionType: "THERMALS" });
    scriptSections.push({
      id: "sec-5-thermals",
      sectionType: "THERMALS",
      title: "Thermal Throttling & Sustained Degradation",
      estimatedTimestamp: thermalTime,
      durationSeconds: durations.thermal,
      goal: "Explain how temperatures and power limit drops affect long render and gaming sessions.",
      talkingPoints: talkingPoints.filter((p) => p.section === "THERMALS"),
      bRollSuggestions: [
        {
          id: "broll-thermal-1",
          sectionType: "THERMALS",
          visualTitle: "Thermal Throttling Degradation Curve",
          description: "Line chart plotting performance over 30 minutes alongside skin temperature readings.",
          visualType: "THERMAL_GRAPH",
          durationSeconds: 20,
          overlayText: "30-Minute Sustained Stress Loop",
        },
      ],
      factCheckCallouts: [
        {
          claim: "Sustained stability drop percentage",
          status: "SUPPORTED",
          note: "Backed by 30-minute continuous loop testing.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
    currentSec += durations.thermal;

    // 6. YOUTUBE & COMMUNITY PROBLEMS
    const communityTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: communityTime, title: "Real User Complaints & Reviewer Disagreements", sectionType: "COMMUNITY_PROBLEMS" });
    scriptSections.push({
      id: "sec-6-community",
      sectionType: "COMMUNITY_PROBLEMS",
      title: "Real User Issues & What Reviewers Missed",
      estimatedTimestamp: communityTime,
      durationSeconds: durations.comm,
      goal: "Highlight recurring buyer complaints (battery drain, display flicker, camera lag) and explain reviewer disagreements.",
      talkingPoints: talkingPoints.filter((p) => p.section === "COMMUNITY_PROBLEMS" || p.section === "REVIEWER_DISAGREEMENTS"),
      bRollSuggestions: [
        {
          id: "broll-comm-1",
          sectionType: "COMMUNITY_PROBLEMS",
          visualTitle: "Anonymized Comment Quotes & Issue Breakdown",
          description: "Graphic popups displaying recurring viewer complaints with frequency counts.",
          visualType: "COMMENT_OVERLAY",
          durationSeconds: 18,
          overlayText: "Mined from 500+ Verified User Discussions",
        },
      ],
      factCheckCallouts: [
        {
          claim: "Widespread hardware defects",
          status: "NEEDS_CONTEXT",
          note: "Distinguish between isolated early-batch defects and confirmed recurring design flaws.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);
    currentSec += durations.comm;

    // 7. AUDIENCE QUESTIONS & VERDICT
    const verdictTime = formatTimestamp(currentSec);
    chapters.push({ timestamp: verdictTime, title: "Audience Q&A & Final Verdict", sectionType: "VERDICT" });
    scriptSections.push({
      id: "sec-7-verdict",
      sectionType: "VERDICT",
      title: "Audience Q&A & Final Buying Verdict",
      estimatedTimestamp: verdictTime,
      durationSeconds: durations.verdict,
      goal: "Answer top audience questions directly and deliver an evidence-grounded buying recommendation.",
      talkingPoints: talkingPoints.filter((p) => p.section === "AUDIENCE_QUESTIONS" || p.section === "VERDICT" || p.section === "BUYING_ADVICE"),
      bRollSuggestions: [
        {
          id: "broll-verdict-1",
          sectionType: "VERDICT",
          visualTitle: "Final Scorecard & Recommendation Badge",
          description: "Summary scorecard showing Pros, Cons, and ideal buyer personas.",
          visualType: "SPEC_COMPARISON",
          durationSeconds: 15,
          overlayText: "Final Evidence-Grounded Verdict",
        },
      ],
      factCheckCallouts: [
        {
          claim: "Final purchase recommendation",
          status: "SUPPORTED",
          note: "Grounded strictly in tested price-to-performance and thermal data.",
        },
      ],
    });
    bRollList.push(...scriptSections[scriptSections.length - 1].bRollSuggestions);

    return { scriptSections, bRollList, chapters };
  }

  private static generateMarkdownExport(
    topic: string,
    targetDurationMinutes: TargetVideoDuration,
    videoAngle: any,
    hooks: CreatorHook[],
    titles: CreatorTitle[],
    sections: ScriptSection[],
    talkingPoints: TalkingPoint[],
    chapters: ChapterSuggestion[],
    benchmarkCards: BenchmarkVisualCard[]
  ): string {
    const md: string[] = [];

    md.push(`# Creator Production Brief: ${topic}`);
    md.push(`**Target Video Duration:** ~${targetDurationMinutes} Minutes`);
    md.push(`**Primary Video Angle:** ${videoAngle.primaryAngle}`);
    md.push(`**Narrative Theme:** ${videoAngle.narrativeTheme}`);
    md.push(`**Target Audience:** ${videoAngle.targetAudience}`);
    md.push(`\n---\n`);

    md.push(`## 1. Evidence-Backed Opening Hooks\n`);
    for (const h of hooks) {
      md.push(`### [${h.category}] ${h.headline}`);
      md.push(`> "${h.scriptWording}"`);
      md.push(`*Evidence:* ${h.evidenceExcerpt}\n`);
    }

    md.push(`\n---\n## 2. High-CTR Title Options\n`);
    for (const t of titles) {
      md.push(`* **[${t.style}]** ${t.title}`);
    }

    md.push(`\n---\n## 3. YouTube Video Chapters (Paste Ready)\n\`\`\`text`);
    for (const ch of chapters) {
      md.push(`${ch.timestamp} ${ch.title}`);
    }
    md.push(`\`\`\`\n`);

    md.push(`\n---\n## 4. Structured Script Outline & Production Timestamps (~${targetDurationMinutes} min)\n`);
    for (const s of sections) {
      md.push(`### ${s.estimatedTimestamp} — ${s.title} (${s.durationSeconds}s)`);
      md.push(`**Section Goal:** ${s.goal}\n`);
      md.push(`**Key Talking Points:**`);
      for (const tp of s.talkingPoints) {
        md.push(`- **${tp.title}** [Status: ${tp.verificationStatus}]: ${tp.statement}`);
        if (tp.contextNote) md.push(`  *Context Caveat:* ${tp.contextNote}`);
        if (tp.doNotSayWarning) md.push(`  *⚠️ DO NOT SAY:* ${tp.doNotSayWarning}`);
      }
      md.push(`\n**B-Roll Visuals:**`);
      for (const b of s.bRollSuggestions) {
        md.push(`- 🎥 *${b.visualTitle}* (${b.durationSeconds}s): ${b.description}`);
      }
      md.push(`\n`);
    }

    md.push(`\n---\n## 5. Benchmark Cards for Video Editors\n`);
    for (const card of benchmarkCards) {
      md.push(`### ${card.title}`);
      md.push(`- **${card.entityAName}:** ${card.entityAScore.toLocaleString()}`);
      if (card.entityBName && card.entityBScore !== undefined) {
        md.push(`- **${card.entityBName}:** ${card.entityBScore.toLocaleString()}`);
        if (card.deltaPercent !== undefined) {
          md.push(`- **Delta:** ${card.deltaPercent > 0 ? `+${card.deltaPercent}%` : `${card.deltaPercent}%`}`);
        }
      }
      md.push(`- **Comparability:** ${card.comparabilityStatus}`);
      md.push(`- **Conditions:** ${card.testConditions}`);
      md.push(`- **Source:** ${card.sourcePublisher}\n`);
    }

    return md.join("\n");
  }
}
