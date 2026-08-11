"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useFirebasePush() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      
      // Invalidate queries to refetch notification list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });

      // Show toast
      toast(payload.notification?.title || "Thông báo mới", {
        description: payload.notification?.body || "Bạn có thông báo mới.",
        duration: 5000,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
}
