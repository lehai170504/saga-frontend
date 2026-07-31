import axiosInstance from "@/lib/axios";
import {
  ProjectIntegrationsResponse,
  JiraProjectLinkRequest,
  GitHubRepositoriesLinkRequest,
  SyncStatusResponse,
} from "../types";

export const projectIntegrationApi = {
  getProjectIntegrations: async (projectId: string) => {
    return axiosInstance.get<never, ProjectIntegrationsResponse>(`/api/projects/${projectId}/integrations`);
  },

  linkJiraProject: async (projectId: string, data: JiraProjectLinkRequest) => {
    return axiosInstance.post<never, ProjectIntegrationsResponse>(`/api/projects/${projectId}/jira/link`, data);
  },

  deleteJiraIntegration: async (projectId: string) => {
    return axiosInstance.delete(`/api/projects/${projectId}/jira`);
  },

  linkGithubRepositories: async (projectId: string, data: GitHubRepositoriesLinkRequest) => {
    return axiosInstance.post<never, ProjectIntegrationsResponse>(`/api/projects/${projectId}/github/repositories`, data);
  },

  deleteGithubRepository: async (projectId: string, repositoryId: number) => {
    return axiosInstance.delete(`/api/projects/${projectId}/github/repositories/${repositoryId}`);
  },

  getSyncStatus: async (projectId: string) => {
    return axiosInstance.get<never, SyncStatusResponse>(`/api/projects/${projectId}/sync-status`);
  },
};
