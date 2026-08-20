export interface EntityResolutionResult {
  mentionText: string;
  canonicalName: string;
  isMatch: boolean;
  confidence: number;
  status: "CONFIRMED" | "REVIEW_REQUIRED" | "UNRESOLVED";
}

export class EntityIntelligenceEngine {
  static resolveEntity(mention: string, canonical: string): EntityResolutionResult {
    const isDirectMatch = mention.toLowerCase().trim() === canonical.toLowerCase().trim();
    if (isDirectMatch) {
      return {
        mentionText: mention,
        canonicalName: canonical,
        isMatch: true,
        confidence: 99.0,
        status: "CONFIRMED",
      };
    }

    return {
      mentionText: mention,
      canonicalName: canonical,
      isMatch: false,
      confidence: 65.0,
      status: "REVIEW_REQUIRED",
    };
  }
}
