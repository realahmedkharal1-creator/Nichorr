export interface ResolvedEntity {
  rawTopic: string;
  primaryBrand: string;
  modelName: string;
  detectedVariant?: string;
  region: string;
  socFamily?: string;
  isIncompatibleVariant: boolean;
}

export class EntityResolver {
  static resolve(topic: string, region: string = "Global"): ResolvedEntity {
    const tLower = topic.toLowerCase();

    let primaryBrand = "Generic Hardware";
    if (tLower.includes("samsung") || tLower.includes("galaxy") || tLower.includes("s27")) primaryBrand = "Samsung";
    else if (tLower.includes("iphone") || tLower.includes("apple") || tLower.includes("macbook")) primaryBrand = "Apple";
    else if (tLower.includes("nvidia") || tLower.includes("rtx")) primaryBrand = "NVIDIA";
    else if (tLower.includes("amd") || tLower.includes("rx") || tLower.includes("ryzen")) primaryBrand = "AMD";

    let detectedVariant: string | undefined = undefined;
    let socFamily: string | undefined = undefined;

    if (tLower.includes("exynos")) {
      detectedVariant = "Exynos Variant";
      socFamily = "Exynos 2600";
    } else if (tLower.includes("snapdragon")) {
      detectedVariant = "Snapdragon Variant";
      socFamily = "Snapdragon 8 Gen 5";
    }

    return {
      rawTopic: topic,
      primaryBrand,
      modelName: topic.split(" vs ")[0] || topic,
      detectedVariant,
      region,
      socFamily,
      isIncompatibleVariant: detectedVariant !== undefined,
    };
  }

  /**
   * Validates whether two evidence items or claims belong to compatible hardware variants.
   */
  static areVariantsCompatible(entityA: ResolvedEntity, entityB: ResolvedEntity): { compatible: boolean; reason?: string } {
    if (entityA.primaryBrand !== entityB.primaryBrand) {
      return { compatible: false, reason: `Brand mismatch: ${entityA.primaryBrand} vs ${entityB.primaryBrand}` };
    }

    if (entityA.socFamily && entityB.socFamily && entityA.socFamily !== entityB.socFamily) {
      return {
        compatible: false,
        reason: `Incompatible SoC hardware variants detected: ${entityA.socFamily} vs ${entityB.socFamily}. Evidence merging blocked.`,
      };
    }

    return { compatible: true };
  }
}
