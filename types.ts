
export type Tier = 1 | 2 | 3;

export interface Student {
  id: string;
  name: string;
  grade: string;
  tier: Tier;
  accommodations: string; 
  iepNotes?: string;      
  isELL?: boolean;        
  behaviorPlan?: string;  
  scores: number[];       
  mclassBOY?: number;
  mapBOY?: number;
}

export interface LessonPhase {
  name: string;
  teacherActions: string;
  studentActions: string;
  engagementStrategy?: string;
  quickCheck?: string;
}

export interface Misconception {
  issue: string;
  cause: string;
  correction: string;
}

export interface BridgePlan {
  focusSkill: string;
  twoMoves: string[];
  easierVersion: string;
  successSignal: string;
}

export interface StructuredLessonPlan {
  overview: {
    grade: string;
    subject: string;
    standards: string;
    learningObjective: string;
    successCriteria: string;
    vocabulary: string;
    talkBalanceTarget: string; // e.g., "55% Teacher / 45% Student"
  };
  weWill: string; // Required Fundamental 5
  iWill: string;  // Required Fundamental 5
  misconceptions: Misconception[]; // At least 2 required
  phases: LessonPhase[]; // Do Now -> I Do -> We Do -> You Do -> Closure
  differentiation: {
    below: string;
    on: string;
    above: string;
  };
  classroomCulture: {
    paxKernel: string;
    attentionSignal: string;
  };
  bridgePlan: BridgePlan; // Proficient+1 scaffolding
  exitTicketDesign: {
    skill: string;
    masteryRule: string;
  };
}

export interface ObservationAnalysis {
  alignmentSummary: {
    level: string;
    strength: string;
    growth: string;
  };
  talkBalance: {
    teacherPercentage: number;
    studentPercentage: number;
    evidence: { quote: string; type: 'teacher' | 'student'; timestamp?: string }[];
    missedOpportunity: string;
    actionStep: string;
  };
  misconceptionReview: {
    appeared: string;
    response: string;
    resolved: boolean;
    suggestion: string;
  }[];
  flowAnalysis: {
    phase: string;
    whatMatched: string;
    whatWasMissing: string;
    adjustment: string;
  }[];
  bridgePlan: BridgePlan; // Next Step logic
  ttessAlignment?: {
    dimension: string;
    score: number;
    evidence: string;
  }[];
  nextAdjustments: {
    keep: string[];
    adjust: string[];
    add: string[];
  };
}

export interface ExitTicketAnalysis {
  snapshot: {
    skill: string;
    totalStudents: number;
    masteryCriteria: string;
  };
  performanceBands: {
    gotIt: { count: number; names: string[] };
    almost: { count: number; names: string[] };
    notYet: { count: number; names: string[] };
  };
  misconceptionMapping: {
    primary: string;
    secondary: string;
    reteachStrategy: string;
  };
  bridgePlan: BridgePlan;
  nextDayPlan: {
    reteach: { strategy: string; example: string };
    reinforce: { strategy: string };
    extension: { task: string };
  };
  studentData: {
    name: string;
    score: number;
    suggestedTier: number;
    observation: string;
  }[];
}

export interface InstructionalReflectionReport {
  lessonInfo: { teacher: string; date: string; subject: string };
  implementationSnapshot: { phase: string; strengths: string; growthAreas: string }[];
  studentResults: { masteryRate: string; bands: string };
  bridgePlanHistory: string[];
  growthMindsetStatement: string;
  actionSteps: string[];
}

export interface GrowthTrendReport {
  overallTrend: string;
  metricSnapshots: { metric: string; value: string; trend: 'up' | 'down' | 'stable' }[];
  growthInsights: string[];
  ladderProgress: string; // Growth Ladder Rung summary
}

export interface LessonPlan {
  id: string;
  title: string;
  curriculum: 'Amplify' | 'Bluebonnet' | 'Other';
  content: string;
  status: 'draft' | 'analyzed' | 'rewritten';
  structuredRewrite?: StructuredLessonPlan;
}
