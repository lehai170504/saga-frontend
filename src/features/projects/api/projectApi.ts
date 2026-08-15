import axiosInstance from "@/lib/axios";
import { CreateTeamProjectRequest, ProjectResponse, GithubBranchesResponse, GithubCommitsResponse, GithubIssuesResponse, ProjectDashboardStatsResponse, ProjectType, UpdateProjectGroupWeightsRequest } from "../types";

export const projectApi = {
  createTeamProject: async (teamId: string, data: CreateTeamProjectRequest) => {
    return axiosInstance.post<never, ProjectResponse>(`/api/teams/${teamId}/projects`, data);
  },
  getProjectDetail: async (projectId: string) => {
    return axiosInstance.get<never, ProjectResponse>(`/api/projects/${projectId}`);
  },
  updateProjectDetail: async (projectId: string, data: { name: string; description: string | null; projectTypeId?: string }) => {
    return axiosInstance.put<never, ProjectResponse>(`/api/projects/${projectId}`, data);
  },
  getProjectTypes: async () => {
    return axiosInstance.get<never, ProjectType[]>('/api/project-types');
  },
  createProjectType: async (data: Omit<ProjectType, 'projectTypeId'>) => {
    return axiosInstance.post<never, ProjectType>('/api/project-types', data);
  },
  updateProjectGroupWeights: async (projectId: string, data: UpdateProjectGroupWeightsRequest) => {
    return axiosInstance.put<never, any>(`/api/projects/${projectId}/group-weights`, data);
  },
  getGithubBranches: async (projectId: string, repositoryId: string, page = 0, size = 100) => {
    return axiosInstance.get<never, GithubBranchesResponse>(`/api/projects/${projectId}/github/repositories/${repositoryId}/branches`, {
      params: { page, size }
    });
  },
  getGithubCommits: async (projectId: string, repositoryId: string, branch: string, page = 0, size = 20) => {
    return axiosInstance.get<never, GithubCommitsResponse>(`/api/projects/${projectId}/github/repositories/${repositoryId}/commits`, {
      params: { branch, page, size }
    });
  },
  getGithubIssues: async (projectId: string, repositoryId?: string, page = 0, size = 20) => {
    return axiosInstance.get<never, GithubIssuesResponse>(`/api/projects/${projectId}/github/issues`, {
      params: { repositoryId, page, size }
    });
  },
  getProjectDashboardStats: async (projectId: string) => {
    return axiosInstance.get<never, ProjectDashboardStatsResponse>(`/api/projects/${projectId}/dashboard-stats`);
  }
};
