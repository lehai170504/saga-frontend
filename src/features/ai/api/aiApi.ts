import axiosInstance from "@/lib/axios";
import { AiConversation, AiMessage } from "../types";

export const aiApi = {
  getConversations: async () => {
    return axiosInstance.get<never, AiConversation[]>("/api/v1/ai/conversations");
  },
  getConversationDetail: async (id: string) => {
    return axiosInstance.get<never, { conversation: AiConversation; messages: AiMessage[] }>(`/api/v1/ai/conversations/${id}`);
  },
  createConversation: async (title: string) => {
    return axiosInstance.post<never, AiConversation>("/api/v1/ai/conversations", { title });
  },
  sendMessage: async (id: string, content: string) => {
    return axiosInstance.post<never, AiMessage>(`/api/v1/ai/conversations/${id}/messages`, { content });
  },
  confirmAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/confirm`);
  },
  rejectAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/reject`);
  },
  // Download artifact
  downloadArtifact: async (artifactId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "https://saga-backend-production-3951.up.railway.app"}/api/v1/ai/artifacts/${artifactId}/download`, {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error("Failed to download artifact");
    }

    // Try to extract filename from Content-Disposition
    let filename = "saga-artifact.docx";
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
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
