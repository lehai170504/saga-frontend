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

  const maxCommits = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.commits));
  }, [data]);

  const getDayData = (date: Date) => {
    if (!data) return null;
    return data.find(d => isSameDay(parseISO(d.date), date));
  };

  const getIntensityClass = (commits: number) => {
    if (commits === 0) return "bg-muted/30"; // Level 0
    const ratio = commits / maxCommits;
    if (ratio <= 0.25) return "bg-primary/30"; // Level 1
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
    <div className="w-full overflow-x-auto p-6 bg-card rounded-2xl border border-border">
      <div className="flex gap-2 min-w-max">
        {/* Y Axis Labels (Days) */}
        <div className="flex flex-col gap-1.5 mt-6 pr-2 text-xs text-muted-foreground font-medium justify-between">
          {daysOfWeek.map((day, i) => (
            <div key={day} className="h-4 flex items-center">{i % 2 === 0 ? day : ""}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1.5">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1.5">
              {/* Month Label (only show if it's the first week of the month, approximated) */}
              <div className="h-5 text-xs text-muted-foreground font-medium flex items-end mb-1">
                {week[0].getDate() <= 7 ? format(week[0], "MMM", { locale: vi }) : ""}
              </div>

              {week.map((day, dayIdx) => {
                const dayData = getDayData(day);
                const commits = dayData?.commits || 0;

                return (
                  <div
                    key={dayIdx}
                    title={`${format(day, "dd/MM/yyyy")}: ${commits} hoạt động`}
                    className={`w-4 h-4 rounded-sm ${getIntensityClass(commits)} hover:ring-2 hover:ring-foreground transition-all cursor-pointer`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground font-medium">
        <span>Ít</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
}
