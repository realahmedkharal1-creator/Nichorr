export type EnterpriseAccessReviewEngineResult = { status: string; data: any };
export class EnterpriseAccessReviewEngine {
  evaluate(): EnterpriseAccessReviewEngineResult {
    return { status: 'SUCCESS', data: {} };
  }
}
