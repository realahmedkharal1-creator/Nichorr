import crypto from "node:crypto";
import {
  NormalizedObservation,
  NormalizedHardwareSpecification,
  NormalizedSoftwareSpecification,
  NormalizedTestConfiguration,
  NormalizedMeasurement,
  FederatedDataClassification,
} from "./collective-intelligence.types";

export interface RawObservationInput {
  observationId?: string;
  federationRecordId: string;
  userId: string;
  researchRunId: string;
  hardware: Partial<NormalizedHardwareSpecification>;
  software: Partial<NormalizedSoftwareSpecification>;
  testConfig: Partial<NormalizedTestConfiguration>;
  measurement: {
    metric: string;
    value: number;
    unit?: string;
    measurementWindow?: string;
    sourcePublisher?: string;
    evidenceSnapshotHash?: string;
    classification?: FederatedDataClassification;
  };
}

export class ObservationNormalizationEngine {
  /**
   * Deterministically normalizes a raw observation into a comparable representation.
   */
  static normalizeObservation(input: RawObservationInput): NormalizedObservation {
    const observationId =
      input.observationId ||
      `obs-${crypto
        .createHash("sha256")
        .update(
          `${input.federationRecordId}:${input.hardware.exactModel || "unknown"}:${
            input.software.benchmarkSuite || "unknown"
          }:${input.measurement.metric}:${input.measurement.value}`
        )
        .digest("hex")
        .substring(0, 12)}`;

    // Normalize Hardware
    const hardware: NormalizedHardwareSpecification = {
      manufacturer: (input.hardware.manufacturer || "UNKNOWN").trim(),
      hardwareFamily: (input.hardware.hardwareFamily || "UNKNOWN").trim(),
      exactModel: (input.hardware.exactModel || "UNKNOWN").trim(),
      gpu: input.hardware.gpu ? input.hardware.gpu.trim() : undefined,
      cpu: input.hardware.cpu ? input.hardware.cpu.trim() : undefined,
      vramGb: input.hardware.vramGb,
      ramGb: input.hardware.ramGb,
      memoryConfig: input.hardware.memoryConfig ? input.hardware.memoryConfig.trim() : undefined,
      powerLimitWatts: input.hardware.powerLimitWatts,
    };

    // Normalize Software
    const software: NormalizedSoftwareSpecification = {
      driver: input.software.driver ? input.software.driver.trim() : undefined,
      os: input.software.os ? input.software.os.trim() : undefined,
      appGameVersion: input.software.appGameVersion ? input.software.appGameVersion.trim() : undefined,
      benchmarkSuite: (input.software.benchmarkSuite || "UNKNOWN_SUITE").trim(),
      benchmarkVersion: input.software.benchmarkVersion ? input.software.benchmarkVersion.trim() : undefined,
    };

    // Normalize Test Configuration
    const testConfig: NormalizedTestConfiguration = {
      resolution: input.testConfig.resolution ? input.testConfig.resolution.trim() : undefined,
      preset: input.testConfig.preset ? input.testConfig.preset.trim() : undefined,
      renderingApi: input.testConfig.renderingApi ? input.testConfig.renderingApi.trim() : undefined,
      upscalingTechnology: input.testConfig.upscalingTechnology ? input.testConfig.upscalingTechnology.trim() : undefined,
      upscalingMode: input.testConfig.upscalingMode ? input.testConfig.upscalingMode.trim() : undefined,
      frameGeneration: input.testConfig.frameGeneration,
      rayTracing: input.testConfig.rayTracing,
      thermalConditionsCelsius: input.testConfig.thermalConditionsCelsius,
      powerConditionsWatts: input.testConfig.powerConditionsWatts,
      methodologyNotes: input.testConfig.methodologyNotes ? input.testConfig.methodologyNotes.trim() : undefined,
    };

    // Normalize Measurement
    const measurement: NormalizedMeasurement = {
      metric: (input.measurement.metric || "SCORE").trim(),
      value: Number.isFinite(input.measurement.value) ? input.measurement.value : 0,
      unit: (input.measurement.unit || "pts").trim(),
      measurementWindow: input.measurement.measurementWindow ? input.measurement.measurementWindow.trim() : undefined,
      sourcePublisher: (input.measurement.sourcePublisher || "UNKNOWN_PUBLISHER").trim(),
      evidenceSnapshotHash: input.measurement.evidenceSnapshotHash || "snap-evidence-unknown",
      classification: input.measurement.classification || "FEDERATED_OBSERVATION",
    };

    // Hardware fingerprint
    const hwString = `${hardware.manufacturer}|${hardware.hardwareFamily}|${hardware.exactModel}|${hardware.gpu || ""}|${hardware.cpu || ""}`;
    const hardwareFingerprint = crypto.createHash("sha256").update(hwString).digest("hex").substring(0, 16);

    // Methodology fingerprint
    const methString = `${software.benchmarkSuite}|${software.benchmarkVersion || ""}|${software.driver || ""}|${testConfig.resolution || ""}|${testConfig.preset || ""}|${testConfig.renderingApi || ""}|${testConfig.upscalingTechnology || ""}|${testConfig.frameGeneration ? "fg" : "no-fg"}|${testConfig.rayTracing ? "rt" : "no-rt"}`;
    const methodologyFingerprint = crypto.createHash("sha256").update(methString).digest("hex").substring(0, 16);

    return {
      observationId,
      federationRecordId: input.federationRecordId,
      userId: input.userId,
      researchRunId: input.researchRunId,
      hardware,
      software,
      testConfig,
      measurement,
      methodologyFingerprint,
      hardwareFingerprint,
      normalizedAt: new Date().toISOString(),
    };
  }
}
