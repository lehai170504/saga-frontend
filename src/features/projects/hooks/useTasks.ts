import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { GetTasksParams } from "../api/taskApi";

export const useProjectTasks = (projectId: string, filters?: GetTasksParams) => {
  return useQuery({
    queryKey: ["project-tasks", projectId, filters],
    queryFn: () => taskApi.getProjectTasks(projectId, filters),
    enabled: !!projectId,
  });
};

export const useTaskDetail = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["project-task-detail", projectId, taskId],
    queryFn: () => taskApi.getTaskById(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};
