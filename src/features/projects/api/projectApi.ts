import axiosInstance from "@/lib/axios";
import { CreateTeamProjectRequest, ProjectResponse, GithubBranchesResponse, GithubCommitsResponse, GithubIssuesResponse } from "../types";

export const projectApi = {
  createTeamProject: async (teamId: string, data: CreateTeamProjectRequest) => {
    return axiosInstance.post<never, ProjectResponse>(`/api/teams/${teamId}/projects`, data);
  },
  getProjectDetail: async (projectId: string) => {
    return axiosInstance.get<never, { projectId: string; name: string; description: string | null; createdAt: string; updatedAt: string }>(`/api/projects/${projectId}`);
  },
  updateProjectDetail: async (projectId: string, data: { name: string; description: string | null }) => {
    return axiosInstance.put<never, ProjectResponse>(`/api/projects/${projectId}`, data);
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
  }
};
