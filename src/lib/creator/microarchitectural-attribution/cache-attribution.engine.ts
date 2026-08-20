import { TraceNormalizationRecord } from "./microarchitectural-attribution.types";

export class CacheAttributionEngine {
  public static evaluate(norm: TraceNormalizationRecord): {
    isTriggered: boolean;
    level: "CACHE_L1" | "CACHE_L2" | "CACHE_L3" | null;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    if (norm.l3CacheMissRateMPKI > 4.0) {
      supporting.push(`L3 / LLC cache miss rate (${norm.l3CacheMissRateMPKI} MPKI) is elevated.`);
      return { isTriggered: true, level: "CACHE_L3", supporting, contradicting };
    }

    if (norm.l1DataCacheMissRateMPKI > 15.0) {
      supporting.push(`L1 data cache miss rate (${norm.l1DataCacheMissRateMPKI} MPKI) exceeds 15 MPKI threshold.`);
      return { isTriggered: true, level: "CACHE_L1", supporting, contradicting };
    }

    if (norm.l2CacheMissRateMPKI > 8.0) {
      supporting.push(`L2 cache miss rate (${norm.l2CacheMissRateMPKI} MPKI) is elevated.`);
      return { isTriggered: true, level: "CACHE_L2", supporting, contradicting };
    }

    contradicting.push("Cache miss rates remain within baseline thresholds across L1, L2, and L3.");
    return { isTriggered: false, level: null, supporting, contradicting };
  }
}
