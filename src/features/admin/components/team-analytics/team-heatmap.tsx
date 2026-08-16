"use client";

import React, { useMemo } from "react";
import { HeatmapData } from "@/features/lecturer/types/analytics";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle } from "lucide-react";
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek, subWeeks, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamHeatmapProps {
  data?: HeatmapData[];
  isLoading: boolean;
}

export function TeamHeatmap({ data, isLoading }: TeamHeatmapProps) {
  // Generate last 12 weeks of dates for the heatmap
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subWeeks(today, 11), { weekStartsOn: 1 }); // 12 weeks ago, start on Monday
    const endDate = endOfWeek(today, { weekStartsOn: 1 });

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weeksArray: Date[][] = [];

    for (let i = 0; i < allDays.length; i += 7) {
      weeksArray.push(allDays.slice(i, i + 7));
    }

    return weeksArray;
  }, []);

  // Ensure data is an array. Backend might return a map/object {"YYYY-MM-DD": count} or wrapped array.
  const actualData: HeatmapData[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if ((data as unknown as Record<string, unknown>).content && Array.isArray((data as unknown as Record<string, unknown>).content)) return (data as unknown as Record<string, unknown>).content as HeatmapData[];
    if ((data as unknown as Record<string, unknown>).heatmapData && Array.isArray((data as unknown as Record<string, unknown>).heatmapData)) return (data as unknown as Record<string, unknown>).heatmapData as HeatmapData[];
    if (typeof data === "object") {
      // Handle map/dictionary format
      return Object.entries(data).map(([date, commits]) => ({
        date,
        commits: Number(commits) || 0,
        totalActivities: Number(commits) || 0,
        peerReviews: 0,
        comments: 0,
        documents: 0,
        tasks: 0,
        totalScore: 0,
      }));
    }
    return [];
  }, [data]);

  const maxActivities = useMemo(() => {
    if (actualData.length === 0) return 1;
    return Math.max(...actualData.map(d => d.totalActivities));
  }, [actualData]);

  const getDayData = (date: Date) => {
    return actualData.find(d => isSameDay(parseISO(d.date), date));
  };

  const getIntensityClass = (activities: number) => {
    if (activities === 0) return "bg-muted/50"; // Level 0
    const ratio = activities / maxActivities;
    if (ratio <= 0.25) return "bg-primary/40"; // Level 1
    if (ratio <= 0.5) return "bg-primary/60"; // Level 2
    if (ratio <= 0.75) return "bg-primary/80"; // Level 3
    return "bg-primary"; // Level 4
  };

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/20">
        <AlertCircle className="w-8 h-8 text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground font-medium">Chưa có dữ liệu hoạt động trong thời gian này.</p>
      </div>
    );
  }

  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="w-full overflow-x-auto">
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-3 min-w-max">
          {/* Y Axis Labels (Days) */}
          <div className="flex flex-col gap-1.5 mt-[28px] pr-2 text-[11px] text-muted-foreground font-medium">
            {daysOfWeek.map((day, i) => (
              <div key={day} className="h-6 flex items-center leading-none">{i % 2 === 0 ? day : ""}</div>
            ))}
          </div>

          {/* Heatmap Area */}
          <div className="flex flex-col">
            {/* Month Labels Row */}
            <div className="relative h-[22px] mb-1 text-[11px] text-muted-foreground font-medium w-full">
              {weeks.map((week, weekIdx) => {
                const isFirstWeekOfMonth = week[0].getDate() <= 7;
                if (isFirstWeekOfMonth) {
                  return (
                    <div
                      key={weekIdx}
                      className="absolute bottom-0 whitespace-nowrap"
                      style={{ left: `${weekIdx * 30}px` }} // 24px width + 6px gap = 30px per column
                    >
                      {format(week[0], "MMM", { locale: vi })}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Grid of Weeks */}
            <div className="flex gap-1.5">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dayIdx) => {
                    const dayData = getDayData(day);
                    const activities = dayData?.totalActivities || 0;
                    const commits = dayData?.commits || 0;
                    const tasks = dayData?.tasks || 0;
                    const docs = dayData?.documents || 0;
                    const reviews = dayData?.peerReviews || 0;
                    const score = dayData?.totalScore || 0;

                    const hasActivity = activities > 0;

                    return (
                      <Tooltip key={dayIdx}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-6 h-6 rounded-md ${getIntensityClass(activities)} hover:ring-2 hover:ring-foreground transition-all cursor-pointer shadow-sm`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="flex flex-col gap-2 p-4 shadow-xl border-border/50 max-w-xs">
                          <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-2 mb-1">
                            <p className="font-bold text-[13px] text-foreground">
                              {format(day, "EEEE, dd/MM/yyyy", { locale: vi })}
                            </p>
                            {score > 0 && (
                              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                +{score} điểm
                              </span>
                            )}
                          </div>
                          {hasActivity ? (
                            <>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span>Tổng: <strong className="text-foreground">{activities}</strong> hoạt động</span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-1 text-xs">
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Commits</span>
                                  <span className="font-extrabold text-foreground">{commits}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Tasks</span>
                                  <span className="font-extrabold text-foreground">{tasks}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Tài liệu</span>
                                  <span className="font-extrabold text-foreground">{docs}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Đánh giá</span>
                                  <span className="font-extrabold text-foreground">{reviews}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-muted-foreground text-xs">Không có hoạt động</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-end gap-3 text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
        <span>Ít</span>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-md bg-muted/50" />
          <div className="w-5 h-5 rounded-md bg-primary/40" />
          <div className="w-5 h-5 rounded-md bg-primary/60" />
          <div className="w-5 h-5 rounded-md bg-primary/80" />
          <div className="w-5 h-5 rounded-md bg-primary" />
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
}
