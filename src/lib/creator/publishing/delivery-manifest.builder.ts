import {
  CreatorDeliveryManifest,
  DeliveryManifestAsset,
  PublishingPreflightReport,
} from "./publishing.types";
import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";

export class DeliveryManifestBuilder {
  /**
   * Constructs the final machine-readable delivery manifest for multi-platform distribution.
   */
  static buildManifest(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preflight: PublishingPreflightReport,
    preferences: CreatorProductionPreferences
  ): CreatorDeliveryManifest {
    const assets: DeliveryManifestAsset[] = [];

    // Long-Form Script
    assets.push({
      assetId: "ast-script-md",
      assetType: "SCRIPT_MARKDOWN",
      platform: "YOUTUBE_LONG_FORM",
      fileName: "script.md",
      status: report.scriptSections?.length ? "CURRENT" : "MISSING",
      required: true,
      enabled: preferences.generateScript !== false,
      validationStatus: report.scriptSections?.length ? "VALID" : "BLOCKED",
    });

    // Shorts Script Adaptation
    if (preferences.enableYouTubeShorts) {
      assets.push({
        assetId: "ast-shorts-md",
        assetType: "SHORTS_SCRIPT",
        platform: "YOUTUBE_SHORTS",
        fileName: "shorts-script.md",
        status: preflight.shortsAdaptation ? "CURRENT" : "MISSING",
        required: true,
        enabled: true,
        validationStatus: preflight.shortsAdaptation ? "VALID" : "BLOCKED",
      });
    }

    // Podcast Script Adaptation
    if (preferences.enablePodcast) {
      assets.push({
        assetId: "ast-podcast-md",
        assetType: "PODCAST_SCRIPT",
        platform: "PODCAST",
        fileName: "podcast-script.md",
        status: preflight.podcastAdaptation ? "CURRENT" : "MISSING",
        required: true,
        enabled: true,
        validationStatus: preflight.podcastAdaptation ? "VALID" : "BLOCKED",
      });
    }

    // Thumbnail Copy
    if (preferences.generateThumbnailCopy !== false) {
      assets.push({
        assetId: "ast-thumb-copy",
        assetType: "THUMBNAIL_COPY",
        platform: "ALL",
        fileName: "thumbnail-copy.md",
        status: preflight.thumbnailCopyCandidates.length ? "CURRENT" : "MISSING",
        required: false,
        enabled: true,
        validationStatus: "VALID",
      });
    }

    // B-Roll Plan
    if (preferences.generateBRoll) {
      assets.push({
        assetId: "ast-broll-md",
        assetType: "B_ROLL_PLAN",
        platform: "YOUTUBE_LONG_FORM",
        fileName: "b-roll-plan.md",
        status: report.bRollList?.length ? "CURRENT" : "MISSING",
        required: false,
        enabled: true,
        validationStatus: "VALID",
      });
    }

    // Benchmark Cards
    if (preferences.generateBenchmarkCards) {
      assets.push({
        assetId: "ast-bench-json",
        assetType: "BENCHMARK_CARDS",
        platform: "YOUTUBE_LONG_FORM",
        fileName: "benchmark-cards.json",
        status: report.benchmarkCards?.length ? "CURRENT" : "MISSING",
        required: false,
        enabled: true,
        validationStatus: "VALID",
      });
    }

    // YouTube Chapters
    if (preferences.generateChapters) {
      assets.push({
        assetId: "ast-chapters-txt",
        assetType: "CHAPTERS_TXT",
        platform: "YOUTUBE_LONG_FORM",
        fileName: "chapters.txt",
        status: report.chapters?.length ? "CURRENT" : "MISSING",
        required: false,
        enabled: true,
        validationStatus: report.chapters?.length ? "VALID" : "WARNING",
      });
    }

    // Timeline Markers
    if (preferences.generateTimelineMarkers) {
      assets.push({
        assetId: "ast-timeline-edl",
        assetType: "TIMELINE_EDL",
        platform: "YOUTUBE_LONG_FORM",
        fileName: "timeline.edl",
        status: "CURRENT",
        required: false,
        enabled: true,
        validationStatus: "VALID",
      });
      assets.push({
        assetId: "ast-timeline-fcpxml",
        assetType: "TIMELINE_FCPXML",
        platform: "YOUTUBE_LONG_FORM",
        fileName: "timeline.fcpxml",
        status: "CURRENT",
        required: false,
        enabled: true,
        validationStatus: "VALID",
      });
    }

    // Provenance Proof Sheet
    assets.push({
      assetId: "ast-provenance-md",
      assetType: "PROVENANCE_PROOF",
      platform: "ALL",
      fileName: "provenance-proof.md",
      status: session.provenanceReport?.citationProofSheetMarkdown ? "CURRENT" : "CURRENT",
      required: true,
      enabled: true,
      validationStatus: "VALID",
    });

    // Quality Report JSON
    assets.push({
      assetId: "ast-quality-json",
      assetType: "QUALITY_REPORT",
      platform: "ALL",
      fileName: "quality-report.json",
      status: report.qualityReview ? "CURRENT" : "MISSING",
      required: true,
      enabled: true,
      validationStatus: report.qualityReview ? "VALID" : "WARNING",
    });

    // Publishing Preflight Report JSON
    assets.push({
      assetId: "ast-preflight-json",
      assetType: "PREFLIGHT_REPORT",
      platform: "ALL",
      fileName: "publishing-preflight.json",
      status: "CURRENT",
      required: true,
      enabled: true,
      validationStatus: preflight.readyToPublish ? "VALID" : "BLOCKED",
    });

    return {
      manifestId: `manifest-${session.id}`,
      researchRunId: session.id,
      topic: session.topic,
      version: 1,
      generatedAt: new Date().toISOString(),
      overallStatus: preflight.readinessStatus,
      readyToPublish: preflight.readyToPublish,
      publishingScore: preflight.overallPublishingScore,
      assets,
    };
  }
}
