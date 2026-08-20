export interface SourceClassification {
  sourceId: string;
  sourceCategory: "Primary Source" | "Independent Technical Source" | "Secondary Source" | "Community Source" | "Independence Uncertain";
  isSyndicated: boolean;
  syndicationNotes?: string;
  independenceScore: number; // 0 to 10 scale
}

const PRIMARY_DOMAINS = [
  "samsung.com", "apple.com", "intel.com", "amd.com", "nvidia.com",
  "microsoft.com", "dell.com", "hp.com", "lenovo.com", "qualcomm.com", "arm.com"
];

const INDEPENDENT_BENCHMARK_DOMAINS = [
  "anandtech.com", "gsmarena.com", "notebookcheck.net", "tomshardware.com",
  "pugetsystems.com", "gamersnexus.net", "rtings.com", "geformat.de", "ltt.gg"
];

const COMMUNITY_DOMAINS = [
  "reddit.com", "xda-developers.com", "forums.macrumors.com", "forum.overclock3d.net"
];

export function classifySource(source: { id: string; url: string; publisher?: string; title: string }): SourceClassification {
  const urlLower = (source.url || "").toLowerCase();
  const publisherLower = (source.publisher || "").toLowerCase();

  const isPrimary = PRIMARY_DOMAINS.some(d => urlLower.includes(d) || publisherLower.includes(d));
  if (isPrimary) {
    return {
      sourceId: source.id,
      sourceCategory: "Primary Source",
      isSyndicated: false,
      independenceScore: 10.0,
    };
  }

  const isIndependent = INDEPENDENT_BENCHMARK_DOMAINS.some(d => urlLower.includes(d) || publisherLower.includes(d));
  if (isIndependent) {
    return {
      sourceId: source.id,
      sourceCategory: "Independent Technical Source",
      isSyndicated: false,
      independenceScore: 9.2,
    };
  }

  const isCommunity = COMMUNITY_DOMAINS.some(d => urlLower.includes(d) || publisherLower.includes(d));
  if (isCommunity) {
    return {
      sourceId: source.id,
      sourceCategory: "Community Source",
      isSyndicated: false,
      independenceScore: 8.0,
    };
  }

  return {
    sourceId: source.id,
    sourceCategory: "Secondary Source",
    isSyndicated: false,
    independenceScore: 7.0,
  };
}

export function detectSourceSyndication(sources: Array<{ id: string; title: string; publisher?: string }>): Map<string, boolean> {
  const syndicationMap = new Map<string, boolean>();

  for (let i = 0; i < sources.length; i++) {
    syndicationMap.set(sources[i].id, false);
    for (let j = i + 1; j < sources.length; j++) {
      const wordsA = new Set((sources[i].title || "").toLowerCase().split(/s+/).filter(w => w.length > 3));
      const wordsB = new Set((sources[j].title || "").toLowerCase().split(/s+/).filter(w => w.length > 3));
      const overlap = Array.from(wordsA).filter(w => wordsB.has(w));
      const similarity = overlap.length / Math.max(1, Math.min(wordsA.size, wordsB.size));

      if (similarity > 0.75) {
        syndicationMap.set(sources[i].id, true);
        syndicationMap.set(sources[j].id, true);
      }
    }
  }

  return syndicationMap;
}
