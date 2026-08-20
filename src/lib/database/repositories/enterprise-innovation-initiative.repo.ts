export class EnterpriseInnovationInitiativeRepository {
  async getInitiatives(workspaceId: string) { return [{ id: '1', workspaceId }]; }
  async getInitiativeById(id: string) { return { id }; }
  async createInitiative(workspaceId: string, data: any) { return { id: 'new', workspaceId, ...data }; }
}
