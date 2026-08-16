"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { GlobalCommandPalette } from "@/components/shared/global-command-palette";
import { SagaAiWidget } from "@/features/ai/components/SagaAiWidget";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      {children}
      <GlobalCommandPalette />
      <SagaAiWidget />
    </RouteGuard>
  );
}
