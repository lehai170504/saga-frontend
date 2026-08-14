import axiosInstance from "@/lib/axios";

export type ContributionWeightRequest = {
  requestId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  lecturerId: string;
  lecturerName: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proposedCodeWeight?: number;
  proposedDocumentWeight?: number;
  proposedDesignWeight?: number;
  proposedTestingWeight?: number;
  createdAt: string;
  resolvedAt: string | null;
};

export type WeightRequestsResponse = {
  courseId: number;
  courseCode: string;
  courseName: string;
  requests: ContributionWeightRequest[];
};

export type DecideWeightRequestPayload = {
  decision: "APPROVED" | "REJECTED";
  feedbackMessage?: string;
};

export type CourseWeightsResponse = {
  courseId: string;
  courseCode: string;
  courseName: string;
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
  testingWeight: number;
};

export type RequestCourseWeightPayload = {
  codeWeight: number;
  documentWeight: number;
  designWeight: number;
  reason: string;
  lecturerId: string;
};

export const contributionWeightApi = {
  getWeightRequests: async (status?: string) => {
    return axiosInstance.get<never, ContributionWeightRequest[]>(
      `/api/v1/courses/contribution-slice-weight-requests`,
      {
        params: { status }
      }
    );
  },

  decideWeightRequest: async (requestId: string | number, data: DecideWeightRequestPayload) => {
    return axiosInstance.put<never, void>(
      `/api/v1/courses/contribution-slice-weight-requests/${requestId}/decision`,
      data
    );
  },

  getCourseWeights: async (courseId: string) => {
    return axiosInstance.get<never, CourseWeightsResponse>(
      `/api/v1/courses/${courseId}/contribution-slice-weights`
    );
  },

  requestCourseWeightChange: async (courseId: string, data: RequestCourseWeightPayload) => {
    return axiosInstance.post<never, void>(
      `/api/v1/courses/${courseId}/contribution-slice-weight-requests`,
      data
    );
  }
};
