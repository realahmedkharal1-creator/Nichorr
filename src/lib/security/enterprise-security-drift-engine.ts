export type EnterpriseSecurityDriftEngineResult = { status: string; data: any };
export class EnterpriseSecurityDriftEngine {
  evaluate(): EnterpriseSecurityDriftEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
