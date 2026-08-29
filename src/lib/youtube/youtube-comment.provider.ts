import { CentralCacheProvider } from "@/lib/cache/cache-provider";
import {
  YouTubeCommentItem,
  YouTubeCommentSignal,
  YouTubeAudienceQuestion,
  ProblemCategory,
  SignalStrength,
  QuestionCategory,
} from "./youtube.types";

export class YouTubeCommentProvider {
  private static CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Evaluates spam probability and flags noisy/bot comments.
   */
  static evaluateCommentQuality(text: string): { spamScore: number; isFiltered: boolean; category: 'PROBLEM' | 'QUESTION' | 'PRAISE' | 'EXPERIENCE' | 'NOISE' } {
    const clean = text.trim().toLowerCase();

    // Spam / Promotion checks
    const spamKeywords = ["check my bio", "whatsapp", "telegram", "crypto", "sub4sub", "subscribe to my", "dm me on", "free gift", "t.me/"];
    const hasSpamKeyword = spamKeywords.some((kw) => clean.includes(kw));
    const hasUrl = /https?:\/\/[^\s]+/.test(clean);
    const isVeryShort = clean.length < 5 && !clean.includes("why") && !clean.includes("how");
    const isGenericReaction = ["first", "nice", "cool", "wow", "great video", "love this", "legend", "goat"].includes(clean);

    // Creator self-promo blocks (pinned comments / description dumps) are the common case
    // that used to leak through: they are long, contain many links, and mention affiliate or
    // sponsorship markers. One such block was surfaced to the user as an "audience question".
    const linkCount = (clean.match(/https?:\/\//g) || []).length;
    const promoMarkers = ["sponsored", "affiliate", "amzn.to", "product links", "blog post:", "follow me", "my links", "discount code", "use code", "shop:", "merch"];
    const hasPromoMarker = promoMarkers.some((kw) => clean.includes(kw));
    const isLinkFarm = linkCount >= 3;
    const isDescriptionDump = clean.length > 600 && linkCount >= 1;

    if (hasSpamKeyword || isLinkFarm || hasPromoMarker || isDescriptionDump) {
      return { spamScore: 0.95, isFiltered: true, category: "NOISE" };
    }

    // A single link is tolerated only when the comment cites a discussion source, which is
    // the case this exemption was written for.
    if (hasUrl && !clean.includes("reddit") && !clean.includes("github")) {
      return { spamScore: 0.95, isFiltered: true, category: "NOISE" };
    }

    if (isVeryShort || isGenericReaction) {
      return { spamScore: 0.8, isFiltered: true, category: "NOISE" };
    }

    // Category determination
    // Cap the length so a long rambling post that happens to contain "?" isn't presented
    // as a crisp audience question.
    const looksLikeQuestion =
      clean.includes("?") || clean.startsWith("should i") || clean.startsWith("is it") ||
      clean.startsWith("how does") || clean.startsWith("does anyone");
    if (looksLikeQuestion && clean.length <= 300) {
      return { spamScore: 0.05, isFiltered: false, category: "QUESTION" };
    }

    const problemKeywords = ["issue", "problem", "drain", "heat", "hot", "warm", "throttle", "throttling", "bug", "flicker", "lag", "crash", "stutter", "defect", "fail", "slow", "broken", "freeze", "drop", "dim"];
    if (problemKeywords.some((kw) => clean.includes(kw))) {
      return { spamScore: 0.1, isFiltered: false, category: "PROBLEM" };
    }

    const praiseKeywords = ["smooth", "fast", "best", "incredible", "amazing battery", "zero issues", "flawless"];
    if (praiseKeywords.some((kw) => clean.includes(kw))) {
      return { spamScore: 0.15, isFiltered: false, category: "PRAISE" };
    }

    return { spamScore: 0.2, isFiltered: false, category: "EXPERIENCE" };
  }

  /**
   * Classifies a problem comment into a specific hardware/software category.
   */
  static categorizeProblem(text: string): ProblemCategory {
    const t = text.toLowerCase();
    if (t.includes("camera") || t.includes("shutter") || t.includes("autofocus") || t.includes("lens") || t.includes("photo") || t.includes("blurry")) return "CAMERA_BUG";
    if (t.includes("flicker") || t.includes("pwm") || t.includes("eye strain") || t.includes("headache") || t.includes("display line")) return "DISPLAY_FLICKER";
    if (t.includes("throttle") || t.includes("throttling") || t.includes("fps drop") || t.includes("clock speed") || t.includes("dimming")) return "THROTTLING";
    if (t.includes("battery") || t.includes("drain") || t.includes("sot") || t.includes("screen on time") || t.includes("overnight")) return "BATTERY_DRAIN";
    if (t.includes("overheat") || t.includes("heat") || t.includes(" warm") || t.includes("temperature") || /\bhot\b/.test(t)) return "OVERHEATING";
    if (t.includes("crash") || t.includes("freeze") || t.includes("reboot") || t.includes("bootloop") || t.includes("stuck")) return "SOFTWARE_CRASH";
    if (t.includes("charge") || t.includes("charging") || t.includes("watt") || t.includes("slow charge") || t.includes("cable")) return "CHARGING_ISSUE";
    if (t.includes("wifi") || t.includes("bluetooth") || t.includes("signal") || t.includes("disconnect") || t.includes("cellular")) return "CONNECTIVITY";
    if (t.includes("speaker") || t.includes("audio") || t.includes("mic") || t.includes("sound") || t.includes("distortion")) return "AUDIO_SPEAKER";
    return "OTHER";
  }

  /**
   * Categorizes audience questions into actionable creator research buckets.
   */
  static categorizeQuestion(questionText: string): QuestionCategory {
    const q = questionText.toLowerCase();
    if (q.includes("should i") || q.includes("worth it") || q.includes("buy") || q.includes("upgrade") || q.includes("or should i wait")) return "BUYING";
    if (q.includes("exynos") || q.includes("snapdragon") || q.includes("version") || q.includes("variant") || q.includes("global") || q.includes("us model")) return "VARIANT";
    if (q.includes("battery") || q.includes("drain") || q.includes("hours") || q.includes("last")) return "BATTERY";
    if (q.includes("fps") || q.includes("throttle") || q.includes("gaming") || q.includes("performance") || q.includes("speed")) return "PERFORMANCE";
    if (q.includes("charger") || q.includes("case") || q.includes("accessory") || q.includes("compatible") || q.includes("support")) return "COMPATIBILITY";
    return "RELIABILITY";
  }

  /**
   * Fetches comment threads for a video and filters noise.
   */
  async getCommentsForVideo(videoId: string): Promise<YouTubeCommentItem[]> {
    const cleanId = videoId.replace("https://www.youtube.com/watch?v=", "").split("&")[0];
    const cacheKey = `yt_comments_${cleanId}`;
    const cached = CentralCacheProvider.get<YouTubeCommentItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const comments: YouTubeCommentItem[] = [];

    if (apiKey && apiKey !== "your-youtube-api-key") {
      try {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${cleanId}&maxResults=25&order=relevance&textFormat=plainText&key=${apiKey}`;
        const res = await fetch(url, {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        if (res.ok) {
          const data = await res.json();
          for (const item of (data.items || [])) {
            const topSnippet = item.snippet?.topLevelComment?.snippet;
            if (topSnippet) {
              const text = topSnippet.textDisplay || topSnippet.textOriginal || "";
              const quality = YouTubeCommentProvider.evaluateCommentQuality(text);

              comments.push({
                commentId: item.id || `c_${Math.random()}`,
                videoId: cleanId,
                author: topSnippet.authorDisplayName || "Tech Viewer",
                text,
                likeCount: topSnippet.likeCount || 0,
                publishedAt: topSnippet.publishedAt ? topSnippet.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
                category: quality.category,
                spamScore: quality.spamScore,
                isFiltered: quality.isFiltered,
                sentiment: quality.category === "PROBLEM" ? "NEGATIVE" : quality.category === "PRAISE" ? "POSITIVE" : "NEUTRAL",
              });
            }
          }
        }
      } catch (err: any) {
        console.warn(`YouTube Comment API retrieval warning for video ${cleanId}:`, err.message);
      }
    }

    // No fabricated fallback. A previous `getDeterministicComments()` invented viewer comments
    // (with invented authors and like counts) whenever the API was unavailable, and those became
    // "community signals" and "audience questions" presented to the creator as real user reports.
    // With no API key or no comments, this returns an empty list and those sections stay empty.

    CentralCacheProvider.set(cacheKey, comments, YouTubeCommentProvider.CACHE_TTL_MS);
    return comments;
  }

  /**
   * Aggregates comments across multiple video sources into actionable signals and questions.
   */
  aggregateCommentIntelligence(topic: string, allComments: YouTubeCommentItem[]): {
    recurringProblems: YouTubeCommentSignal[];
    audienceQuestions: YouTubeAudienceQuestion[];
  } {
    const validComments = allComments.filter((c) => !c.isFiltered);
    const problemMap = new Map<ProblemCategory, YouTubeCommentItem[]>();
    const questionList: YouTubeCommentItem[] = [];

    for (const c of validComments) {
      if (c.category === "PROBLEM") {
        const cat = YouTubeCommentProvider.categorizeProblem(c.text);
        if (!problemMap.has(cat)) problemMap.set(cat, []);
        problemMap.get(cat)!.push(c);
      } else if (c.category === "QUESTION") {
        questionList.push(c);
      }
    }

    // Build recurring problems
    const recurringProblems: YouTubeCommentSignal[] = [];
    let signalId = 1;

    for (const [cat, items] of problemMap.entries()) {
      const count = items.length;
      let signalStrength: SignalStrength = "ISOLATED";
      if (count >= 8) signalStrength = "STRONG_RECURRING";
      else if (count >= 4) signalStrength = "RECURRING";
      else if (count >= 2) signalStrength = "EMERGING";

      // Describe what was actually observed rather than asserting a specific technical
      // symptom. The previous version emitted a fixed sentence per category (e.g. "Multiple
      // users report unexpected idle battery drain on 5G and during overnight standby")
      // regardless of what the comments said, inventing specifics the evidence didn't support.
      const categoryLabel: Record<ProblemCategory, string> = {
        BATTERY_DRAIN: "battery drain",
        OVERHEATING: "device overheating",
        THROTTLING: "performance throttling",
        DISPLAY_FLICKER: "display flicker",
        CAMERA_BUG: "camera problems",
        SOFTWARE_CRASH: "software crashes or instability",
        CHARGING_ISSUE: "charging problems",
        CONNECTIVITY: "connectivity problems",
        AUDIO_SPEAKER: "speaker or audio problems",
        OTHER: "other issues",
      };
      const label = categoryLabel[cat] || "issues";
      const summary = `${count} viewer ${count === 1 ? "comment" : "comments"} across the analysed videos raise ${label}. See the quoted comments for what was actually said.`;

      recurringProblems.push({
        id: `sig_yt_${signalId++}`,
        topic,
        category: cat,
        signalSummary: summary,
        signalStrength,
        commentCount: count,
        sampleComments: items.slice(0, 3).map((item) => ({
          author: item.author,
          text: item.text,
          videoId: item.videoId,
        })),
        firstHandLikelihood: count >= 3 ? "HIGH" : "MEDIUM",
      });
    }

    // Build audience questions, de-duplicated by normalized question text. The same question often
    // recurs verbatim across multiple videos; merging keeps frequency/source counts honest instead
    // of emitting the identical question multiple times.
    const audienceQuestions: YouTubeAudienceQuestion[] = [];
    const questionByText = new Map<string, YouTubeAudienceQuestion>();
    let qId = 1;

    for (const qItem of questionList) {
      const key = qItem.text.trim().toLowerCase().replace(/\s+/g, " ");
      const existing = questionByText.get(key);
      if (existing) {
        // Merge: bump frequency, take the strongest importance, and track additional source videos.
        existing.frequency += 1;
        const itemImportance = qItem.likeCount > 50 ? 9.2 : qItem.likeCount > 10 ? 8.5 : 7.8;
        existing.importanceScore = Math.max(existing.importanceScore, itemImportance);
        if (!existing.sourceVideoIds.includes(qItem.videoId)) {
          existing.sourceVideoIds.push(qItem.videoId);
        }
        continue;
      }
      const cat = YouTubeCommentProvider.categorizeQuestion(qItem.text);
      const q: YouTubeAudienceQuestion = {
        id: `aq_yt_${qId++}`,
        question: qItem.text,
        category: cat,
        frequency: Math.max(1, Math.floor((qItem.likeCount || 0) / 10) + 1),
        importanceScore: qItem.likeCount > 50 ? 9.2 : qItem.likeCount > 10 ? 8.5 : 7.8,
        sourceVideoIds: [qItem.videoId],
        sampleCommentTexts: [qItem.text],
      };
      questionByText.set(key, q);
      audienceQuestions.push(q);
      if (audienceQuestions.length >= 8) break;
    }

    return { recurringProblems, audienceQuestions };
  }
}
