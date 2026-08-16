export interface SprintBreakdown {
  sprintId: string;
  sprintName: string;
  sliceScore: number;
  sliceContributionPercentage: number;
  contributionPercentage: number;
  peerReviewCount?: number;
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
  testContributionScore: number;
  documentContributionScore: number;
  researchContributionScore: number;
  
  codeContributionPercentage: number;
  testContributionPercentage: number;
  documentContributionPercentage: number;
  researchContributionPercentage: number;

  sliceScore: number;
  sliceContributionPercentage: number;
  peerReviewScore: number;
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
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
  lastUpdatedAt: string | null;
}

export interface CourseContributionWeightRequest {
  codeWeight: number;
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
}

