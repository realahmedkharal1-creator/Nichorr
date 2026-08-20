export class EnterpriseIdentityRepository {
  async getIdentitys(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
