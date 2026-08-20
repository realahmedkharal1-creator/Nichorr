export interface DependencyNodeRecord {
  id: string;
  name: string;
  type: "API" | "WORKER" | "QUEUE" | "DATABASE" | "CONNECTOR" | "AGENT";
  upstream: string[];
  downstream: string[];
}

export class DependencyGraphRepository {
  async getDependencyGraph(): Promise<DependencyNodeRecord[]> {
    return [
      {
        id: "dep-1",
        name: "ExecutionEngine",
        type: "WORKER",
        upstream: ["GovernedAPIGateway", "MultiAgentOrchestrator"],
        downstream: ["Production Edge TPU Orchestrator REST Adapter"],
      },
      {
        id: "dep-2",
        name: "Production Edge TPU Orchestrator REST Adapter",
        type: "CONNECTOR",
        upstream: ["ExecutionEngine"],
        downstream: ["Production Edge TPU Cluster"],
      },
    ];
  }
}
