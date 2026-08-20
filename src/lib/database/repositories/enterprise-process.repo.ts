export class EnterpriseProcessRepository { async find() { return []; } async create(data: any) { return { id: "uuid", ...data }; } }
