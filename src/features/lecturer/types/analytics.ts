export interface ProjectBasicInfo {
  id: string;
  name: string;
}

export interface StudentBasicInfo {
  courseId: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  team: {
    teamId: string;
    teamName: string;
    roleInTeam: "LEADER" | "MEMBER" | "MENTOR";
  } | null;
}

export interface TeamMemberResponse {
  studentId: string;
  fullName: string;
  studentCode: string;
  roleInTeam: string;
}

export interface Page<T> {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface TeamDetail {
  courseId: string;
  teamId: string;
  teamName: string;
  project: ProjectBasicInfo | null;
  members: Page<TeamMemberResponse>;
}

export interface StudentProgress {
  courseId: string;
  studentId: string;
  teamId: string;
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  overallCompletionRate: number;
  totalCommits: number;
  taskDistribution: Record<string, number>;
  unclassifiedTasks: number;
}

export interface StudentActivity {
  sourceId: string;
  type: string;
  occurredAt: string;
  title: string;
  projectId: string;
  sprintId: string;
}

export interface StudentActivitiesResponse {
  courseId: string;
  studentId: string;
  activities: Page<StudentActivity>;
}

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

export interface StudentContributionAggregate {
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
}

export interface StudentContributionDetailResponse {
  courseId: string;
  studentId: string;
  teamId: string;
  projectId: string;
  currentAggregate: StudentContributionAggregate;
}

export interface EarlyWarning {
  studentId: string;
  teamId: string;
  signalType: "OVERDUE_TASK";
  severity: string | null;
  message: string;
}

export interface InteractionNode {
  id: string;
  label: string;
  group?: string;
}

export interface InteractionEdge {
  from: string;
  to: string;
  weight: number;
}

export interface TeamInteraction {
  nodes: InteractionNode[];
  edges: InteractionEdge[];
}

export interface HeatmapData {
  date: string;
  commits: number;
}

export interface SprintVelocity {
  sprintId: string;
  sprintName: string;
  currentPlannedPoints: number;
  completedPoints: number;
  nullPointCount: number;
  bugsCount: number;
}
