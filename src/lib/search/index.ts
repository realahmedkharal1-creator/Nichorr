import { SearchProvider } from "./search.interface";
import { WebSearchProvider } from "./web.search.provider";
import { SerpApiSearchProvider } from "./serpapi.search.provider";
import { MockSearchProvider } from "./mock.search.provider";

export function getSearchProvider(providerName?: string): SearchProvider {
  const provider = (providerName || process.env.SEARCH_PROVIDER || "tavily").toLowerCase().trim();

  if (provider === "serpapi") {
    return new SerpApiSearchProvider();
  }
  if (provider === "mock") {
    return new MockSearchProvider();
  }
  return new WebSearchProvider();
}

export * from "./search.interface";
export * from "./web.search.provider";
export * from "./serpapi.search.provider";
export * from "./mock.search.provider";
