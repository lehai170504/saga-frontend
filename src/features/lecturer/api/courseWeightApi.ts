import axiosInstance from "@/lib/axios";

export interface CourseWeightResponse {
  courseId: string;
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
  lastUpdatedAt?: string;
}

export interface UpdateCourseWeightPayload {
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
}

export const courseWeightApi = {
  getCourseWeights: async (courseId: string) => {
    return axiosInstance.get<never, CourseWeightResponse>(`/api/v1/courses/${courseId}/contribution-slice-weights`);
  },
  updateCourseWeights: async (courseId: string, payload: UpdateCourseWeightPayload) => {
    return axiosInstance.put<never, CourseWeightResponse>(`/api/v1/courses/${courseId}/contribution-slice-weights`, payload);
  }
};
