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

export interface RubricCriteriaRequest {
  criteriaName: string;
  weight: number;
  description: string;
}

export const rubricApi = {
  getDefaultRubric: () => {
    return axiosInstance.get<never, PeerReviewDefaultRubricResponse>("/api/v1/peer-review-rubrics/default");
  },

  createRubricCriteria: (data: RubricCriteriaRequest) => {
    return axiosInstance.post<never, RubricCriteria>("/api/admin/peer-review-rubrics", data);
  },

  updateRubricCriteria: (id: string, data: RubricCriteriaRequest) => {
    return axiosInstance.put<never, RubricCriteria>(`/api/admin/peer-review-rubrics/${id}`, data);
  },

  deleteRubricCriteria: (id: string) => {
    return axiosInstance.delete<never, void>(`/api/admin/peer-review-rubrics/${id}`);
  },
};
