export type CreateTeamProjectRequest = {
  name: string;
};

export type ProjectResponse = {
  id: string;
  teamId: string;
  name: string;
};

export type Sprint = {
  sprintId: string;
  sprintName: string;
  externalSprintId: string | null;
  startDate: string | null;
  endDate: string | null;
  goal: string | null;
};

export type TeamSprintsResponse = {
  projectId: string;
  teamId: string;
  sprints: Sprint[];
};

export type ReviewCandidate = {
  studentId: string;
  fullName: string;
  studentCode: string;
  alreadyReviewed: boolean;
  existingReviewId: string | null;
  existingTotalStarRating: number | null;
};

export type SprintCandidatesResponse = {
  teamId: string;
  sprintId: string;
  reviewerId: string;
  candidates: ReviewCandidate[];
};

export type RubricCriterion = {
  rubricId: string;
  criteriaName: string;
  weight: number;
  description: string;
};

export type TeamRubricResponse = {
  teamId?: string;
  subjectId?: string;
  criteria: RubricCriterion[];
};

export type DefaultRubricResponse = {
  criteria: RubricCriterion[];
};

export interface GithubBranchInfo {
  name: string;
}

export interface GithubBranchesResponse {
  repositoryId: string;
  repositoryName: string;
  branches: {
    content: GithubBranchInfo[] | string[]; // Support string list or object list safely
    page: number;
    size: number;
    hasNext: boolean;
  };
}

export interface GithubCommitInfo {
  sha: string;
  message: string;
  authorName: string;
  authorLogin: string;
  authoredAt: string;
  committedAt: string;
  url: string;
}

export interface GithubCommitsResponse {
  repositoryId: string;
  repositoryName?: string;
  branch: string;
  commits: {
    content: GithubCommitInfo[];
    page: number;
    size: number;
    hasNext: boolean;
  };
}
