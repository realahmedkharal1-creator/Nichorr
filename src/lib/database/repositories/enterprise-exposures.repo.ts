export class EnterpriseExposuresRepository {
  async getByWorkspace(workspaceId: string) { return []; }
  async getById(id: string) { return null; }
  async create(data: any) { return { ...data, id: '123' }; }
}
