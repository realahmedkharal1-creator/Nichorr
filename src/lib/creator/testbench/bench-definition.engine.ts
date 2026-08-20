import crypto from "crypto";
import { TestbenchDefinition } from "./testbench.types";

export class BenchDefinitionEngine {
  /**
   * Generates a standard baseline testbench definition for the research run.
   */
  static createDefaultTestbench(
    researchRunId: string,
    userId: string,
    overrides: Partial<TestbenchDefinition> = {}
  ): TestbenchDefinition {
    const now = new Date().toISOString();
    const id = `tb-${crypto.randomUUID().slice(0, 8)}`;

    return {
      testbenchId: overrides.testbenchId || id,
      userId,
      researchRunId,
      name: overrides.name || "Primary Silicon Testbench Rig Alpha",
      description:
        overrides.description ||
        "Automated empirical silicon testbench for high-resolution graphics and compute regression analysis.",
      hardwareTarget: overrides.hardwareTarget || "GeForce RTX 5090 / Ryzen 9 9950X",
      architecture: overrides.architecture || "Blackwell / Zen 5",
      cpu: overrides.cpu || "AMD Ryzen 9 9950X",
      gpu: overrides.gpu || "NVIDIA GeForce RTX 5090",
      motherboard: overrides.motherboard || "ASUS ROG Crosshair X870E Hero",
      firmware: overrides.firmware || "96.02.11.00.01",
      bios: overrides.bios || "BIOS 0805",
      driver: overrides.driver || "GeForce 565.90",
      operatingSystem: overrides.operatingSystem || "Windows 11 Pro 24H2",
      memoryConfiguration: overrides.memoryConfiguration || "64GB DDR5-6000 CL30 Dual Channel",
      powerConfiguration: overrides.powerConfiguration || "1200W ATX 3.1 Platinum PSU",
      coolingConfiguration: overrides.coolingConfiguration || "360mm AIO Liquid Cooler (3x120mm fans)",
      measurementDevices: overrides.measurementDevices || [
        "Onboard GPU Power Sensors",
        "HWiNFO64 Telemetry Stream",
      ],
      benchmarkSuite: overrides.benchmarkSuite || "Cyberpunk 2077 (4K Ultra RT)",
      benchmarkVersion: overrides.benchmarkVersion || "2.13",
      applicationVersion: overrides.applicationVersion || "2.13",
      methodology:
        overrides.methodology ||
        "Clean boot, 10-minute thermal preheat, 3 valid measurement runs with automated outlier detection.",
      requiredCapabilities: overrides.requiredCapabilities || [
        "DirectX 12 Ultimate",
        "Hardware Accelerated GPU Scheduling",
        "Resizable BAR Enabled",
      ],
      safetyConstraints: {
        maxThermalLimitCelsius: 90,
        maxPowerLimitWatts: 600,
        abortOnThrottling: true,
        requireExternalPowerMeter: false,
        ...overrides.safetyConstraints,
      },
      status: overrides.status || "ACTIVE",
      createdAt: overrides.createdAt || now,
      updatedAt: overrides.updatedAt || now,
    };
  }

  /**
   * Validates safety constraints and configuration fields.
   */
  static validate(definition: TestbenchDefinition): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!definition.name || definition.name.trim().length === 0) {
      errors.push("Testbench name is required.");
    }
    if (!definition.hardwareTarget || definition.hardwareTarget.trim().length === 0) {
      errors.push("Hardware target is required.");
    }
    if (definition.safetyConstraints.maxThermalLimitCelsius > 105) {
      errors.push("Safety constraint maxThermalLimitCelsius cannot exceed 105°C.");
    }
    if (definition.safetyConstraints.maxPowerLimitWatts > 1000) {
      errors.push("Safety constraint maxPowerLimitWatts cannot exceed 1000W.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
