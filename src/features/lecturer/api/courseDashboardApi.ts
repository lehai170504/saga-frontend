import axiosInstance from "@/lib/axios";

// ---------------------------------------------------------
// 1. Trends Types
// ---------------------------------------------------------
export interface TrendSprint {
  sprintId: string;
  sprintName: string;
  sprintState: string;
  startDate: string;
  endDate: string;
  teamId: string;
  teamName: string;
  totalTasks: number;
  completedTasks: number;
  currentPlannedStoryPoints: number;
  currentCompletedStoryPoints: number;
  tasksWithoutStoryPoints: number;
  totalSlicesGenerated: number;
}

export interface TrendsResponse {
  courseId: string;
  sprints: TrendSprint[];
}

// ---------------------------------------------------------
// 2. Teams Progress Types
// ---------------------------------------------------------
export interface CurrentSprint {
  sprintId: string;
  sprintName: string;
  state: string;
  startDate: string;
  endDate: string;
}

export interface TeamProgress {
  teamId: string;
  teamName: string;
  projectId: string;
  currentSprint: CurrentSprint;
  currentSprintTaskCount: number;
  currentSprintDoneTaskCount: number;
  currentSprintPlannedStoryPoints: number;
  currentSprintCompletedStoryPoints: number;
  currentSprintTasksWithoutStoryPoints: number;
  projectCommitCount: number;
  healthStatus: string;
}

export interface TeamsProgressResponse {
  courseId: string;
  teams: TeamProgress[];
}

// ---------------------------------------------------------
// 3. Contribution Summary Types
// ---------------------------------------------------------
export interface ContributionSummaryResponse {
  courseId: string;
  teamCount: number;
  totalStudents: number;
  totalStudentsWithTeam: number;
  totalStudentsWithoutTeam: number;
  totalSlicesGenerated: number;
}

// ---------------------------------------------------------
// 4. At-Risk Summary Types
// ---------------------------------------------------------
export interface WarningDistribution {
  [key: string]: number; // e.g. "OVERDUE_TASK": 5
}

export interface StudentRisk {
  studentId: string;
  teamId: string;
  warningCount: number;
  warningDistribution: WarningDistribution;
  riskLevel: string;
}

export interface AtRiskSummaryResponse {
  courseId: string;
  totalWarnings: number;
  affectedStudents: number;
  affectedTeams: number;
  warningDistribution: WarningDistribution;
  students: StudentRisk[];
}

// ---------------------------------------------------------
// API Client
// ---------------------------------------------------------
export const courseDashboardApi = {
  getTeamsProgress: async (courseId: string) => {
    return axiosInstance.get<never, TeamsProgressResponse>(`/api/v1/courses/${courseId}/dashboard/teams-progress`);
  },

  getContributionSummary: async (courseId: string) => {
    return axiosInstance.get<never, ContributionSummaryResponse>(`/api/v1/courses/${courseId}/dashboard/contribution-summary`);
  },

  getTrends: async (courseId: string) => {
    return axiosInstance.get<never, TrendsResponse>(`/api/v1/courses/${courseId}/dashboard/trends`);
  },

  getAtRiskSummary: async (courseId: string) => {
    return axiosInstance.get<never, AtRiskSummaryResponse>(`/api/v1/courses/${courseId}/dashboard/at-risk-summary`);
  }
};
