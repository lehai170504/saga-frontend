"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApplicationRole } from "@/stores/authStore";
import { Skeleton } from "@/components/shared/Skeleton";
import { API_BASE_URL } from "@/lib/axios";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ApplicationRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.assign(`${API_BASE_URL}/api/auth/login`);
        return;
      }
      if (allowedRoles && user && !allowedRoles.includes(user.applicationRole)) {
        let redirectPath = "/student";
        if (user.applicationRole === "ADMIN") redirectPath = "/admin";
        if (user.applicationRole === "LECTURER") redirectPath = "/lecturer";

        setTimeout(() => {
          router.replace(redirectPath);
        }, 0);
      }
    }
  }, [isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8 w-full bg-background min-h-screen">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl opacity-60" />
        <Skeleton className="h-40 w-full rounded-2xl opacity-40" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.applicationRole)) {
    return null;
  }

  return <>{children}</>;
}
