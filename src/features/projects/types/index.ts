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
