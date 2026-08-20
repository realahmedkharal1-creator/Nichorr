import crypto from "node:crypto";
import {
  MicrocodeSimulationScenario,
  MicrocodeMitigationScenarioCategory,
  WorkloadSensitivityDimension,
} from "./architectural-forecast.types";

export class ScenarioEngine {
  /**
   * Generates default baseline microcode simulation scenarios.
   */
  static getDefaultScenarios(
    researchRunId: string,
    userId: string
  ): MicrocodeSimulationScenario[] {
    return [
      {
        scenarioId: "scen-no-mitigation",
        userId,
        researchRunId,
        name: "Unmitigated Baseline",
        overheadCategory: "NO_MITIGATION",
        assumedOverheadPercentage: 0,
        targetWorkloadCategory: "All Benchmarks",
        targetArchitecture: "All Architectures",
        targetInstructionSets: [],
        sensitivityFactors: [],
        description: "Zero mitigation overhead (unmitigated hardware execution state).",
        isCustom: false,
        createdAt: new Date().toISOString(),
      },
      {
        scenarioId: "scen-low-mitigation",
        userId,
        researchRunId,
        name: "Light Microcode Patch (Spectre-BHB / Retbleed Fix)",
        overheadCategory: "LOW_OVERHEAD",
        assumedOverheadPercentage: 2.5,
        targetWorkloadCategory: "Compute & Productivity",
        targetArchitecture: "x86_64 / ARMv9",
        targetInstructionSets: ["Branch Predictor Flushing"],
        sensitivityFactors: ["BRANCH_SENSITIVITY"],
        description: "Conservative branch predictor flush on ring-0 kernel transitions.",
        isCustom: false,
        createdAt: new Date().toISOString(),
      },
      {
        scenarioId: "scen-moderate-mitigation",
        userId,
        researchRunId,
        name: "Moderate Speculative Execution Barrier (Downfall / Gather Fix)",
        overheadCategory: "MODERATE_OVERHEAD",
        assumedOverheadPercentage: 6.0,
        targetWorkloadCategory: "Vector / SIMD Heavy",
        targetArchitecture: "x86_64 AVX2 / AVX-512",
        targetInstructionSets: ["AVX-512 Gather", "Vector Register Clearing"],
        sensitivityFactors: ["MEMORY_SENSITIVITY", "BRANCH_SENSITIVITY"],
        description: "Disables transient speculative vector loads across hyperthread boundaries.",
        isCustom: false,
        createdAt: new Date().toISOString(),
      },
      {
        scenarioId: "scen-high-mitigation",
        userId,
        researchRunId,
        name: "Aggressive Hardware Fault Microcode Revocation",
        overheadCategory: "HIGH_OVERHEAD",
        assumedOverheadPercentage: 14.0,
        targetWorkloadCategory: "System Call & Virtualization Heavy",
        targetArchitecture: "x86_64 Server & Workstation",
        targetInstructionSets: ["Full Page Table Isolation", "IBPB on VM Exit"],
        sensitivityFactors: ["SYSCALL_SENSITIVITY", "VIRTUALIZATION_SENSITIVITY", "MEMORY_SENSITIVITY"],
        description: "Full synchronous cache invalidation on process and virtual machine context switches.",
        isCustom: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Creates a custom user-defined simulation scenario with declared assumptions.
   */
  static createCustomScenario(
    researchRunId: string,
    userId: string,
    name: string,
    assumedOverheadPercentage: number,
    sensitivityFactors: WorkloadSensitivityDimension[] = [],
    description: string = "Custom user scenario"
  ): MicrocodeSimulationScenario {
    let overheadCategory: MicrocodeMitigationScenarioCategory = "CUSTOM_ASSUMPTION";
    if (assumedOverheadPercentage === 0) overheadCategory = "NO_MITIGATION";
    else if (assumedOverheadPercentage <= 3) overheadCategory = "LOW_OVERHEAD";
    else if (assumedOverheadPercentage <= 8) overheadCategory = "MODERATE_OVERHEAD";
    else if (assumedOverheadPercentage > 8) overheadCategory = "HIGH_OVERHEAD";

    const scenarioId = `scen-custom-${crypto
      .createHash("sha256")
      .update(`${userId}:${name}:${assumedOverheadPercentage}`)
      .digest("hex")
      .substring(0, 10)}`;

    return {
      scenarioId,
      userId,
      researchRunId,
      name,
      overheadCategory,
      assumedOverheadPercentage,
      targetWorkloadCategory: "Custom Defined",
      targetArchitecture: "User Declared",
      targetInstructionSets: [],
      sensitivityFactors,
      description,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
  }
}
