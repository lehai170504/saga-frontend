"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useTeamSprints } from "@/features/projects/hooks/useTeamSprints";
import { TeamSprintReviews } from "@/features/lecturer/components/peer-review/team-sprint-reviews";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Timer, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LecturerPeerReviewsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  
  // Lấy danh sách nhóm từ Course Students
  const { data: studentsData, isLoading: isLoadingTeams } = useCourseStudents(courseId);

  const teams = useMemo(() => {
    const list = studentsData?.studentsWithTeam?.content || [];
    const map = new Map<string, { id: string, name: string }>();
    list.forEach(s => {
      if (s.team && !map.has(s.team.teamId)) {
        map.set(s.team.teamId, { id: s.team.teamId, name: s.team.teamName });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }));
  }, [studentsData]);

  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  const effectiveTeamId = selectedTeamId || (teams.length > 0 ? teams[0].id : "");

  // Lấy danh sách Sprints của Team được chọn
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(effectiveTeamId);
  const sprints = sprintsData?.sprints || [];

  const effectiveSprintId = (selectedSprintId && sprints.some(s => s.sprintId === selectedSprintId))
    ? selectedSprintId
    : (sprints.length > 0 ? sprints[sprints.length - 1].sprintId : "");

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Đánh giá chéo (Peer Review)" 
        description="Xem kết quả đánh giá chéo giữa các thành viên trong nhóm theo từng Sprint" 
      />

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm w-fit max-w-full">
        <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[200px]">
          <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
            <Users size={16} />
          </div>
          <div className="flex-1">
            {isLoadingTeams ? (
              <Skeleton className="h-9 w-full" />
            ) : teams.length > 0 ? (
              <Select value={effectiveTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-full h-9 bg-background border-border/50">
                  <SelectValue placeholder="Chọn một nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Info size={14} /> Chưa có nhóm
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block h-8 w-px bg-border/50"></div>

        <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[200px]">
          <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
            <Timer size={16} />
          </div>
          <div className="flex-1">
            {isLoadingSprints && effectiveTeamId ? (
              <Skeleton className="h-9 w-full" />
            ) : sprints.length > 0 ? (
              <Select value={effectiveSprintId} onValueChange={setSelectedSprintId}>
                <SelectTrigger className="w-full h-9 bg-background border-border/50">
                  <SelectValue placeholder="Chọn một Sprint" />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map(sprint => (
                    <SelectItem key={sprint.sprintId} value={sprint.sprintId}>
                      {sprint.sprintName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Info size={14} /> Chưa có Sprint
              </div>
            )}
          </div>
        </div>
      </div>

      <TeamSprintReviews 
        courseId={courseId}
        teamId={effectiveTeamId}
        sprintId={effectiveSprintId}
      />
    </div>
  );
}
