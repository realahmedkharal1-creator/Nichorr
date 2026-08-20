export interface GovernedControlVersion {
  controlKey: string;
  version: string;
  configuration: Record<string, any>;
  status: "DRAFT" | "VALIDATED" | "APPROVED" | "ACTIVE" | "SUPERSEDED";
  createdAt: string;
}

export class ControlVersionEngine {
  static createVersion(controlKey: string, currentVersion: string, configuration: Record<string, any>): GovernedControlVersion {
    const nextVer = `v${(parseFloat(currentVersion.replace("v", "")) + 0.1).toFixed(1)}`;
    return {
      controlKey,
      version: nextVer,
      configuration,
      status: "DRAFT", // Control versions start as DRAFT until promoted!
      createdAt: new Date().toISOString(),
    };
  }
}
