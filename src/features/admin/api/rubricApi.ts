import axiosInstance from "@/lib/axios";

export interface RubricItem {
  star: number;
  label: string;
  description: string;
  adjustmentFactor: number;
}

export interface PeerReviewDefaultRubricResponse {
  id?: string;
  items: RubricItem[];
  requireLowScoreComment: boolean;
  requireHighScoreComment: boolean;
}

export const rubricApi = {
  getDefaultRubric: () => {
    return axiosInstance.get<never, PeerReviewDefaultRubricResponse>("/api/v1/peer-review-rubrics/default");
  },
};
