export class EnterpriseFinancialCapitalAllocationRepository {
    async getCapitalAllocations(workspaceId: string) { return []; }
    async createCapitalAllocation(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
