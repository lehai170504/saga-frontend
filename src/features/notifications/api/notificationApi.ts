import axiosInstance from "@/lib/axios";
import { NotificationResponse, UnreadCountResponse, AdminBroadcastRequest } from "../types";

export const notificationApi = {
  getNotifications: async (page = 0, size = 20): Promise<NotificationResponse> => {
    return axiosInstance.get(`/api/me/notifications?page=${page}&size=${size}`);
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return axiosInstance.get(`/api/me/notifications/unread-count`);
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/api/me/notifications/${id}/read`);
  },

  registerFirebaseInstallation: async (installationId: string): Promise<void> => {
    await axiosInstance.post(`/api/me/firebase-installations`, { firebaseInstallationId: installationId });
  },

  revokeFirebaseInstallation: async (installationId: string): Promise<void> => {
    await axiosInstance.delete(`/api/me/firebase-installations/${installationId}`);
  },

  adminBroadcast: async (payload: AdminBroadcastRequest, idempotencyKey: string): Promise<void> => {
    await axiosInstance.post(`/api/admin/notifications/broadcast`, payload, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  }
};
