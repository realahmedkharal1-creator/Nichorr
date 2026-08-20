import { ResearchRunSession } from "@/features/research/research-engine";
import { ResearchChange, ResearchChangeType, ChangeSeverity, ChangeConfidence } from "./research-changes.types";

export class ResearchDiffEngine {
  /**
   * Compares two research session states deterministically and produces structured ResearchChanges.
   */
  static computeChanges(
    previousSession: ResearchRunSession | null,
    currentSession: ResearchRunSession
  ): ResearchChange[] {
    const changes: ResearchChange[] = [];
    const now = new Date().toISOString();

    if (!previousSession) {
      // First baseline snapshot - no changes
      return [];
    }

    // 1. Compare Sources
    const prevSourcesMap = new Map((previousSession.sources || []).map((s) => [s.id, s]));
    const currSourcesMap = new Map((currentSession.sources || []).map((s) => [s.id, s]));

    for (const [id, currSrc] of currSourcesMap.entries()) {
      const prevSrc = prevSourcesMap.get(id);
      if (!prevSrc) {
        changes.push({
          id: `chg-src-add-${id}`,
          changeType: "SOURCE_ADDED",
          entityId: id,
          entityName: currSrc.title || currSrc.publisher || id,
          previousValue: null,
          currentValue: currSrc.url,
          severity: "LOW",
          confidence: "CONFIRMED",
          summary: `New source added: ${currSrc.title || currSrc.publisher}`,
          detailedReason: `Source ${currSrc.publisher} added to evidence repository.`,
          sourcePublisher: currSrc.publisher,
          authorityTier: `TIER_${currSrc.sourceTier || 2}`,
          affectedClaimIds: [],
          detectedAt: now,
        });
      } else {
        // Check tier change
        if (prevSrc.sourceTier !== currSrc.sourceTier) {
          changes.push({
            id: `chg-src-tier-${id}`,
            changeType: "SOURCE_AUTHORITY_CHANGED",
            entityId: id,
            entityName: currSrc.title || currSrc.publisher,
            previousValue: `Tier ${prevSrc.sourceTier}`,
            currentValue: `Tier ${currSrc.sourceTier}`,
            severity: "MEDIUM",
            confidence: "CONFIRMED",
            summary: `Source authority tier updated for ${currSrc.publisher}`,
            detailedReason: `Authority tier changed from Tier ${prevSrc.sourceTier} to Tier ${currSrc.sourceTier}.`,
            sourcePublisher: currSrc.publisher,
            authorityTier: `TIER_${currSrc.sourceTier || 2}`,
            affectedClaimIds: [],
            detectedAt: now,
          });
        }
        // Check syndication/independence change
        if (prevSrc.isSyndicated !== currSrc.isSyndicated) {
          changes.push({
            id: `chg-src-indep-${id}`,
            changeType: "SOURCE_INDEPENDENCE_CHANGED",
            entityId: id,
            entityName: currSrc.title || currSrc.publisher,
            previousValue: prevSrc.isSyndicated ? "Syndicated" : "Independent",
            currentValue: currSrc.isSyndicated ? "Syndicated" : "Independent",
            severity: currSrc.isSyndicated ? "HIGH" : "LOW",
            confidence: "CONFIRMED",
            summary: `Source independence rating updated for ${currSrc.publisher}`,
            detailedReason: currSrc.isSyndicated
              ? "Source was identified as syndicated PR wire content."
              : "Source was verified as independent editorial testing.",
            sourcePublisher: currSrc.publisher,
            affectedClaimIds: [],
            detectedAt: now,
          });
        }
      }
    }

    for (const [id, prevSrc] of prevSourcesMap.entries()) {
      if (!currSourcesMap.has(id)) {
        // Source removed - check if claims still have alternate evidence
        const affectedClaims = (currentSession.claims || [])
          .filter((c) => (c.evidence_ids || []).length > 0)
          .map((c) => c.id);

        changes.push({
          id: `chg-src-rem-${id}`,
          changeType: "SOURCE_REMOVED",
          entityId: id,
          entityName: prevSrc.title || prevSrc.publisher || id,
          previousValue: prevSrc.url,
          currentValue: null,
          severity: "HIGH",
          confidence: "CONFIRMED",
          summary: `Source removed or unavailable: ${prevSrc.title || prevSrc.publisher}`,
          detailedReason: `Source is no longer present in active research pool. Downstream claims must be checked for alternate evidence backing.`,
          sourcePublisher: prevSrc.publisher,
          affectedClaimIds: affectedClaims,
          detectedAt: now,
        });
      }
    }

    // 2. Compare Benchmarks
    const prevBenchmarks = previousSession.hardwareIntelligence?.benchmarkRecords || [];
    const currBenchmarks = currentSession.hardwareIntelligence?.benchmarkRecords || [];
    const getBmEntityName = (b: any) => b.entityName || b.hardwareEntity?.name || "Hardware Entity";
    const getBmConditions = (b: any) => b.testConditions || (b.testConfiguration ? `${b.testConfiguration.resolution || ""} ${b.testConfiguration.upscalingMode || ""}`.trim() : "");
    const getBmPublisher = (b: any) => b.sourcePublisher || b.provenance?.publisher || "Lab Database";

    const prevBmMap = new Map((prevBenchmarks as any[]).map((b: any) => [`${getBmEntityName(b)}_${b.benchmarkName}`, b]));
    const currBmMap = new Map((currBenchmarks as any[]).map((b: any) => [`${getBmEntityName(b)}_${b.benchmarkName}`, b]));

    for (const [key, currBm] of currBmMap.entries()) {
      const prevBm = prevBmMap.get(key);
      const currEntity = getBmEntityName(currBm);
      const currConditions = getBmConditions(currBm);
      const currPub = getBmPublisher(currBm);

      if (!prevBm) {
        changes.push({
          id: `chg-bm-add-${currBm.id || key}`,
          changeType: "BENCHMARK_ADDED",
          entityId: currBm.id || key,
          entityName: `${currEntity} ${currBm.benchmarkName}`,
          previousValue: null,
          currentValue: `${currBm.score} ${currBm.metricUnit || "pts"}`,
          severity: "LOW",
          confidence: "CONFIRMED",
          summary: `New laboratory benchmark added: ${currEntity} ${currBm.benchmarkName}`,
          detailedReason: `Measured score: ${currBm.score} ${currBm.metricUnit || "pts"}`,
          sourcePublisher: currPub,
          affectedClaimIds: [],
          detectedAt: now,
        });
      } else {
        const prevEntity = getBmEntityName(prevBm);
        const prevConditions = getBmConditions(prevBm);
        const prevPub = getBmPublisher(prevBm);

        // Value change
        if (prevBm.score !== currBm.score) {
          const delta = currBm.score - prevBm.score;
          const pct = prevBm.score > 0 ? ((delta / prevBm.score) * 100).toFixed(1) : "0";
          const isMaterial = Math.abs(delta / (prevBm.score || 1)) > 0.05;

          changes.push({
            id: `chg-bm-score-${currBm.id || key}`,
            changeType: "BENCHMARK_UPDATED",
            entityId: currBm.id || key,
            entityName: `${currEntity} ${currBm.benchmarkName}`,
            previousValue: `${prevBm.score} ${prevBm.metricUnit || "pts"}`,
            currentValue: `${currBm.score} ${currBm.metricUnit || "pts"}`,
            severity: isMaterial ? "HIGH" : "MEDIUM",
            confidence: "CONFIRMED",
            summary: `Benchmark score changed for ${currEntity} ${currBm.benchmarkName}`,
            detailedReason: `Score updated from ${prevBm.score} to ${currBm.score} (${delta > 0 ? "+" : ""}${pct}% delta).`,
            sourcePublisher: currPub || prevPub,
            affectedClaimIds: [],
            detectedAt: now,
          });
        }

        // Methodology change
        if (prevConditions && currConditions && prevConditions !== currConditions) {
          changes.push({
            id: `chg-bm-meth-${currBm.id || key}`,
            changeType: "BENCHMARK_METHODOLOGY_CHANGED",
            entityId: currBm.id || key,
            entityName: `${currEntity} ${currBm.benchmarkName}`,
            previousValue: prevConditions,
            currentValue: currConditions,
            severity: "CRITICAL",
            confidence: "CONFIRMED",
            summary: `Benchmark testing methodology changed for ${currBm.benchmarkName}`,
            detailedReason: `Test conditions shifted from "${prevConditions}" to "${currConditions}". Direct comparison may be invalid.`,
            methodologyNotes: `Previous: ${prevConditions} | Current: ${currConditions}`,
            affectedClaimIds: [],
            detectedAt: now,
          });
        }
      }
    }

    // 3. Compare Claims
    const prevClaimsMap = new Map((previousSession.claims || []).map((c) => [c.id, c]));
    const currClaimsMap = new Map((currentSession.claims || []).map((c) => [c.id, c]));

    for (const [id, currClaim] of currClaimsMap.entries()) {
      const prevClaim = prevClaimsMap.get(id);
      if (!prevClaim) {
        changes.push({
          id: `chg-clm-add-${id}`,
          changeType: "CLAIM_ADDED",
          entityId: id,
          entityName: currClaim.claim_text,
          previousValue: null,
          currentValue: currClaim.status || "VERIFIED",
          severity: "MEDIUM",
          confidence: "CONFIRMED",
          summary: `New claim verified in research: "${currClaim.claim_text}"`,
          detailedReason: `Claim added with status ${currClaim.status || "VERIFIED"}.`,
          affectedClaimIds: [id],
          detectedAt: now,
        });
      } else {
        // Status change
        if (prevClaim.status !== currClaim.status) {
          const isCritical = currClaim.status === "DO_NOT_SAY" || currClaim.status === "CONFLICTED" || currClaim.status === "UNVERIFIED";
          changes.push({
            id: `chg-clm-status-${id}`,
            changeType: "CLAIM_STATUS_CHANGED",
            entityId: id,
            entityName: currClaim.claim_text,
            previousValue: prevClaim.status,
            currentValue: currClaim.status,
            severity: isCritical ? "CRITICAL" : "HIGH",
            confidence: "CONFIRMED",
            summary: `Claim verification status changed to ${currClaim.status}`,
            detailedReason: `Claim "${currClaim.claim_text}" shifted from ${prevClaim.status} to ${currClaim.status}.`,
            affectedClaimIds: [id],
            detectedAt: now,
          });
        }
      }
    }

    for (const [id, prevClaim] of prevClaimsMap.entries()) {
      if (!currClaimsMap.has(id)) {
        changes.push({
          id: `chg-clm-rem-${id}`,
          changeType: "CLAIM_REMOVED",
          entityId: id,
          entityName: prevClaim.claim_text,
          previousValue: prevClaim.status,
          currentValue: null,
          severity: "HIGH",
          confidence: "CONFIRMED",
          summary: `Claim removed from verified claims: "${prevClaim.claim_text}"`,
          detailedReason: `Claim no longer supported by current evidence pool.`,
          affectedClaimIds: [id],
          detectedAt: now,
        });
      }
    }

    // 4. Compare YouTube Reviewer Findings
    const prevYt = previousSession.youtubeIntelligence?.claims || [];
    const currYt = currentSession.youtubeIntelligence?.claims || [];
    if (prevYt.length !== currYt.length) {
      changes.push({
        id: `chg-yt-count`,
        changeType: "REVIEWER_FINDING_ADDED",
        entityId: "youtube-consensus",
        entityName: "YouTube Reviewer Consensus",
        previousValue: `${prevYt.length} findings`,
        currentValue: `${currYt.length} findings`,
        severity: "LOW",
        confidence: "CONFIRMED",
        summary: `Reviewer findings updated: ${currYt.length} signals analyzed.`,
        detailedReason: `New reviewer video evidence processed.`,
        affectedClaimIds: [],
        detectedAt: now,
      });
    }

    // 5. Compare Provenance Reports
    const prevProvScore = (previousSession.provenanceReport as any)?.provenanceScore || previousSession.provenanceReport?.overallGroundingScore;
    const currProvScore = (currentSession.provenanceReport as any)?.provenanceScore || currentSession.provenanceReport?.overallGroundingScore;

    if (prevProvScore !== undefined && currProvScore !== undefined && Math.abs(prevProvScore - currProvScore) > 5) {
      changes.push({
        id: `chg-prov-score`,
        changeType: "PROVENANCE_CHAIN_CHANGED",
        entityId: "provenance-score",
        entityName: "Research Provenance Quality",
        previousValue: `${prevProvScore.toFixed(1)}%`,
        currentValue: `${currProvScore.toFixed(1)}%`,
        severity: "MEDIUM",
        confidence: "CONFIRMED",
        summary: `Overall research provenance score updated to ${currProvScore.toFixed(1)}%`,
        detailedReason: `Lineage proof sheet confidence recalculated based on latest source tiers.`,
        affectedClaimIds: [],
        detectedAt: now,
      });
    }

    return changes;
  }
}
