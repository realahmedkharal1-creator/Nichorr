import {
  ConfounderCategory,
  ResearchHypothesis,
} from "./hypothesis.types";

export class HypothesisConfounderEngine {
  public static reconcileConfounders(
    hypothesis: ResearchHypothesis,
    newConfounder?: ConfounderCategory
  ): {
    activeConfounders: ConfounderCategory[];
    hasMajorBlocker: boolean;
    confounderExplanations: string[];
  } {
    const active = [...hypothesis.activeConfounders];
    if (newConfounder && !active.includes(newConfounder)) {
      active.push(newConfounder);
    }

    const explanations: string[] = [];
    let hasMajorBlocker = false;

    for (const c of active) {
      if (c === "THERMAL") {
        explanations.push("Thermal throttle headroom variance may confound observed clock-dependent regressions.");
        hasMajorBlocker = true;
      } else if (c === "DRIVER") {
        explanations.push("Driver dispatch kernel scheduling variations may confound raw execution unit attribution.");
      } else if (c === "POWER") {
        explanations.push("Board power limit capping may mask microarchitectural execution efficiency gains.");
        hasMajorBlocker = true;
      } else if (c === "METHODOLOGY") {
        explanations.push("Benchmark run duration or warmup iterations differ across test passes.");
      } else if (c === "MULTI_FACTOR") {
        explanations.push("Multiple system parameters altered concurrently without isolation.");
        hasMajorBlocker = true;
      }
    }

    return {
      activeConfounders: active,
      hasMajorBlocker,
      confounderExplanations: explanations,
    };
  }
}
