import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, GetTasksParams, CreateTaskRequest, UpdateTaskRequest } from "../api/taskApi";
import { JiraTask } from "../types";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TASK_MESSAGES } from "../constants/messages";

export const useProjectTasks = (projectId: string, params?: GetTasksParams) => {
  return useQuery({
    queryKey: ["project-tasks", projectId, params],
    queryFn: () => taskApi.getProjectTasks(projectId, params),
    enabled: !!projectId
  });
};

export const useTaskDetail = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["project-task", projectId, taskId],
    queryFn: () => taskApi.getTaskById(projectId, taskId),
    enabled: !!projectId && !!taskId
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
      toast.success(TASK_MESSAGES.CREATE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.CREATE.ERROR;
      toast.error(errMsg);
    }
  });
};

export const useUpdateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      data,
      assigneeId,
      sprintId,
      storyPoint,
      mainIdempotencyKey,
      assigneeIdempotencyKey,
      sprintIdempotencyKey,
      estimationIdempotencyKey
    }: {
      taskId: string;
      data?: UpdateTaskRequest;
      assigneeId?: string | null;
      sprintId?: string | null;
      storyPoint?: number | null;
      mainIdempotencyKey?: string;
      assigneeIdempotencyKey?: string;
      sprintIdempotencyKey?: string;
      estimationIdempotencyKey?: string;
    }) => {
      if (data && Object.keys(data).length > 0) {
        await taskApi.updateTask(projectId, taskId, data, mainIdempotencyKey!);
      }
      if (assigneeId !== undefined) {
        await taskApi.updateTaskAssignee(projectId, taskId, assigneeId, assigneeIdempotencyKey!);
      }
      if (sprintId !== undefined) {
        await taskApi.assignTaskToSprint(projectId, taskId, sprintId, sprintIdempotencyKey!);
      }
      if (storyPoint !== undefined) {
        await taskApi.updateTaskEstimation(projectId, taskId, storyPoint, estimationIdempotencyKey!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success(TASK_MESSAGES.UPDATE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.UPDATE.ERROR;
      toast.error(errMsg);
    }
  });
};

export const useUpdateTaskEstimation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, storyPoint, idempotencyKey }: { taskId: string; storyPoint: number | null; idempotencyKey: string }) =>
      taskApi.updateTaskEstimation(projectId, taskId, storyPoint, idempotencyKey),
    onMutate: async ({ taskId, storyPoint }) => {
      await queryClient.cancelQueries({ queryKey: ["project-tasks", projectId] });
      const previousData = queryClient.getQueriesData({ queryKey: ["project-tasks", projectId] });

      queryClient.setQueriesData({ queryKey: ["project-tasks", projectId] }, (oldData: unknown) => {
        const data = oldData as { content?: JiraTask[] };
        if (!data || !data.content) return oldData;
        return {
          ...data,
          content: data.content.map((t: JiraTask) =>
            t.id === taskId ? { ...t, storyPoint: storyPoint ?? 0 } : t
          ),
        };
      });

      return { previousData };
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.UPDATE_ESTIMATION.ERROR;
      toast.error(errMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
    onSuccess: () => {
      toast.success(TASK_MESSAGES.UPDATE_ESTIMATION.SUCCESS);
    },
  });
};

export const useUpdateTaskAssignee = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, assigneeId, idempotencyKey }: { taskId: string; assigneeId: string | null; assigneeName?: string; idempotencyKey: string }) =>
      taskApi.updateTaskAssignee(projectId, taskId, assigneeId, idempotencyKey),
    onMutate: async ({ taskId, assigneeId, assigneeName }) => {
      await queryClient.cancelQueries({ queryKey: ["project-tasks", projectId] });
      const previousData = queryClient.getQueriesData({ queryKey: ["project-tasks", projectId] });

      queryClient.setQueriesData({ queryKey: ["project-tasks", projectId] }, (oldData: unknown) => {
        const data = oldData as { content?: JiraTask[] };
        if (!data || !data.content) return oldData;
        return {
          ...data,
          content: data.content.map((t: JiraTask) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              assignee: assigneeId ? { id: assigneeId, fullName: assigneeName || t.assignee?.fullName || "Sinh viên" } : null
            };
          }),
        };
      });

      return { previousData };
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const axiosErr = err as AxiosError<{ message?: string; error?: string; status?: number }>;
      const errCode = axiosErr?.response?.data?.error;
      const status = axiosErr?.response?.status;
      const backendMsg = axiosErr?.response?.data?.message || "";

      let userMsg: string = TASK_MESSAGES.UPDATE_ASSIGNEE.ERROR;
      if (errCode === "JIRA_RESOURCE_NOT_FOUND" || status === 409 || backendMsg.includes("Jira resource")) {
        userMsg = TASK_MESSAGES.UPDATE_ASSIGNEE.NOT_FOUND;
      } else if (backendMsg) {
        userMsg = backendMsg;
      }

      toast.error(userMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
    onSuccess: () => {
      toast.success(TASK_MESSAGES.UPDATE_ASSIGNEE.SUCCESS);
    },
  });
};

export const useUpdateTaskPriority = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, priority, idempotencyKey }: { taskId: string; priority: string; idempotencyKey: string }) =>
      taskApi.updateTask(projectId, taskId, { priority }, idempotencyKey),

    onMutate: async ({ taskId, priority }) => {
      await queryClient.cancelQueries({ queryKey: ["project-tasks", projectId] });
      const previousData = queryClient.getQueriesData({ queryKey: ["project-tasks", projectId] });

      queryClient.setQueriesData({ queryKey: ["project-tasks", projectId] }, (oldData: unknown) => {
        const data = oldData as { content?: JiraTask[] };
        if (!data || !data.content) return oldData;
        return {
          ...data,
          content: data.content.map((t: JiraTask) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              priority
            };
          }),
        };
      });

      return { previousData };
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.UPDATE_PRIORITY.ERROR;
      toast.error(errMsg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
    onSuccess: () => {
      toast.success(TASK_MESSAGES.UPDATE_PRIORITY.SUCCESS);
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, idempotencyKey }: { taskId: string; idempotencyKey: string }) =>
      taskApi.deleteTask(projectId, taskId, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      toast.success(TASK_MESSAGES.DELETE.SUCCESS);
    },
    onError: (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.DELETE.ERROR;
      toast.error(errMsg);
    }
  });
};

export const useTaskTransitions = (projectId: string, taskId: string, enabled = true) => {
  return useQuery({
    queryKey: ["task-transitions", projectId, taskId],
    queryFn: () => taskApi.getTaskTransitions(projectId, taskId),
    enabled: !!projectId && !!taskId && enabled
  });
};

export const useTransitionTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, transitionId, idempotencyKey }: { taskId: string; transitionId: string; idempotencyKey: string; targetStatus?: string }) =>
      taskApi.transitionTask(projectId, taskId, transitionId, idempotencyKey),
    onMutate: async ({ taskId, targetStatus }) => {
      if (!targetStatus) return;
      await queryClient.cancelQueries({ queryKey: ["project-tasks", projectId] });
      const previousQueries = queryClient.getQueriesData({ queryKey: ["project-tasks", projectId] });

      queryClient.setQueriesData({ queryKey: ["project-tasks", projectId] }, (oldData: unknown) => {
        if (!oldData) return oldData;
        const data = oldData as { content?: JiraTask[] };
        if (Array.isArray(data.content)) {
          return {
            ...data,
            content: data.content.map((t: JiraTask) =>
              t.id === taskId ? { ...t, status: targetStatus } : t
            )
          };
        }
        return oldData;
      });

      return { previousQueries };
    },
    onError: (err: unknown, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      const axiosErr = err as AxiosError<{ message: string }>;
      const errMsg = axiosErr?.response?.data?.message || TASK_MESSAGES.TRANSITION.ERROR;
      toast.error(errMsg);
    },
    onSuccess: () => {
      toast.success(TASK_MESSAGES.TRANSITION.SUCCESS);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    }
  });
};

