import { SiliconDifferentialResearchOpportunity } from "./testbench-cluster.types";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";

export interface ClusterValidationBridgeResult {
  success: boolean;
  opportunity: SiliconDifferentialResearchOpportunity;
  calibrationQueueItemId?: string;
  message: string;
}

export class ClusterValidationBridgeEngine {
  public static bridgeToCalibrationQueue(
    opportunity: SiliconDifferentialResearchOpportunity,
    researchRunId: string,
    userId: string
  ): ClusterValidationBridgeResult {
    if (opportunity.status === "QUEUED" || opportunity.status === "VALIDATED") {
      return {
        success: false,
        opportunity,
        message: `Opportunity "${opportunity.title}" is already queued or validated.`,
      };
    }

    // Connect to Phase 86 research calibration queue
    const queueItem = ResearchCalibrationProvider.assessCandidate(
      opportunity.opportunityId,
      researchRunId,
      userId
    );

    const updatedOpportunity: SiliconDifferentialResearchOpportunity = {
      ...opportunity,
      status: "QUEUED",
    };

    return {
      success: true,
      opportunity: updatedOpportunity,
      calibrationQueueItemId: queueItem.queueItemId,
      message: `Silicon research opportunity "${opportunity.title}" successfully bridged to Phase 86 Research Calibration Queue.`,
    };
  }
}
