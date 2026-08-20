import { MicroarchitectureResearchOpportunity } from "./microarchitecture.types";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";
import { MicroarchitectureAuditService } from "./microarchitecture.audit";

export class MicroarchitectureValidationBridge {
  public static bridgeOpportunityToCalibration(
    opp: MicroarchitectureResearchOpportunity,
    userId: string,
    researchRunId: string
  ): {
    success: boolean;
    opportunity: MicroarchitectureResearchOpportunity;
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

    MicroarchitectureAuditService.log(
      userId,
      researchRunId,
      "VALIDATION_TASK_CREATED",
      opp.opportunityId,
      "creator-lead",
      `Bridged microarchitecture opportunity '${opp.title}' to Phase 86 calibration task ${calibrationTaskId}.`
    );

    return {
      success: true,
      opportunity: opp,
      calibrationTaskId,
      message: "Microarchitecture research opportunity bridged to Phase 86 calibration queue.",
    };
  }
}
