import crypto from "crypto";
import {
  TestbenchClusterNode,
  SiliconDifferentialEntry,
  SiliconDifferentialMatrix,
  DifferentialClassification,
} from "./testbench-cluster.types";
import { MethodologyEngine } from "./methodology.engine";

export interface NodeBenchmarkRecord {
  node: TestbenchClusterNode;
  benchmarkSuite: string;
  score: number;
  metricUnit: string;
  powerWatts?: number;
  gpuTempCelsius?: number;
  clockGhz?: number;
}

export class SiliconDifferentialEngine {
  public static compareNodes(
    clusterId: string,
    userId: string,
    researchRunId: string,
    recordA: NodeBenchmarkRecord,
    recordB: NodeBenchmarkRecord
  ): SiliconDifferentialEntry {
    const nodeA = recordA.node;
    const nodeB = recordB.node;

    const deltaAbsolute = Number((recordA.score - recordB.score).toFixed(2));
    const deltaPercentage = recordB.score > 0
      ? Number((((recordA.score - recordB.score) / recordB.score) * 100).toFixed(2))
      : 0;

    const powerDeltaWatts = recordA.powerWatts !== undefined && recordB.powerWatts !== undefined
      ? Number((recordA.powerWatts - recordB.powerWatts).toFixed(1))
      : undefined;

    const perfPerWattA = recordA.powerWatts && recordA.powerWatts > 0 ? recordA.score / recordA.powerWatts : undefined;
    const perfPerWattB = recordB.powerWatts && recordB.powerWatts > 0 ? recordB.score / recordB.powerWatts : undefined;
    const perfPerWattDelta = perfPerWattA !== undefined && perfPerWattB !== undefined
      ? Number((perfPerWattA - perfPerWattB).toFixed(3))
      : undefined;

    const thermalDeltaCelsius = recordA.gpuTempCelsius !== undefined && recordB.gpuTempCelsius !== undefined
      ? Number((recordA.gpuTempCelsius - recordB.gpuTempCelsius).toFixed(1))
      : undefined;

    const clockDeltaGhz = recordA.clockGhz !== undefined && recordB.clockGhz !== undefined
      ? Number((recordA.clockGhz - recordB.clockGhz).toFixed(2))
      : undefined;

    // Check methodology compatibility
    const methodEval = MethodologyEngine.evaluateCompatibility(
      {
        benchmarkSuite: recordA.benchmarkSuite,
        benchmarkVersion: "2.13",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        renderingApi: "DirectX 12",
      },
      {
        benchmarkSuite: recordB.benchmarkSuite,
        benchmarkVersion: "2.13",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        renderingApi: "DirectX 12",
      }
    );

    const confounders: string[] = [...methodEval.confounders];
    const candidateCauses: string[] = [];

    // Evaluate hardware variance dimensions
    const isDifferentSilicon = nodeA.siliconIdentity.gpuSku !== nodeB.siliconIdentity.gpuSku ||
      nodeA.siliconIdentity.cpuModel !== nodeB.siliconIdentity.cpuModel;
    const isDifferentStepping = nodeA.siliconIdentity.cpuStepping !== nodeB.siliconIdentity.cpuStepping;
    const isDifferentDriver = nodeA.siliconIdentity.gpuDriverVersion !== nodeB.siliconIdentity.gpuDriverVersion;
    const isDifferentFirmware = nodeA.siliconIdentity.gpuFirmwareVersion !== nodeB.siliconIdentity.gpuFirmwareVersion;
    const isDifferentBios = nodeA.siliconIdentity.biosVersion !== nodeB.siliconIdentity.biosVersion;
    const isDifferentPower = nodeA.siliconIdentity.powerConfigWatts !== nodeB.siliconIdentity.powerConfigWatts;

    if (isDifferentSilicon) candidateCauses.push("SILICON_DIFFERENCE");
    if (isDifferentStepping) candidateCauses.push("SILICON_STEPPING");
    if (isDifferentDriver) candidateCauses.push("DRIVER_CHANGE");
    if (isDifferentFirmware) candidateCauses.push("FIRMWARE_CHANGE");
    if (isDifferentBios) candidateCauses.push("BIOS_CHANGE");
    if (isDifferentPower) candidateCauses.push("POWER_VARIANCE");

    let classification: DifferentialClassification = "IDENTICAL_CONFIGURATION";
    let primaryDivergenceFactor = "None";

    if (!methodEval.isCompatible) {
      classification = "NOT_COMPARABLE";
      primaryDivergenceFactor = "Methodology Incompatible";
    } else if (candidateCauses.length > 2) {
      classification = "MULTI_FACTOR_DIFFERENCE";
      primaryDivergenceFactor = "Multiple Simultaneous Hardware/Software Shifts";
      confounders.push("Multiple factors shifted simultaneously: " + candidateCauses.join(", "));
    } else if (isDifferentStepping) {
      classification = "SILICON_VARIANT";
      primaryDivergenceFactor = `CPU Stepping Shift (${nodeA.siliconIdentity.cpuStepping} vs ${nodeB.siliconIdentity.cpuStepping})`;
    } else if (isDifferentFirmware) {
      classification = "FIRMWARE_VARIANT";
      primaryDivergenceFactor = `Firmware Version Delta (${nodeA.siliconIdentity.gpuFirmwareVersion} vs ${nodeB.siliconIdentity.gpuFirmwareVersion})`;
    } else if (isDifferentDriver) {
      classification = "DRIVER_VARIANT";
      primaryDivergenceFactor = `Driver Version Delta (${nodeA.siliconIdentity.gpuDriverVersion} vs ${nodeB.siliconIdentity.gpuDriverVersion})`;
    } else if (isDifferentPower) {
      classification = "POWER_VARIANT";
      primaryDivergenceFactor = `Power Target Delta (${nodeA.siliconIdentity.powerConfigWatts}W vs ${nodeB.siliconIdentity.powerConfigWatts}W)`;
    } else if (isDifferentSilicon) {
      classification = "SILICON_VARIANT";
      primaryDivergenceFactor = `Hardware SKU Delta (${nodeA.siliconIdentity.gpuSku} vs ${nodeB.siliconIdentity.gpuSku})`;
    }

    const observedDifferenceNote =
      `Observed empirical difference: ${recordA.score} ${recordA.metricUnit} vs ${recordB.score} ${recordB.metricUnit} ` +
      `(${deltaPercentage > 0 ? `+${deltaPercentage}%` : `${deltaPercentage}%`}). Factor: ${primaryDivergenceFactor}.`;

    const differentialId = `diff-${crypto.randomBytes(6).toString("hex")}`;

    return {
      differentialId,
      clusterId,
      userId,
      researchRunId,
      benchmarkSuite: recordA.benchmarkSuite,
      nodeAId: nodeA.nodeId,
      nodeBId: nodeB.nodeId,
      nodeASku: nodeA.siliconIdentity.gpuSku,
      nodeBSku: nodeB.siliconIdentity.gpuSku,
      nodeAStepping: nodeA.siliconIdentity.cpuStepping,
      nodeBStepping: nodeB.siliconIdentity.cpuStepping,
      nodeADriver: nodeA.siliconIdentity.gpuDriverVersion,
      nodeBDriver: nodeB.siliconIdentity.gpuDriverVersion,
      nodeABios: nodeA.siliconIdentity.biosVersion,
      nodeBBios: nodeB.siliconIdentity.biosVersion,
      scoreA: recordA.score,
      scoreB: recordB.score,
      metricUnit: recordA.metricUnit,
      deltaAbsolute,
      deltaPercentage,
      powerDeltaWatts,
      perfPerWattDelta,
      thermalDeltaCelsius,
      clockDeltaGhz,
      differentialClassification: classification,
      primaryDivergenceFactor,
      candidateCauses,
      confounders,
      isCausallyEstablished: false, // Strict epistemic guard
      observedDifferenceNote,
      methodologyCompatible: methodEval.isCompatible,
      evidenceBoundary:
        "OBSERVED_DIFFERENCE ≠ PROVEN_CAUSE: Physical cluster measurements preserve empirical delta without automatic causal assertion.",
      comparedAt: new Date().toISOString(),
    };
  }

  public static buildMatrix(
    clusterId: string,
    researchRunId: string,
    userId: string,
    records: NodeBenchmarkRecord[]
  ): SiliconDifferentialMatrix {
    const entries: SiliconDifferentialEntry[] = [];

    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        entries.push(
          this.compareNodes(clusterId, userId, researchRunId, records[i], records[j])
        );
      }
    }

    const variantCount = entries.filter((e) => e.differentialClassification !== "IDENTICAL_CONFIGURATION").length;
    const contradictionCount = entries.filter((e) => Math.abs(e.deltaPercentage) > 8 && e.differentialClassification === "IDENTICAL_CONFIGURATION").length;
    const outlierCount = entries.filter((e) => Math.abs(e.deltaPercentage) > 15).length;

    return {
      matrixId: `sdm-${crypto.randomBytes(4).toString("hex")}`,
      clusterId,
      researchRunId,
      userId,
      entries,
      totalComparisonsCount: entries.length,
      variantCount,
      contradictionCount,
      outlierCount,
      evidenceBoundary:
        "SILICON_DIFFERENTIAL_MATRIX: Multi-node cross-comparison with explicit non-causal epistemic boundary.",
      generatedAt: new Date().toISOString(),
    };
  }
}
