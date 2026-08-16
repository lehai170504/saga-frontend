import axiosInstance from "@/lib/axios";
import { AiConversation, AiMessage, GeneratedArtifact } from "../types";

export const aiApi = {
  getConversations: async () => {
    return axiosInstance.get<never, AiConversation[]>("/api/v1/ai/conversations");
  },
  getConversationDetail: async (id: string) => {
    return axiosInstance.get<never, { conversation: AiConversation; messages: AiMessage[] }>(`/api/v1/ai/conversations/${id}`);
  },
  createConversation: async (title?: string, courseId?: string) => {
    const payload: { title?: string; courseId?: string } = {};
    if (title) payload.title = title;
    if (courseId) payload.courseId = courseId;
    return axiosInstance.post<never, AiConversation>("/api/v1/ai/conversations", payload);
  },
  sendMessage: async (id: string, content: string, courseId?: string) => {
    const payload: { content: string; courseId?: string } = { content };
    if (courseId) payload.courseId = courseId;
    return axiosInstance.post<never, AiMessage>(`/api/v1/ai/conversations/${id}/messages`, payload);
  },
  confirmAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/confirm`);
  },
  rejectAction: async (actionId: string) => {
    return axiosInstance.post<never, void>(`/api/v1/ai/pending-actions/${actionId}/reject`);
  },
  // Download artifact
  downloadArtifact: async (artifact: GeneratedArtifact | string) => {
    const artifactId = typeof artifact === "string" ? artifact : artifact.id;
    const defaultFilename = typeof artifact === "string" ? "saga-report.docx" : (artifact.filename || "saga-report.docx");

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://saga-backend-production-3951.up.railway.app";
    const res = await fetch(
      `${API_BASE}/api/v1/ai/artifacts/${artifactId}/download`,
      { method: "GET", credentials: "include" }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Không thể tải báo cáo." }));
      throw err;
    }

    let filename = defaultFilename;
    const contentDisposition = res.headers.get("Content-Disposition");
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};
