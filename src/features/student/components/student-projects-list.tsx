"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { FolderKanban, Crown, Plus, Loader2, Settings } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useCreateTeamProject } from "@/features/projects/hooks/useProjects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCourseStudents, useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import Link from "next/link";

interface GroupMember {
  name: string;
  role: string;
  email: string;
  initials: string;
}

interface ProjectGroup {
  id: string;
  name: string;
  topic: string;
  leader: string;
  members: GroupMember[];
  projectId?: string;
}

interface StudentProjectsListProps {
  courseId?: string;
}

export function StudentProjectsList({ courseId }: StudentProjectsListProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<string>("");

  const isStudent = user?.applicationRole === "STUDENT";

  const { data: studentsData, isLoading: isLoadingStudents, refetch: refetchStudents } = useCourseStudents(
    courseId || "",
    undefined,
    { enabled: !isStudent }
  );

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch: refetchMyTeam } = useMyTeamMembers(
    courseId || "",
    { enabled: isStudent }
  );

  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const createProjectMutation = useCreateTeamProject(activeTeamId);

  const isLoading = isLoadingCourse || (isStudent ? isLoadingMyTeam : isLoadingStudents);
  const refetch = isStudent ? refetchMyTeam : refetchStudents;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    createProjectMutation.mutate(
      { name: projectName },
      {
        onSuccess: () => {
          toast.success("Khởi tạo dự án thành công!");
          setIsDialogOpen(false);
          setProjectName("");
          refetch();
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi khởi tạo dự án");
        }
      }
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  // Xử lý dữ liệu thật từ API
  let realGroups: ProjectGroup[] = [];
  let userActiveGroup: string | undefined = undefined;

  if (isStudent) {
    if (myTeamData) {
      const membersList: GroupMember[] = (myTeamData.members?.content || []).map(m => ({
        name: m.fullName,
        role: m.roleInTeam === "LEADER" ? "Trưởng nhóm" : "Thành viên",
        email: "",
        initials: m.fullName.charAt(0)
      }));

      const leaderObj = myTeamData.members?.content?.find(m => m.roleInTeam === "LEADER");

      realGroups = [
        {
          id: myTeamData.teamId,
          name: myTeamData.teamName,
          topic: myTeamData.project?.name || "Chưa có đề tài",
          leader: leaderObj?.fullName || "",
          projectId: myTeamData.project?.projectId,
          members: membersList
        }
      ];
      userActiveGroup = myTeamData.teamName;
    }
  } else {
    const studentsWithTeam = studentsData?.studentsWithTeam?.content || [];
    const teamsMap = new Map<string, ProjectGroup>();

    studentsWithTeam.forEach(s => {
      if (!s.team) return;
      const teamId = s.team.teamId;

      if (!teamsMap.has(teamId)) {
        teamsMap.set(teamId, {
          id: teamId,
          name: s.team.teamName,
          topic: s.team.projectName || "Chưa có đề tài",
          leader: "",
          projectId: s.team.projectId,
          members: []
        });
      }

      const team = teamsMap.get(teamId)!;
      const role = s.team.teamMembers.find(m => m.studentId === s.studentId)?.roleInTeam || "MEMBER";

      team.members.push({
        name: s.fullName,
        role: role === "LEADER" ? "Trưởng nhóm" : "Thành viên",
        email: s.email,
        initials: s.fullName.charAt(0)
      });

      if (role === "LEADER") {
        team.leader = s.fullName;
      }
    });

    realGroups = Array.from(teamsMap.values());
    userActiveGroup = realGroups.find(g => g.members.some(m => m.email === user?.email))?.name;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">

        {/* Header Section */}
        <PageHeader
          title="Danh sách nhóm dự án"
          description={
            courseData
              ? `Danh sách thành viên và đề tài của các nhóm trong Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl bg-muted/40" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {realGroups.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border border-dashed rounded-3xl">
                {isStudent
                  ? "Bạn chưa tham gia vào nhóm nào trong khóa học này."
                  : "Chưa có nhóm nào được tạo trong khóa học này."}
              </div>
            )}
            {realGroups.map((group) => {
              const isOwnGroup = group.name === userActiveGroup;
              
              // Sắp xếp Trưởng nhóm lên đầu danh sách thành viên
              const sortedMembers = [...group.members].sort((a, b) => {
                const aIsLeader = a.role === "Trưởng nhóm";
                const bIsLeader = b.role === "Trưởng nhóm";
                if (aIsLeader && !bIsLeader) return -1;
                if (!aIsLeader && bIsLeader) return 1;
                return 0;
              });

              return (
                <div
                  key={group.id}
                  className={`relative rounded-3xl p-5 md:p-6 flex flex-col gap-4 hover-lift border ${isOwnGroup
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary shadow-lg shadow-primary/20"
                    : "glass-panel"
                    }`}
                >
                  {/* Top Row: Group Identity & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isOwnGroup
                          ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(234,88,12,0.3)]"
                          : "bg-muted/50 text-muted-foreground"
                          }`}>
                          {group.name}
                        </span>
                        {isOwnGroup && (
                          <span className="text-[10px] font-bold uppercase text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded animate-pulse">
                            Nhóm của bạn
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <FolderKanban size={14} className="text-primary shrink-0" />
                        {group.topic}
                      </h3>
                    </div>

                    {isOwnGroup && (
                      group.projectId ? (
                        <Link href={`/student/${courseId}/projects/create`}>
                          <Button className="glass-button rounded-xl font-bold shrink-0 w-full sm:w-auto h-11 flex items-center justify-center">
                            <Settings size={16} className="mr-2" strokeWidth={3} />
                            Cấu hình Dự án
                          </Button>
                        </Link>
                      ) : (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="glass-button rounded-xl font-bold shrink-0 w-full sm:w-auto h-11 flex items-center justify-center"
                              onClick={() => setActiveTeamId(group.id)}
                            >
                              <Plus size={16} className="mr-2" strokeWidth={3} />
                              Khởi tạo Dự án
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50">
                            <DialogHeader className="mb-4">
                              <DialogTitle className="text-2xl font-extrabold tracking-tight">Khởi tạo Dự án mới</DialogTitle>
                              <DialogDescription className="text-sm mt-1">
                                Tạo một không gian làm việc mới cho <span className="font-bold text-primary">{group.name}</span>. Sau khi khởi tạo, bạn có thể liên kết dự án với Jira và GitHub.
                              </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleCreateProject} className="space-y-6">
                              <div className="space-y-2">
                                <Label htmlFor="projectName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                  Tên Dự án <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="projectName"
                                  placeholder="Nhập tên dự án (VD: SAGA Library System)..."
                                  className="rounded-xl h-12 bg-muted/50 border-border/50 focus-visible:ring-primary/20 font-medium"
                                  value={projectName}
                                  onChange={(e) => setProjectName(e.target.value)}
                                  autoFocus
                                />
                              </div>

                              <div className="flex justify-end gap-3 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="rounded-xl h-11 px-6 font-bold"
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  type="submit"
                                  className="glass-button rounded-xl h-11 px-6 font-bold flex items-center justify-center"
                                  disabled={createProjectMutation.isPending}
                                >
                                  {createProjectMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <FolderKanban className="h-4 w-4 mr-2" />
                                  )}
                                  Tạo Dự án
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )
                    )}
                  </div>

                  {/* Bottom Row: Member Names list (on its own line) */}
                  <div className="border-t border-border/20 pt-4 mt-1 space-y-2">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Thành viên trong nhóm</div>
                    <div className="flex flex-col gap-2">
                      {sortedMembers.length > 0 ? sortedMembers.map((member, i) => {
                        const isLeader = member.role === "Trưởng nhóm";
                        return (
                          <div
                            key={i}
                            className={
                              isLeader
                                ? "bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-primary flex items-center justify-between hover:bg-primary/20 transition-all shadow-sm shadow-primary/5 w-full"
                                : "bg-muted/15 border border-border/10 rounded-2xl px-4 py-2.5 text-xs font-bold text-foreground/80 hover:bg-muted/30 transition-colors w-full"
                            }
                          >
                            <div className="flex items-center gap-2.5">
                              {isLeader ? (
                                <Crown size={14} className="fill-primary text-primary shrink-0 animate-bounce" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 ml-1 mr-0.5" />
                              )}
                              <span>{member.name}</span>
                            </div>
                            {isLeader && (
                              <span className="text-[8px] font-black uppercase bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full tracking-wider">
                                Trưởng nhóm
                              </span>
                            )}
                          </div>
                        );
                      }) : (
                        <span className="text-xs text-muted-foreground italic">Không có thành viên nào</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
