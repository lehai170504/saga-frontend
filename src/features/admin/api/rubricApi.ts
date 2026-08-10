import axiosInstance from "@/lib/axios";

export interface RubricCriteria {
  rubricId: string;
  criteriaName: string;
  weight: number;
  description: string;
}

export interface PeerReviewDefaultRubricResponse {
  criteria: RubricCriteria[];
}

export const rubricApi = {
  getDefaultRubric: () => {
    return axiosInstance.get<never, PeerReviewDefaultRubricResponse>("/api/v1/peer-review-rubrics/default");
  }
};
