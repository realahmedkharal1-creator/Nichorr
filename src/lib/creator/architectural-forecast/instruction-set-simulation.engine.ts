import crypto from "node:crypto";
import {
  InstructionSetDeprecationSimulation,
  InstructionDeprecationState,
} from "./architectural-forecast.types";

export class InstructionSetDeprecationEngine {
  /**
   * Models the theoretical performance impact of instruction-set deprecation or emulation fallbacks.
   */
  static simulateDeprecation(
    researchRunId: string,
    userId: string,
    instructionSet: string,
    affectedSKUs: string[],
    affectedBenchmarkSuites: string[],
    options?: {
      fallbackPath?: string;
      modeledOverhead?: number;
      dependencyDescription?: string;
    }
  ): InstructionSetDeprecationSimulation {
    const fallbackPath = options?.fallbackPath || "Scalar software emulation path";
    const modeledOverhead = typeof options?.modeledOverhead === "number" ? options.modeledOverhead : 14.5;
    const dependencyDescription =
      options?.dependencyDescription ||
      `Workloads utilizing ${instructionSet} vector intrinsics will route through ${fallbackPath}.`;

    let deprecationImpactState: InstructionDeprecationState = "MATERIAL_MODELED_IMPACT";
    if (modeledOverhead <= 1) {
      deprecationImpactState = "NO_MODELED_IMPACT";
    } else if (modeledOverhead <= 5) {
      deprecationImpactState = "POSSIBLE_IMPACT";
    }

    const deprecationId = `isd-${crypto
      .createHash("sha256")
      .update(`${instructionSet}:${affectedSKUs.join(",")}:${modeledOverhead}`)
      .digest("hex")
      .substring(0, 10)}`;

    return {
      deprecationId,
      userId,
      researchRunId,
      instructionSet,
      affectedSKUs,
      affectedBenchmarkSuites,
      fallbackPath,
      deprecationImpactState,
      modeledOverheadPercentage: modeledOverhead,
      workloadDependencyDescription: dependencyDescription,
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: Instruction set deprecation models represent synthetic architectural simulations. They do not constitute measured laboratory evidence.",
      simulatedAt: new Date().toISOString(),
    };
  }
}
