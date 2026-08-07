"use client";

import React, { useMemo } from "react";
import { HeatmapData } from "@/features/lecturer/types/analytics";
import { Skeleton } from "@/components/shared/Skeleton";
import { AlertCircle } from "lucide-react";
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek, subWeeks, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

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
        commits: Number(commits) || 0
      }));
    }
    return [];
  }, [data]);

  const maxCommits = useMemo(() => {
    if (actualData.length === 0) return 1;
    return Math.max(...actualData.map(d => d.commits));
  }, [actualData]);

  const getDayData = (date: Date) => {
    return actualData.find(d => isSameDay(parseISO(d.date), date));
  };

  const getIntensityClass = (commits: number) => {
    if (commits === 0) return "bg-muted"; // Level 0
    const ratio = commits / maxCommits;
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
      <div className="flex gap-3 min-w-max">
        {/* Y Axis Labels (Days) */}
        <div className="flex flex-col gap-1 mt-[26px] pr-1 text-[11px] text-muted-foreground font-medium">
          {daysOfWeek.map((day, i) => (
            <div key={day} className="h-3 flex items-center leading-none">{i % 2 === 0 ? day : ""}</div>
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
                    style={{ left: `${weekIdx * 16}px` }} // 12px width + 4px gap = 16px per column
                  >
                    {format(week[0], "MMM", { locale: vi })}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Grid of Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => {
                  const dayData = getDayData(day);
                  const commits = dayData?.commits || 0;

                  return (
                    <div
                      key={dayIdx}
                      title={`${format(day, "dd/MM/yyyy")}: ${commits} hoạt động`}
                      className={`w-3 h-3 rounded-[3px] ${getIntensityClass(commits)} hover:ring-2 hover:ring-foreground transition-all cursor-pointer`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-end gap-2 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
        <span>Ít</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[3px] bg-muted" />
          <div className="w-3 h-3 rounded-[3px] bg-primary/40" />
          <div className="w-3 h-3 rounded-[3px] bg-primary/60" />
          <div className="w-3 h-3 rounded-[3px] bg-primary/80" />
          <div className="w-3 h-3 rounded-[3px] bg-primary" />
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
}
