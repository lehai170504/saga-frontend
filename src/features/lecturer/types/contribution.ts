export interface SprintBreakdown {
  sprintId: string;
  sprintName: string;
  taskScore: number;
  retrospectiveMultiplier: number;
  adjustedTaskScore: number;
  peerReviewCount: number;
}

export interface ContributionWarning {
  code: string;
  message: string;
  severity: string;
}

export interface ContributionMember {
  studentId: string;
  fullName: string;
  studentCode: string;
  codeContributionScore: number;
  documentContributionScore: number;
  designContributionScore: number;
  codeContributionPercentage: number;
  documentContributionPercentage: number;
  designContributionPercentage: number;
  peerReviewScore: number;
  taskContributionScore: number;
  taskContributionPercentage: number;
  finalContributionPercentage: number;
  evidenceCount: number;
  sprintBreakdowns: SprintBreakdown[];
  warnings: ContributionWarning[];
  // Optional frontend fields
  role?: string;
  email?: string;
}

export interface ContributionEvaluationResponse {
  teamId: string;
  projectId: string | null;
  evaluatedAt: string;
  members: ContributionMember[];
}

export interface ContributionAdjustment {
  studentId: string;
  adjustmentPercentage: number;
  proposedPercentage: number; // added this to store absolute value
  note: string;
}

export interface ContributionOverrideRequest {
  studentId: string;
  proposedPercentage: number;
  reason: string;
}

export interface CourseContributionWeightResponse {
  courseId: string;
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
  lastUpdatedAt: string | null;
}

export interface CourseContributionWeightRequest {
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
}

