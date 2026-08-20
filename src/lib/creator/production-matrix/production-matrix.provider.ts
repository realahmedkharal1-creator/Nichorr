export * from "./production-matrix.types";
export * from "./production-matrix.audit";
export * from "./production-matrix.engine";
export * from "../benchmark-diff/benchmark-diff.types";
export * from "../benchmark-diff/benchmark-diff.engine";
export * from "../asset-assembly/asset-assembler.types";
export * from "../asset-assembly/asset-assembler.engine";

import {
  ProductionMatrix,
  ProductionVariant,
  ProductionVariantType,
} from "./production-matrix.types";
import { ProductionMatrixEngine } from "./production-matrix.engine";
import { ProductionMatrixAuditService } from "./production-matrix.audit";
import { BenchmarkDiffEngine } from "../benchmark-diff/benchmark-diff.engine";
import { BenchmarkMeasurement } from "../benchmark-diff/benchmark-diff.types";
import { AssetAssemblerEngine } from "../asset-assembly/asset-assembler.engine";

const globalForMatrixProvider = globalThis as unknown as {
  creatorMatrixStore: {
    matrices: Map<string, ProductionMatrix>;
  } | undefined;
};

const matrixStore = globalForMatrixProvider.creatorMatrixStore ?? {
  matrices: new Map<string, ProductionMatrix>(),
};
if (process.env.NODE_ENV !== "production")
  globalForMatrixProvider.creatorMatrixStore = matrixStore;

export class ProductionMatrixProvider {
  /**
   * Retrieves or initializes the Production Matrix for a research run.
   */
  static getProductionMatrix(
    researchRunId: string,
    userId: string = "anonymous-creator",
    evidenceSnapshotHash: string = "snap-evidence-default"
  ): ProductionMatrix {
    const key = `${userId}:${researchRunId}`;
    let matrix = matrixStore.matrices.get(key);
    if (!matrix) {
      matrix = ProductionMatrixEngine.createDefaultMatrix(userId, researchRunId, evidenceSnapshotHash);
      matrixStore.matrices.set(key, matrix);
    }
    return matrix;
  }

  /**
   * Creates a new production variant inside the matrix.
   */
  static createVariant(
    userId: string,
    researchRunId: string,
    name: string,
    variantType: ProductionVariantType,
    targetDurationMinutes: number,
    evidenceSnapshotHash: string,
    overrides?: Partial<ProductionVariant>
  ): ProductionVariant {
    const matrix = this.getProductionMatrix(researchRunId, userId, evidenceSnapshotHash);
    const variant = ProductionMatrixEngine.createVariant(
      userId,
      researchRunId,
      name,
      variantType,
      targetDurationMinutes,
      evidenceSnapshotHash,
      overrides
    );

    matrix.variants.push(variant);
    matrix.totalVariantsCount = matrix.variants.length;
    matrix.activeVariantsCount = matrix.variants.filter((v) => v.status !== "ARCHIVED").length;
    matrix.matrixSnapshotHash = ProductionMatrixEngine.generateDeterministicMatrixHash(matrix);
    matrix.lastEvaluatedAt = new Date().toISOString();

    const key = `${userId}:${researchRunId}`;
    matrixStore.matrices.set(key, matrix);

    return variant;
  }

  /**
   * Duplicates an existing variant.
   */
  static duplicateVariant(
    userId: string,
    researchRunId: string,
    sourceVariantId: string,
    newName: string
  ): ProductionVariant {
    const matrix = this.getProductionMatrix(researchRunId, userId);
    const source = matrix.variants.find((v) => v.variantId === sourceVariantId);
    if (!source) {
      throw new Error(`Variant not found: ${sourceVariantId}`);
    }

    const dup = ProductionMatrixEngine.duplicateVariant(source, newName);
    matrix.variants.push(dup);
    matrix.totalVariantsCount = matrix.variants.length;
    matrix.matrixSnapshotHash = ProductionMatrixEngine.generateDeterministicMatrixHash(matrix);

    const key = `${userId}:${researchRunId}`;
    matrixStore.matrices.set(key, matrix);

    return dup;
  }

  /**
   * Retrieves a single variant by ID.
   */
  static getVariant(
    researchRunId: string,
    variantId: string,
    userId: string = "anonymous-creator"
  ): ProductionVariant | undefined {
    const matrix = this.getProductionMatrix(researchRunId, userId);
    return matrix.variants.find((v) => v.variantId === variantId);
  }

  /**
   * Compares two variants.
   */
  static compareVariants(variantA: ProductionVariant, variantB: ProductionVariant) {
    return ProductionMatrixEngine.compareVariants(variantA, variantB);
  }

  /**
   * Compares two benchmark measurements across 20 dimensions.
   */
  static compareBenchmarks(baseline: BenchmarkMeasurement, candidate: BenchmarkMeasurement) {
    return BenchmarkDiffEngine.compareBenchmarks(baseline, candidate);
  }

  /**
   * Assembles assets for a variant.
   */
  static assembleAssets(
    variant: ProductionVariant,
    existingAssets?: Array<{ id: string; name: string; type: string; status?: string; lineage?: string }>,
    blockers?: string[]
  ) {
    return AssetAssemblerEngine.assembleAssetsForVariant(variant, existingAssets, blockers);
  }

  /**
   * Retrieves audit ledger history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator") {
    return ProductionMatrixAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory cache.
   */
  static clearCache(): void {
    matrixStore.matrices.clear();
    ProductionMatrixAuditService.clearHistory();
  }
}
