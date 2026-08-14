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

export interface UpdateProjectTypePayload extends CreateProjectTypePayload {
  projectTypeId: string;
}

export const projectTypeApi = {
  getProjectTypes: async (): Promise<ProjectType[]> => {
    const { data } = await axiosInstance.get("/api/project-types");
    return data;
  },

  createProjectType: async (payload: CreateProjectTypePayload): Promise<ProjectType> => {
    const { data } = await axiosInstance.post("/api/project-types", payload);
    return data;
  },

  updateProjectType: async (payload: UpdateProjectTypePayload): Promise<ProjectType> => {
    const { projectTypeId, ...rest } = payload;
    const { data } = await axiosInstance.put(`/api/project-types/${projectTypeId}`, rest);
    return data;
  },

  deleteProjectType: async (projectTypeId: string): Promise<void> => {
    await axiosInstance.delete(`/api/project-types/${projectTypeId}`);
  },
};
