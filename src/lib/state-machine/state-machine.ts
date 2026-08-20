export type RunStatus = 
  | 'CREATED' 
  | 'PLANNING' 
  | 'PLAN_READY' 
  | 'DISCOVERING' 
  | 'RETRIEVING' 
  | 'EXTRACTING' 
  | 'CLAIMING' 
  | 'VERIFYING' 
  | 'CORRELATING' 
  | 'CONFLICT_ANALYSIS' 
  | 'COMMUNITY_ANALYSIS' 
  | 'AUDIENCE_ANALYSIS' 
  | 'OPPORTUNITY_ANALYSIS' 
  | 'QUALITY_CHECK' 
  | 'GENERATING_BRIEF' 
  | 'COMPLETED' 
  | 'PARTIAL' 
  | 'FAILED' 
  | 'CANCELLED';

const VALID_TRANSITIONS: Record<RunStatus, RunStatus[]> = {
  CREATED: ['PLANNING', 'FAILED', 'CANCELLED'],
  PLANNING: ['PLAN_READY', 'FAILED', 'CANCELLED'],
  PLAN_READY: ['DISCOVERING', 'FAILED', 'CANCELLED'],
  DISCOVERING: ['RETRIEVING', 'PARTIAL', 'FAILED', 'CANCELLED'],
  RETRIEVING: ['EXTRACTING', 'PARTIAL', 'FAILED', 'CANCELLED'],
  EXTRACTING: ['CLAIMING', 'PARTIAL', 'FAILED', 'CANCELLED'],
  CLAIMING: ['VERIFYING', 'PARTIAL', 'FAILED', 'CANCELLED'],
  VERIFYING: ['CORRELATING', 'PARTIAL', 'FAILED', 'CANCELLED'],
  CORRELATING: ['CONFLICT_ANALYSIS', 'PARTIAL', 'FAILED', 'CANCELLED'],
  CONFLICT_ANALYSIS: ['COMMUNITY_ANALYSIS', 'PARTIAL', 'FAILED', 'CANCELLED'],
  COMMUNITY_ANALYSIS: ['AUDIENCE_ANALYSIS', 'PARTIAL', 'FAILED', 'CANCELLED'],
  AUDIENCE_ANALYSIS: ['OPPORTUNITY_ANALYSIS', 'PARTIAL', 'FAILED', 'CANCELLED'],
  OPPORTUNITY_ANALYSIS: ['QUALITY_CHECK', 'PARTIAL', 'FAILED', 'CANCELLED'],
  QUALITY_CHECK: ['GENERATING_BRIEF', 'PARTIAL', 'FAILED', 'CANCELLED'],
  GENERATING_BRIEF: ['COMPLETED', 'PARTIAL', 'FAILED', 'CANCELLED'],
  COMPLETED: [],
  PARTIAL: [],
  FAILED: [],
  CANCELLED: []
};

export class ResearchStateMachine {
  private currentStatus: RunStatus;

  constructor(initialStatus: RunStatus = 'CREATED') {
    this.currentStatus = initialStatus;
  }

  getStatus(): RunStatus {
    return this.currentStatus;
  }

  transitionTo(nextStatus: RunStatus): boolean {
    const allowed = VALID_TRANSITIONS[this.currentStatus];
    if (!allowed || !allowed.includes(nextStatus)) {
      throw new Error(`Invalid state transition from ${this.currentStatus} to ${nextStatus}`);
    }
    this.currentStatus = nextStatus;
    return true;
  }
}
