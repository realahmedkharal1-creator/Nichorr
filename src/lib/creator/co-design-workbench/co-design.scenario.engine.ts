import crypto from "crypto";
import { CoDesignScenario, CoDesignParameter, CoDesignConstraint } from "./co-design.types";
import { CoDesignParameterEngine } from "./co-design.parameter.engine";
import { CoDesignConstraintEngine } from "./co-design.constraint.engine";

export class CoDesignScenarioEngine {
  public static calculateFingerprint(
    baselineId: string,
    targetHardware: string,
    modelVersion: string,
    parameters: Record<string, CoDesignParameter>,
    constraints: CoDesignConstraint[]
  ): string {
    const sortedParamEntries = Object.entries(parameters)
      .sort(([k1], [k2]) => k1.localeCompare(k2))
      .map(([k, p]) => ({ id: k, val: p.currentValue, unit: p.unit }));

    const sortedConstraints = [...constraints]
      .sort((a, b) => a.constraintId.localeCompare(b.constraintId))
      .map((c) => ({ id: c.constraintId, op: c.operator, lim: c.limitValue }));

    const payload = JSON.stringify({
      baselineId,
      targetHardware,
      modelVersion,
      params: sortedParamEntries,
      constraints: sortedConstraints,
    });

    return `cdfp-${crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16)}`;
  }

  public static createScenario(params: {
    userId: string;
    researchRunId: string;
    title?: string;
    description?: string;
    baselineId?: string;
    targetHardware?: string;
    modelVersion?: string;
    parameters?: Record<string, CoDesignParameter>;
    activeConstraints?: CoDesignConstraint[];
  }): CoDesignScenario {
    const title = params.title || "Blackwell Architecture Scaling Scenario";
    const description = params.description || "Simulating memory bandwidth vs L3 cache latency scaling in 4K RT workloads.";
    const baselineId = params.baselineId || "eb-5090-4k-rt";
    const targetHardware = params.targetHardware || "NVIDIA GeForce RTX 5090 (Blackwell)";
    const modelVersion = params.modelVersion || "CD-SIM-V1.4.0";
    const parameters = params.parameters || CoDesignParameterEngine.createDefaultParameters();
    const activeConstraints = params.activeConstraints || CoDesignConstraintEngine.createDefaultConstraints();

    const scenarioFingerprint = this.calculateFingerprint(
      baselineId,
      targetHardware,
      modelVersion,
      parameters,
      activeConstraints
    );

    const scenarioId = `scen-${scenarioFingerprint.slice(5, 17)}`;

    return {
      scenarioId,
      revision: 1,
      userId: params.userId,
      researchRunId: params.researchRunId,
      title,
      description,
      baselineId,
      targetHardware,
      modelVersion,
      parameters,
      activeConstraints,
      scenarioFingerprint,
      isImmutable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public static createRevision(
    scenario: CoDesignScenario,
    updatedParameters: Record<string, CoDesignParameter>
  ): CoDesignScenario {
    const scenarioFingerprint = this.calculateFingerprint(
      scenario.baselineId,
      scenario.targetHardware,
      scenario.modelVersion,
      updatedParameters,
      scenario.activeConstraints
    );

    return {
      ...scenario,
      revision: scenario.revision + 1,
      parameters: updatedParameters,
      scenarioFingerprint,
      isImmutable: false,
      updatedAt: new Date().toISOString(),
    };
  }
}
