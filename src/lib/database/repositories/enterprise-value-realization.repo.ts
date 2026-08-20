export class EnterpriseFinancialValueRealizationRepository {
    async getValueRealizations(workspaceId: string) { return []; }
    async createValueRealization(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
