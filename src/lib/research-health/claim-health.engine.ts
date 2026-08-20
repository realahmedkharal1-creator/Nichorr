import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import {
  ClaimHealthRecord,
  ClaimHealthStatus,
  EvidenceItemHealth,
  EvidenceFreshnessStatus,
  EvidenceValidityStatus,
  RevalidationActionType,
} from "./research-health.types";

export class ClaimHealthEngine {
  /**
   * Evaluates the factual health, freshness, validity, and creator impact of each research claim.
   * Connects upstream evidence health directly to downstream creator assets.
   */
  static evaluateClaimHealth(
    session: ResearchRunSession,
    evidenceHealth: EvidenceItemHealth[],
    report?: CreatorStudioReport
  ): ClaimHealthRecord[] {
    const claimRecords: ClaimHealthRecord[] = [];
    const evidenceHealthMap = new Map(evidenceHealth.map((e) => [e.evidenceId, e]));
    const sourcesMap = new Map((session.sources || []).map((s) => [s.id, s]));
    const nowStr = session.updatedAt || session.createdAt || new Date().toISOString();

    for (const clm of session.claims || []) {
      const evidenceIds = clm.evidence_ids || [];
      const upstreamEvidence = evidenceIds
        .map((id) => evidenceHealthMap.get(id))
        .filter((e): e is EvidenceItemHealth => !!e);

      const supportingEvidenceCount = upstreamEvidence.length;
      const primaryEvidenceCount = upstreamEvidence.filter(
        (e) => e.sourceTier === 1 || e.evidenceType === 'OEM_SPEC'
      ).length;
      
      const conflictingEvidenceCount = (session.conflicts || []).filter(
        (c) => c.claim_a_id === clm.id || c.claim_b_id === clm.id
      ).length;

      // Determine Authority Status
      let authorityStatus: ClaimHealthRecord['authorityStatus'] = 'UNKNOWN';
      if (primaryEvidenceCount > 0) {
        authorityStatus = 'TIER_1_PRIMARY';
      } else if (upstreamEvidence.some((e) => e.sourceTier === 2 || e.evidenceType === 'BENCHMARK')) {
        authorityStatus = 'TIER_2_LAB';
      } else if (upstreamEvidence.some((e) => e.sourceTier === 3)) {
        authorityStatus = 'TIER_3_SECONDARY';
      } else if (upstreamEvidence.some((e) => e.sourceTier === 4 || e.evidenceType === 'COMMUNITY')) {
        authorityStatus = 'TIER_4_COMMUNITY';
      }

      // Determine Independence Status
      let independenceStatus: ClaimHealthRecord['independenceStatus'] = 'UNKNOWN';
      const hasSyndicated = upstreamEvidence.some((e) => {
        const src = sourcesMap.get(e.sourceId);
        return src?.isSyndicated;
      });
      if (hasSyndicated) {
        independenceStatus = 'PR_SYNDICATED';
      } else if (upstreamEvidence.length > 0) {
        independenceStatus = 'INDEPENDENT';
      }

      // Determine Methodology Status
      let methodologyStatus: ClaimHealthRecord['methodologyStatus'] = 'NOT_APPLICABLE';
      const benchmarkEvi = upstreamEvidence.filter((e) => e.evidenceType === 'BENCHMARK' || e.evidenceType === 'THERMAL');
      if (benchmarkEvi.length > 0) {
        const hasMethodologyConflict = benchmarkEvi.some((b) => b.methodologyNote?.includes("upscaling") || b.revalidationReason?.includes("methodology"));
        if (hasMethodologyConflict) {
          methodologyStatus = 'METHODOLOGY_CONFLICT';
        } else if (benchmarkEvi.some((b) => b.methodologyNote)) {
          methodologyStatus = 'METHODOLOGY_VERIFIED';
        } else {
          methodologyStatus = 'METHODOLOGY_UNCERTAIN';
        }
      }

      // Determine Aggregate Freshness Status
      let freshnessStatus: EvidenceFreshnessStatus = 'UNKNOWN';
      if (upstreamEvidence.length === 0) {
        freshnessStatus = 'UNKNOWN';
      } else if (upstreamEvidence.some((e) => e.freshnessStatus === 'EXPIRED')) {
        freshnessStatus = 'EXPIRED';
      } else if (upstreamEvidence.some((e) => e.freshnessStatus === 'STALE')) {
        freshnessStatus = 'STALE';
      } else if (upstreamEvidence.some((e) => e.freshnessStatus === 'AGING')) {
        freshnessStatus = 'AGING';
      } else if (upstreamEvidence.every((e) => e.freshnessStatus === 'FRESH')) {
        freshnessStatus = 'FRESH';
      }

      // Determine Core Health & Validity Status
      let healthStatus: ClaimHealthStatus = 'HEALTHY';
      let validityStatus: EvidenceValidityStatus = 'VALID';
      let revalidationRequired = false;
      let revalidationAction: RevalidationActionType | undefined = undefined;
      let reason = "Claim is grounded in verified, authoritative laboratory evidence.";

      if (clm.status === 'DO_NOT_SAY') {
        healthStatus = 'BLOCKED';
        validityStatus = 'UNVERIFIED';
        revalidationRequired = false;
        reason = "Hard safety blocker: Claim contains prohibited or misleading factual assertion.";
      } else if (clm.status === 'CONFLICTED' || conflictingEvidenceCount > 0) {
        healthStatus = 'CONFLICTED';
        validityStatus = 'CONFLICTED';
        revalidationRequired = true;
        revalidationAction = 'RECHECK_LAB_RESULT';
        reason = "Material conflict detected between authoritative sources.";
      } else if (supportingEvidenceCount === 0 || (clm as any).status === 'UNBACKED') {
        healthStatus = 'UNBACKED';
        validityStatus = 'UNVERIFIED';
        revalidationRequired = true;
        revalidationAction = 'RECHECK_PRIMARY_SOURCE';
        reason = "No valid supporting evidence remains in the verified research graph.";
      } else if (methodologyStatus === 'METHODOLOGY_CONFLICT') {
        healthStatus = 'NEEDS_REVALIDATION';
        validityStatus = 'REVALIDATION_REQUIRED';
        revalidationRequired = true;
        revalidationAction = 'RECHECK_BENCHMARK_METHODOLOGY';
        reason = "Benchmark methodology shift or upscaling discrepancy detected.";
      } else if (freshnessStatus === 'EXPIRED' || freshnessStatus === 'STALE') {
        healthStatus = 'NEEDS_REVALIDATION';
        validityStatus = 'REVALIDATION_REQUIRED';
        revalidationRequired = true;
        revalidationAction = benchmarkEvi.length > 0 ? 'RECHECK_LAB_RESULT' : 'RECHECK_PRIMARY_SOURCE';
        reason = `Supporting evidence is ${freshnessStatus.toLowerCase()} and requires verification.`;
      } else if (freshnessStatus === 'AGING') {
        healthStatus = 'AGING';
        validityStatus = 'VALID';
        revalidationRequired = false;
        reason = "Evidence is aging but remains valid for production use.";
      } else if (freshnessStatus === 'UNKNOWN') {
        healthStatus = 'AGING';
        validityStatus = 'VALID';
        revalidationRequired = false;
        reason = "Evidence verification timestamp is unknown; marked aging as safety precaution.";
      }

      // Trace Affected Creator Assets
      const affectedCreatorAssets = this.findAffectedCreatorAssets(clm.id, evidenceIds, report);

      // Provenance summary
      const firstSrc = upstreamEvidence[0]?.sourcePublisher || "Verified OEM Source";
      const provSummary = `Grounded via ${supportingEvidenceCount} evidence item(s) from ${firstSrc} (${authorityStatus}).`;

      claimRecords.push({
        claimId: clm.id,
        claimText: clm.claim_text,
        claimType: (clm as any).claim_type || 'FACTUAL',
        healthStatus,
        freshnessStatus,
        validityStatus,
        authorityStatus,
        independenceStatus,
        methodologyStatus,
        supportingEvidenceCount,
        primaryEvidenceCount,
        conflictingEvidenceCount,
        lastVerifiedAt: nowStr,
        revalidationRequired,
        revalidationAction,
        reason,
        upstreamEvidenceIds: evidenceIds,
        provenanceChainSummary: provSummary,
        affectedCreatorAssets,
      });
    }

    return claimRecords;
  }

  private static findAffectedCreatorAssets(
    claimId: string,
    evidenceIds: string[],
    report?: CreatorStudioReport
  ): ClaimHealthRecord['affectedCreatorAssets'] {
    if (!report) return [];
    const assets: ClaimHealthRecord['affectedCreatorAssets'] = [];

    // 1. Talking Points
    const affectedTps = (report.talkingPoints || []).filter(
      (tp) => tp.evidenceIds?.includes(claimId) || tp.evidenceIds?.some((id) => evidenceIds.includes(id))
    );

    for (const tp of affectedTps) {
      assets.push({
        assetType: 'TALKING_POINT',
        assetId: tp.id,
        assetLabel: `Talking Point: "${tp.title}"`,
      });
    }

    // 2. Script Sections
    const affectedTpIds = new Set(affectedTps.map((t) => t.id));
    for (const sec of report.scriptSections || []) {
      const hasTp = sec.talkingPoints?.some((st) => affectedTpIds.has(st.id));
      if (hasTp) {
        assets.push({
          assetType: 'SCRIPT_SECTION',
          assetId: sec.id,
          assetLabel: `Script Section: "${sec.title}"`,
        });
      }
    }

    // 3. Benchmark Cards
    for (const bc of report.benchmarkCards || []) {
      if (bc.id === claimId || evidenceIds.includes(bc.id)) {
        assets.push({
          assetType: 'BENCHMARK_CARD',
          assetId: bc.id,
          assetLabel: `Benchmark Card: "${bc.benchmarkName}"`,
        });
      }
    }

    // 4. Teleprompter
    if (report.fullNarrationScript && affectedTps.length > 0) {
      assets.push({
        assetType: 'TELEPROMPTER',
        assetId: 'teleprompter-script',
        assetLabel: 'Spoken Narration Script',
      });
    }

    return assets;
  }
}
