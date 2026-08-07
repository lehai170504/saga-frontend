import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import { TaskQueryFilters } from "../types/task";

export const useProjectTasks = (projectId: string, filters?: TaskQueryFilters) => {
  return useQuery({
    queryKey: ["project-tasks", projectId, filters],
    queryFn: () => taskApi.getProjectTasks(projectId, filters),
    enabled: !!projectId,
  });
};

export const useTaskDetail = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["project-task-detail", projectId, taskId],
    queryFn: () => taskApi.getTaskDetail(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
};
