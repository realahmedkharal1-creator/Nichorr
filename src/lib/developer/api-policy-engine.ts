export interface ApiPolicyDecision {
  allowed: boolean;
  reason?: string;
  scopeGranted: boolean;
  autonomyLevel: number;
  requiresHumanApproval: boolean;
}

export class ApiPolicyEngine {
  static evaluatePolicy(scopeRequired: string, scopesAvailable: string[], autonomyLevel: number = 3): ApiPolicyDecision {
    const hasScope = scopesAvailable.includes(scopeRequired) || scopesAvailable.includes("admin:all");
    
    if (!hasScope) {
      return {
        allowed: false,
        reason: `Missing required scope: ${scopeRequired}`,
        scopeGranted: false,
        autonomyLevel,
        requiresHumanApproval: false,
      };
    }

    const requiresApproval = scopeRequired.includes("publish") || scopeRequired.includes("execute");

    return {
      allowed: !requiresApproval,
      scopeGranted: true,
      autonomyLevel,
      requiresHumanApproval: requiresApproval,
    };
  }

  static redactSecrets(data: any): any {
    const jsonStr = JSON.stringify(data);
    const sanitized = jsonStr.replace(/(sk_[a-zA-Z0-9]+|vt_live_[a-zA-Z0-9]+)/g, "[REDACTED_SECRET]");
    return JSON.parse(sanitized);
  }
}
