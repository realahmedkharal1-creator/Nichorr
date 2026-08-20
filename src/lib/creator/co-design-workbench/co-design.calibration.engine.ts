import {
  CoDesignOpportunity,
} from "./co-design.types";

export class CoDesignCalibrationEngine {
  public static reconcileCalibrationStatus(
    opp: CoDesignOpportunity,
    calibrationResultStatus: "RESOLVED" | "IN_PROGRESS" | "FAILED"
  ): CoDesignOpportunity {
    return {
      ...opp,
      resolutionStatus:
        calibrationResultStatus === "RESOLVED"
          ? "VALIDATED"
          : calibrationResultStatus === "FAILED"
          ? "REJECTED"
          : "VALIDATION_PENDING",
    };
  }
}
