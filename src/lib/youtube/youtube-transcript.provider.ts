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
   *
   * YouTube actively blocks unauthenticated transcript retrieval from datacenter IPs. Every
   * free server-side route (timedtext, InnerTube get_transcript, InnerTube ANDROID player)
   * now returns HTTP 200 with an EMPTY body or a 400 FAILED_PRECONDITION unless a
   * BotGuard-generated `pot` token is attached — and that token needs a real browser to
   * generate. So this tries, in order:
   *   1. Watch-page scrape of `captionTracks` — still lets us *detect* that a caption track
   *      exists (so we can report BLOCKED vs UNAVAILABLE), and occasionally returns a body.
   *   2. An external transcript API, if YT_TRANSCRIPT_API_URL is set. This is the reliable
   *      production path — those providers run residential proxies / solve BotGuard. See
   *      .env.example for ready-to-use provider configs (e.g. Supadata).
   * Nothing is ever fabricated: if no body can be retrieved the tab stays honestly empty.
   */
  async getTranscript(videoId: string): Promise<YouTubeTranscriptResult> {
    const cleanId = videoId
      .replace("https://www.youtube.com/watch?v=", "")
      .replace("https://youtu.be/", "")
      .split("&")[0];

    const cacheKey = `yt_transcript_${cleanId}`;
    const cached = CentralCacheProvider.get<YouTubeTranscriptResult>(cacheKey);
    if (cached) return cached;

    const UA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    let captionTrackExists = false;

    // --- Strategy 1: direct watch-page scrape --------------------------------------------
    try {
      const response = await fetch(
        `https://www.youtube.com/watch?v=${cleanId}&bpctr=9999999999&has_verified=1&hl=en&gl=US`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": UA,
            // Skip the EU consent interstitial that otherwise replaces the watch page.
            Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+678",
          },
          signal: AbortSignal.timeout(8000),
        }
      );

      if (response.ok) {
        const html = await response.text();
        const match = html.match(/"captionTracks":\s*(\[.*?\])/);
        if (match && match[1]) {
          const tracks = JSON.parse(match[1].replace(/\\u0026/g, "&"));
          captionTrackExists = tracks.length > 0;
          const englishTrack =
            tracks.find((t: any) => t.languageCode === "en" || t.vssId?.includes(".en")) || tracks[0];

          if (englishTrack?.baseUrl) {
            const baseUrl = englishTrack.baseUrl.replace(/\\u0026/g, "&");
            for (const fmt of ["&fmt=json3", ""]) {
              const capRes = await fetch(baseUrl + fmt, {
                headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": UA, Referer: "https://www.youtube.com/" },
                signal: AbortSignal.timeout(8000),
              });
              if (!capRes.ok) continue;
              const body = await capRes.text();
              if (!body.trim()) continue; // the empty-body block described above

              const segments = fmt
                ? this.parseJson3(body, cleanId)
                : this.parseTimedTextXml(body, cleanId);
              if (segments.length > 0) {
                return this.cacheAndReturn(cacheKey, {
                  videoId: cleanId,
                  status: "AVAILABLE",
                  language: englishTrack.languageCode || "en",
                  isGenerated: englishTrack.kind === "asr",
                  segments,
                  fullText: segments.map((s) => s.text).join(" "),
                  retrievedAt: new Date().toISOString(),
                });
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`Direct transcript scrape failed for ${cleanId}:`, err.message);
    }

    // --- Strategy 2: external transcript API -----------------------------------------------
    const apiUrl = process.env.YT_TRANSCRIPT_API_URL;
    if (apiUrl) {
      try {
        const url = apiUrl.includes("{videoId}")
          ? apiUrl.replace("{videoId}", cleanId)
          : `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}videoId=${cleanId}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            ...(process.env.YT_TRANSCRIPT_API_KEY
              ? {
                  Authorization: `Bearer ${process.env.YT_TRANSCRIPT_API_KEY}`,
                  "x-api-key": process.env.YT_TRANSCRIPT_API_KEY,
                }
              : {}),
          },
          signal: AbortSignal.timeout(15000),
        });
        if (res.ok) {
          const data: any = await res.json();
          // Accept the common shapes: {content:[...]}, {transcript:[...]}, {segments:[...]}, [ ... ]
          const rawSegs: any[] =
            data.content || data.transcript || data.segments || (Array.isArray(data) ? data : []);
          // Supadata-style providers report per-segment `offset`/`duration` in milliseconds
          // (and tag each segment with a `lang`); youtube-transcript-api-style providers use
          // `start`/`dur` in seconds. Force-ms can also be set via YT_TRANSCRIPT_API_MS=1.
          const msMode =
            process.env.YT_TRANSCRIPT_API_MS === "1" ||
            rawSegs.some((s) => s && s.lang !== undefined && s.offset !== undefined);
          const segments: YouTubeTranscriptSegment[] = rawSegs
            .map((s: any, i: number): YouTubeTranscriptSegment | null => {
              const div = msMode ? 1000 : 1;
              const start =
                Number(s.start ?? (s.startMs != null ? s.startMs / 1000 : s.offset != null ? s.offset / div : 0)) || 0;
              const duration =
                Number(s.dur ?? (s.durationMs != null ? s.durationMs / 1000 : s.duration != null ? s.duration / div : 0)) || 0;
              const text = YouTubeTranscriptProvider.cleanTranscriptText(String(s.text ?? s.content ?? ""));
              if (!text) return null;
              return {
                segmentId: `seg_${i + 1}`,
                videoId: cleanId,
                start,
                duration,
                end: Math.round((start + duration) * 100) / 100,
                text,
                formattedTime: YouTubeTranscriptProvider.formatTimestamp(start),
                sequence: i + 1,
              };
            })
            .filter((s): s is YouTubeTranscriptSegment => s !== null);

          if (segments.length > 0) {
            return this.cacheAndReturn(cacheKey, {
              videoId: cleanId,
              status: "AVAILABLE",
              language: "en",
              isGenerated: false,
              segments,
              fullText: segments.map((s) => s.text).join(" "),
              retrievedAt: new Date().toISOString(),
            });
          }
        } else {
          console.warn(`External transcript API returned ${res.status} for ${cleanId}`);
        }
      } catch (err: any) {
        console.warn(`External transcript API error for ${cleanId}:`, err.message);
      }
    }

    // --- Honest failure -------------------------------------------------------------------
    return this.cacheAndReturn(cacheKey, {
      videoId: cleanId,
      status: captionTrackExists ? "BLOCKED" : "TRANSCRIPT_UNAVAILABLE",
      language: "unknown",
      isGenerated: false,
      segments: [],
      fullText: "",
      errorMessage: captionTrackExists
        ? "This video has captions, but YouTube blocked every automated retrieval route (get_transcript, ANDROID player, and timedtext all returned empty — a known restriction on server IPs). Configure YT_TRANSCRIPT_API_URL with a transcript provider to enable transcript-derived analysis."
        : "No captions or transcript were published for this video.",
      retrievedAt: new Date().toISOString(),
    });
  }

  private cacheAndReturn(key: string, result: YouTubeTranscriptResult): YouTubeTranscriptResult {
    CentralCacheProvider.set(key, result, YouTubeTranscriptProvider.CACHE_TTL_MS);
    return result;
  }

  /**
   * Parses YouTube's json3 timedtext format into structured segments.
   */
  private parseJson3(body: string, videoId: string): YouTubeTranscriptSegment[] {
    const segments: YouTubeTranscriptSegment[] = [];
    try {
      const data = JSON.parse(body);
      let seq = 1;
      for (const ev of data.events || []) {
        if (!ev.segs) continue;
        const text = YouTubeTranscriptProvider.cleanTranscriptText(
          ev.segs.map((s: any) => s.utf8 || "").join("")
        );
        if (!text) continue;
        const start = (ev.tStartMs || 0) / 1000;
        const duration = (ev.dDurationMs || 0) / 1000;
        segments.push({
          segmentId: `seg_${seq}`,
          videoId,
          start,
          duration,
          end: Math.round((start + duration) * 100) / 100,
          text,
          formattedTime: YouTubeTranscriptProvider.formatTimestamp(start),
          sequence: seq++,
        });
      }
    } catch {
      /* fall through to empty */
    }
    return segments;
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
