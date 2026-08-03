"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FolderKanban, ShieldCheck, Link2 } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStudentCourse } from "@/context/StudentCourseContext";
import { useCourseStudents, useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCreateTeamProject } from "@/features/projects/hooks/useProjects";
import { ProjectIntegrationPanel } from "@/features/integrations/components/project-integration-panel";

export function StudentProjectCreate() {
  const { courseId, course, isLoading: isLoadingCourse } = useStudentCourse();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const isStudent = user?.applicationRole === "STUDENT";

  const { data: studentsData, isLoading: isLoadingStudents, refetch: refetchStudents } = useCourseStudents(
    courseId,
    undefined,
    { enabled: !isStudent }
  );

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch: refetchMyTeam } = useMyTeamMembers(
    courseId,
    { enabled: isStudent }
  );

  // Find user's student record and team early to pass to hook
  const myProfileId = user?.localProfileId;
  const myStudentRecord = studentsData?.studentsWithTeam?.content?.find((s) => s.studentId === myProfileId);

  const myTeam = isStudent
    ? (myTeamData ? {
        teamId: myTeamData.teamId,
        teamName: myTeamData.teamName,
        projectId: myTeamData.project?.projectId,
        projectName: myTeamData.project?.name || "",
      } : null)
    : myStudentRecord?.team;

  const myRole = isStudent
    ? myTeamData?.roleInTeam
    : myStudentRecord?.team?.teamMembers?.find(m => m.studentId === myProfileId)?.roleInTeam;

  const { mutate: createProject, isPending: isCreating } = useCreateTeamProject(myTeam?.teamId || "");

  const [projectName, setProjectName] = useState("");

  const isLoading = isLoadingCourse || isLoadingAuth || (isStudent ? isLoadingMyTeam : isLoadingStudents);
  const refetch = isStudent ? refetchMyTeam : refetchStudents;

  if (isLoading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background p-6 space-y-6">
        <Skeleton className="h-20 rounded-2xl bg-muted/30" />
        <Skeleton className="h-96 rounded-3xl bg-muted/30" />
      </div>
    );
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Vui lòng điền tên đề tài dự án");
      return;
    }

    createProject({ name: projectName }, {
      onSuccess: () => {
        toast.success("Khởi tạo dự án thành công!");
        refetch(); // Refetch to get the new projectId
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo dự án");
      }
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">

        {/* Header Section */}
        <PageHeader
          title="Cấu hình & Kết nối Dự án Nhóm"
          description={course ? `Khóa học ${course.courseCode || ""}` : "Đang tải dữ liệu khóa học..."}
        />

        {!myTeam ? (
          <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-xl font-bold text-destructive">Bạn chưa được phân nhóm</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Hiện tại bạn chưa thuộc nhóm nào trong khóa học này. Vui lòng liên hệ giảng viên để được sắp xếp nhóm trước khi thực hiện chức năng này.
            </p>
          </Card>
        ) : !myTeam.projectId ? (
          <form onSubmit={handleCreateProject} className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                    <FolderKanban size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">Đăng ký Đề tài Dự án</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Thông tin đề tài của nhóm bạn</p>
                  </div>
                </div>

                {myRole === "LEADER" ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="project-name" className="text-xs font-bold text-muted-foreground">Tên đề tài / Dự án</Label>
                      <Input
                        id="project-name"
                        placeholder="Ví dụ: Hệ thống quản lý thư viện số SAGA"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="h-11 rounded-xl bg-background border-border font-medium text-xs focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted/30 border border-border/50 rounded-2xl text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      Chưa có dự án nào được đăng ký cho nhóm này.
                      <br />Chỉ Leader của nhóm mới có quyền tạo dự án.
                    </p>
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 space-y-6">
                <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 border-b border-border/40 pb-4">
                  <ShieldCheck className="text-primary" size={16} />
                  <span>Xác nhận thông tin</span>
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Khóa học:</span>
                    <span className="text-foreground text-right font-extrabold">{course?.courseCode}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Lớp học:</span>
                    <span className="text-foreground text-right font-extrabold">{course?.clazz?.name}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Nhóm dự án:</span>
                    <span className="text-primary text-right font-extrabold">{myTeam.teamName}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Vai trò của bạn:</span>
                    <span className="text-foreground text-right font-extrabold">{myRole}</span>
                  </div>
                </div>

                {myRole === "LEADER" && (
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                  >
                    {isCreating ? "Đang tạo..." : "Khởi tạo Project"}
                  </Button>
                )}
              </Card>
            </div>
          </form>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">Dự án đang thực hiện</h3>
                  <p className="text-lg font-black text-foreground mt-1">{myTeam.projectName}</p>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <FolderKanban size={24} />
                </div>
              </Card>

              {/* Show Integration Panel */}
              <ProjectIntegrationPanel projectId={myTeam.projectId} />
            </div>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 space-y-6">
                <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 border-b border-border/40 pb-4">
                  <ShieldCheck className="text-primary" size={16} />
                  <span>Thông tin Nhóm</span>
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Nhóm dự án:</span>
                    <span className="text-primary text-right font-extrabold">{myTeam.teamName}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Vai trò của bạn:</span>
                    <span className="text-foreground text-right font-extrabold">{myRole}</span>
                  </div>
                </div>
              </Card>

              <Card className="border border-primary/20 bg-primary/10 rounded-3xl p-5 flex gap-3.5 items-start shadow-sm text-left">
                <Link2 className="text-primary shrink-0" size={16} />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-foreground text-[11px] uppercase tracking-wide">Quản lý tích hợp</h4>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed">
                    Chỉ nhóm trưởng (Leader) mới có quyền sửa đổi cấu hình tích hợp GitHub và Jira. Các thành viên khác chỉ có thể xem trạng thái.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
