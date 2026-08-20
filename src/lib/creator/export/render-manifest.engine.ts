import {
  CreatorExportAsset,
  RenderManifest,
  RenderManifestEntry,
} from "./creator-export.types";

export class RenderManifestEngine {
  /**
   * Generates a deterministic hash for a render manifest excluding volatile timestamps.
   */
  static generateManifestHash(packageId: string, entries: RenderManifestEntry[]): string {
    const sorted = [...entries].sort((a, b) => a.entryId.localeCompare(b.entryId));
    const summary = sorted.map((e) => `${e.assetId}:${e.outputFormat}:${e.aspectRatio}:${e.renderCapabilityState}`).join("|");
    const raw = `${packageId}:${summary}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `rmani-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Generates a deterministic render manifest for required package assets without fake execution.
   */
  static generateRenderManifest(
    packageId: string,
    assets: CreatorExportAsset[],
    activeBlockers: string[] = []
  ): RenderManifest {
    const entries: RenderManifestEntry[] = [];

    for (const asset of assets) {
      if (!asset.isRenderRequired && asset.status === "AVAILABLE") {
        continue; // Existing verified assets do not need rendering
      }

      let renderCapabilityState: RenderManifestEntry["renderCapabilityState"] = "NOT_CONFIGURED";
      let blockerReason: string | undefined;

      if (activeBlockers.length > 0) {
        renderCapabilityState = "BLOCKED";
        blockerReason = activeBlockers.join("; ");
      } else if (asset.status === "AVAILABLE") {
        renderCapabilityState = "AVAILABLE";
      } else if (asset.status === "BLOCKED") {
        renderCapabilityState = "BLOCKED";
        blockerReason = asset.blockerDetails || "Asset blocked by upstream safety gate";
      } else {
        // External render pipeline is honest: not configured locally
        renderCapabilityState = "NOT_CONFIGURED";
      }

      let resolution = "1920x1080";
      let aspectRatio = "16:9";
      let outputFormat = "MP4 (H.264 / AAC)";

      if (asset.targetFormat === "YOUTUBE_SHORTS") {
        resolution = "1080x1920";
        aspectRatio = "9:16";
      } else if (asset.targetFormat === "PODCAST") {
        resolution = "N/A (Audio)";
        aspectRatio = "1:1";
        outputFormat = "WAV PCM (24-bit/48kHz Master) / MP3 (320kbps Derivative)";
      }

      entries.push({
        entryId: `rme-${asset.assetId}`,
        assetId: asset.assetId,
        assetType: asset.assetType,
        targetPlatform: asset.targetFormat,
        outputFormat,
        resolution,
        aspectRatio,
        frameRate: 60,
        expectedFilename: asset.expectedFilename,
        renderCapabilityState,
        dependencies: [asset.upstreamLineage],
        validationRequirements: ["Preflight Quality Check", "Evidence Grounding Integrity"],
        blockerReason,
      });
    }

    const totalEntriesCount = entries.length;
    const existingAssetsCount = entries.filter((e) => e.renderCapabilityState === "AVAILABLE").length;
    const renderRequiredCount = entries.filter((e) => e.renderCapabilityState === "NOT_CONFIGURED" || e.renderCapabilityState === "STAGING_ONLY").length;
    const unavailableRenderersCount = entries.filter((e) => e.renderCapabilityState === "NOT_CONFIGURED" || e.renderCapabilityState === "UNAVAILABLE").length;
    const blockedEntriesCount = entries.filter((e) => e.renderCapabilityState === "BLOCKED").length;

    const manifestHash = this.generateManifestHash(packageId, entries);
    const nowStr = new Date().toISOString();

    return {
      manifestId: `rm-${packageId}-${Date.now().toString(36)}`,
      packageId,
      status: blockedEntriesCount > 0 ? "BLOCKED" : "VALID",
      entries,
      totalEntriesCount,
      existingAssetsCount,
      renderRequiredCount,
      unavailableRenderersCount,
      blockedEntriesCount,
      manifestHash,
      generatedAt: nowStr,
    };
  }
}
