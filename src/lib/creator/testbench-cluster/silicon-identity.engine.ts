import crypto from "crypto";
import { SiliconIdentity } from "./testbench-cluster.types";

export class SiliconIdentityEngine {
  public static createSiliconIdentity(params: Partial<SiliconIdentity>): SiliconIdentity {
    const cpuVendor = params.cpuVendor || "AMD";
    const cpuFamily = params.cpuFamily || "Zen 5";
    const cpuModel = params.cpuModel || "Ryzen 9 9950X";
    const cpuStepping = params.cpuStepping || "B0";
    const cpuArchitecture = params.cpuArchitecture || "x86_64";
    const cpuCores = params.cpuCores ?? 16;
    const cpuThreads = params.cpuThreads ?? 32;
    const cpuCacheTopology = params.cpuCacheTopology || "L1 1MB / L2 16MB / L3 64MB";
    const cpuSupportedInstructionSets = params.cpuSupportedInstructionSets || [
      "AVX-512",
      "AVX2",
      "FMA3",
      "BMI2",
      "SSE4.2",
    ];

    const gpuVendor = params.gpuVendor || "NVIDIA";
    const gpuArchitecture = params.gpuArchitecture || "Blackwell";
    const gpuSku = params.gpuSku || "GeForce RTX 5090";
    const gpuVramGb = params.gpuVramGb ?? 32;
    const gpuDriverVersion = params.gpuDriverVersion || "GeForce 565.90";
    const gpuFirmwareVersion = params.gpuFirmwareVersion || "96.02.11.00.01";

    const motherboard = params.motherboard || "ASUS ROG Crosshair X870E Hero";
    const biosVersion = params.biosVersion || "BIOS 0805";
    const ramGb = params.ramGb ?? 64;
    const ramSpeedMhz = params.ramSpeedMhz ?? 6000;
    const operatingSystem = params.operatingSystem || "Windows 11 Pro 24H2";
    const kernelVersion = params.kernelVersion || "10.0.26100";
    const powerConfigWatts = params.powerConfigWatts ?? 500;

    const canonicalIdentity = {
      cpuVendor,
      cpuFamily,
      cpuModel,
      cpuStepping,
      cpuArchitecture,
      cpuCores,
      cpuThreads,
      cpuCacheTopology,
      cpuSupportedInstructionSets: [...cpuSupportedInstructionSets].sort(),
      gpuVendor,
      gpuArchitecture,
      gpuSku,
      gpuVramGb,
      gpuDriverVersion,
      gpuFirmwareVersion,
      motherboard,
      biosVersion,
      ramGb,
      ramSpeedMhz,
      operatingSystem,
      kernelVersion,
      powerConfigWatts,
    };

    const siliconFingerprint = `sfp-${crypto
      .createHash("sha256")
      .update(JSON.stringify(canonicalIdentity))
      .digest("hex")
      .slice(0, 16)}`;

    return {
      ...canonicalIdentity,
      siliconFingerprint,
    };
  }

  public static compareIdentities(
    a: SiliconIdentity,
    b: SiliconIdentity
  ): {
    isIdentical: boolean;
    differences: string[];
  } {
    const diffs: string[] = [];
    if (a.cpuModel !== b.cpuModel) diffs.push(`CPU: ${a.cpuModel} vs ${b.cpuModel}`);
    if (a.cpuStepping !== b.cpuStepping) diffs.push(`CPU Stepping: ${a.cpuStepping} vs ${b.cpuStepping}`);
    if (a.gpuSku !== b.gpuSku) diffs.push(`GPU: ${a.gpuSku} vs ${b.gpuSku}`);
    if (a.gpuDriverVersion !== b.gpuDriverVersion) diffs.push(`Driver: ${a.gpuDriverVersion} vs ${b.gpuDriverVersion}`);
    if (a.gpuFirmwareVersion !== b.gpuFirmwareVersion) diffs.push(`Firmware: ${a.gpuFirmwareVersion} vs ${b.gpuFirmwareVersion}`);
    if (a.biosVersion !== b.biosVersion) diffs.push(`BIOS: ${a.biosVersion} vs ${b.biosVersion}`);
    if (a.ramSpeedMhz !== b.ramSpeedMhz) diffs.push(`RAM Speed: ${a.ramSpeedMhz}MHz vs ${b.ramSpeedMhz}MHz`);
    if (a.powerConfigWatts !== b.powerConfigWatts) diffs.push(`Power Limit: ${a.powerConfigWatts}W vs ${b.powerConfigWatts}W`);

    return {
      isIdentical: diffs.length === 0,
      differences: diffs,
    };
  }
}
