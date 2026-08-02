"use client";

import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ApplicationRole } from "@/stores/authStore";

interface ClientGuardProps {
  children: React.ReactNode;
  allowedRoles?: ApplicationRole[];
}

export function ClientGuard({ children, allowedRoles }: ClientGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Not authenticated, redirect to API login
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://saga-backend-production-3951.up.railway.app";
      window.location.assign(`${API_BASE_URL}/api/auth/login`);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Đang tải thông tin phiên đăng nhập...</p>
      </div>
    );
  }

  if (!user) {
    // Return null while redirecting
    return null;
  }

  // Check roles if provided
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.applicationRole)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
          <div className="bg-destructive/10 p-4 rounded-full text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">403 - Không đủ quyền truy cập</h1>
          <p className="text-muted-foreground mb-6">Bạn không có quyền xem trang này với vai trò hiện tại.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
  }

  return <>{children}</>;
}
