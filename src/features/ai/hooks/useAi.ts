import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "../api/aiApi";
import { AiMessage } from "../types";
import { toast } from "sonner";

import { getVietnameseErrorMessage } from "@/lib/error-utils";

export const useAiConversations = () => {
  return useQuery({
    queryKey: ["ai-conversations"],
    queryFn: () => aiApi.getConversations(),
    retry: 1,
  });
};

export const useAiConversationDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["ai-conversation-detail", id],
    queryFn: () => aiApi.getConversationDetail(id!),
    enabled: !!id,
    retry: 1,
  });
};

export const useCreateAiConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title?: string; courseId?: string } | string) => {
      if (typeof payload === "string") {
        return aiApi.createConversation(payload);
      }
      return aiApi.createConversation(payload.title, payload.courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Không thể tạo cuộc hội thoại"));
    }
  });
};

export const useSendAiMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string; courseId?: string } | string) => {
      if (typeof payload === "string") {
        return aiApi.sendMessage(conversationId, payload);
      }
      return aiApi.sendMessage(conversationId, payload.content, payload.courseId);
    },
    onSuccess: (data: AiMessage) => {
      const dataObj = data as unknown as Record<string, unknown>;
      const pendingAction = data?.pendingAction || dataObj?.pending_action || dataObj?.proposedAction || dataObj?.action;
      if (pendingAction) {
        queryClient.setQueryData(["latest-pending-action", conversationId], pendingAction);
      }
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Lỗi khi gửi tin nhắn"));
    }
  });
};

export const useSendAiMessageDynamic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { conversationId: string; content: string; courseId?: string }) => {
      return aiApi.sendMessage(payload.conversationId, payload.content, payload.courseId);
    },
    onSuccess: (data: AiMessage, variables) => {
      const dataObj = data as unknown as Record<string, unknown>;
      const pendingAction = data?.pendingAction || dataObj?.pending_action || dataObj?.proposedAction || dataObj?.action;
      if (pendingAction) {
        queryClient.setQueryData(["latest-pending-action", variables.conversationId], pendingAction);
      }
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Lỗi khi gửi tin nhắn"));
    }
  });
};

const getAiActionErrorMessage = (err: unknown, fallback: string) => {
  const error = err as Record<string, unknown>;
  const response = error?.response as Record<string, unknown>;
  const data = response?.data as Record<string, unknown>;
  const status = response?.status || error?.status;
  const errorCode = String(data?.error || error?.error || "");

  if (errorCode === "AI_AGENT_UNAVAILABLE" || status === 503) {
    return "Dịch vụ AI hiện đang bận hoặc gián đoạn (503). Vui lòng thử lại sau ít phút.";
  }
  if (errorCode === "AI_AGENT_NOT_CONFIGURED") {
    return "Hệ thống Trợ lý AI chưa sẵn sàng.";
  }
  if (errorCode === "AI_AGENT_COURSE_SCOPE_MISMATCH" || errorCode === "AI_AGENT_CONFLICT" || status === 409) {
    return "Đề xuất đã hết hạn hoặc đã được xử lý (TTL 10 phút). Vui lòng nhờ AI đề xuất lại.";
  }
  if (errorCode === "AI_AGENT_COURSE_FORBIDDEN" || status === 403) {
    return "Bạn không có quyền truy cập hoặc thực hiện thao tác này.";
  }
  if (errorCode === "AI_AGENT_RESOURCE_NOT_FOUND" || status === 404) {
    return "Hội thoại hoặc đề xuất không tồn tại.";
  }
  if (errorCode === "AI_AGENT_ACTION_UNSUPPORTED" || errorCode === "AI_AGENT_REQUEST_INVALID" || status === 400) {
    return "Thao tác không được hỗ trợ hoặc dữ liệu không hợp lệ.";
  }
  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }
  return getVietnameseErrorMessage(err, fallback);
};

export const useConfirmAiAction = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => aiApi.confirmAction(actionId),
    onSuccess: () => {
      toast.success("Đã xác nhận tạo Task thành công!");
      queryClient.setQueryData(["latest-pending-action", conversationId], null);
      queryClient.removeQueries({ queryKey: ["latest-pending-action", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-sprints"] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getAiActionErrorMessage(err, "Không thể xác nhận thao tác"));
    }
  });
};

export const useRejectAiAction = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => aiApi.rejectAction(actionId),
    onSuccess: () => {
      toast.success("Đã từ chối đề xuất tạo Task.");
      queryClient.setQueryData(["latest-pending-action", conversationId], null);
      queryClient.removeQueries({ queryKey: ["latest-pending-action", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getAiActionErrorMessage(err, "Lỗi khi từ chối thao tác"));
    }
  });
};
