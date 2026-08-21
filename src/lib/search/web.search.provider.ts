import { SearchProvider, SearchResult } from "./search.interface";
import { MockSearchProvider } from "./mock.search.provider";

export class WebSearchProvider implements SearchProvider {
  name = "Web Search Provider";
  private fallback: MockSearchProvider = new MockSearchProvider();

  async search(query: string, queryType: string = "PRIMARY", isTestMode: boolean = false): Promise<SearchResult[]> {
    const tavilyKey = process.env.TAVILY_API_KEY;
    const hasLiveKey = tavilyKey && tavilyKey !== "your-tavily-api-key";

    if (hasLiveKey) {
      try {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          body: JSON.stringify({
            api_key: tavilyKey,
            query,
            search_depth: "advanced",
            include_answer: false,
            max_results: 6,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.results.map((r: any) => ({
            title: r.title,
            url: r.url,
            snippet: r.content,
            publisher: new URL(r.url).hostname.replace("www.", ""),
            publishedDate: r.published_date || new Date().toISOString().split("T")[0],
            sourceType: r.url.includes("reddit.com") ? "COMMUNITY_FORUM" : "TECH_PUBLICATION",
            sourceTier: r.url.includes(".gov") || r.url.includes("apple.com") || r.url.includes("samsung.com") ? 1 : 2,
          }));
        }

        const body = await response.text().catch(() => "");
        const detail = body.slice(0, 200).replace(/\s+/g, " ").trim();
        throw new Error(
          `TAVILY_SEARCH_FAILED: live search request returned HTTP ${response.status}. Real web search is unavailable, so no sources were collected. ${detail ? `Response: ${detail}` : ""}`.trim()
        );
      } catch (err: any) {
        if (err?.message?.startsWith("TAVILY_SEARCH_FAILED")) throw err;
        throw new Error(`TAVILY_SEARCH_FAILED: live search request failed (${err?.message || "network error"}). Real web search is unavailable.`);
      }
    }

    if (!isTestMode) {
      throw new Error("TAVILY_SEARCH_FAILED: TAVILY_API_KEY is not configured. Real web search is unavailable, so no sources were collected. Please configure your TAVILY_API_KEY in .env.local");
    }

    // Only allow mock data if explicitly in test mode AND no live key was configured to attempt
    return this.fallback.search(query, queryType);
  }
}
