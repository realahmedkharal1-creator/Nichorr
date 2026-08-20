export class EnterpriseCustomerJourneyStageRepository {
        async findById(id: string) { return { id }; }
        async list(workspaceId: string) { return []; }
        async save(data: any) { return data; }
    }