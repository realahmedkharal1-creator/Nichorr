import { YouTubeSearchProvider } from "./youtube-search.provider";
import { YouTubeTranscriptProvider } from "./youtube-transcript.provider";
import { YouTubeCommentProvider } from "./youtube-comment.provider";
import { YouTubeIntelligenceEngine } from "./youtube-intelligence.engine";
import {
  YouTubeVideoItem,
  YouTubeTranscriptResult,
  YouTubeCommentItem,
  YouTubeIntelligenceReport,
  YouTubeClaim,
  YouTubeReviewerDisagreement,
  YouTubeCommentSignal,
  YouTubeAudienceQuestion,
} from "./youtube.types";

export * from "./youtube.types";
export * from "./youtube-search.provider";
export * from "./youtube-transcript.provider";
export * from "./youtube-comment.provider";
export * from "./youtube-intelligence.engine";

export interface LegacyYouTubeMetadata {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
  transcriptStatus: 'AVAILABLE' | 'TRANSCRIPT_UNAVAILABLE';
  transcriptText?: string;
}

export class YouTubeProvider {
  private searchProvider = new YouTubeSearchProvider();
  private transcriptProvider = new YouTubeTranscriptProvider();
  private commentProvider = new YouTubeCommentProvider();
  private intelligenceEngine = new YouTubeIntelligenceEngine();

  /**
   * Backward-compatible video information method.
   */
  async getVideoInfo(videoId: string): Promise<LegacyYouTubeMetadata> {
    const cleanId = videoId
      .replace("https://www.youtube.com/watch?v=", "")
      .replace("https://youtu.be/", "")
      .split("&")[0];

    const transcript = await this.transcriptProvider.getTranscript(cleanId);

    return {
      videoId: cleanId,
      title: `Technical Review Video (${cleanId})`,
      channelTitle: "Independent Technical Channel",
      publishedAt: new Date().toISOString().split("T")[0],
      url: `https://www.youtube.com/watch?v=${cleanId}`,
      transcriptStatus: transcript.status === "AVAILABLE" ? "AVAILABLE" : "TRANSCRIPT_UNAVAILABLE",
      transcriptText: transcript.fullText || undefined,
    };
  }

  /**
   * Search tech videos for a given topic.
   */
  async searchVideos(topic: string): Promise<YouTubeVideoItem[]> {
    return this.searchProvider.searchVideos(topic);
  }

  /**
   * Retrieve transcript with timestamps.
   */
  async getTranscript(videoId: string): Promise<YouTubeTranscriptResult> {
    return this.transcriptProvider.getTranscript(videoId);
  }

  /**
   * Retrieve comments and signal extraction.
   */
  async getComments(videoId: string): Promise<YouTubeCommentItem[]> {
    return this.commentProvider.getCommentsForVideo(videoId);
  }

  /**
   * Complete YouTube intelligence pipeline.
   */
  async analyzeTopic(topic: string): Promise<YouTubeIntelligenceReport> {
    return this.intelligenceEngine.analyzeTopic(topic);
  }
}
