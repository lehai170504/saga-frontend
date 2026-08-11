import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notificationApi";
import { AdminBroadcastRequest } from "../types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export const useNotificationsList = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ["notifications", page, size],
    queryFn: () => notificationApi.getNotifications(page, size),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 60000, // optionally poll every minute, though FCM is primary
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      // Invalidate both the list and the unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
    },
  });
};

export const useAdminBroadcast = () => {
  return useMutation({
    mutationFn: async (payload: AdminBroadcastRequest) => {
      const idempotencyKey = uuidv4();
      return notificationApi.adminBroadcast(payload, idempotencyKey);
    },
    onSuccess: () => {
      toast.success("Đã gửi thông báo Broadcast thành công!");
    },
    onError: (error) => {
      toast.error("Gửi thông báo thất bại. Vui lòng thử lại.");
      console.error(error);
    }
  });
};
