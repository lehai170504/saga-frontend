import axiosInstance from "@/lib/axios";

export interface SprintSummaryResponse {
  sprintId: string;
  sprintName: string;
  externalSprintId: string | null;
  startDate: string | null;
  endDate: string | null;
  goal: string | null;
}

export interface SprintListResponse {
  projectId: string;
  teamId: string | null;
  sprints: SprintSummaryResponse[];
}

export const adminSprintApi = {
  getTeamSprints: async (teamId: string) => {
    return axiosInstance.get<never, SprintListResponse>(
      `/api/v1/teams/${teamId}/sprints`
    );
  }
};
