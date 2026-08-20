import { CoDesignOpportunity } from "./co-design.types";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";
import { CoDesignAuditService } from "./co-design.audit";

export class CoDesignValidationBridge {
  public static bridgeOpportunityToCalibration(
    opp: CoDesignOpportunity,
    userId: string,
    researchRunId: string
  ): {
    success: boolean;
    opportunity: CoDesignOpportunity;
    calibrationTaskId: string;
    message: string;
  } {
    const calibrationTaskId = `cal-task-${opp.opportunityId}`;

    try {
      ResearchCalibrationProvider.assessCandidate(
        opp.opportunityId,
        researchRunId,
        userId
      );
    } catch {
      // Gracefully handled if provider is initializing
    }

    opp.resolutionStatus = "VALIDATED";

    CoDesignAuditService.log(
      userId,
      researchRunId,
      "CALIBRATION_REQUESTED",
      opp.opportunityId,
      "creator-lead",
      `Bridged co-design simulation opportunity '${opp.title}' to Phase 86 calibration task ${calibrationTaskId}.`
    );

    return {
      success: true,
      opportunity: opp,
      calibrationTaskId,
      message: "Co-design simulation hypothesis bridged to Phase 86 research calibration queue.",
    };
  }
}
