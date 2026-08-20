export interface GraphQualityHealth {
  totalEntities: number;
  totalRelationships: number;
  orphanNodes: number;
  healthStatus: "HEALTHY" | "WATCH" | "DEGRADED";
  healthScore: number;
}

export class GraphQualityEngine {
  static evaluateGraphHealth(entities: number, relationships: number, orphans: number): GraphQualityHealth {
    const score = Math.max(0, 100 - orphans * 5);
    const status = score > 85 ? "HEALTHY" : score > 60 ? "WATCH" : "DEGRADED";

    return {
      totalEntities: entities,
      totalRelationships: relationships,
      orphanNodes: orphans,
      healthStatus: status,
      healthScore: score,
    };
  }
}
