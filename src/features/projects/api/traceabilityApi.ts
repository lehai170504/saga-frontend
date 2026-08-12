import axiosInstance from "@/lib/axios";
import { TaskTraceability, ProjectTraceability } from "../types/traceability";

export const traceabilityApi = {
  linkTaskIssue: async (
    projectId: string,
    taskId: string,
    issueId: string,
    idempotencyKey: string
  ): Promise<void> => {
    return axiosInstance.post(
      `/api/v1/projects/${projectId}/tasks/${taskId}/github-issues/${issueId}`,
      {},
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
  },

  unlinkTaskIssue: async (
    projectId: string,
    taskId: string,
    issueId: string,
    idempotencyKey: string
  ): Promise<void> => {
    return axiosInstance.delete(
      `/api/v1/projects/${projectId}/tasks/${taskId}/github-issues/${issueId}`,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
  },

  getTaskTraceability: async (
    projectId: string,
    taskId: string
  ) => {
    return axiosInstance.get<never, TaskTraceability>(
      `/api/v1/projects/${projectId}/tasks/${taskId}/traceability`
    );
  },

  getProjectTraceability: async (
    projectId: string
  ) => {
    return axiosInstance.get<never, ProjectTraceability>(`/api/projects/${projectId}/traceability`);
  },
};
