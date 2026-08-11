import axiosInstance from "@/lib/axios";
import { Page } from "@/types/pagination";

export type ContributionWeightRequest = {
  requestId: number;
  requestedBy: {
    userId: number;
    fullName: string;
  };
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proposedCodeWeight: number;
  proposedDocumentWeight: number;
  proposedDesignWeight: number;
  proposedTestingWeight: number;
  createdAt: string;
  course?: {
    courseId: number;
    courseCode: string;
    courseName: string;
  };
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
    return axiosInstance.get<never, Page<ContributionWeightRequest>>(
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
