"use client";

import React from "react";
import { SprintVelocityChart } from "./sprint-velocity-chart";
import { useSprintVelocity } from "@/features/lecturer/hooks/useAnalytics";

interface SprintVelocityViewProps {
  courseId: string;
  teamId: string;
}

export function SprintVelocityView({ courseId, teamId }: SprintVelocityViewProps) {
  const { data, isLoading } = useSprintVelocity(courseId, teamId);

  return (
    <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Vận tốc Sprint (Velocity)</h3>
        <p className="text-sm text-muted-foreground mt-1">Sự tương quan giữa Điểm Kế hoạch và Điểm Hoàn thành qua các Sprints.</p>
      </div>
      <SprintVelocityChart data={data?.sprints || (data as unknown as import("@/features/lecturer/types/analytics").SprintVelocity[])} isLoading={isLoading} />
    </div>
  );
}
