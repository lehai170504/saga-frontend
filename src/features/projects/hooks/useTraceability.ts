import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVietnameseErrorMessage } from "@/lib/error-utils";
import { traceabilityApi } from "../api/traceabilityApi";
import { addLinkedTaskId, removeLinkedTaskId } from "../utils/linkedTasksStorage";
import { toast } from "sonner";

export const useTaskTraceability = (projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task-traceability", projectId, taskId],
    queryFn: () => traceabilityApi.getTaskTraceability(projectId, taskId),
    enabled: !!projectId && !!taskId,
    staleTime: 30 * 1000,
  });
};

export const useProjectTraceability = (projectId: string) => {
  return useQuery({
    queryKey: ["project-traceability", projectId],
    queryFn: () => traceabilityApi.getProjectTraceability(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
  });
};

export const useLinkTaskIssue = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, idempotencyKey }: { issueId: string; idempotencyKey: string }) =>
      traceabilityApi.linkTaskIssue(projectId, taskId, issueId, idempotencyKey),
    onSuccess: () => {
      addLinkedTaskId(projectId, taskId);
      toast.success("Đã liên kết GitHub Issue với công việc thành công!");
      queryClient.invalidateQueries({ queryKey: ["task-traceability", projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-traceability", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
    onError: (err: Error) => {
      toast.error(getVietnameseErrorMessage(err, "Không thể liên kết GitHub Issue"));
    },
  });
};

export const useUnlinkTaskIssue = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ issueId, idempotencyKey }: { issueId: string; idempotencyKey: string }) =>
      traceabilityApi.unlinkTaskIssue(projectId, taskId, issueId, idempotencyKey),
    onSuccess: () => {
      removeLinkedTaskId(projectId, taskId);
      toast.success("Đã hủy liên kết GitHub Issue thành công!");
      queryClient.invalidateQueries({ queryKey: ["task-traceability", projectId, taskId] });
      queryClient.invalidateQueries({ queryKey: ["project-traceability", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
    onError: (err: Error) => {
      toast.error(getVietnameseErrorMessage(err, "Không thể hủy liên kết GitHub Issue"));
    },
  });
};
