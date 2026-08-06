"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FolderKanban, Crown, Plus, Loader2, Settings, Users } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useCreateTeamProject } from "@/features/projects/hooks/useProjects";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface StudentProjectsListProps {
  courseId?: string;
}

export function StudentProjectsList({ courseId }: StudentProjectsListProps) {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const createProjectMutation = useCreateTeamProject(activeTeamId);

  const isLoading = isLoadingCourse || isLoadingMyTeam;

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const projectId = myTeamData?.project?.projectId || (myTeamData?.project as { id?: string })?.id;
  const members = myTeamData?.members?.content || [];

  // Sắp xếp Trưởng nhóm lên đầu
  const sortedMembers = [...members].sort((a, b) => {
    if (a.roleInTeam === "LEADER" && b.roleInTeam !== "LEADER") return -1;
    if (a.roleInTeam !== "LEADER" && b.roleInTeam === "LEADER") return 1;
    return 0;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">

        {/* Header Section */}
        <PageHeader
          title="Thông tin Nhóm"
          description={
            courseData
              ? `Xem thông tin chi tiết và không gian làm việc của nhóm trong Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        />

        {isLoading ? (
          <div className="glass-panel rounded-[2rem] p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-[2rem] bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
            </div>
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Card for Group Info */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
                    Nhóm của bạn
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-foreground">
                    {myTeamData.teamName}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground bg-background/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/50 inline-flex shadow-sm">
                  <FolderKanban size={18} className="text-primary" />
                  <span className="font-semibold text-sm">
                    {myTeamData.project?.name || "Chưa có đề tài"}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 relative z-10">
                {projectId ? (
                  <Link href={`/student/${courseId}/projects/create`}>
                    <Button className="w-full md:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]">
                      <Settings size={18} className="mr-2" strokeWidth={3} />
                      Cấu hình Dự án
                    </Button>
                  </Link>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full md:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]">
                        <Plus size={18} className="mr-2" strokeWidth={3} />
                        Khởi tạo Dự án
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">Khởi tạo Dự án mới</DialogTitle>
                        <DialogDescription className="text-sm mt-1 text-muted-foreground/80">
                          Tạo một không gian làm việc mới cho <span className="font-bold text-primary">{myTeamData.teamName}</span>. Sau khi khởi tạo, bạn có thể liên kết dự án với Jira và GitHub.
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
                            className="rounded-xl h-12 bg-muted/30 border-border/50 focus-visible:ring-primary/30 focus-visible:bg-background font-medium transition-all"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t border-border/40 mt-6">
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl h-11 px-6 font-bold hover:bg-muted/50 mt-4"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            className="rounded-xl h-11 px-6 font-bold flex items-center justify-center mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
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
                )}
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-5">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
                <Users size={16} />
                Thành viên trong nhóm ({sortedMembers.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedMembers.map((member) => {
                  const isLeader = member.roleInTeam === "LEADER";
                  return (
                    <div
                      key={member.studentId}
                      className={`glass-panel rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${isLeader ? 'border-primary/30 bg-primary/[0.03]' : 'hover:border-border/80'}`}
                    >
                      <Avatar className={`h-12 w-12 border-2 ${isLeader ? 'border-primary shadow-[0_0_12px_rgba(234,88,12,0.3)]' : 'border-background shadow-md'}`}>
                        <AvatarFallback className={`font-bold text-sm ${isLeader ? "bg-gradient-to-br from-primary to-orange-600 text-white" : "bg-muted text-muted-foreground"}`}>
                          {member.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold truncate text-foreground leading-tight">
                            {member.fullName}
                          </h4>
                          {isLeader && (
                            <div className="bg-primary/10 p-1 rounded-full shrink-0 animate-pulse">
                              <Crown size={12} className="fill-primary text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${isLeader ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground border-border/40'}`}>
                            {isLeader ? "Trưởng nhóm" : "Thành viên"}
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold truncate">
                            {member.studentCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
