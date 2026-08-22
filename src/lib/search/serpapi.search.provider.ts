import { SearchProvider, SearchResult } from "./search.interface";
import { MockSearchProvider } from "./mock.search.provider";

export class SerpApiSearchProvider implements SearchProvider {
  name = "SerpAPI Search Provider";
  private fallback: MockSearchProvider = new MockSearchProvider();

  async search(query: string, queryType: string = "PRIMARY", isTestMode: boolean = false): Promise<SearchResult[]> {
    const serpapiKey = process.env.SERPAPI_API_KEY;
    const hasLiveKey = serpapiKey && serpapiKey !== "your-serpapi-api-key";

    if (hasLiveKey) {
      try {
        const url = new URL("https://serpapi.com/search");
        url.searchParams.set("engine", "google");
        url.searchParams.set("q", query);
        url.searchParams.set("api_key", serpapiKey);
        url.searchParams.set("num", "6");

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const organicResults = data.organic_results || [];
          return organicResults.slice(0, 6).map((r: any) => {
            const resultUrl = r.link || r.url || "";
            let publisher = r.source || "";
            if (!publisher && resultUrl) {
              try {
                publisher = new URL(resultUrl).hostname.replace("www.", "");
              } catch {
                publisher = "web-source";
              }
            }

            return {
              title: r.title || "Search Result",
              url: resultUrl,
              snippet: r.snippet || r.snippet_highlighted_words?.join(" ") || "",
              publisher: publisher || "web-source",
              publishedDate: r.date || new Date().toISOString().split("T")[0],
              sourceType: resultUrl.includes("reddit.com") ? "COMMUNITY_FORUM" : "TECH_PUBLICATION",
              sourceTier: resultUrl.includes(".gov") || resultUrl.includes("apple.com") || resultUrl.includes("samsung.com") ? 1 : 2,
            };
          });
        }

        const body = await response.text().catch(() => "");
        const detail = body.slice(0, 200).replace(/\s+/g, " ").trim();
        throw new Error(
          `SERPAPI_SEARCH_FAILED: live search request returned HTTP ${response.status}. Real web search is unavailable, so no sources were collected. ${detail ? `Response: ${detail}` : ""}`.trim()
        );
      } catch (err: any) {
        if (err?.message?.startsWith("SERPAPI_SEARCH_FAILED")) throw err;
        throw new Error(`SERPAPI_SEARCH_FAILED: live search request failed (${err?.message || "network error"}). Real web search is unavailable.`);
      }
    }

    if (!isTestMode) {
      throw new Error("SERPAPI_SEARCH_FAILED: SERPAPI_API_KEY is not configured. Real web search is unavailable, so no sources were collected. Please configure your SERPAPI_API_KEY in .env.local");
    }

    return this.fallback.search(query, queryType);
  }
}
