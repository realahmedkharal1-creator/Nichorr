import { NodeCapabilities, TestbenchClusterNode } from "./testbench-cluster.types";

export class ClusterCapabilityEngine {
  public static discoverCapabilities(node: Partial<TestbenchClusterNode>): NodeCapabilities {
    return {
      cpuTelemetry: "AVAILABLE",
      gpuTelemetry: "AVAILABLE",
      externalPowerMeter: "NOT_CONFIGURED",
      oscilloscope: "NOT_CONFIGURED",
      daqSystem: "NOT_CONFIGURED",
      thermalChamber: "NOT_CONFIGURED",
      directX12Ultimate: "AVAILABLE",
      vulkanRayTracing: "AVAILABLE",
    };
  }

  public static validateRequiredCapabilities(
    nodeCapabilities: NodeCapabilities,
    required: string[]
  ): {
    isValid: boolean;
    missing: string[];
  } {
    const missing: string[] = [];

    for (const req of required) {
      if (req === "CPU_TELEMETRY" && nodeCapabilities.cpuTelemetry !== "AVAILABLE") {
        missing.push("CPU_TELEMETRY");
      }
      if (req === "GPU_TELEMETRY" && nodeCapabilities.gpuTelemetry !== "AVAILABLE") {
        missing.push("GPU_TELEMETRY");
      }
      if (req === "EXTERNAL_POWER_METER" && nodeCapabilities.externalPowerMeter !== "AVAILABLE") {
        missing.push("EXTERNAL_POWER_METER");
      }
      if (req === "OSCILLOSCOPE" && nodeCapabilities.oscilloscope !== "AVAILABLE") {
        missing.push("OSCILLOSCOPE");
      }
      if (req === "DAQ_SYSTEM" && nodeCapabilities.daqSystem !== "AVAILABLE") {
        missing.push("DAQ_SYSTEM");
      }
      if (req === "DIRECTX_12_ULTIMATE" && nodeCapabilities.directX12Ultimate !== "AVAILABLE") {
        missing.push("DIRECTX_12_ULTIMATE");
      }
    }

    return {
      isValid: missing.length === 0,
      missing,
    };
  }
}
