export type EnterpriseAccessRiskEngineResult = { status: string; data: any };
export class EnterpriseAccessRiskEngine {
  evaluate(): EnterpriseAccessRiskEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
