import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiAgentApi, CreateConversationPayload, SendMessagePayload } from "../api/aiAgentApi";
import { toast } from "sonner";

export const useConversations = () => {
  return useQuery({
    queryKey: ["ai-conversations"],
    queryFn: () => aiAgentApi.getConversations(),
  });
};

export const useConversation = (conversationId: string | null) => {
  return useQuery({
    queryKey: ["ai-conversation", conversationId],
    queryFn: () => {
      if (!conversationId) throw new Error("Conversation ID is required");
      return aiAgentApi.getConversationDetail(conversationId);
    },
    enabled: !!conversationId,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateConversationPayload) => aiAgentApi.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi tạo hội thoại AI");
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, payload }: { conversationId: string; payload: SendMessagePayload }) =>
      aiAgentApi.sendMessage(conversationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ai-conversation", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["ai-conversations"] }); // Update preview or timestamp in sidebar
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi gửi tin nhắn cho AI");
    }
  });
};

export const useConfirmPendingAction = () => {
  return useMutation({
    mutationFn: (actionId: string) => aiAgentApi.confirmPendingAction(actionId),
    onSuccess: () => {
      // In a real app we might want to invalidate the specific conversation that contained this action,
      // or rely on the UI to optimistically update the action status.
      toast.success("Đã xác nhận hành động thành công");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xác nhận hành động");
    }
  });
};

export const useRejectPendingAction = () => {
  return useMutation({
    mutationFn: (actionId: string) => aiAgentApi.rejectPendingAction(actionId),
    onSuccess: () => {
      toast.success("Đã từ chối hành động");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi từ chối hành động");
    }
  });
};

export const useDownloadArtifact = () => {
  return useMutation({
    mutationFn: (artifactId: string) => aiAgentApi.downloadArtifact(artifactId),
    onSuccess: (response, artifactId) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Artifact_${artifactId}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error("Lỗi khi tải xuống tệp");
    }
  });
};
