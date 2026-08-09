import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, GetTasksParams, CreateTaskRequest, UpdateTaskRequest } from "../api/taskApi";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useProjectTasks = (projectId: string, params?: GetTasksParams) => {
  return useQuery({
    queryKey: ["project-tasks", projectId, params],
    queryFn: () => taskApi.getProjectTasks(projectId, params),
    enabled: !!projectId
  });
};

export const useCreateTask = (projectId: string, sprintId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      data, 
      idempotencyKey, 
      assignIdempotencyKey 
    }: { 
      data: CreateTaskRequest; 
      idempotencyKey: string; 
      assignIdempotencyKey: string; 
    }) => {
      const newTask = await taskApi.createTask(projectId, data, idempotencyKey);
      if (sprintId && sprintId !== "ALL" && sprintId !== "ACTIVE_DEFAULT") {
        await taskApi.assignTaskToSprint(projectId, newTask.id, sprintId, assignIdempotencyKey);
      }
      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success("Tạo Jira task thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || "Có lỗi xảy ra khi tạo Jira task.";
      toast.error(errMsg);
    }
  });
};

export const useUpdateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data, idempotencyKey }: { taskId: string; data: UpdateTaskRequest; idempotencyKey: string }) =>
      taskApi.updateTask(projectId, taskId, data, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success("Cập nhật task thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || "Có lỗi xảy ra khi cập nhật task.";
      toast.error(errMsg);
    }
  });
};

export const useDeleteTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, idempotencyKey }: { taskId: string; idempotencyKey: string }) =>
      taskApi.deleteTask(projectId, taskId, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success("Xóa task thành công!");
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || "Có lỗi xảy ra khi xóa task.";
      toast.error(errMsg);
    }
  });
};
