"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Flame, Calendar } from "lucide-react";
import { HeatmapStudentRow } from "@/features/projects/types";

interface HeatmapHeaderFiltersProps {
  activePreset: "7d" | "14d" | "30d" | "custom";
  onPresetChange: (preset: "7d" | "14d" | "30d") => void;
  startDateStr: string;
  endDateStr: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  selectedStudentId?: string;
  onStudentChange: (val: string | undefined) => void;
  students: HeatmapStudentRow[];
}

export function HeatmapHeaderFilters({
  activePreset,
  onPresetChange,
  startDateStr,
  endDateStr,
  onStartDateChange,
  onEndDateChange,
  selectedStudentId,
  onStudentChange,
  students,
}: HeatmapHeaderFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/60 border border-border/50 p-6 rounded-[2rem] backdrop-blur-xl shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
            <Flame size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Biểu đồ Nhiệt Hoạt động (Heatmap Chart)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-medium pl-10">
          Ma trận trực quan hóa mật độ làm việc, tần suất commit và đóng góp theo từng ngày của các thành viên
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Preset Buttons */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPresetChange("7d")}
            className={`h-8 rounded-lg px-3 text-xs font-bold transition-all ${
              activePreset === "7d"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            7 ngày
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPresetChange("14d")}
            className={`h-8 rounded-lg px-3 text-xs font-bold transition-all ${
              activePreset === "14d"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            14 ngày
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPresetChange("30d")}
            className={`h-8 rounded-lg px-3 text-xs font-bold transition-all ${
              activePreset === "30d"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            30 ngày
          </Button>
        </div>

        {/* Student Filter Dropdown */}
        {students.length > 0 && (
          <select
            value={selectedStudentId || ""}
            onChange={(e) => onStudentChange(e.target.value || undefined)}
            className="h-9 px-3 rounded-xl bg-background border border-border/60 text-xs font-bold text-foreground outline-none cursor-pointer shadow-sm hover:border-primary transition-all"
          >
            <option value="">Tất cả thành viên trong nhóm</option>
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.fullName} ({s.studentCode})
              </option>
            ))}
          </select>
        )}

        {/* Date Picker Range */}
        <div className="flex items-center gap-2 bg-background border border-border/60 rounded-xl px-3 py-1.5 shadow-sm text-xs font-bold">
          <Calendar size={14} className="text-muted-foreground" />
          <input
            type="date"
            value={startDateStr}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-transparent text-foreground outline-none font-semibold cursor-pointer"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="date"
            value={endDateStr}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-transparent text-foreground outline-none font-semibold cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
