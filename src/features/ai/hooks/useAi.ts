import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "../api/aiApi";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Lỗi khi gửi tin nhắn"));
    }
  });
};

export const useConfirmAiAction = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => aiApi.confirmAction(actionId),
    onSuccess: () => {
      toast.success("Đã xác nhận thao tác thành công");
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Không thể xác nhận thao tác"));
    }
  });
};

export const useRejectAiAction = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => aiApi.rejectAction(actionId),
    onSuccess: () => {
      toast.success("Đã từ chối thao tác");
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Lỗi khi từ chối thao tác"));
    }
  });
};
