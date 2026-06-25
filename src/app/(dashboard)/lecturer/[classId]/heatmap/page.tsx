"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { heatmapData } from "@/mock-data/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { DrillDownDrawer } from "@/components/shared/DrillDownDrawer";

export default function HeatmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getLevelClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-900/50 dark:text-orange-400";
      case 2:
        return "bg-orange-300 border-orange-400 text-orange-900 dark:bg-orange-900/60 dark:border-orange-800/60 dark:text-orange-200";
      case 3:
        return "bg-orange-500 border-orange-600 text-white shadow-sm dark:bg-orange-600 dark:border-orange-500";
      case 4:
        return "bg-orange-600 border-orange-700 text-white shadow-sm dark:bg-orange-500 dark:border-orange-400";
      default:
        return "bg-muted/50 border-border text-muted-foreground";
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-background min-h-screen">
      <PageHeader
        title="Biểu đồ nhiệt hoạt động"
        description="Giám sát tính liên tục trong hoạt động làm việc nhóm và commit code."
      >
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] h-10 bg-background border-input rounded-lg text-sm font-medium shadow-sm focus:ring-primary">
            <SelectValue placeholder="Loại hoạt động" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-popover text-popover-foreground">
            <SelectItem value="all">Tất cả hoạt động</SelectItem>
            <SelectItem value="commits">Chỉ Commits</SelectItem>
            <SelectItem value="prs">Pull Requests</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="group-1">
          <SelectTrigger className="w-35 h-10 bg-background border-input rounded-lg text-sm font-medium shadow-sm focus:ring-primary">
            <SelectValue placeholder="Chọn nhóm" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-popover text-popover-foreground">
            <SelectItem value="group-1">Team Alpha</SelectItem>
            <SelectItem value="group-2">Team Beta</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="30days">
          <SelectTrigger className="w-35 h-10 bg-background border-input rounded-lg text-sm font-medium shadow-sm focus:ring-primary">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-popover text-popover-foreground">
            <SelectItem value="14days">14 ngày qua</SelectItem>
            <SelectItem value="30days">30 ngày qua</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <Card className="border-border shadow-sm rounded-2xl bg-card text-card-foreground flex flex-col pt-2">
        <SectionHeader
          title="Tần suất đóng góp hệ thống"
          description="Hiển thị mật độ hoạt động theo từng ngày"
          rightElement={
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Ít</span>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-muted/50 border border-border"></div>
                <div className="w-4 h-4 rounded-sm bg-orange-100 border border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/50"></div>
                <div className="w-4 h-4 rounded-sm bg-orange-300 border border-orange-400 dark:bg-orange-900/60 dark:border-orange-800/60"></div>
                <div className="w-4 h-4 rounded-sm bg-orange-500 border border-orange-600 dark:bg-orange-600 dark:border-orange-500"></div>
                <div className="w-4 h-4 rounded-sm bg-orange-600 border border-orange-700 dark:bg-orange-500 dark:border-orange-400"></div>
              </div>
              <span>Nhiều</span>
            </div>
          }
        />

        <CardContent className="p-8">
          <div className="flex flex-wrap gap-3 max-w-5xl mx-auto justify-center">
            {isLoading
              ? Array.from({ length: 45 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl opacity-60 bg-muted"
                  />
                ))
              : heatmapData.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(item.date)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex flex-col items-center justify-center text-sm font-bold transition-all hover:-translate-y-1 hover:shadow-md hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-background cursor-pointer ${getLevelClass(
                      item.level,
                    )}`}
                    title={`${item.date}: ${item.count} hoạt động`}
                  >
                    <span>
                      {item.date.includes("-")
                        ? item.date.split("-")[2]
                        : item.date}
                    </span>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      <DrillDownDrawer
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        date={selectedDate}
      />
    </div>
  );
}
