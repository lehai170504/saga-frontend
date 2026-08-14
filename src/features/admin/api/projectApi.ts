import axiosInstance from "@/lib/axios";
import { PageResponse } from "./userApi";

export interface AdminProjectResponse {
  id: string;
  name: string;
  description: string;
  course: {
    id: string;
    courseCode: string;
    name: string;
  };
  jira: {
    connectionStatus: string;
  };
  gitHub: {
    repositoryCount: number;
    activeRepositoryCount: number;
  };
}

export interface ProjectFilterParams {
  page?: number;
  size?: number;
}

export interface ProjectDetailResponse {
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  team: {
    teamId: string;
    teamName: string;
  };
}

export interface ProjectStatsResponse {
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

export interface CreateProjectResponse {
  id: string;
  teamId: string;
  name: string;
  projectType?: {
    projectTypeId: string;
    code: string;
    name: string;
  };
}

export interface UpdateGroupWeightPayload {
  groupId: string;
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
  note?: string;
}

export const projectApi = {
  getProjects: (params?: ProjectFilterParams) => {
    return axiosInstance.get<never, PageResponse<AdminProjectResponse>>("/api/admin/projects", { params });
  },
  getProjectDetail: (projectId: string) => {
    return axiosInstance.get<never, ProjectDetailResponse>(`/api/projects/${projectId}`);
  },
  updateProject: (projectId: string, data: { name: string; description: string }) => {
    return axiosInstance.put<never, ProjectDetailResponse>(`/api/projects/${projectId}`, data);
  },
  getProjectStats: (projectId: string) => {
    return axiosInstance.get<never, ProjectStatsResponse>(`/api/projects/${projectId}/dashboard-stats`);
  },
  createProject: (teamId: string, data: { name: string; projectTypeId: string; description?: string }) => {
    return axiosInstance.post<never, CreateProjectResponse>(`/api/teams/${teamId}/projects`, data);
  },
  updateGroupWeights: (projectId: string, data: UpdateGroupWeightPayload) => {
    return axiosInstance.put<never, void>(`/api/projects/${projectId}/group-weights`, data);
  }
};
