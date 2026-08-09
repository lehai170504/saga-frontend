import axiosInstance from "@/lib/axios";
import { PageResponse } from "./userApi";

export interface AdminTeamResponse {
  id: string;
  name: string;
  course: {
    id: string;
    courseCode: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  };
}

export interface TeamFilterParams {
  page?: number;
  size?: number;
}

export const teamApi = {
  getTeams: (params?: TeamFilterParams) => {
    return axiosInstance.get<never, PageResponse<AdminTeamResponse>>("/api/admin/teams", { params });
  }
};
