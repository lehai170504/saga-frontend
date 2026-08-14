"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProjectTypesTable } from "@/features/admin/components/project-types/project-types-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useProjectTypes } from "@/features/admin/hooks/useProjectTypes";

export default function ProjectTypesManagementPage() {
  const { data: projectTypes, isLoading } = useProjectTypes();

  return (
    <div className="space-y-8 ">
      <PageHeader
        title="Quản lý Loại Dự án"
        description="Định nghĩa các loại dự án (Design, Research, Tester...) và cấu hình tiêu chí đánh giá động (JSON Schema) cho từng loại."
        workspace="Master Data"
      />

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-end mb-4">
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
              <div className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                ))}
              </div>
            </div>
          ) : (
            <ProjectTypesTable data={projectTypes || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
