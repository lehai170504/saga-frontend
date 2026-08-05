export interface ProjectBasicInfo {
  id: string;
  name: string;
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
  teamId: string;
  teamName: string;
  project: ProjectBasicInfo | null;
  members: Page<TeamMemberResponse>;
}

export interface TaskDistribution {
  type: string;
  count: number;
}

export interface StudentProgress {
  overallCompletionRate: number;
  taskDistribution: TaskDistribution[];
  totalCommits: number;
  totalIssuesResolved: number;
  unclassifiedTaskCount: number;
}

export interface StudentActivity {
  type: "COMMIT" | "DOCUMENT";
  sourceId: string;
  message: string;
  timestamp: string;
}

export interface StudentContributionDetail {
  studentId: string;
  codeContributionPercentage: number;
  documentContributionPercentage: number;
  designContributionPercentage: number;
  taskContributionPercentage: number;
  finalContributionPercentage: number;
  peerReviewScore: number;
  evidenceCount: number;
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
