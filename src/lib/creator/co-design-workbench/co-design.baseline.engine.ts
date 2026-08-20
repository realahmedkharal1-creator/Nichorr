import crypto from "crypto";
import { EmpiricalBaseline } from "./co-design.types";

export class CoDesignBaselineEngine {
  public static createDefaultBaselines(userId: string, researchRunId: string): EmpiricalBaseline[] {
    const baseline1: EmpiricalBaseline = {
      baselineId: "eb-5090-4k-rt",
      userId,
      researchRunId,
      sourceType: "PHYSICAL_BENCHMARK",
      hardwareTarget: "AMD Ryzen 9 9950X / NVIDIA GeForce RTX 5090 (B0)",
      cpuModel: "Ryzen 9 9950X",
      cpuStepping: "B0",
      gpuModel: "GeForce RTX 5090",
      gpuArchitecture: "Blackwell",
      driverVersion: "GeForce 565.90",
      benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
      resolution: "3840x2160",
      preset: "Ray Tracing Overdrive",
      measuredScoreFPS: 112.5,
      measuredPowerWatts: 440,
      measuredTemperatureCelsius: 65,
      measuredPerfPerWatt: 0.256,
      primaryBottleneckAttribution: "MEMORY_BANDWIDTH",
      methodologyFingerprint: "mfp-cp2077-4k",
      siliconFingerprint: "sfp-5090-b0",
      sourceSnapshotHash: "ssh-5090-b0-physical",
      registeredAt: new Date().toISOString(),
    };

    const baseline2: EmpiricalBaseline = {
      baselineId: "eb-4090-4k-rt",
      userId,
      researchRunId,
      sourceType: "PHYSICAL_BENCHMARK",
      hardwareTarget: "AMD Ryzen 9 9950X / NVIDIA GeForce RTX 4090",
      cpuModel: "Ryzen 9 9950X",
      cpuStepping: "B0",
      gpuModel: "GeForce RTX 4090",
      gpuArchitecture: "AdaLovelace",
      driverVersion: "GeForce 565.90",
      benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
      resolution: "3840x2160",
      preset: "Ray Tracing Overdrive",
      measuredScoreFPS: 78.4,
      measuredPowerWatts: 450,
      measuredTemperatureCelsius: 72,
      measuredPerfPerWatt: 0.174,
      primaryBottleneckAttribution: "CORE_EXECUTION",
      methodologyFingerprint: "mfp-cp2077-4k",
      siliconFingerprint: "sfp-4090-ada",
      sourceSnapshotHash: "ssh-4090-ada-physical",
      registeredAt: new Date().toISOString(),
    };

    return [baseline1, baseline2];
  }
}
