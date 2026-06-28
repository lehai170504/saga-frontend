"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background">
        <main className="w-full">{children}</main>
      </div>
    </RouteGuard>
  );
}
