import axiosInstance from "@/lib/axios";

export interface SprintPeerReviewResponse {
  sprintId: string;
  teamId: string;
  reviews: any[]; // Depending on the actual DTO, simplifying here for Admin view
}

export const adminPeerReviewApi = {
  getSprintPeerReviews: async (teamId: string, sprintId: string) => {
    return axiosInstance.get<never, SprintPeerReviewResponse>(
      `/api/v1/teams/${teamId}/sprints/${sprintId}/peer-reviews`
    );
  }
};
