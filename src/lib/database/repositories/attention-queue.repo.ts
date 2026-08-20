export class AttentionQueueRepository {
  getAttentionItems(workspaceId: string) { return []; }
  updateItemState(id: string, state: string) { return { id, state }; }
}