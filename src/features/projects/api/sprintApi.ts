import axiosInstance from "@/lib/axios";
import { TeamSprintsResponse, SprintCandidatesResponse, TeamRubricResponse, DefaultRubricResponse } from "../types";

export const sprintApi = {
  getTeamSprints: async (teamId: string) => {
    return axiosInstance.get<never, TeamSprintsResponse>(`/api/v1/teams/${teamId}/sprints`);
  },

  getTeamSprintCandidates: async (teamId: string, sprintId: string) => {
    return axiosInstance.get<never, SprintCandidatesResponse>(`/api/v1/teams/${teamId}/sprints/${sprintId}/peer-reviews/candidates`);
  },

  getTeamRubric: async (teamId: string) => {
    return axiosInstance.get<never, TeamRubricResponse>(`/api/v1/teams/${teamId}/peer-review-rubric`);
  },

  getDefaultRubric: async () => {
    return axiosInstance.get<never, DefaultRubricResponse>(`/api/v1/peer-review-rubrics/default`);
  },

  submitPeerReview: async (teamId: string, sprintId: string, data: { revieweeId: string; starRating?: number; criteriaRatings?: { rubricId: string; starRating: number }[]; comment: string }) => {
    return axiosInstance.post<never, unknown>(`/api/v1/teams/${teamId}/sprints/${sprintId}/peer-reviews`, data);
  }
};
