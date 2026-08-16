import axiosInstance from "@/lib/axios";
import { NotificationResponse, UnreadCountResponse, AdminBroadcastRequest, CourseBroadcastRequest } from "../types";

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

  registerFirebaseInstallation: async (installationId: string): Promise<{ id?: string; firebaseInstallationId?: string } | void> => {
    return axiosInstance.post(`/api/me/firebase-installations`, { firebaseInstallationId: installationId });
  },

  revokeFirebaseInstallation: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/me/firebase-installations/${id}`);
  },

  adminBroadcast: async (payload: AdminBroadcastRequest, idempotencyKey: string): Promise<void> => {
    const cleanPayload = {
      audience: payload.audience,
      title: payload.title.trim(),
      message: payload.message.trim(),
    };
    await axiosInstance.post(`/api/admin/notifications/broadcast`, cleanPayload, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
  },

  courseBroadcast: async (payload: CourseBroadcastRequest, idempotencyKey: string): Promise<void> => {
    const cleanPayload: CourseBroadcastRequest = {
      courseIds: payload.courseIds,
      title: payload.title.trim(),
      message: payload.message.trim(),
      ...(payload.actionUrl?.trim() ? { actionUrl: payload.actionUrl.trim() } : {}),
    };
    await axiosInstance.post(`/api/v1/courses/notifications/broadcast`, cleanPayload, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
  },
};
