"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { SagaAiWidget } from "@/features/ai/components/SagaAiWidget";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <>
        {children}
        <SagaAiWidget />
      </>
    </RouteGuard>
  );
}
