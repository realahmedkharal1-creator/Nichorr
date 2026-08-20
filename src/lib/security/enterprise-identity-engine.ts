export type EnterpriseIdentityEngineResult = { status: string; data: any };
export class EnterpriseIdentityEngine {
  evaluate(): EnterpriseIdentityEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
