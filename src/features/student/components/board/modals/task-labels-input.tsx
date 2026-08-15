"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Tag, Plus, Check } from "lucide-react";

interface TaskLabelsInputProps {
  value: string;
  onChange: (val: string) => void;
}

const SAGA_MARKERS = [
  { label: "saga:code", name: "Lập trình", color: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20" },
  { label: "saga:test", name: "Kiểm thử", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20" },
  { label: "saga:document", name: "Tài liệu", color: "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20" },
  { label: "saga:research", name: "Nghiên cứu", color: "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/20" },
];

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
          <Tag size={12} className="text-primary" />
          Nhãn (Labels)
        </label>
        <span className="text-[10px] text-muted-foreground font-semibold">Phân loại đóng góp</span>
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ngăn cách bằng dấu phẩy, ví dụ: saga:code, FE, API"
        className="h-10 rounded-xl bg-background/50 border-border/40 text-xs px-4"
      />

      {/* Guide & Quick Add Markers */}
      <div className="p-3 rounded-2xl border border-border/40 bg-muted/20 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
          <Info size={13} className="text-primary shrink-0" />
          <span>Gán nhãn loại công việc (SAGA Markers):</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Nhấp vào các nhãn bên dưới để tự động gắn nhãn tiêu chuẩn. Hệ thống sẽ dựa vào đây để phân bổ tỷ trọng đóng góp tương ứng:
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {SAGA_MARKERS.map((item) => {
            const isAdded = existingList.includes(item.label);

            return (
              <Badge
                key={item.label}
                variant="outline"
                onClick={() => handleToggleMarker(item.label)}
                className={`cursor-pointer text-[10px] font-bold py-1 px-2.5 rounded-xl border transition-all flex items-center gap-1 select-none ${
                  item.color
                } ${isAdded ? "ring-2 ring-primary/50 shadow-sm" : ""}`}
              >
                {isAdded ? <Check size={11} className="text-primary" /> : <Plus size={11} />}
                <span>{item.label}</span>
                <span className="text-[9px] opacity-75 font-semibold">({item.name})</span>
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
