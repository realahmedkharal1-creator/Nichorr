export class EnterpriseCommandRepository {
  async getCommands(workspaceId: string) { return [{ id: 'cmd-1', status: 'DRAFT', title: 'Default' }]; }
  async getCommandById(id: string) { return { id, status: 'DRAFT', title: 'Default' }; }
  async createCommand(workspaceId: string, data: any) { return { id: 'cmd-1', ...data, status: 'DRAFT' }; }
  async updateStatus(id: string, status: string) { return { id, status }; }
}
