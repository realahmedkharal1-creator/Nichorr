export interface ExtractedPage {
  url: string;
  title: string;
  extractedText: string;
  author?: string;
  publishedDate?: string;
  isAccessible: boolean;
  statusMessage: string;
}

export class WebExtractionEngine {
  /**
   * Evaluates whether a target URL violates SSRF boundaries (blocking local IP ranges).
   */
  private isSafeUrl(targetUrl: string): boolean {
    try {
      const parsed = new URL(targetUrl);
      const host = parsed.hostname.toLowerCase();

      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.endsWith(".internal") ||
        host.endsWith(".local")
      ) {
        return false;
      }
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  async extractContent(url: string): Promise<ExtractedPage> {
    if (!this.isSafeUrl(url)) {
      return {
        url,
        title: "Blocked URL",
        extractedText: "",
        isAccessible: false,
        statusMessage: "SSRF Protection: Private/internal IP range access blocked.",
      };
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "VeritasTechBot/1.0 (+https://veritastech.ai)",
          "Accept": "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        return {
          url,
          title: "Page Inaccessible",
          extractedText: "",
          isAccessible: false,
          statusMessage: `HTTP Error ${response.status}`,
        };
      }

      const html = await response.text();
      // Strip script/style blocks (including their contents), then remaining tags, then normalize.
      // NOTE: previous patterns were over-escaped (\\b / \\/) so they never matched, which leaked
      // raw CSS/JS into the extracted text and downstream evidence/claims.
      const cleanText = html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

      // Reject content that is clearly not a readable article: bot/CDN interstitials or pages that
      // are still mostly markup/script residue. Treating these as evidence produces junk claims.
      const lower = cleanText.toLowerCase();
      const isInterstitial =
        cleanText.length < 200 ||
        /checking your browser|enable javascript|verifying you are human|attention required|cf-browser-verification|access denied|are you a robot/.test(lower);
      const residualMarkupRatio =
        (cleanText.match(/[{};<>]|--[a-z]|function\s*\(|var\s|=>/gi) || []).length /
        Math.max(1, cleanText.split(/\s+/).length);
      const looksLikeCodeDump = residualMarkupRatio > 0.15;

      if (isInterstitial || looksLikeCodeDump) {
        return {
          url,
          title,
          extractedText: "",
          isAccessible: false,
          statusMessage: isInterstitial
            ? "Content unusable: bot-check/interstitial or empty article body."
            : "Content unusable: page returned markup/script residue rather than readable text.",
        };
      }

      return {
        url,
        title,
        extractedText: cleanText.slice(0, 5000), // Limit payload length
        isAccessible: true,
        statusMessage: "Successfully extracted",
      };
    } catch (err: any) {
      return {
        url,
        title: "Extraction Failed",
        extractedText: "",
        isAccessible: false,
        statusMessage: err.message || "Network timeout or extraction error",
      };
    }
  }
}
