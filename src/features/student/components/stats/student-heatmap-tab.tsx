"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { Info } from "lucide-react";
import { useTeamHeatmap } from "@/features/projects/hooks/useProjectDashboardStats";
import { HeatmapHeaderFilters } from "./heatmap/heatmap-header-filters";
import { HeatmapLegendBanner } from "./heatmap/heatmap-legend-banner";
import { HeatmapMatrixTable } from "./heatmap/heatmap-matrix-table";
import { HeatmapTopContributors } from "./heatmap/heatmap-top-contributors";

interface StudentHeatmapTabProps {
  courseId: string;
  teamId: string;
}

export function StudentHeatmapTab({ courseId, teamId }: StudentHeatmapTabProps) {
  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDateStr, setStartDateStr] = useState<string>(formatDateForApi(thirtyDaysAgo));
  const [endDateStr, setEndDateStr] = useState<string>(formatDateForApi(today));
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  const [activePreset, setActivePreset] = useState<"7d" | "14d" | "30d" | "custom">("30d");

  const handlePresetChange = (preset: "7d" | "14d" | "30d") => {
    const end = new Date();
    const start = new Date();
    if (preset === "7d") start.setDate(end.getDate() - 7);
    if (preset === "14d") start.setDate(end.getDate() - 14);
    if (preset === "30d") start.setDate(end.getDate() - 30);

    setActivePreset(preset);
    setStartDateStr(formatDateForApi(start));
    setEndDateStr(formatDateForApi(end));
  };

  const { data: heatmapData, isLoading, error } = useTeamHeatmap(
    courseId,
    teamId,
    startDateStr,
    endDateStr,
    selectedStudentId
  );

  const students = heatmapData?.students || [];
  const days = heatmapData?.days || [];

  // Helper to format date label for matrix columns (dd/MM)
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  // Helper to get color classes based on Heatmap Score
  const getCellColorClass = (score: number) => {
    if (!score || score <= 0) {
      return "bg-muted/30 border-muted-foreground/10 text-muted-foreground hover:bg-muted/50";
    }
    if (score >= 1 && score <= 5) {
      // Green (Light Activity)
      return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 shadow-sm";
    }
    if (score >= 6 && score <= 15) {
      // Yellow / Amber (Moderate Activity)
      return "bg-amber-500/30 text-amber-700 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/40 shadow-sm";
    }
    // Red / Rose (High Activity)
    return "bg-rose-500/35 text-rose-700 dark:text-rose-400 border-rose-500/50 hover:bg-rose-500/45 shadow-md font-bold";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Date Range & Student Selector */}
      <HeatmapHeaderFilters
        activePreset={activePreset}
        onPresetChange={handlePresetChange}
        startDateStr={startDateStr}
        endDateStr={endDateStr}
        onStartDateChange={(val) => {
          setActivePreset("custom");
          setStartDateStr(val);
        }}
        onEndDateChange={(val) => {
          setActivePreset("custom");
          setEndDateStr(val);
        }}
        selectedStudentId={selectedStudentId}
        onStudentChange={setSelectedStudentId}
        students={students}
      />

      {/* Color Scale Legend Banner */}
      <HeatmapLegendBanner />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-[2.5rem]" />
        </div>
      ) : error ? (
        <Card className="rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Info size={32} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không thể tải dữ liệu Biểu đồ nhiệt</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Vui lòng kiểm tra lại khoảng thời gian đã chọn hoặc thử thay đổi điều kiện lọc sinh viên.
          </p>
        </Card>
      ) : (
        <>
          {/* Main Matrix Table */}
          <HeatmapMatrixTable
            students={students}
            days={days}
            formatDateLabel={formatDateLabel}
            getCellColorClass={getCellColorClass}
          />

          {/* Member Activity Breakdown & Summary Cards */}
          <HeatmapTopContributors students={students} />
        </>
      )}
    </div>
  );
}
