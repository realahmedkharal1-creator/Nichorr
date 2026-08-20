import { createClient } from "@/lib/supabase/server";

export interface ServiceDependencyRecord {
  id: string;
  service_name: string;
  depends_on: string;
  criticality: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  failure_propagation_risk: number;
  created_at?: string;
}

export class ServiceDependencyRepository {
  async getServiceDependencies(): Promise<ServiceDependencyRecord[]> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("service_dependencies").select("*");
      if (!error && data && data.length > 0) return data;
    } catch {}

    return [
      {
        id: "svc-dep-1",
        service_name: "ExecutionEngine",
        depends_on: "GovernedAPIGateway",
        criticality: "CRITICAL",
        failure_propagation_risk: 95.0,
        created_at: new Date().toISOString(),
      },
      {
        id: "svc-dep-2",
        service_name: "Production Edge TPU REST Adapter",
        depends_on: "ExecutionEngine",
        criticality: "HIGH",
        failure_propagation_risk: 85.0,
        created_at: new Date().toISOString(),
      },
    ];
  }
}
