"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoading, isFetching, error } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Force a fetch of the current user, as we just got a new cookie
    queryClient.invalidateQueries({ queryKey: ["auth-me"] });
  }, [queryClient]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      // Use setTimeout to avoid "Router action dispatched before initialization" in Turbopack
      setTimeout(() => {
        if (user) {
          // Redirect based on role
          if (user.applicationRole === "ADMIN") {
            router.replace("/admin");
          } else if (user.applicationRole === "LECTURER") {
            router.replace("/lecturer");
          } else {
            router.replace("/student");
          }
        } else if (error || !user) {
          router.replace("/");
        }
      }, 0);
    }
  }, [user, isLoading, isFetching, error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">
        Đang xác thực phiên đăng nhập...
      </p>
    </div>
  );
}
