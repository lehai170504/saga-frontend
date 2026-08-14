"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { HeatmapDaySummary, HeatmapStudentRow } from "@/features/projects/types";

interface HeatmapMatrixTableProps {
  students: HeatmapStudentRow[];
  days: HeatmapDaySummary[];
  formatDateLabel: (dateStr: string) => string;
  getCellColorClass: (score: number) => string;
}

export function HeatmapMatrixTable({
  students,
  days,
  formatDateLabel,
  getCellColorClass,
}: HeatmapMatrixTableProps) {
  return (
    <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm overflow-hidden space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary" />
          <h3 className="font-black text-base text-foreground">Ma trận Biểu đồ Nhiệt theo Thành viên</h3>
        </div>
        <Badge variant="outline" className="rounded-xl text-[10px] font-bold py-1 px-3 border-primary/30 text-primary bg-primary/5">
          {students.length} Thành viên
        </Badge>
      </div>

      {/* Scrollable Grid Table */}
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/30">
              <th className="py-3 px-4 text-xs font-extrabold uppercase text-muted-foreground sticky left-0 bg-card/90 backdrop-blur-md z-10 w-48 shadow-sm">
                Thành viên
              </th>
              <th className="py-3 px-3 text-xs font-extrabold uppercase text-center text-muted-foreground w-20">
                Tổng Điểm
              </th>
              {days.map((day) => (
                <th
                  key={day.date}
                  className="py-3 px-1.5 text-[11px] font-bold text-center text-muted-foreground min-w-[42px]"
                >
                  {formatDateLabel(day.date)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/20 text-xs">
            {students.map((student) => (
              <tr key={student.studentId} className="hover:bg-muted/20 transition-colors group">
                {/* Student Info */}
                <td className="py-3 px-4 font-bold text-foreground sticky left-0 bg-card/90 backdrop-blur-md z-10 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-[10px] shrink-0">
                      {student.fullName?.charAt(0) || "S"}
                    </div>
                    <div className="truncate max-w-[130px]">
                      <div className="font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                        {student.fullName}
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground">
                        {student.studentCode}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Total Student Score */}
                <td className="py-3 px-3 text-center font-black text-amber-600 dark:text-amber-400">
                  {student.totalScore}
                </td>

                {/* Heatmap Cells */}
                {student.cells.map((cell) => (
                  <td key={cell.date} className="py-2 px-1 text-center">
                    <div
                      title={`Ngày ${cell.date}\n${student.fullName}\nScore: ${cell.totalScore}đ\nCommits: ${cell.commits}\nTasks: ${cell.tasks}\nReviews: ${cell.peerReviews}\nComments: ${cell.comments}`}
                      className={`w-9 h-9 rounded-xl border flex flex-col items-center justify-center mx-auto cursor-pointer transition-all duration-200 hover:scale-110 ${getCellColorClass(
                        cell.totalScore
                      )}`}
                    >
                      <span className="text-[11px] font-extrabold">{cell.totalScore > 0 ? cell.totalScore : ""}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}

            {/* Team Daily Summary Row */}
            {days.length > 0 && (
              <tr className="bg-muted/30 border-t-2 border-border/50 font-bold">
                <td className="py-3.5 px-4 font-black text-foreground sticky left-0 bg-muted/90 backdrop-blur-md z-10">
                  Tổng cộng Team
                </td>
                <td className="py-3.5 px-3 text-center font-black text-amber-500">
                  {days.reduce((sum, d) => sum + d.totalScore, 0)}
                </td>
                {days.map((day) => (
                  <td key={day.date} className="py-2 px-1 text-center">
                    <div
                      title={`Tổng cả Nhóm ngày ${day.date}\nĐiểm: ${day.totalScore}đ\nCommits: ${day.commits}\nTasks: ${day.tasks}`}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center mx-auto ${getCellColorClass(
                        day.totalScore
                      )}`}
                    >
                      <span className="text-[11px] font-extrabold">{day.totalScore > 0 ? day.totalScore : ""}</span>
                    </div>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
