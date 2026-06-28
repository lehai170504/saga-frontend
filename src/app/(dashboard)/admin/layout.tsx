"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { GlobalCommandPalette } from "@/components/shared/global-command-palette";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <main className="w-full">{children}</main>
        <GlobalCommandPalette />
      </div>
    </RouteGuard>
  );
}
