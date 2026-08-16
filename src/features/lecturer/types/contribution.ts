export interface SprintBreakdown {
  sprintId: string;
  sprintName: string;
  taskScore: number;
  retrospectiveMultiplier: number;
  adjustedTaskScore: number;
  peerReviewCount: number;
  sliceScore?: number;
  sliceContributionPercentage?: number;
  contributionPercentage?: number;
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
  testContributionPercentage: number;
  documentContributionScore: number;
  researchContributionScore?: number;
  codeContributionPercentage: number;
  documentContributionPercentage: number;
  researchContributionPercentage?: number;
  peerReviewScore: number;
  taskContributionScore: number;
  taskContributionPercentage: number;
  finalContributionPercentage: number;
  sliceScore?: number;
  sliceContributionPercentage?: number;
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

export interface CourseContributionModeRequest {
  mode: "COURSE" | "TEAM";
}

export interface TeamContributionWeightItem {
  teamId: string;
  teamName: string;
  projectId: string;
  projectName: string;
  projectTypeId: string;
  projectTypeCode: string;
  projectTypeName: string;
  source: string;
  codeWeight: number;
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
}

export interface CourseContributionTeamWeightResponse {
  courseId: string;
  mode: "COURSE" | "TEAM";
  teams: TeamContributionWeightItem[];
}

