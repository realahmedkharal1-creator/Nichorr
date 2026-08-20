export class EnterpriseFinancialMetricRepository {
    async getMetrics(workspaceId: string) { return []; }
    async createMetric(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
