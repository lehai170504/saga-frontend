import axiosInstance from "@/lib/axios";
import { TaskListResponse, TaskReadResponse, TaskQueryFilters } from "../types/task";

export const taskApi = {
  getProjectTasks: async (projectId: string, filters?: TaskQueryFilters) => {
    return axiosInstance.get<never, TaskListResponse>(
      `/api/v1/projects/${projectId}/tasks`,
      { params: filters }
    );
  },

  getTaskDetail: async (projectId: string, taskId: string) => {
    return axiosInstance.get<never, TaskReadResponse>(
      `/api/v1/projects/${projectId}/tasks/${taskId}`
    );
  }
};
