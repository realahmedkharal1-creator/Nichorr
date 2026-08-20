import { createClient } from "@/lib/supabase/server";

export interface SpecialistAgentRecord {
  id: string;
  agent_name: string;
  category: "DISCOVERY" | "VERIFICATION" | "CONTRADICTION" | "FORESIGHT" | "STRATEGY";
  capabilities: string[];
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "INACTIVE";
  version: string;
}

export class AgentRegistryRepository {
  async getAgents(): Promise<SpecialistAgentRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("agent_registry").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "ag-1",
        agent_name: "DiscoveryAgent",
        category: "DISCOVERY",
        capabilities: ["entity_resolution", "alias_mapping", "source_ingestion"],
        risk_level: "LOW",
        status: "ACTIVE",
        version: "1.0.0",
      },
      {
        id: "ag-2",
        agent_name: "VerificationAgent",
        category: "VERIFICATION",
        capabilities: ["claim_extraction", "evidence_binding", "citation_audit"],
        risk_level: "LOW",
        status: "ACTIVE",
        version: "1.0.0",
      },
      {
        id: "ag-3",
        agent_name: "ContradictionAgent",
        category: "CONTRADICTION",
        capabilities: ["conflict_detection", "contested_state_tagging"],
        risk_level: "MEDIUM",
        status: "ACTIVE",
        version: "1.0.0",
      },
      {
        id: "ag-4",
        agent_name: "StrategyAgent",
        category: "STRATEGY",
        capabilities: ["consequential_recommendation", "risk_tradeoff_analysis"],
        risk_level: "HIGH",
        status: "ACTIVE",
        version: "1.0.0",
      },
    ];
  }
}
