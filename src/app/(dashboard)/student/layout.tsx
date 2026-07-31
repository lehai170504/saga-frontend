"use client";

import React from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <div className="min-h-screen bg-background flex flex-col w-full relative">
        <main className="w-full flex-1">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
