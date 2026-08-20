export class EnterpriseAccessRecertificationRepository {
  async getAccessRecertifications(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
