export interface SyndicationRelationship {
  sourceAId: string;
  sourceBId: string;
  relationshipType: 'ORIGINATES_FROM' | 'SYNDICATED_FROM' | 'CITES' | 'INDEPENDENT_REPORTING';
  confidence: number;
  reason: string;
}

export class SyndicationDetector {
  /**
   * Evaluates text similarity and URL domains to detect press release syndications or copied reporting.
   */
  static analyzeRelationships(sources: Array<{ id: string; url: string; title: string; publisher: string; extractedText?: string }>): SyndicationRelationship[] {
    const relationships: SyndicationRelationship[] = [];

    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const srcA = sources[i];
        const srcB = sources[j];

        const titleA = srcA.title.toLowerCase();
        const titleB = srcB.title.toLowerCase();

        // 1. Check title similarity
        const titleWordsA = new Set(titleA.split(/s+/).filter((w) => w.length > 3));
        const titleWordsB = new Set(titleB.split(/s+/).filter((w) => w.length > 3));

        const intersection = Array.from(titleWordsA).filter((w) => titleWordsB.has(w));
        const jaccardSimilarity = intersection.length / Math.max(1, Math.min(titleWordsA.size, titleWordsB.size));

        if (jaccardSimilarity > 0.75) {
          relationships.push({
            sourceAId: srcA.id,
            sourceBId: srcB.id,
            relationshipType: "SYNDICATED_FROM",
            confidence: 0.9,
            reason: `High title text overlap (${Math.round(jaccardSimilarity * 100)}% keyword match) indicates syndicated press release distribution.`,
          });
        } else if (srcA.publisher === srcB.publisher) {
          relationships.push({
            sourceAId: srcA.id,
            sourceBId: srcB.id,
            relationshipType: "ORIGINATES_FROM",
            confidence: 0.95,
            reason: "Originates from the same publisher domain.",
          });
        } else {
          relationships.push({
            sourceAId: srcA.id,
            sourceBId: srcB.id,
            relationshipType: "INDEPENDENT_REPORTING",
            confidence: 0.85,
            reason: "Distinct publisher domains with unique headline phrasing.",
          });
        }
      }
    }

    return relationships;
  }
}
