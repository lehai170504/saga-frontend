"use client";

import React, { useState } from "react";
import { TeamHeatmap } from "./team-heatmap";
import { useTeamHeatmap } from "@/features/lecturer/hooks/useAnalytics";
import { subMonths, format } from "date-fns";

interface TeamHeatmapViewProps {
  courseId: string;
  teamId: string;
}

export function TeamHeatmapView({ courseId, teamId }: TeamHeatmapViewProps) {
  // Default to last 3 months
  const [endDate] = useState(() => new Date());
  const [startDate] = useState(() => subMonths(new Date(), 3));

  const { data, isLoading } = useTeamHeatmap(
    courseId,
    teamId,
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd")
  );

  return (
    <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Biểu đồ nhiệt (Heatmap)</h3>
        <p className="text-sm text-muted-foreground mt-1">Mức độ hoạt động và đóng góp của toàn bộ nhóm trong 3 tháng qua.</p>
      </div>
      <TeamHeatmap data={data?.days || (data as unknown as import("@/features/lecturer/types/analytics").HeatmapData[])} isLoading={isLoading} />
    </div>
  );
}
