export class EnterpriseAccessReviewRepository {
  async getAccessReviews(workspaceId: string) {
    return [{ id: 'mock-id', workspace_id: workspaceId }];
  }
}
