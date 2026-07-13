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

// Mock data generation for heatmap for a specific project
const generateHeatmapData = (projectId: string) => {
  const students = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1); // 30 days

  return students.map(student => ({
    name: student,
    data: days.map(day => {
      // Randomly generate activity count favoring low numbers but occasionally high
      const isWeekend = day % 7 === 0 || day % 7 === 6;
      let count = 0;
      if (!isWeekend) {
        count = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
        if (Math.random() > 0.9) count += Math.floor(Math.random() * 8) + 5; // Occasional spike
      } else {
        count = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0;
      }
      return { day, count };
    })
  }));
};

// Helper to determine color based on count
const getColorClass = (count: number) => {
  if (count === 0) return "bg-muted/30 border-border/20";
  if (count <= 2) return "bg-primary/20 border-primary/20";
  if (count <= 5) return "bg-primary/50 border-primary/30";
  if (count <= 8) return "bg-primary/80 border-primary/50";
  return "bg-primary border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]";
};

export function ProjectHeatmap({ projectId }: { projectId: string }) {
  const [filterType, setFilterType] = useState("all");
  const heatmapData = React.useMemo(() => generateHeatmapData(projectId), [projectId]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-muted-foreground text-xs font-semibold backdrop-blur-md">
            <Activity size={14} className="text-teal-500" />
            Agile Velocity & Code Quality
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
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
              {heatmapData.map((student, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-[140px] shrink-0 flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate w-full text-right">{student.name}</span>
                  </div>

                  <div className="flex-1 flex gap-1.5">
                    {student.data.map((dayData, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="relative flex-1 group/cell"
                      >
                        <div
                          className={`w-full aspect-square rounded-[4px] border transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(dayData.count)}`}
                        />
                        {/* Custom Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-xl opacity-0 invisible group-hover/cell:opacity-100 group-hover/cell:visible transition-all z-20 shadow-xl pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
                          {dayData.count === 0 ? 'Không có hoạt động' : `${dayData.count} Story Points / Thao tác`} vào Ngày {dayData.day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
