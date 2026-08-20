export interface StructuredLog {
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  requestId?: string;
  workspaceId?: string;
  projectId?: string;
  durationMs?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

export class ApplicationLogger {
  log(log: Omit<StructuredLog, "timestamp">): StructuredLog {
    const entry: StructuredLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV !== "test") {
      console.log(JSON.stringify(entry));
    }
    return entry;
  }
}
