export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publisher?: string;
  author?: string;
  publishedDate?: string;
  sourceType: 'OFFICIAL_SPEC' | 'DOCUMENTATION' | 'INDEPENDENT_BENCHMARK' | 'TECH_PUBLICATION' | 'COMMUNITY_FORUM' | 'YOUTUBE_VIDEO' | 'REGULATORY_FILING' | 'OTHER';
  sourceTier: 1 | 2 | 3;
}

export interface SearchProvider {
  name: string;
  search(query: string, queryType?: string): Promise<SearchResult[]>;
}
