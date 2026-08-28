import { YouTubeSearchProvider } from "./youtube-search.provider";
import { YouTubeTranscriptProvider } from "./youtube-transcript.provider";
import { YouTubeCommentProvider } from "./youtube-comment.provider";
import {
  YouTubeIntelligenceReport,
  YouTubeVideoItem,
  YouTubeTranscriptResult,
  YouTubeClaim,
  YouTubeReviewerDisagreement,
  YouTubeCommentItem,
  YouTubeCommentSignal,
  YouTubeAudienceQuestion,
} from "./youtube.types";
import { EntityResolver, ResolvedEntity } from "@/features/research/entity-resolver";
import { CentralCacheProvider } from "@/lib/cache/cache-provider";

export class YouTubeIntelligenceEngine {
  private searchProvider = new YouTubeSearchProvider();
  private transcriptProvider = new YouTubeTranscriptProvider();
  private commentProvider = new YouTubeCommentProvider();

  /**
   * Performs full YouTube intelligence analysis for a tech topic.
   */
  async analyzeTopic(topic: string, entityInfo?: ResolvedEntity): Promise<YouTubeIntelligenceReport> {
    const cacheKey = `yt_intel_${topic.toLowerCase().replace(/\s+/g, "_")}`;
    const cached = CentralCacheProvider.get<YouTubeIntelligenceReport>(cacheKey);
    if (cached) {
      return cached;
    }

    const resolvedEntity = entityInfo || EntityResolver.resolve(topic);

    // 1. Video Discovery
    const videos = await this.searchProvider.searchVideos(topic);

    // 2. Transcripts & Claims
    const transcripts: Record<string, YouTubeTranscriptResult> = {};
    const claims: YouTubeClaim[] = [];
    const allComments: YouTubeCommentItem[] = [];

    for (const vid of videos.slice(0, 4)) {
      // Transcript Fetching
      const transcript = await this.transcriptProvider.getTranscript(vid.videoId);
      transcripts[vid.videoId] = transcript;

      // Extract Claims from available transcripts
      if (transcript.status === "AVAILABLE" && transcript.segments.length > 0) {
        const extractedClaims = this.extractClaimsFromTranscript(vid, transcript, resolvedEntity);
        claims.push(...extractedClaims);
      }

      // Comment Fetching
      const comments = await this.commentProvider.getCommentsForVideo(vid.videoId);
      allComments.push(...comments);
    }

    // 3. Reviewer Disagreements & Consensus
    const { consensus, disagreements } = this.analyzeReviewerDynamics(topic, claims, resolvedEntity);

    // 4. Comment Intelligence (Recurring Problems & Audience Questions)
    const { recurringProblems, audienceQuestions } = this.commentProvider.aggregateCommentIntelligence(topic, allComments);

    // 5. Coverage Gaps
    const coverageGaps = this.identifyCoverageGaps(topic, claims, audienceQuestions);

    // 6. Creator Content Opportunities
    const contentOpportunities = this.generateContentOpportunities(topic, disagreements, recurringProblems, audienceQuestions);

    const report: YouTubeIntelligenceReport = {
      topic,
      analyzedAt: new Date().toISOString(),
      videos,
      transcripts,
      claims,
      reviewerConsensus: consensus,
      reviewerDisagreements: disagreements,
      recurringProblems,
      audienceQuestions,
      coverageGaps,
      contentOpportunities,
    };

    CentralCacheProvider.set(cacheKey, report, 30 * 60 * 1000); // 30 mins TTL
    return report;
  }

  /**
   * Extracts evidence-grounded claims from transcript segments.
   */
  private extractClaimsFromTranscript(
    video: YouTubeVideoItem,
    transcript: YouTubeTranscriptResult,
    entity: ResolvedEntity
  ): YouTubeClaim[] {
    const claims: YouTubeClaim[] = [];
    let claimCount = 1;

    for (const seg of transcript.segments) {
      const text = seg.text;
      const tLower = text.toLowerCase();

      // Check for measured results or reviewer observations
      const isBenchmark = tLower.includes("fps") || tLower.includes("score") || tLower.includes("watt") || tLower.includes("percent") || tLower.includes("hours");
      const isThermal = tLower.includes("throttle") || tLower.includes("temperature") || tLower.includes("dimming") || tLower.includes("celsius");
      const isVariant = tLower.includes("exynos") || tLower.includes("snapdragon") || tLower.includes("variant");

      if (isBenchmark || isThermal || isVariant) {
        let claimType: YouTubeClaim["claimType"] = "REVIEWER_OBSERVATION";
        if (tLower.includes("averaged") || tLower.includes("measured") || tLower.includes("achieved") || tLower.includes("lasted")) {
          claimType = "MEASURED_RESULT";
        } else if (isVariant) {
          claimType = "CITED_SPEC";
        }

        claims.push({
          id: `yt_cl_${video.videoId}_${claimCount++}`,
          videoId: video.videoId,
          channelTitle: video.channelTitle,
          videoTitle: video.title,
          claim: text,
          claimType,
          timestamp: seg.formattedTime,
          timestampSeconds: seg.start,
          confidence: claimType === "MEASURED_RESULT" ? "HIGH" : "MEDIUM",
          hardwareEntity: entity.modelName,
          socVariant: isVariant ? (tLower.includes("exynos") ? "Exynos 2600" : "Snapdragon 8 Gen 5") : undefined,
          provenanceUrl: `${video.url}&t=${Math.floor(seg.start)}s`,
        });
      }
    }

    return claims;
  }

  /**
   * Derives reviewer consensus and disagreements from the claims actually extracted from
   * real transcripts.
   *
   * This function previously returned two fixed consensus sentences and two fully invented
   * "disagreements" — complete with real creators' channel names, made-up video ids, and
   * fabricated measurements ("58.4 fps average", "3.5 degrees hotter") — on every single run
   * regardless of input. That fabricated output flowed into the Conflicts tab, the research
   * brief and the provenance chain as if it were researched evidence.
   *
   * Everything below is now computed from `claims`, each of which carries a real channel,
   * timestamp and provenance URL. When there is not enough real material to support a finding,
   * the corresponding array is returned empty rather than filled in.
   */
  private analyzeReviewerDynamics(
    topic: string,
    claims: YouTubeClaim[],
    entity: ResolvedEntity
  ): { consensus: string[]; disagreements: YouTubeReviewerDisagreement[] } {
    const consensus: string[] = [];
    const disagreements: YouTubeReviewerDisagreement[] = [];

    // Nothing to analyse without claims from at least two independent channels.
    const distinctChannels = new Set(claims.map((c) => c.channelTitle));
    if (claims.length === 0 || distinctChannels.size < 2) {
      return { consensus, disagreements };
    }

    // Group claims by the measurable topic they discuss, so agreement/disagreement is only
    // ever assessed between reviewers talking about the same thing.
    const ASPECTS: Array<{ key: string; label: string; terms: RegExp }> = [
      { key: "battery", label: "Battery Endurance", terms: /\bbattery|\bendurance|screen[- ]on time|\bmah\b/i },
      { key: "thermal", label: "Sustained Thermals & Throttling", terms: /\bthermal|\bthrottl|\btemperature|\bdegrees\b|\bheat\b/i },
      { key: "display", label: "Display Brightness & Panel Behaviour", terms: /\bnits\b|\bbrightness|\bdisplay|\bpanel\b|refresh rate|\bpwm\b/i },
      { key: "performance", label: "Sustained Performance", terms: /\bfps\b|frame rate|\bbenchmark|\bgeekbench\b|\bantutu\b|\bperformance\b/i },
      { key: "camera", label: "Camera System", terms: /\bcamera|\bmegapixel|\d+\s?mp\b|\bphoto|video quality|dynamic range/i },
      { key: "charging", label: "Charging Speed", terms: /\bcharg|\bwatt|\d+\s?w\b|\busb-c\b/i },
    ];

    const numbersIn = (text: string): number[] =>
      (text.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter((n) => Number.isFinite(n));

    for (const aspect of ASPECTS) {
      const relevant = claims.filter(
        (c) => aspect.terms.test(c.claim) && (c.claimType === "MEASURED_RESULT" || c.claimType === "CITED_SPEC" || c.claimType === "REVIEWER_OBSERVATION")
      );
      const channels = new Set(relevant.map((c) => c.channelTitle));
      if (relevant.length < 2 || channels.size < 2) continue;

      // A hardware-variant split is a real, reportable disagreement: the reviewers tested
      // physically different silicon, so their numbers are not comparable.
      const variants = new Set(relevant.map((c) => c.socVariant).filter(Boolean) as string[]);
      if (variants.size >= 2) {
        const perVariant = Array.from(variants).map((v) => relevant.find((c) => c.socVariant === v)!);
        disagreements.push({
          id: `yt_disagree_variant_${aspect.key}`,
          topic,
          aspect: aspect.label,
          reviewers: perVariant.map((c) => ({
            channel: c.channelTitle,
            videoId: c.videoId,
            claim: c.claim,
            timestamp: c.timestamp,
            socVariant: c.socVariant,
          })),
          disagreementType: "HARDWARE_VARIANT",
          explanation: `Reviewers tested different silicon variants (${Array.from(variants).join(" vs ")}), so their ${aspect.label.toLowerCase()} figures describe different retail models and cannot be compared directly.`,
          suggestedCreatorAngle: `Tell viewers which variant ships in their region before quoting any ${aspect.label.toLowerCase()} number.`,
        });
        continue;
      }

      // Otherwise look for a genuine numeric spread between two channels on the same aspect.
      const measured = relevant.filter((c) => numbersIn(c.claim).length > 0);
      const byChannel = new Map<string, YouTubeClaim>();
      for (const c of measured) if (!byChannel.has(c.channelTitle)) byChannel.set(c.channelTitle, c);

      if (byChannel.size >= 2) {
        const [a, b] = Array.from(byChannel.values());
        const maxA = Math.max(...numbersIn(a.claim));
        const maxB = Math.max(...numbersIn(b.claim));
        const spread = Math.max(maxA, maxB) === 0 ? 0 : Math.abs(maxA - maxB) / Math.max(maxA, maxB);

        // Only surface a spread big enough to change a viewer's conclusion (>15%).
        if (spread > 0.15) {
          disagreements.push({
            id: `yt_disagree_measurement_${aspect.key}`,
            topic,
            aspect: aspect.label,
            reviewers: [a, b].map((c) => ({
              channel: c.channelTitle,
              videoId: c.videoId,
              claim: c.claim,
              timestamp: c.timestamp,
            })),
            disagreementType: "TEST_CONDITION",
            explanation: `${a.channelTitle} and ${b.channelTitle} report materially different ${aspect.label.toLowerCase()} figures for the same comparison. Test conditions are not stated identically in both videos, so the gap may be methodological rather than a real hardware difference.`,
            suggestedCreatorAngle: `Quote both figures with the channel and test conditions on screen instead of picking one as the headline number.`,
          });
          continue;
        }

        // Close agreement across independent channels is itself a reportable finding.
        consensus.push(
          `${byChannel.size} independent channels (${Array.from(byChannel.keys()).join(", ")}) report closely matching ${aspect.label.toLowerCase()} results.`
        );
      }
    }

    return { consensus, disagreements };
  }

  /**
   * Surfaces under-covered research gaps: things the audience asked about that no reviewer
   * claim in the analysed videos actually addresses.
   *
   * This previously returned four fixed sentences (PWM flicker, PD chargers, lavalier latency,
   * etc.) on every run while ignoring both of its arguments, presenting invented gaps as
   * research findings. It now compares real audience questions against real reviewer claims.
   */
  private identifyCoverageGaps(
    topic: string,
    claims: YouTubeClaim[],
    questions: YouTubeAudienceQuestion[]
  ): string[] {
    if (questions.length === 0) return [];

    const STOPWORDS = new Set([
      "what", "when", "where", "which", "does", "did", "will", "would", "could", "should",
      "this", "that", "these", "those", "with", "without", "from", "have", "has", "had",
      "the", "and", "for", "are", "is", "it", "its", "you", "your", "my", "any", "can",
      "about", "how", "why", "who", "there", "if", "on", "in", "of", "to", "a", "an",
    ]);
    const keywords = (text: string): string[] =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOPWORDS.has(w));

    const claimText = claims.map((c) => c.claim.toLowerCase()).join(" ");
    const gaps: string[] = [];

    for (const q of questions) {
      const kw = keywords(q.question);
      if (kw.length === 0) continue;
      // A question is "covered" if most of its distinctive terms appear somewhere in the
      // reviewer claims. Anything below that threshold is a genuine coverage gap.
      const covered = kw.filter((w) => claimText.includes(w)).length;
      if (covered / kw.length < 0.5) {
        gaps.push(`Viewers are asking about this but no analysed reviewer covers it: "${q.question}"`);
      }
      if (gaps.length >= 6) break;
    }

    return gaps;
  }

  /**
   * Builds content opportunities strictly from findings this run actually produced.
   *
   * The previous implementation returned three fixed video ideas — referencing Exynos vs
   * Snapdragon, PWM flicker and 1000-nit sunlight tests — regardless of whether any of that
   * appeared in the research, while ignoring all three of its arguments.
   */
  private generateContentOpportunities(
    topic: string,
    disagreements: YouTubeReviewerDisagreement[],
    problems: YouTubeCommentSignal[],
    questions: YouTubeAudienceQuestion[]
  ): Array<{ title: string; description: string; hook: string; targetAudience: string }> {
    const opportunities: Array<{ title: string; description: string; hook: string; targetAudience: string }> = [];

    // 1. Unresolved reviewer disagreements make the strongest videos: the creator can settle
    //    (or at least frame) a question the existing coverage leaves open.
    for (const d of disagreements.slice(0, 2)) {
      opportunities.push({
        title: `${d.aspect}: why the reviews disagree on ${topic}`,
        description: `${d.reviewers.map((r) => r.channel).join(" and ")} report different results here. ${d.explanation}`,
        hook: `"Two trusted channels tested the same thing and got different answers. Here's what actually explains the gap."`,
        targetAudience: "Viewers comparing reviews before buying",
      });
    }

    // 2. Recurring owner-reported problems that launch reviews typically miss.
    const strongProblems = problems.filter((p) => p.signalStrength === "STRONG_RECURRING" || p.signalStrength === "RECURRING");
    if (strongProblems.length > 0) {
      opportunities.push({
        title: `What owners report after living with the ${topic}`,
        description: `Recurring viewer-reported issues worth verifying on camera: ${strongProblems.slice(0, 3).map((p) => p.signalSummary).join(" ")}`,
        hook: `"The reviews are in — but here's what people who actually bought it keep bringing up."`,
        targetAudience: "Prospective buyers and current owners",
      });
    }

    // 3. The single highest-demand unanswered audience question.
    const topQuestion = [...questions].sort((a, b) => b.importanceScore - a.importanceScore)[0];
    if (topQuestion) {
      opportunities.push({
        title: `Answering the question everyone keeps asking about the ${topic}`,
        description: `Asked repeatedly in the comments of the analysed videos: "${topQuestion.question}"`,
        hook: `"This is the one question nobody reviewing this has actually answered."`,
        targetAudience: "Viewers researching before purchase",
      });
    }

    return opportunities;
  }
}
