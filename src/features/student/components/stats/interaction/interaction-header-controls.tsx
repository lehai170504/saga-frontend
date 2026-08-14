"use client";

import React from "react";
import { Network } from "lucide-react";

interface InteractionHeaderControlsProps {
  focalStudentId: string;
  onSelectFocalStudent: (studentId: string) => void;
  teamMembers?: { studentId: string; fullName: string; studentCode: string; roleInTeam: string }[];
}

export function InteractionHeaderControls({
  focalStudentId,
  onSelectFocalStudent,
  teamMembers = [],
}: InteractionHeaderControlsProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/60 border border-border/50 p-6 rounded-[2rem] backdrop-blur-xl shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Network size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Mạng Tương tác Đóng góp (Interaction Graph)
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-medium pl-10">
          Trực quan hóa đồ thị liên kết review, comment, phân công task và commit mã nguồn giữa các thành viên
        </p>
      </div>

      {/* Member Selector Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground shrink-0">Chọn sinh viên làm trung tâm:</span>
        <select
          value={focalStudentId}
          onChange={(e) => onSelectFocalStudent(e.target.value)}
          className="h-10 px-3.5 rounded-xl bg-background border border-border/60 text-xs font-bold text-foreground outline-none cursor-pointer shadow-sm hover:border-primary transition-all"
        >
          {teamMembers.map((m) => (
            <option key={m.studentId} value={m.studentId}>
              {m.fullName} ({m.studentCode}) {m.roleInTeam === "LEADER" ? "👑 Leader" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
