import crypto from "crypto";
import {
  MicroarchitecturalAttributionRecord,
  ResearchHealthReconciliationRecord,
  ResearchHealthEffect,
} from "./microarchitectural-attribution.types";

export class ResearchHealthReconciliationEngine {
  public static reconcileWithResearchHealth(
    attrib: MicroarchitecturalAttributionRecord,
    targetResearchRunId: string,
    existingClaims: string[] = []
  ): ResearchHealthReconciliationRecord {
    let newHealthEffect: ResearchHealthEffect = "SUPPORTS_EXISTING_FINDING";
    let evidenceDeltaSummary = `Observed ${attrib.attributionClassification} bottleneck profile supports baseline research telemetry.`;
    let recommendedHumanAction = "Review and retain existing verified claim citations.";

    if (attrib.attributionClassification === "THERMAL_LIMITATION") {
      newHealthEffect = "CONTRADICTS_EXISTING_FINDING";
      evidenceDeltaSummary = "Trace attribution detected thermal throttling, potentially confounding baseline efficiency conclusions.";
      recommendedHumanAction = "Human review recommended: perform controlled ambient temperature re-test before publishing.";
    } else if (attrib.evidenceStrength === "LOW" || attrib.evidenceStrength === "VERY_LOW") {
      newHealthEffect = "INSUFFICIENT_DATA";
      evidenceDeltaSummary = "Counter coverage is insufficient for conclusive research health attribution.";
      recommendedHumanAction = "Collect additional PMU performance counters on physical node.";
    }

    const reconciliationId = `rhr-${crypto
      .createHash("sha256")
      .update(`${attrib.attributionId}:${targetResearchRunId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      reconciliationId,
      attributionId: attrib.attributionId,
      targetResearchRunId,
      previousHealthStatus: "HEALTHY",
      newHealthEffect,
      evidenceDeltaSummary,
      affectedClaimsCount: existingClaims.length,
      affectedClaims: existingClaims,
      recommendedHumanAction,
      reconciledAt: new Date().toISOString(),
    };
  }
}
