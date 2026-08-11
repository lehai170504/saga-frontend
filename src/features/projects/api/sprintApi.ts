import axiosInstance from "@/lib/axios";
import { TeamSprintsResponse, SprintCandidatesResponse, TeamRubricResponse, Sprint } from "../types";

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



  submitPeerReview: async (teamId: string, sprintId: string, data: { revieweeId: string; starRating?: number; criteriaRatings?: { rubricId: string; starRating: number }[]; comment: string }) => {
    return axiosInstance.post<never, unknown>(`/api/v1/teams/${teamId}/sprints/${sprintId}/peer-reviews`, data);
  },

  getProjectSprints: async (projectId: string) => {
    return axiosInstance.get<never, TeamSprintsResponse>(`/api/v1/projects/${projectId}/sprints`);
  },

  createSprint: async (projectId: string, data: { name: string; goal: string; startDate: string | null; endDate: string | null }, idempotencyKey: string) => {
    return axiosInstance.post<never, Sprint>(`/api/v1/projects/${projectId}/sprints`, data, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  startSprint: async (projectId: string, sprintId: string, idempotencyKey: string) => {
    return axiosInstance.post<never, Sprint>(`/api/v1/projects/${projectId}/sprints/${sprintId}/start`, {}, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  closeSprint: async (projectId: string, sprintId: string, idempotencyKey: string) => {
    return axiosInstance.post<never, Sprint>(`/api/v1/projects/${projectId}/sprints/${sprintId}/close`, {}, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  updateSprint: async (projectId: string, sprintId: string, data: { name: string; goal: string; startDate: string | null; endDate: string | null }, idempotencyKey: string) => {
    return axiosInstance.put<never, Sprint>(`/api/v1/projects/${projectId}/sprints/${sprintId}`, data, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  deleteSprint: async (projectId: string, sprintId: string, idempotencyKey: string) => {
    return axiosInstance.delete(`/api/v1/projects/${projectId}/sprints/${sprintId}`, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  }
};
