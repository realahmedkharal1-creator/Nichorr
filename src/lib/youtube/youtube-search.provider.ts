import { CentralCacheProvider } from "@/lib/cache/cache-provider";
import { YouTubeVideoItem } from "./youtube.types";

export interface YouTubeSearchOptions {
  maxResults?: number;
  dimensions?: Array<'REVIEW' | 'BENCHMARK' | 'THERMALS' | 'BATTERY' | 'CAMERA' | 'ISSUES' | 'TEARDOWN'>;
  freshnessMonths?: number;
}

export class YouTubeSearchProvider {
  private static CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Generates multi-vector search queries across technology evaluation dimensions.
   */
  static generateSearchVectors(topic: string): Array<{ dimension: string; query: string }> {
    const cleanTopic = topic.trim();
    return [
      { dimension: "REVIEW", query: `${cleanTopic} in-depth review test` },
      { dimension: "BENCHMARK", query: `${cleanTopic} gaming benchmark fps power draw` },
      { dimension: "THERMALS", query: `${cleanTopic} thermal throttling sustained temperature test` },
      { dimension: "BATTERY", query: `${cleanTopic} battery life drain endurance test` },
      { dimension: "CAMERA", query: `${cleanTopic} camera comparison 4k video dynamic range` },
      { dimension: "ISSUES", query: `${cleanTopic} problems user complaints long term review` },
    ];
  }

  /**
   * Discovers tech review videos for a given topic across multiple technology dimensions.
   */
  async searchVideos(topic: string, options: YouTubeSearchOptions = {}): Promise<YouTubeVideoItem[]> {
    const cacheKey = `yt_search_${topic.toLowerCase().replace(/\s+/g, "_")}`;
    const cached = CentralCacheProvider.get<YouTubeVideoItem[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const vectors = YouTubeSearchProvider.generateSearchVectors(topic);
    const discoveredVideos: Map<string, YouTubeVideoItem> = new Map();

    if (apiKey && apiKey !== "your-youtube-api-key") {
      try {
        for (const vector of vectors.slice(0, 3)) { // Query top 3 vectors to preserve API quota
          const encodedQuery = encodeURIComponent(vector.query);
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodedQuery}&relevanceLanguage=en&regionCode=US&key=${apiKey}`;
          
          const res = await fetch(url, {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
          });
          if (res.ok) {
            const data = await res.json();
            for (const item of (data.items || [])) {
              const videoId = item.id?.videoId;
              if (videoId && !discoveredVideos.has(videoId)) {
                discoveredVideos.set(videoId, {
                  videoId,
                  title: item.snippet?.title || "Technology Review Video",
                  channelTitle: item.snippet?.channelTitle || "Tech Creator",
                  channelId: item.snippet?.channelId,
                  publishedAt: item.snippet?.publishedAt ? item.snippet.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
                  url: `https://www.youtube.com/watch?v=${videoId}`,
                  description: item.snippet?.description,
                  thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
                  dimension: vector.dimension,
                  query: vector.query,
                });
              }
            }
          }
        }
      } catch (err: any) {
        console.warn("YouTube Search API query failed; no YouTube intelligence will be produced for this run:", err.message);
      }
    }

    // No fabricated fallback. If the API key is absent or the API returned nothing, this
    // returns an empty list and the intelligence engine reports "no YouTube data" honestly.
    // A previous `generateDeterministicTechVideos()` fallback invented videos here — fake
    // videoIds, real creators' channel names, and fabricated view counts — which then flowed
    // into claims, conflicts and briefs as if it were researched evidence.
    if (discoveredVideos.size === 0 && (!apiKey || apiKey === "your-youtube-api-key")) {
      console.warn("YouTube discovery skipped: YOUTUBE_API_KEY is not configured. No YouTube intelligence will be produced for this run.");
    }

    const results = Array.from(discoveredVideos.values());
    CentralCacheProvider.set(cacheKey, results, YouTubeSearchProvider.CACHE_TTL_MS);
    return results;
  }
}
