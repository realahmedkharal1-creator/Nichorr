export class EnterpriseFinancialTraceRepository {
    async getTraces(workspaceId: string) { return []; }
    async createTrace(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
