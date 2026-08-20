import { VariantAssetBinding } from "../production-matrix/production-matrix.types";

export interface AssetAssemblyItem {
  assetId: string;
  name: string;
  assetType: VariantAssetBinding["assetType"];
  assemblyState: VariantAssetBinding["assemblyState"];
  upstreamEvidenceLineage: string;
  isReusedExisting: boolean;
  blockerDetails?: string;
}

export interface AssetAssemblyPlan {
  planId: string;
  variantId: string;
  assembledAssets: AssetAssemblyItem[];
  totalRequired: number;
  availableCount: number;
  missingCount: number;
  blockedCount: number;
  staleCount: number;
  completenessScore: number;
  generatedAt: string;
}
