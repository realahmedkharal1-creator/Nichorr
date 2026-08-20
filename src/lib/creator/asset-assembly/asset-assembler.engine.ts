import {
  ProductionVariant,
  VariantAssetBinding,
} from "../production-matrix/production-matrix.types";
import {
  AssetAssemblyItem,
  AssetAssemblyPlan,
} from "./asset-assembler.types";

export class AssetAssemblerEngine {
  /**
   * Evaluates and maps existing verified assets to a specific production variant without silent generation.
   */
  static assembleAssetsForVariant(
    variant: ProductionVariant,
    existingProjectAssets: Array<{ id: string; name: string; type: string; status?: string; lineage?: string }> = [],
    activeBlockers: string[] = []
  ): AssetAssemblyPlan {
    const assembledAssets: AssetAssemblyItem[] = [];

    // Core asset requirements per variant type
    const standardRequirements: Array<{ name: string; type: VariantAssetBinding["assetType"] }> = [
      { name: "Verified Script Section (Hook)", type: "HOOK" },
      { name: "Core Talking Points Sequence", type: "TALKING_POINT" },
      { name: "Primary Benchmark Card", type: "BENCHMARK_CARD" },
      { name: "B-Roll Shot List References", type: "BROLL_SHOT" },
      { name: "Teleprompter Telecast Section", type: "TELEPROMPTER_ROLL" },
      { name: "Platform Publishing Metadata", type: "PUBLISHING_METADATA" },
    ];

    if (variant.variantType === "YOUTUBE_LONG_FORM") {
      standardRequirements.push({ name: "Timeline Chapters & Markers", type: "TIMELINE_MARKER" });
      standardRequirements.push({ name: "Multi-Platform Distribution Package", type: "DISTRIBUTION_PACKAGE" });
    }

    for (const req of standardRequirements) {
      // Find matching existing asset
      const matchingAsset = existingProjectAssets.find(
        (a) => a.type === req.type || a.name.toLowerCase().includes(req.name.toLowerCase())
      );

      let assemblyState: VariantAssetBinding["assemblyState"] = "REQUIRED";
      let upstreamEvidenceLineage = `Variant: ${variant.name} -> Evidence Snapshot: ${variant.sharedEvidenceSnapshotHash}`;
      let isReusedExisting = false;
      let blockerDetails: string | undefined;

      if (activeBlockers.length > 0) {
        assemblyState = "BLOCKED";
        blockerDetails = activeBlockers.join("; ");
      } else if (matchingAsset) {
        if (matchingAsset.status === "STALE") {
          assemblyState = "STALE";
        } else {
          assemblyState = "AVAILABLE";
          isReusedExisting = true;
          upstreamEvidenceLineage = matchingAsset.lineage || upstreamEvidenceLineage;
        }
      } else {
        assemblyState = "MISSING";
      }

      assembledAssets.push({
        assetId: matchingAsset ? matchingAsset.id : `req-${req.type.toLowerCase()}-${variant.variantId}`,
        name: req.name,
        assetType: req.type,
        assemblyState,
        upstreamEvidenceLineage,
        isReusedExisting,
        blockerDetails,
      });
    }

    const totalRequired = assembledAssets.length;
    const availableCount = assembledAssets.filter((a) => a.assemblyState === "AVAILABLE").length;
    const missingCount = assembledAssets.filter((a) => a.assemblyState === "MISSING").length;
    const blockedCount = assembledAssets.filter((a) => a.assemblyState === "BLOCKED").length;
    const staleCount = assembledAssets.filter((a) => a.assemblyState === "STALE").length;
    const completenessScore = totalRequired > 0 ? Math.round((availableCount / totalRequired) * 100) : 0;
    const nowStr = new Date().toISOString();

    return {
      planId: `assm-plan-${variant.variantId}-${Date.now().toString(36)}`,
      variantId: variant.variantId,
      assembledAssets,
      totalRequired,
      availableCount,
      missingCount,
      blockedCount,
      staleCount,
      completenessScore,
      generatedAt: nowStr,
    };
  }
}
