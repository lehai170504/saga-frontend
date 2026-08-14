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

  const { data, isLoading } = useStudentInteractions(
    courseId,
    teamId,
    selectedStudentId
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
              value={selectedStudentId}
              onValueChange={setSelectedStudentId}
            >
              <SelectTrigger className="w-full rounded-xl h-10">
                <SelectValue placeholder="Chọn thành viên" />
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

      <div className="p-6 flex-1 bg-muted/5">
        {!selectedStudentId ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card">
            <User className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold text-lg">Chưa chọn thành viên</p>
            <p className="text-[13px] font-medium opacity-80 mt-1">Vui lòng chọn một thành viên để xem sơ đồ tương tác của họ.</p>
          </div>
        ) : (
          <InteractionGraph data={data} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
