"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertTriangle } from "lucide-react";
import { useTeamSprints, useBurndown } from "@/features/projects/hooks/useTeamSprints";
import { BurndownHeaderSelector } from "./burndown/burndown-header-selector";
import { BurndownSummaryCards } from "./burndown/burndown-summary-cards";
import { BurndownLineChart } from "./burndown/burndown-line-chart";
import { BurndownEmptyState } from "./burndown/burndown-empty-state";

interface StudentBurndownTabProps {
  courseId: string;
  teamId: string;
}

export function StudentBurndownTab({ courseId, teamId }: StudentBurndownTabProps) {
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(teamId);
  const sprints = useMemo(() => sprintsData?.sprints || [], [sprintsData?.sprints]);

  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  useEffect(() => {
    if (sprints.length > 0 && !selectedSprintId) {
      // Find active sprint or default to first sprint
      const activeSprint = sprints.find((s) => s.state === "ACTIVE" || s.state === "active");
      const defaultId = activeSprint ? activeSprint.sprintId : sprints[0].sprintId;
      requestAnimationFrame(() => setSelectedSprintId(defaultId));
    }
  }, [sprints, selectedSprintId]);

  const { data: burndown, isLoading: isLoadingBurndown, error: burndownError } = useBurndown(
    courseId,
    teamId,
    selectedSprintId
  );

  const points = burndown?.points || [];
  const totalScope = burndown?.totalScope ?? 0;
  const lastPoint = points.length > 0 ? points[points.length - 1] : null;

  const currentActual = lastPoint?.actualRemaining ?? totalScope;
  const currentIdeal = lastPoint?.idealRemaining ?? 0;
  const currentDone = lastPoint?.doneCount ?? 0;

  const isBehind = currentActual > currentIdeal;
  const isAhead = currentActual < currentIdeal;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  const chartData = points.map((p) => ({
    date: formatDateLabel(p.date),
    fullDate: p.date,
    idealRemaining: p.idealRemaining,
    actualRemaining: p.actualRemaining,
    doneCount: p.doneCount,
  }));

  if (isLoadingSprints) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (sprints.length === 0) {
    return <BurndownEmptyState />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Sprint Selector */}
      <BurndownHeaderSelector
        sprints={sprints}
        selectedSprintId={selectedSprintId}
        onSelectSprint={setSelectedSprintId}
      />

      {isLoadingBurndown ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[420px] rounded-[2.5rem]" />
        </div>
      ) : burndownError ? (
        <Card className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không thể tải dữ liệu Burndown Chart</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Sprint này chưa có dữ liệu lịch trình hoặc chưa được liên kết với project Jira hợp lệ.
          </p>
        </Card>
      ) : (
        <>
          {/* Top Metric Cards */}
          <BurndownSummaryCards
            totalScope={totalScope}
            sprintName={burndown?.sprintName}
            currentActual={currentActual}
            currentIdeal={currentIdeal}
            currentDone={currentDone}
            isBehind={isBehind}
            isAhead={isAhead}
          />

          {/* Main Burndown Chart Card */}
          <BurndownLineChart
            startDate={burndown?.startDate}
            endDate={burndown?.endDate}
            chartData={chartData}
            isBehind={isBehind}
          />
        </>
      )}
    </div>
  );
}
