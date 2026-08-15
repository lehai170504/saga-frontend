export type CreateTeamProjectRequest = {
  name: string;
  projectTypeId: string;
};

export type ProjectType = {
  projectTypeId: string;
  code: string;
  name: string;
  description?: string;
  criteriaConfig?: string;
};

export type ProjectResponse = {
  id: string;
  teamId: string;
  name: string;
  projectType: {
    projectTypeId: string;
    code: string;
    name: string;
  };
  description?: string | null;
  projectId?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ProjectDetailResponse = {
  projectId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  team: {
    teamId: string;
    teamName: string;
  };
  projectType: {
    projectTypeId: string;
    code: string;
    name: string;
  };
};

export type UpdateProjectGroupWeightsRequest = {
  groupId: string;
  codeWeight: number;
  testWeight: number;
  documentWeight: number;
  researchWeight: number;
  note?: string;
};

export type Sprint = {
  sprintId: string;
  sprintName: string;
  startDate: string | null;
  endDate: string | null;
  goal: string | null;
  state?: string;
};

export type TeamSprintsResponse = {
  projectId: string;
  teamId: string;
  sprints: Sprint[];
};

export interface BurndownPoint {
  date: string;
  idealRemaining: number;
  actualRemaining: number;
  doneCount: number;
}

export interface BurndownChartResponse {
  courseId: string;
  teamId: string;
  sprintId: string;
  sprintName: string;
  startDate: string;
  endDate: string;
  totalScope: number;
  points: BurndownPoint[];
}

export interface OverviewDayActivity {
  date: string;
  commits: number;
  peerReviews: number;
  comments: number;
  documents: number;
  tasks: number;
  totalActivities: number;
  totalScore: number;
}

export interface OverviewTotals {
  commits: number;
  peerReviews: number;
  comments: number;
  documents: number;
  tasks: number;
  totalActivities: number;
  totalScore: number;
}

export interface OverviewActivityResponse {
  courseId: string;
  teamId: string;
  startDate: string;
  endDate: string;
  days: OverviewDayActivity[];
  totals: OverviewTotals;
}

export interface HeatmapCell {
  date: string;
  commits: number;
  peerReviews: number;
  comments: number;
  documents: number;
  tasks: number;
  totalActivities: number;
  totalScore: number;
}

export interface HeatmapStudentRow {
  studentId: string;
  studentCode: string;
  fullName: string;
  commits: number;
  peerReviews: number;
  comments: number;
  documents: number;
  tasks: number;
  totalActivities: number;
  totalScore: number;
  cells: HeatmapCell[];
}

export interface HeatmapDaySummary {
  date: string;
  commits: number;
  peerReviews: number;
  comments: number;
  documents: number;
  tasks: number;
  totalActivities: number;
  totalScore: number;
}

export interface HeatmapChartResponse {
  courseId: string;
  teamId: string;
  studentId?: string;
  startDate: string;
  endDate: string;
  students: HeatmapStudentRow[];
  days: HeatmapDaySummary[];
}

export interface InteractionNode {
  studentId: string;
  studentCode: string;
  fullName: string;
  degree: number;
}

export interface InteractionEdge {
  fromStudentId: string;
  toStudentId: string;
  sourceType: "REVIEWED" | "COMMENTED_ON" | "ASSIGNED_TO" | "COLLABORATED_WITH" | string;
  sourceCount: number;
  directed: boolean;
}

export interface StudentInteractionResponse {
  courseId: string;
  teamId: string;
  studentId: string;
  nodes: InteractionNode[];
  edges: InteractionEdge[];
}

export type ReviewCandidate = {
  studentId: string;
  fullName: string;
  studentCode: string;
  alreadyReviewed: boolean;
  existingReviewId: string | null;
  existingTotalStarRating: number | null;
  existingCreatedAt?: string | null;
};

export type SubmitPeerReviewRequest = {
  revieweeId: string;
  starRating?: number;
  criteriaRatings?: { rubricId: string; starRating: number }[];
  comment: string;
  createdAt?: string;
};

export type PeerReviewItem = {
  id?: string;
  sprintId?: string;
  sprintName?: string;
  reviewerId?: string;
  reviewerName?: string;
  revieweeId?: string;
  revieweeName?: string;
  starRating?: number;
  criteriaRatings?: { rubricId: string; criteriaName?: string; starRating: number }[];
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SprintPeerReviewsResponse = {
  sprintId?: string;
  sprintName?: string;
  teamId?: string;
  reviews: PeerReviewItem[];
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

export interface GithubIssueInfo {
  issueId: string;
  githubIssueId?: number;
  number: number;
  title: string;
  state: string;
  authorLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  url?: string;
  repositoryId?: number;
}

export interface GithubIssuesResponse {
  projectId: string;
  repositoryId?: number;
  issues: {
    content: GithubIssueInfo[];
    page: number;
    size: number;
    hasNext: boolean;
  };
}

export interface ProjectDashboardStatsResponse {
  projectId: string;
  generatedAt: string;
  tasks: {
    total: number;
    completed: number;
    incomplete: number;
    completionPercentage: number;
  };
  github: {
    repositoryCount: number;
    commitCount: number;
    pullRequestCount: number;
  };
}

export type JiraTaskComponent = {
  id: string;
  name: string;
};

export type JiraTaskSprint = {
  id: string;
  name: string;
  externalSprintId: string | null;
};

export type JiraTaskActor = {
  id: string;
  fullName: string;
  studentCode: string;
};

export type JiraTask = {
  id: string;
  projectId: string;
  externalId: string;
  externalKey: string;
  title: string;
  type: string;
  issueType?: string;
  issue_type?: string;
  status: string;
  priority: string;
  storyPoint: number;
  storyPoints?: number;
  story_point?: number;
  estimation?: number;
  dueDate: string | null;
  externalUpdatedAt: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  description: string | null;
  labels: string[];
  components: JiraTaskComponent[];
  sprint: JiraTaskSprint | null;
  assignee: JiraTaskActor | null;
  reporter: JiraTaskActor | null;
  blocksTaskId: string | null;
};

export type ProjectTasksResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: JiraTask[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export * from "./githubIssue";
export * from "./traceability";
