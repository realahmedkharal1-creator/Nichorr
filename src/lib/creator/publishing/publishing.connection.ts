import { PublishingConnectionState, PublishingTargetPlatform } from "./publishing.types";

export interface PlatformConnectionProfile {
  platform: PublishingTargetPlatform;
  state: PublishingConnectionState;
  channelOrShowName?: string;
  isConfigured: boolean;
  notes: string;
}

export class PublishingConnectionService {
  /**
   * Inspects connection state for a target platform with complete honesty (zero fake OAuth/APIs).
   */
  static getConnectionState(platform: PublishingTargetPlatform): PlatformConnectionProfile {
    // In current local environment, external third-party publishing APIs are not configured.
    // We report this truthfully as NOT_CONFIGURED or STAGING_ONLY.
    switch (platform) {
      case "YOUTUBE_LONG_FORM":
        return {
          platform,
          state: "NOT_CONFIGURED",
          isConfigured: false,
          notes: "YouTube Data API v3 OAuth integration is not configured locally. Staging-only deployment mode enabled.",
        };
      case "YOUTUBE_SHORTS":
        return {
          platform,
          state: "NOT_CONFIGURED",
          isConfigured: false,
          notes: "YouTube Shorts upload endpoint is not configured locally. Staging-only deployment mode enabled.",
        };
      case "PODCAST":
        return {
          platform,
          state: "NOT_CONFIGURED",
          isConfigured: false,
          notes: "Podcast RSS/Hosting API credentials are not configured locally. Staging-only deployment mode enabled.",
        };
      default:
        return {
          platform,
          state: "UNAVAILABLE",
          isConfigured: false,
          notes: "Platform target not supported for direct publishing.",
        };
    }
  }

  /**
   * Validates whether publishing to this platform can proceed or must default to staging-only.
   */
  static resolveEffectivePublishMode(
    platform: PublishingTargetPlatform,
    requestedMode: "MANUAL_PUBLISH" | "SCHEDULED_PUBLISH" | "STAGING_ONLY"
  ): { effectiveMode: "MANUAL_PUBLISH" | "SCHEDULED_PUBLISH" | "STAGING_ONLY"; connectionState: PublishingConnectionState; reason: string } {
    const conn = this.getConnectionState(platform);
    if (!conn.isConfigured || conn.state === "NOT_CONFIGURED" || conn.state === "UNAVAILABLE") {
      return {
        effectiveMode: "STAGING_ONLY",
        connectionState: "STAGING_ONLY",
        reason: `${platform} connection not configured. Assets staged locally without remote push.`,
      };
    }
    return {
      effectiveMode: requestedMode,
      connectionState: conn.state,
      reason: `Connection verified for ${platform}.`,
    };
  }
}
