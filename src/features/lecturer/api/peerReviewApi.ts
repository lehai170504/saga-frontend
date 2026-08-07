import axiosInstance from "@/lib/axios";
import {
  PeerReviewDefaultRubricResponse,
  PeerReviewRubricResponse,
  SprintPeerReviewResponse
} from "../types/peer-review";

export const lecturerPeerReviewApi = {
  getDefaultRubric: async () => {
    return axiosInstance.get<never, PeerReviewDefaultRubricResponse>(
      `/api/v1/peer-review-rubrics/default`
    );
  },

  getTeamRubric: async (teamId: string) => {
    return axiosInstance.get<never, PeerReviewRubricResponse>(
      `/api/v1/teams/${teamId}/peer-review-rubric`
    );
  },

  getSprintPeerReviews: async (teamId: string, sprintId: string) => {
    return axiosInstance.get<never, SprintPeerReviewResponse>(
      `/api/v1/teams/${teamId}/sprints/${sprintId}/peer-reviews`
    );
  }
};
