import { TaskDecompositionEngine, DecomposedSubtask } from "./task-decomposition";
import { CrossAgentVerificationEngine, CrossAgentVerificationResult } from "./cross-agent-verification";

export interface OrchestrationExecutionResult {
  taskId: string;
  userIntent: string;
  autonomyLevel: number;
  plan: DecomposedSubtask[];
  verification: CrossAgentVerificationResult;
  requiresHumanApproval: boolean;
  status: "COMPLETED" | "WAITING_FOR_APPROVAL";
}

export class IntelligenceOrchestrator {
  static orchestrateTask(taskId: string, intent: string, autonomyLevel: number): OrchestrationExecutionResult {
    const plan = TaskDecompositionEngine.decomposeIntent(intent);
    const hasHighRisk = plan.some((step) => step.riskLevel === "HIGH");

    // Autonomy level < 4 requires human approval for high risk subtasks
    const requiresApproval = hasHighRisk && autonomyLevel < 4;

    const mockAgentResults = [
      { agent: "DiscoveryAgent", status: "VERIFIED" },
      { agent: "VerificationAgent", status: "VERIFIED" },
    ];
    const verification = CrossAgentVerificationEngine.verifyOutputs(mockAgentResults);

    return {
      taskId,
      userIntent: intent,
      autonomyLevel,
      plan,
      verification,
      requiresHumanApproval: requiresApproval,
      status: requiresApproval ? "WAITING_FOR_APPROVAL" : "COMPLETED",
    };
  }
}
