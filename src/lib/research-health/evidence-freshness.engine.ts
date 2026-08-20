import { ResearchRunSession } from "@/features/research/research-engine";
import {
  EvidenceItemHealth,
  EvidenceFreshnessStatus,
  EvidenceValidityStatus,
  FreshnessConfidence,
} from "./research-health.types";

export class EvidenceFreshnessEngine {
  /**
   * Evaluates the freshness and validity of individual evidence items across distinct tech domains.
   * Strictly separates Freshness from Authority and Methodology.
   * If metadata is missing, returns UNKNOWN without fabricating dates.
   */
  static evaluateEvidenceFreshness(session: ResearchRunSession): EvidenceItemHealth[] {
    const results: EvidenceItemHealth[] = [];
    const now = new Date();
    const sourcesMap = new Map((session.sources || []).map((s) => [s.id, s]));

    for (const evi of session.evidence || []) {
      const src = sourcesMap.get(evi.source_id);
      const eviType = this.classifyEvidenceType(evi, session);

      // Determine age signals
      const extractedDateStr = this.extractDateSignal(evi, src, session);
      let ageInDays: number | null = null;
      let freshnessStatus: EvidenceFreshnessStatus = 'UNKNOWN';
      let validityStatus: EvidenceValidityStatus = 'VALID';
      let confidence: FreshnessConfidence = 'UNKNOWN';
      let revalidationReason: string | undefined = undefined;
      let methodologyNote: string | undefined = undefined;

      if (extractedDateStr) {
        const parsedDate = new Date(extractedDateStr);
        if (!isNaN(parsedDate.getTime())) {
          const diffMs = Math.max(0, now.getTime() - parsedDate.getTime());
          ageInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          confidence = 'HIGH';
        }
      }

      // Domain-specific freshness threshold evaluation
      switch (eviType) {
        case 'BENCHMARK': {
          const bmMatch = (session.hardwareIntelligence?.benchmarkRecords as any[])?.find(
            (b: any) => b.id === evi.id || (b.benchmarkName && b.benchmarkName.toLowerCase().includes(evi.excerpt.toLowerCase().slice(0, 15)))
          );
          
          if (bmMatch) {
            methodologyNote = `Benchmark: ${bmMatch.benchmarkName} (${bmMatch.score} ${bmMatch.metricUnit || "pts"}).`;
            if ((bmMatch as any).testConditions?.includes("DLSS") && !(bmMatch as any).testConditions?.includes("Native")) {
              methodologyNote += " Tested with upscaling / frame gen.";
            }
          }

          if (ageInDays === null) {
            freshnessStatus = 'UNKNOWN';
            confidence = 'LOW';
            revalidationReason = "Missing benchmark execution timestamp.";
          } else if (ageInDays > 180) {
            freshnessStatus = 'EXPIRED';
            validityStatus = 'REVALIDATION_REQUIRED';
            revalidationReason = `Benchmark result is ${ageInDays} days old and may be superseded by newer driver/firmware revisions.`;
          } else if (ageInDays > 90) {
            freshnessStatus = 'STALE';
            validityStatus = 'REVALIDATION_REQUIRED';
            revalidationReason = `Benchmark result is ${ageInDays} days old (>90 days). Recheck driver optimizations.`;
          } else if (ageInDays > 45) {
            freshnessStatus = 'AGING';
            revalidationReason = `Benchmark is ${ageInDays} days old. Still valid for current comparisons.`;
          } else {
            freshnessStatus = 'FRESH';
          }
          break;
        }

        case 'THERMAL': {
          const thermalMatch = (session.hardwareIntelligence?.thermalFindings as any[])?.find(
            (t: any) => (t.entityName && evi.product_entity && t.entityName.includes(evi.product_entity))
          );
          if (thermalMatch) {
            methodologyNote = `Peak Temp: ${thermalMatch.peakTempC || 0}°C, Throttling: ${thermalMatch.throttlingPercent || 0}%, Stability: ${thermalMatch.stabilityRating || "UNKNOWN"}.`;
          }

          if (ageInDays === null) {
            freshnessStatus = 'UNKNOWN';
            confidence = 'LOW';
            revalidationReason = "Missing thermal run timestamp.";
          } else if (ageInDays > 120) {
            freshnessStatus = 'STALE';
            validityStatus = 'REVALIDATION_REQUIRED';
            revalidationReason = "Thermal results older than 120 days require verification against latest cooling firmware.";
          } else if (ageInDays > 60) {
            freshnessStatus = 'AGING';
          } else {
            freshnessStatus = 'FRESH';
          }
          break;
        }

        case 'YOUTUBE_REVIEW': {
          const ytFinding = session.youtubeIntelligence?.claims?.find(
            (y) => y.channelTitle && evi.excerpt.includes(y.channelTitle)
          );
          if (ytFinding) {
            methodologyNote = `Reviewer: ${ytFinding.channelTitle}, Finding: "${ytFinding.claim}"`;
          }

          if (ageInDays === null) {
            freshnessStatus = 'UNKNOWN';
            confidence = 'LOW';
            revalidationReason = "Missing YouTube video publication date.";
          } else if (ageInDays > 180) {
            freshnessStatus = 'STALE';
            validityStatus = 'REVALIDATION_REQUIRED';
            revalidationReason = `Review is ${ageInDays} days old; long-term reviews or newer updates may have altered consensus.`;
          } else if (ageInDays > 90) {
            freshnessStatus = 'AGING';
          } else {
            freshnessStatus = 'FRESH';
          }
          break;
        }

        case 'HARDWARE_SPEC':
        case 'OEM_SPEC': {
          // Hardware specs remain valid longer unless SKU or spec revisions occur
          if (ageInDays === null) {
            freshnessStatus = 'UNKNOWN';
            confidence = 'MEDIUM';
          } else if (ageInDays > 365) {
            freshnessStatus = 'STALE';
            validityStatus = 'REVALIDATION_REQUIRED';
            revalidationReason = "Specification is over 1 year old; verify against current OEM datasheet revisions.";
          } else if (ageInDays > 180) {
            freshnessStatus = 'AGING';
          } else {
            freshnessStatus = 'FRESH';
          }
          break;
        }

        default: {
          if (ageInDays === null) {
            freshnessStatus = 'UNKNOWN';
            confidence = 'LOW';
          } else if (ageInDays > 180) {
            freshnessStatus = 'STALE';
            validityStatus = 'REVALIDATION_REQUIRED';
          } else if (ageInDays > 90) {
            freshnessStatus = 'AGING';
          } else {
            freshnessStatus = 'FRESH';
          }
          break;
        }
      }

      // Check source independence and syndication
      if (src?.isSyndicated) {
        validityStatus = 'REVALIDATION_REQUIRED';
        revalidationReason = (revalidationReason ? `${revalidationReason} ` : "") + "Source identified as syndicated PR wire.";
      }

      results.push({
        evidenceId: evi.id,
        sourceId: evi.source_id,
        evidenceType: eviType,
        productEntity: evi.product_entity || "Hardware System",
        excerpt: evi.excerpt,
        freshnessStatus,
        validityStatus,
        confidence,
        ageInDays,
        lastVerifiedAt: session.updatedAt || session.createdAt || now.toISOString(),
        revalidationReason,
        methodologyNote,
        sourcePublisher: src?.publisher || "Unknown Publisher",
        sourceUrl: src?.url,
        sourceTier: src?.sourceTier || (src?.isPrimary ? 1 : 2),
      });
    }

    return results;
  }

  private static classifyEvidenceType(
    evi: { evidence_type?: string; excerpt: string },
    session: ResearchRunSession
  ): 'BENCHMARK' | 'HARDWARE_SPEC' | 'YOUTUBE_REVIEW' | 'OEM_SPEC' | 'THERMAL' | 'COMMUNITY' | 'GENERAL' {
    if (evi.evidence_type === 'BENCHMARK' || /geekbench|cinebench|3dmark|fps|score|pts/i.test(evi.excerpt)) {
      return 'BENCHMARK';
    }
    if (evi.evidence_type === 'THERMAL' || /watt|celsius|temperature|throttl|temp|fan noise|power limit/i.test(evi.excerpt)) {
      return 'THERMAL';
    }
    if (/youtube|video|reviewer|unbox|timestamp/i.test(evi.excerpt) || session.youtubeIntelligence) {
      const ytMatch = session.youtubeIntelligence?.claims?.some((c) => evi.excerpt.includes(c.channelTitle));
      if (ytMatch) return 'YOUTUBE_REVIEW';
    }
    if (/specification|spec|ghz|core count|ram|vram|tdp|modem|process node/i.test(evi.excerpt)) {
      return 'HARDWARE_SPEC';
    }
    if (/whitepaper|datasheet|oem|apple|intel|amd|nvidia|qualcomm/i.test(evi.excerpt)) {
      return 'OEM_SPEC';
    }
    return 'GENERAL';
  }

  private static extractDateSignal(
    evi: any,
    src: any,
    session: ResearchRunSession
  ): string | null {
    // 1. Evidence explicit test date
    if (evi.testDate) return evi.testDate;
    if (evi.extractedAt) return evi.extractedAt;

    // 2. Source publication date
    if (src?.publicationDate) return src.publicationDate;
    if (src?.publishedAt) return src.publishedAt;
    if (src?.date) return src.date;

    // 3. Fallback to session creation date if known
    if (session.createdAt) return session.createdAt;

    return null;
  }
}
