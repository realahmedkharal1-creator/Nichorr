export class EnterpriseFinancialBusinessCaseRepository {
    async getBusinessCases(workspaceId: string) { return []; }
    async createBusinessCase(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
