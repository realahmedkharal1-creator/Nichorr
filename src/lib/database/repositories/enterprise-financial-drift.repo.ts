export class EnterpriseFinancialDriftRepository {
    async getDrifts(workspaceId: string) { return []; }
    async createDrift(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
