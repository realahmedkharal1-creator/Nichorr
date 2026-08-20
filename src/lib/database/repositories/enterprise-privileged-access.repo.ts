export class EnterprisePrivilegedAccessRepository {
  async getPrivilegedAccesss(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
