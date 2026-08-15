import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "../api/aiApi";
import { toast } from "sonner";

export const useAiConversations = () => {
  return useQuery({
    queryKey: ["ai-conversations"],
    queryFn: () => aiApi.getConversations(),
  });
};

export const useAiConversationDetail = (id: string | null) => {
  return useQuery({
    queryKey: ["ai-conversation-detail", id],
    queryFn: () => aiApi.getConversationDetail(id!),
    enabled: !!id,
  });
};

export const useCreateAiConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => aiApi.createConversation(title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể tạo cuộc hội thoại");
    }
  });
};

export const useSendAiMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => aiApi.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversation-detail", conversationId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Lỗi khi gửi tin nhắn");
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
    onError: (err: any) => {
      toast.error(err.message || "Không thể xác nhận thao tác");
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
    onError: (err: any) => {
      toast.error(err.message || "Lỗi khi từ chối thao tác");
    }
  });
};
