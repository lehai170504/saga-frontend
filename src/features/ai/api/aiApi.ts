import axiosInstance from "@/lib/axios";
import { AiConversation, AiMessage } from "../types";

export const aiApi = {
  getConversations: async () => {
    return axiosInstance.get<never, AiConversation[]>("/api/v1/ai/conversations");
  },
  getConversationDetail: async (id: string) => {
    return axiosInstance.get<never, { conversation: AiConversation; messages: AiMessage[] }>(`/api/v1/ai/conversations/${id}`);
  },
  createConversation: async (title: string, courseId?: string) => {
    return axiosInstance.post<never, AiConversation>("/api/v1/ai/conversations", { title, courseId });
  },
  sendMessage: async (id: string, content: string, courseId?: string) => {
    return axiosInstance.post<never, AiMessage>(`/api/v1/ai/conversations/${id}/messages`, { content, courseId });
  },
  confirmAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/confirm`);
  },
  rejectAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/reject`);
  },
  // Download artifact
  downloadArtifact: async (artifactId: string, filename: string = "saga-artifact.docx") => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://saga-backend-production-3951.up.railway.app"}/api/v1/ai/artifacts/${artifactId}/download`, {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Failed to download artifact");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};
