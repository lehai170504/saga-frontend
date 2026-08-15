import axiosInstance from "@/lib/axios";

export interface ProjectType {
  projectTypeId: string;
  code: string;
  name: string;
  description: string;
  criteriaConfig: string;
}

export interface CreateProjectTypePayload {
  code: string;
  name: string;
  description: string;
  criteriaConfig: string;
}

export const projectTypeApi = {
  getProjectTypes: async (): Promise<ProjectType[]> => {
    return axiosInstance.get<never, ProjectType[]>("/api/project-types");
  },

  createProjectType: async (payload: CreateProjectTypePayload): Promise<ProjectType> => {
    return axiosInstance.post<never, ProjectType>("/api/project-types", payload);
  },
};
