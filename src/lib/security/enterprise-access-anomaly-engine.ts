export type EnterpriseAccessAnomalyEngineResult = { status: string; data: any };
export class EnterpriseAccessAnomalyEngine {
  evaluate(): EnterpriseAccessAnomalyEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
