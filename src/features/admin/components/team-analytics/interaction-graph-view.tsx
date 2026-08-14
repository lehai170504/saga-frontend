"use client";

import React, { useState } from "react";
import { InteractionGraph } from "./interaction-graph";
import { useStudentInteractions, useTeamMembers } from "@/features/lecturer/hooks/useAnalytics";
import { TeamMemberResponse } from "@/features/lecturer/types/analytics";
import { Skeleton } from "@/components/shared/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface InteractionGraphViewProps {
  courseId: string;
  teamId: string;
}

export function InteractionGraphView({ courseId, teamId }: InteractionGraphViewProps) {
  const { data: membersData, isLoading: isMembersLoading } = useTeamMembers(courseId, teamId);
  const members = membersData?.content || [];

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Tự động chọn sinh viên đầu tiên nếu chưa chọn ai (giống bên Lecturer)
  const activeStudentId = selectedStudentId || (members?.length > 0 ? members[0].studentId : "");

  const { data, isLoading } = useStudentInteractions(
    courseId,
    teamId,
    activeStudentId
  );

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Mạng tương tác (Interaction Graph)</h3>
          <p className="text-sm text-muted-foreground mt-1">Sơ đồ mạng lưới tương tác giữa một thành viên và phần còn lại của nhóm.</p>
        </div>

        {/* Student Selector */}
        <div className="w-full sm:w-[250px]">
          {isMembersLoading ? (
            <Skeleton className="h-10 w-full rounded-xl" />
          ) : (
            <Select
              value={activeStudentId}
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger className="w-full rounded-xl h-10 bg-background/50 border-border/50">
                <SelectValue placeholder="Chọn sinh viên trung tâm..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {members.map((member: TeamMemberResponse) => (
                  <SelectItem key={member.studentId} value={member.studentId} className="rounded-lg">
                    {member.fullName}
                  </SelectItem>
                ))}
                {members.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">Không có thành viên nào</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-primary rounded-full" /> Phối hợp (Commits/Tasks)</div>
          <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-success rounded-full" /> Review Code</div>
          <div className="flex items-center gap-2"><div className="w-4 h-1.5 border-b-[3px] border-dotted border-primary" /> Bình luận (Comments)</div>
          <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-destructive rounded-full" /> Giao việc (Assignment)</div>
        </div>
      </div>

      <div className="p-6 flex-1 bg-muted/5 relative min-h-[400px]">
        {/* Lưới nền (Grid Pattern) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {!activeStudentId ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card relative z-10">
            <User className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-lg">Chưa có thành viên nào</p>
            <p className="text-[13px] font-medium opacity-80 mt-1">Nhóm này hiện chưa có sinh viên, không thể vẽ đồ thị.</p>
          </div>
        ) : (
          <div className="relative z-10 w-full h-full">
            <InteractionGraph data={data} isLoading={isLoading} activeStudentId={activeStudentId} />
          </div>
        )}
      </div>
    </div>
  );
}
