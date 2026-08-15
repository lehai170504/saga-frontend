import axiosInstance from "@/lib/axios";

export interface ProjectType {
  projectTypeId: string;
  code: string;
  name: string;
  description: string;
  criteriaConfig: string | null;
}

export const projectTypeApi = {
  getProjectTypes: async (): Promise<ProjectType[]> => {
    return axiosInstance.get<never, ProjectType[]>("/api/project-types");
  }

};
