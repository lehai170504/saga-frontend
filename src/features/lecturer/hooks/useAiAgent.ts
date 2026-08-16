import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiAgentApi, CreateConversationPayload, SendMessagePayload } from "../api/aiAgentApi";
import { toast } from "sonner";
import { getVietnameseErrorMessage } from "@/lib/error-utils";

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
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Có lỗi xảy ra khi tạo hội thoại AI"));
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
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Có lỗi xảy ra khi gửi tin nhắn cho AI"));
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
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Có lỗi xảy ra khi xác nhận hành động"));
    }
  });
};

export const useRejectPendingAction = () => {
  return useMutation({
    mutationFn: (actionId: string) => aiAgentApi.rejectPendingAction(actionId),
    onSuccess: () => {
      toast.success("Đã từ chối hành động");
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Có lỗi xảy ra khi từ chối hành động"));
    }
  });
};

export const useDownloadArtifact = () => {
  return useMutation({
    mutationFn: (artifactId: string) => aiAgentApi.downloadArtifact(artifactId),
    onSuccess: (response, artifactId) => {
      let filename = `Artifact_${artifactId}`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (err: unknown) => {
      toast.error(getVietnameseErrorMessage(err, "Lỗi khi tải xuống tệp"));
    }
  });
};
