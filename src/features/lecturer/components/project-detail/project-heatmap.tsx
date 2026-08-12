import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar as CalendarIcon, Filter, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTeamHeatmap } from "@/features/lecturer/hooks/useAnalytics";
import { format, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to determine color based on count
const getColorClass = (count: number) => {
  if (count === 0) return "bg-muted/30 border-border/20";
  if (count <= 2) return "bg-primary/20 border-primary/20";
  if (count <= 5) return "bg-primary/50 border-primary/30";
  if (count <= 8) return "bg-primary/80 border-primary/50";
  return "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]";
};

export function ProjectHeatmap({ courseId, teamId }: { courseId: string; teamId: string }) {
  const [filterType, setFilterType] = useState("all");
  
  // Lấy dữ liệu 30 ngày gần nhất
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 29), "yyyy-MM-dd");
  
  const { data: heatmapData, isLoading } = useTeamHeatmap(courseId, teamId, startDate, endDate);
  
  // Dữ liệu mảng 30 ngày
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const teamHeatmap = heatmapData?.days || [];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
            <Activity size={14} className="text-success" />
            Agile Velocity & Code Quality
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Biểu đồ Nhiệt Vận tốc
          </h2>
          <p className="text-muted-foreground font-medium">Theo dõi tiến độ cày Story Points và Nợ Kỹ thuật (Bug Rate) của các thành viên trong nhóm</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[160px] h-10 bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted-foreground" />
                <SelectValue placeholder="Loại dữ liệu" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
              <SelectItem value="all">Tất cả (Tích lũy)</SelectItem>
              <SelectItem value="sp">Hoàn thành Story Points</SelectItem>
              <SelectItem value="bug">Bug / Nợ kỹ thuật</SelectItem>
              <SelectItem value="penalty">Bị phạt Slices</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="month">
            <SelectTrigger className="w-full sm:w-[140px] h-10 bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-muted-foreground" />
                <SelectValue placeholder="Thời gian" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50">
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="semester">Cả học kỳ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Heatmap Card */}
      <Card className="rounded-[2rem] border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-primary" size={20} />
              Tần suất theo ngày (30 ngày qua)
            </CardTitle>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
              <span>Thấp</span>
              <div className="flex gap-1 mx-2">
                <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border/20" />
                <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/20" />
                <div className="w-3 h-3 rounded-sm bg-primary/50 border border-primary/30" />
                <div className="w-3 h-3 rounded-sm bg-primary/80 border border-primary/50" />
                <div className="w-3 h-3 rounded-sm bg-primary border border-primary" />
              </div>
              <span>Cao</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 overflow-x-auto custom-scrollbar">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="flex mb-4 ml-[160px]">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[10px] font-bold text-muted-foreground/70 uppercase w-6">
                  {(i + 1) % 5 === 0 || i === 0 ? i + 1 : ""}
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="w-[140px] h-6" />
                  <div className="flex-1 flex gap-1.5">
                    {days.map(d => <Skeleton key={d} className="flex-1 aspect-square rounded-[4px]" />)}
                  </div>
                </div>
              ) : teamHeatmap.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border border-dashed rounded-xl">
                  Chưa có dữ liệu Commit trong khoảng thời gian này
                </div>
              ) : (
                <div className="flex items-center gap-4 group">
                  <div className="w-[140px] shrink-0 flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate w-full text-right">Tổng Team</span>
                  </div>

                  <div className="flex-1 flex gap-1.5">
                    {teamHeatmap.map((dayData, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="relative flex-1 group/cell"
                      >
                        <div
                          className={`w-full aspect-square rounded-[4px] border transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(dayData.commits)}`}
                        />
                        {/* Custom Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-xl opacity-0 invisible group-hover/cell:opacity-100 group-hover/cell:visible transition-all z-20 shadow-xl pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
                          {dayData.commits === 0 ? 'Không có hoạt động' : `${dayData.commits} Commits`} vào Ngày {dayData.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
