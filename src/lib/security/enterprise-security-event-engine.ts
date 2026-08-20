export type EnterpriseSecurityEventEngineResult = { status: string; data: any };
export class EnterpriseSecurityEventEngine {
  evaluate(): EnterpriseSecurityEventEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
