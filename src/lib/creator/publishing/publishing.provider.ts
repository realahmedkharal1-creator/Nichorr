export * from "./publishing.types";
export * from "./platform-adaptation.engine";
export * from "./publishing-preflight.engine";
export * from "./delivery-manifest.builder";
export * from "./creator-publishing.provider";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { PublishingPreflightEngine } from "./publishing-preflight.engine";
import { DeliveryManifestBuilder } from "./delivery-manifest.builder";
import { PlatformAdaptationEngine } from "./platform-adaptation.engine";
import { PublishingPreflightReport, CreatorDeliveryManifest, ThumbnailCopyCandidate } from "./publishing.types";

export class PublishingProvider {
  /**
   * Runs multi-platform publishing preflight validation across Long-form, Shorts, and Podcast delivery targets.
   */
  static runPreflight(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile
  ): PublishingPreflightReport {
    return PublishingPreflightEngine.runPreflight(session, report, preferences, profile);
  }

  /**
   * Builds the machine-readable creator delivery manifest.
   */
  static buildManifest(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preflight: PublishingPreflightReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES
  ): CreatorDeliveryManifest {
    return DeliveryManifestBuilder.buildManifest(session, report, preflight, preferences);
  }

  /**
   * Generates thumbnail copy candidates.
   */
  static generateThumbnailCopy(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    profile?: CreatorScriptTrainingProfile
  ): ThumbnailCopyCandidate[] {
    return PlatformAdaptationEngine.generateThumbnailCopy(session, report, profile);
  }
}
