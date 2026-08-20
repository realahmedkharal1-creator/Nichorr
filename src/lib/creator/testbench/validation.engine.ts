import { TestbenchResearchOpportunity } from "./testbench.types";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";

export class TestbenchValidationBridgeEngine {
  /**
   * Bridges a testbench research opportunity into the Phase 86 Research Calibration Queue.
   * Does NOT automatically mutate any claims or citations.
   */
  static bridgeOpportunityToValidationQueue(
    opportunity: TestbenchResearchOpportunity,
    researchRunId: string,
    userId: string,
    experimentSnapshotHash: string = "snap-exp-default"
  ): {
    success: boolean;
    opportunity: TestbenchResearchOpportunity;
    calibrationQueueItemId?: string;
    message: string;
  } {
    if (opportunity.status === "QUEUED" || opportunity.status === "VALIDATED") {
      return {
        success: true,
        opportunity,
        message: `Opportunity is already in ${opportunity.status} state.`,
      };
    }

    // Connect to Phase 86 research calibration queue
    const queueItem = ResearchCalibrationProvider.assessCandidate(
      opportunity.opportunityId,
      researchRunId,
      userId
    );

    const updatedOpportunity: TestbenchResearchOpportunity = {
      ...opportunity,
      status: "QUEUED",
    };

    return {
      success: true,
      opportunity: updatedOpportunity,
      calibrationQueueItemId: queueItem.queueItemId,
      message: `Opportunity "${opportunity.title}" successfully bridged to Phase 86 Research Calibration Queue.`,
    };
  }
}
