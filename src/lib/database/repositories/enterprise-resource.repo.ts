export class EnterpriseResourceRepository {
  async getResources(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
