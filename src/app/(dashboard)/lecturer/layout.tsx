"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { SagaAiWidget } from "@/features/ai/components/SagaAiWidget";

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["LECTURER"]}>
      <div className="min-h-screen bg-background">
        <main className="w-full">{children}</main>
        <SagaAiWidget />
      </div>
    </RouteGuard>
  );
}