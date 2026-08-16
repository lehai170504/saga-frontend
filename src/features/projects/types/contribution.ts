export type ContributionWarning =
  | "NO_PEER_REVIEW"
  | "LOW_PEER_REVIEW"
  | "INSUFFICIENT_EVIDENCE"
  | "NO_EVIDENCE";

// ==========================================
// 1. Contribution Evaluation Types
// ==========================================

export interface ContributionSprintBreakdown {
  sprintId?: string;
  sprintName?: string;
  codeStoryPoints: number;
  testStoryPoints: number;
  documentStoryPoints: number;
  researchStoryPoints: number;
  contributionPercentage: number;
}

export interface ContributionMemberEvaluation {
  studentId: string;
  fullName: string;
  studentCode: string;
  codeContributionPercentage: number;
  testContributionPercentage: number;
  documentContributionPercentage: number;
  researchContributionPercentage: number;
  finalContributionPercentage: number;
  sliceScore: number;
  sliceContributionPercentage: number;
  peerReviewScore: number;
  sprintBreakdowns: ContributionSprintBreakdown[];
  warnings: ContributionWarning[];
}

export interface ContributionEvaluationResponse {
  teamId: string;
  projectId: string;
  evaluatedAt: string;
  members: ContributionMemberEvaluation[];
}

// ==========================================
// 2. Contribution Graph Types
// ==========================================

export interface GraphWeights {
  CODE?: { ratio: number; percent: number };
  TEST?: { ratio: number; percent: number };
  DOCUMENT?: { ratio: number; percent: number };
  RESEARCH?: { ratio: number; percent: number };
}

export interface BaseGraphNode {
  id: string;
  kind: "CRITERION" | "STUDENT";
}

export interface CriterionGraphNode extends BaseGraphNode {
  kind: "CRITERION";
  criterion: string; // CODE, TEST, DOCUMENT, RESEARCH
  weightRatio: number;
  weightPercent: number;
}

export interface StudentGraphNode extends BaseGraphNode {
  kind: "STUDENT";
  studentId: string;
  fullName: string;
  studentCode: string;
  roleInTeam: string;
  sliceScore: number;
  peerCoefficient: number;
  adjustedScore: number;
  finalContributionPercentage: number;
  warnings: ContributionWarning[];
}

export type ContributionGraphNode = CriterionGraphNode | StudentGraphNode;

export interface GraphEdgeTask {
  externalKey: string;
  title: string;
  sprintName: string;
  storyPoints: number;
}

export interface ContributionGraphEdge {
  id: string;
  source: string; // criterion node id
  target: string; // student node id
  storyPoints: number;
  weightedSlice: number;
  tasks: GraphEdgeTask[];
}

export interface ContributionGraphResponse {
  teamId: string;
  projectId: string;
  evaluatedAt: string;
  formula: string;
  weights: GraphWeights;
  nodes: ContributionGraphNode[];
  edges: ContributionGraphEdge[];
}
