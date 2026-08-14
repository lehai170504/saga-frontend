"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { Info } from "lucide-react";
import { useTeamOverviewActivity } from "@/features/projects/hooks/useProjectDashboardStats";
import { OverviewHeaderFilters } from "./overview/overview-header-filters";
import { OverviewSummaryCards } from "./overview/overview-summary-cards";
import { OverviewScoringRulesBanner } from "./overview/overview-scoring-rules-banner";
import { OverviewTrendChart } from "./overview/overview-trend-chart";
import { OverviewBreakdownChart } from "./overview/overview-breakdown-chart";

interface StudentOverviewActivityTabProps {
  courseId: string;
  teamId: string;
}

export function StudentOverviewActivityTab({ courseId, teamId }: StudentOverviewActivityTabProps) {
  // Helper to format date YYYY-MM-DD
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

  const { data: overviewData, isLoading, error } = useTeamOverviewActivity(
    courseId,
    teamId,
    startDateStr,
    endDateStr
  );

  const days = overviewData?.days || [];
  const totals = overviewData?.totals || {
    commits: 0,
    peerReviews: 0,
    comments: 0,
    documents: 0,
    tasks: 0,
    totalActivities: 0,
    totalScore: 0,
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  const chartData = days.map((d) => ({
    date: formatDateLabel(d.date),
    fullDate: d.date,
    commits: d.commits,
    tasks: d.tasks,
    peerReviews: d.peerReviews,
    comments: d.comments,
    documents: d.documents,
    totalActivities: d.totalActivities,
    totalScore: d.totalScore,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Date Range Selector */}
      <OverviewHeaderFilters
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
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-[2.5rem]" />
        </div>
      ) : error ? (
        <Card className="rounded-[2.5rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <Info size={32} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không thể tải dữ liệu tổng quan hoạt động</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Vui lòng kiểm tra lại khoảng thời gian đã chọn hoặc thử chọn lại các ngày hợp lệ.
          </p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <OverviewSummaryCards totals={totals} />

          {/* Scoring Rules Explanation Banner */}
          <OverviewScoringRulesBanner />

          {/* Main Chart Section: Activity Score Trend & Activity Counts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OverviewTrendChart chartData={chartData} totalScore={totals.totalScore} />
            <OverviewBreakdownChart chartData={chartData} totalActivities={totals.totalActivities} />
          </div>
        </>
      )}
    </div>
  );
}
