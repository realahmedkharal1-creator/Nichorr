export interface RootCauseHypothesisCandidate {
  candidateCause: "MODEL_CHANGE" | "SOURCE_CHANGE" | "DATA_CHANGE" | "RETRIEVAL_CHANGE" | "AGENT_CHANGE" | "POLICY_CHANGE" | "EXECUTION_CHANGE" | "EXTERNAL_EVENT" | "UNKNOWN";
  certaintyClassification: "OBSERVED" | "SUPPORTED" | "INFERRED" | "UNKNOWN";
  explanation: string;
}

export class AdaptiveRootCauseEngine {
  static formulateRootCause(metricName: string, recentChanges: string[]): RootCauseHypothesisCandidate {
    if (recentChanges.some((c) => c.includes("retrieval"))) {
      return {
        candidateCause: "RETRIEVAL_CHANGE",
        certaintyClassification: "SUPPORTED",
        explanation: "Quality drop coincided with recent retrieval parameter update. Supported candidate cause, unconfirmed causation.",
      };
    }

    return {
      candidateCause: "UNKNOWN",
      certaintyClassification: "UNKNOWN",
      explanation: "No recent correlated configuration changes detected. Root cause remains unknown.",
    };
  }
}
