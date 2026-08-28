import { CentralCacheProvider } from "@/lib/cache/cache-provider";
import { YouTubeTranscriptResult, YouTubeTranscriptSegment, TranscriptStatus } from "./youtube.types";

export class YouTubeTranscriptProvider {
  private static CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

  /**
   * Formats seconds into MM:SS or HH:MM:SS format for video timestamp citations.
   */
  static formatTimestamp(seconds: number): string {
    const totalSec = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Decodes XML/HTML character entities often present in raw caption tracks.
   */
  static cleanTranscriptText(rawText: string): string {
    return rawText
      .replace(/&amp;#39;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Chunks short contiguous transcript segments into cohesive 30–60 second blocks.
   */
  static chunkSegments(segments: YouTubeTranscriptSegment[], targetDurationSec: number = 45): YouTubeTranscriptSegment[] {
    if (!segments || segments.length === 0) return [];

    const chunks: YouTubeTranscriptSegment[] = [];
    let currentChunkTexts: string[] = [];
    let chunkStart = segments[0].start;
    let chunkEnd = segments[0].end;
    let videoId = segments[0].videoId;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      currentChunkTexts.push(seg.text);
      chunkEnd = seg.end;

      const duration = chunkEnd - chunkStart;
      if (duration >= targetDurationSec || i === segments.length - 1) {
        chunks.push({
          segmentId: `chunk_${chunks.length + 1}`,
          videoId,
          start: chunkStart,
          end: chunkEnd,
          duration: Math.round((chunkEnd - chunkStart) * 10) / 10,
          text: currentChunkTexts.join(" "),
          formattedTime: YouTubeTranscriptProvider.formatTimestamp(chunkStart),
          sequence: chunks.length + 1,
        });

        if (i < segments.length - 1) {
          chunkStart = segments[i + 1].start;
          chunkEnd = segments[i + 1].end;
          currentChunkTexts = [];
        }
      }
    }

    return chunks;
  }

  /**
   * Fetches timestamped transcript data for a YouTube video.
   */
  async getTranscript(videoId: string): Promise<YouTubeTranscriptResult> {
    const cleanId = videoId
      .replace("https://www.youtube.com/watch?v=", "")
      .replace("https://youtu.be/", "")
      .split("&")[0];

    const cacheKey = `yt_transcript_${cleanId}`;
    const cached = CentralCacheProvider.get<YouTubeTranscriptResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if real Data API captions are configured
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey && apiKey !== "your-youtube-api-key") {
      try {
        // Attempt timedtext caption retrieval
        const response = await fetch(`https://www.youtube.com/watch?v=${cleanId}`, {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (response.ok) {
          const html = await response.text();
          // Check for captionTracks in ytInitialPlayerResponse
          const match = html.match(/"captionTracks":\s*(\[.*?\])/);
          if (match && match[1]) {
            const tracks = JSON.parse(match[1]);
            const englishTrack = tracks.find((t: any) => t.languageCode === "en" || t.vssId?.includes(".en")) || tracks[0];

            if (englishTrack?.baseUrl) {
              const captionRes = await fetch(englishTrack.baseUrl, {
                headers: {
                  "Accept-Language": "en-US,en;q=0.9",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
              });
              if (captionRes.ok) {
                const xmlText = await captionRes.text();
                const parsedSegments = this.parseTimedTextXml(xmlText, cleanId);

                if (parsedSegments.length > 0) {
                  const result: YouTubeTranscriptResult = {
                    videoId: cleanId,
                    status: "AVAILABLE",
                    language: englishTrack.languageCode || "en",
                    isGenerated: !!englishTrack.kind && englishTrack.kind === "asr",
                    segments: parsedSegments,
                    fullText: parsedSegments.map((s) => s.text).join(" "),
                    retrievedAt: new Date().toISOString(),
                  };
                  CentralCacheProvider.set(cacheKey, result, YouTubeTranscriptProvider.CACHE_TTL_MS);
                  return result;
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.warn(`Live transcript retrieval error for video ${cleanId}:`, err.message);
      }
    }

    // No fabricated fallback transcript. A previous `getDeterministicTranscript()` returned
    // invented captions (fake fps figures, fake battery timings, fake thermal deltas) for
    // hardcoded video ids, which downstream code then treated as real reviewer measurements.
    // When captions genuinely cannot be retrieved the result below says so honestly.

    // If video ID is valid format but transcript is not found:
    const unavailableResult: YouTubeTranscriptResult = {
      videoId: cleanId,
      status: "TRANSCRIPT_UNAVAILABLE",
      language: "unknown",
      isGenerated: false,
      segments: [],
      fullText: "",
      errorMessage: "No captions or transcripts were provided by creator or platform for this video.",
      retrievedAt: new Date().toISOString(),
    };
    CentralCacheProvider.set(cacheKey, unavailableResult, YouTubeTranscriptProvider.CACHE_TTL_MS);
    return unavailableResult;
  }

  /**
   * Parses XML timedtext into structured segments.
   */
  private parseTimedTextXml(xml: string, videoId: string): YouTubeTranscriptSegment[] {
    const segments: YouTubeTranscriptSegment[] = [];
    const textRegex = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>(.*?)<\/text>/g;
    let match: RegExpExecArray | null;
    let seq = 1;

    while ((match = textRegex.exec(xml)) !== null) {
      const start = parseFloat(match[1]);
      const duration = parseFloat(match[2]);
      const rawText = match[3];
      const clean = YouTubeTranscriptProvider.cleanTranscriptText(rawText);

      if (clean.length > 0) {
        segments.push({
          segmentId: `seg_${seq}`,
          videoId,
          start,
          duration,
          end: Math.round((start + duration) * 100) / 100,
          text: clean,
          formattedTime: YouTubeTranscriptProvider.formatTimestamp(start),
          sequence: seq++,
        });
      }
    }

    return segments;
  }
}
