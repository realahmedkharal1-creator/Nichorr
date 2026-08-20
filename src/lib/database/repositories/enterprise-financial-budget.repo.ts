export class EnterpriseFinancialBudgetRepository {
    async getBudgets(workspaceId: string) { return []; }
    async createBudget(workspaceId: string, data: any) { return { id: '1', workspace_id: workspaceId, ...data }; }
}
