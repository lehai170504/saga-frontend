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

export const projectApi = {
  getProjects: (params?: ProjectFilterParams) => {
    return axiosInstance.get<never, PageResponse<AdminProjectResponse>>("/api/admin/projects", { params });
  }
};
