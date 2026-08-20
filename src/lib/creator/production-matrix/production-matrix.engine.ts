import {
  ProductionMatrix,
  ProductionVariant,
  ProductionVariantType,
} from "./production-matrix.types";
import { ProductionMatrixAuditService } from "./production-matrix.audit";

export class ProductionMatrixEngine {
  /**
   * Generates a deterministic hash for a production matrix excluding volatile timestamps.
   */
  static generateDeterministicMatrixHash(matrix: ProductionMatrix): string {
    const sorted = [...matrix.variants].sort((a, b) => a.variantId.localeCompare(b.variantId));
    const summary = sorted.map((v) => `${v.variantId}:${v.name}:${v.variantType}:${v.status}:${v.readinessScore}`).join("|");
    const raw = `${matrix.userId}:${matrix.researchRunId}:${matrix.sharedEvidenceSnapshotHash}:${summary}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `matrix-snap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Creates a new production variant bound to the shared evidence graph.
   */
  static createVariant(
    userId: string,
    researchRunId: string,
    name: string,
    variantType: ProductionVariantType,
    targetDurationMinutes: number,
    sharedEvidenceSnapshotHash: string,
    overrides?: Partial<ProductionVariant>
  ): ProductionVariant {
    const nowStr = new Date().toISOString();
    const variantId = `var-${researchRunId}-${variantType.toLowerCase().replace(/_/g, "-")}-${Date.now().toString(36)}`;

    const variant: ProductionVariant = {
      variantId,
      userId,
      researchRunId,
      name,
      variantType,
      status: "DRAFT",
      targetDurationMinutes,
      scriptVersion: 1,
      sharedEvidenceSnapshotHash,
      hookText: overrides?.hookText || `Efficiency & performance benchmark analysis for ${name}`,
      titleCandidate: overrides?.titleCandidate || `${name}: Architecture & Benchmark Review`,
      talkingPointIds: overrides?.talkingPointIds || ["tp-arch-1", "tp-bench-1"],
      benchmarkCardIds: overrides?.benchmarkCardIds || ["bc-single-core", "bc-multi-core"],
      evidenceBindings: overrides?.evidenceBindings || [
        {
          claimId: "clm-1",
          claimText: "M4 Max delivers top single-thread performance",
          evidenceId: "ev-1",
          sourceId: "src-anandtech",
          isPrimary: true,
          status: "VERIFIED",
        },
      ],
      assetBindings: overrides?.assetBindings || [
        { assetId: "ast-hook", assetName: "Hook Script", assetType: "HOOK", assemblyState: "AVAILABLE" },
        { assetId: "ast-tp", assetName: "Talking Points", assetType: "TALKING_POINT", assemblyState: "AVAILABLE" },
        { assetId: "ast-bc", assetName: "Benchmark Card", assetType: "BENCHMARK_CARD", assemblyState: "AVAILABLE" },
      ],
      readinessScore: 88,
      blockers: [],
      warnings: [],
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    ProductionMatrixAuditService.recordAuditEvent({
      auditId: `pmat-aud-${Date.now().toString(36)}-create`,
      userId,
      researchRunId,
      action: "VARIANT_CREATED",
      details: `Created variant "${name}" (${variantType}, ${targetDurationMinutes} min). Shared Evidence Hash: ${sharedEvidenceSnapshotHash}`,
      timestamp: nowStr,
    });

    return variant;
  }

  /**
   * Duplicates an existing variant configuration while retaining strict shared evidence lineage.
   */
  static duplicateVariant(
    sourceVariant: ProductionVariant,
    newName: string
  ): ProductionVariant {
    const nowStr = new Date().toISOString();
    const variantId = `var-${sourceVariant.researchRunId}-dup-${Date.now().toString(36)}`;

    const duplicate: ProductionVariant = {
      ...sourceVariant,
      variantId,
      name: newName,
      status: "DRAFT",
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    ProductionMatrixAuditService.recordAuditEvent({
      auditId: `pmat-aud-${Date.now().toString(36)}-dup`,
      userId: sourceVariant.userId,
      researchRunId: sourceVariant.researchRunId,
      action: "VARIANT_DUPLICATED",
      details: `Duplicated variant "${sourceVariant.name}" to "${newName}"`,
      timestamp: nowStr,
    });

    return duplicate;
  }

  /**
   * Compares two production variants for differences in structure and asset requirements.
   */
  static compareVariants(
    variantA: ProductionVariant,
    variantB: ProductionVariant
  ): { differences: string[]; sharedEvidenceConsistent: boolean } {
    const differences: string[] = [];

    if (variantA.variantType !== variantB.variantType) {
      differences.push(`Format: ${variantA.variantType} vs ${variantB.variantType}`);
    }

    if (variantA.targetDurationMinutes !== variantB.targetDurationMinutes) {
      differences.push(`Duration: ${variantA.targetDurationMinutes}m vs ${variantB.targetDurationMinutes}m`);
    }

    if (variantA.hookText !== variantB.hookText) {
      differences.push("Different hook / presentation angle");
    }

    if (variantA.talkingPointIds.length !== variantB.talkingPointIds.length) {
      differences.push(`Talking point count: ${variantA.talkingPointIds.length} vs ${variantB.talkingPointIds.length}`);
    }

    const sharedEvidenceConsistent =
      variantA.sharedEvidenceSnapshotHash === variantB.sharedEvidenceSnapshotHash;

    if (!sharedEvidenceConsistent) {
      differences.push("CRITICAL: Variants reference divergent evidence snapshots.");
    }

    return {
      differences,
      sharedEvidenceConsistent,
    };
  }

  /**
   * Creates a default matrix with Long Form, Short, and Podcast variants.
   */
  static createDefaultMatrix(
    userId: string,
    researchRunId: string,
    evidenceSnapshotHash: string = "snap-evidence-default"
  ): ProductionMatrix {
    const longForm = this.createVariant(
      userId,
      researchRunId,
      "YouTube Long-Form In-Depth Review",
      "YOUTUBE_LONG_FORM",
      12,
      evidenceSnapshotHash
    );

    const shortForm = this.createVariant(
      userId,
      researchRunId,
      "YouTube Short / Quick Summary",
      "YOUTUBE_SHORT",
      1,
      evidenceSnapshotHash,
      {
        hookText: "Can the new architecture really beat 300W desktops?",
        targetDurationMinutes: 1,
      }
    );

    const podcast = this.createVariant(
      userId,
      researchRunId,
      "Podcast Technical Deep-Dive",
      "PODCAST",
      35,
      evidenceSnapshotHash,
      {
        targetDurationMinutes: 35,
      }
    );

    const variants = [longForm, shortForm, podcast];
    const nowStr = new Date().toISOString();
    const matrixId = `pmat-${researchRunId}-${Date.now().toString(36)}`;

    const partialMatrix: ProductionMatrix = {
      matrixId,
      userId,
      researchRunId,
      sharedEvidenceSnapshotHash: evidenceSnapshotHash,
      variants,
      totalVariantsCount: variants.length,
      activeVariantsCount: variants.length,
      readyVariantsCount: variants.filter((v) => v.readinessScore >= 80).length,
      blockedVariantsCount: variants.filter((v) => v.status === "BLOCKED").length,
      matrixSnapshotHash: "",
      lastEvaluatedAt: nowStr,
    };

    partialMatrix.matrixSnapshotHash = this.generateDeterministicMatrixHash(partialMatrix);

    ProductionMatrixAuditService.recordAuditEvent({
      auditId: `pmat-aud-${Date.now().toString(36)}-init`,
      userId,
      researchRunId,
      action: "MATRIX_EVALUATED",
      details: `Initialized production matrix with ${variants.length} default variants. Hash: ${partialMatrix.matrixSnapshotHash}`,
      timestamp: nowStr,
    });

    return partialMatrix;
  }
}
