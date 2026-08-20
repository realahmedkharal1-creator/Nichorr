export class EnterpriseResourceAllocationRepository {
    async getResourceAllocations(workspaceId: string) {
        return [];
    }
}
export const enterpriseResourceAllocationRepository = new EnterpriseResourceAllocationRepository();
