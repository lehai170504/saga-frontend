"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, Check, Code, FileText, CheckCircle2, Search, AlertCircle } from "lucide-react";

interface TaskLabelsInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const SAGA_MARKERS = [
  {
    label: "saga:code",
    name: "Lập trình",
    desc: "Tính vào đóng góp Code",
    icon: Code,
    activeBg: "bg-blue-500/15 border-blue-500/50 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/30",
    inactiveBg: "bg-muted/30 border-border/40 text-muted-foreground hover:border-blue-500/30 hover:bg-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    label: "saga:test",
    name: "Kiểm thử",
    desc: "Tính vào đóng góp Test",
    icon: CheckCircle2,
    activeBg: "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30",
    inactiveBg: "bg-muted/30 border-border/40 text-muted-foreground hover:border-emerald-500/30 hover:bg-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    label: "saga:document",
    name: "Tài liệu",
    desc: "Tính vào đóng góp Document",
    icon: FileText,
    activeBg: "bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30",
    inactiveBg: "bg-muted/30 border-border/40 text-muted-foreground hover:border-amber-500/30 hover:bg-amber-500/5",
    iconColor: "text-amber-500",
  },
  {
    label: "saga:research",
    name: "Nghiên cứu",
    desc: "Tính vào đóng góp Research",
    icon: Search,
    activeBg: "bg-purple-500/15 border-purple-500/50 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500/30",
    inactiveBg: "bg-muted/30 border-border/40 text-muted-foreground hover:border-purple-500/30 hover:bg-purple-500/5",
    iconColor: "text-purple-500",
  },
];

export function getSagaMarkerBadgeStyle(label: string) {
  switch (label.toLowerCase()) {
    case "saga:code":
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "saga:test":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "saga:document":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "saga:research":
      return "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400";
    default:
      return "border-primary/20 bg-primary/5 text-primary/80";
  }
}

export function getSagaMarkerDisplayName(label: string) {
  switch (label.toLowerCase()) {
    case "saga:code":
      return "Lập trình";
    case "saga:test":
      return "Kiểm thử";
    case "saga:document":
      return "Tài liệu";
    case "saga:research":
      return "Nghiên cứu";
    default:
      return label;
  }
}

export function TaskLabelsInput({ value, onChange }: TaskLabelsInputProps) {
  const existingList = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleToggleMarker = (marker: string) => {
    if (existingList.includes(marker)) {
      const nextList = existingList.filter((item) => item !== marker);
      onChange(nextList.join(", "));
    } else {
      const nextList = [...existingList, marker];
      onChange(nextList.join(", "));
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
          <Tag size={12} className="text-primary" />
          Nhãn phân loại công việc <span className="text-destructive">*</span>
        </label>
      </div>

      {/* 4 Strict Selectable Cards */}
      <div className="grid grid-cols-2 gap-2">
        {SAGA_MARKERS.map((item) => {
          const isSelected = existingList.includes(item.label);
          const IconComp = item.icon;

          return (
            <div
              key={item.label}
              onClick={() => handleToggleMarker(item.label)}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between space-y-1.5 ${isSelected ? item.activeBg : item.inactiveBg
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconComp size={14} className={item.iconColor} />
                  <span className="text-xs font-black">{item.name}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border/60 bg-background/50"
                    }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono px-1.5 py-0 rounded-md border-current/20 bg-current/5 font-bold"
                >
                  {item.label}
                </Badge>
                <span className="text-[9px] text-muted-foreground font-medium">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning if no label selected */}
      {existingList.length === 0 && (
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
          <AlertCircle size={12} className="shrink-0" />
          <span>Vui lòng chọn ít nhất 1 loại công việc để hệ thống ghi nhận tỷ trọng đóng góp.</span>
        </div>
      )}
    </div>
  );
}
