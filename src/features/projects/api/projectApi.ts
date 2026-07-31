import axiosInstance from "@/lib/axios";
import { CreateTeamProjectRequest, ProjectResponse } from "../types";

export const projectApi = {
  createTeamProject: async (teamId: string, data: CreateTeamProjectRequest) => {
    return axiosInstance.post<never, ProjectResponse>(`/api/teams/${teamId}/projects`, data);
  }
};
