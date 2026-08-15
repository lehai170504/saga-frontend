"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FolderKanban, ShieldCheck, Link2, Loader2, Plus, ArrowLeft, Edit2 } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStudentCourse } from "@/context/StudentCourseContext";
import { useCourseStudents, useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCreateTeamProject, useProjectDetail, useUpdateProjectDetail } from "@/features/projects/hooks/useProjects";
import { useProjectTypes } from "@/features/admin/hooks/useProjectTypes";
import { ProjectIntegrationPanel } from "@/features/integrations/components/project-integration-panel";
import { SyncStatusMonitor } from "@/features/integrations/components/sync-status-monitor";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export function StudentProjectCreate() {
  const router = useRouter();
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
      projectId: myTeamData.project?.id,
      projectName: myTeamData.project?.name || "",
    } : null)
    : myStudentRecord?.team;

  const myRole = isStudent
    ? myTeamData?.roleInTeam
    : myStudentRecord?.team?.teamMembers?.find(m => m.studentId === myProfileId)?.roleInTeam;

  const { mutate: createProject, isPending: isCreating } = useCreateTeamProject(myTeam?.teamId || "");
  const { data: projectDetail } = useProjectDetail(myTeam?.projectId || "");
  const updateProjectMutation = useUpdateProjectDetail(myTeam?.projectId || "");

  const [projectName, setProjectName] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const { data: projectTypes } = useProjectTypes();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleOpenEdit = () => {
    setEditName(projectDetail?.name || myTeam?.projectName || "");
    setEditDescription(projectDetail?.description || "");
    setIsEditOpen(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Vui lòng điền tên đề tài dự án.");
      return;
    }

    updateProjectMutation.mutate(
      {
        name: editName.trim(),
        description: editDescription.trim() || null,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          refetch();
        },
      }
    );
  };

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

    if (!projectTypeId) {
      toast.error("Vui lòng chọn loại dự án (Project Type)");
      return;
    }

    createProject({ name: projectName, courseId: courseId || "", projectTypeId }, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6 ">

        {/* Nút quay lại */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 hover:bg-muted/50 -mb-2"
            onClick={() => {
              if (courseId) {
                router.push(`/student/${courseId}/projects`);
              } else {
                router.back();
              }
            }}
          >
            <ArrowLeft size={16} />
            Quay lại
          </Button>
        </div>

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
                    <div className="space-y-1.5 mt-4">
                      <Label className="text-xs font-bold text-muted-foreground">Loại dự án (Project Type)</Label>
                      <Select value={projectTypeId} onValueChange={setProjectTypeId}>
                        <SelectTrigger className="w-full h-11 rounded-xl border-border bg-background">
                          <SelectValue placeholder="Chọn loại dự án..." />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes?.map((pt) => (
                            <SelectItem key={pt.projectTypeId} value={pt.projectTypeId}>
                              {pt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 gap-2"
                  >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isCreating ? "Đang xử lý..." : "Khởi tạo Project"}
                  </Button>
                )}
              </Card>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Top Row: Project Detail & Integrations (2 cols) + Team Info Sidebar (1 col) */}
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group">
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">Dự án đang thực hiện</h3>
                      {myRole === "LEADER" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-1.5 px-3 py-1 cursor-pointer h-7 shadow-sm hover:shadow-md"
                          onClick={handleOpenEdit}
                        >
                          <Edit2 size={11} className="transition-transform group-hover:rotate-12" />
                          Sửa thông tin
                        </Button>
                      )}
                    </div>
                    <p className="text-lg font-black text-foreground mt-1">{projectDetail?.name || myTeam.projectName}</p>
                    {projectDetail?.description && (
                      <p className="text-sm text-foreground/80 mt-2.5 font-medium leading-relaxed max-w-2xl border-l-2 border-primary/30 pl-3">
                        {projectDetail.description}
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0 hidden md:block">
                    <FolderKanban size={24} />
                  </div>
                </Card>

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

            {/* Bottom Row: Full-width Sync Status Table */}
            <div className="space-y-6">
              <SyncStatusMonitor projectId={myTeam.projectId} />
            </div>

          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground">Chỉnh sửa thông tin Dự án</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Cập nhật tên đề tài và mô tả chi tiết của dự án nhóm.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProject} className="space-y-5 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-project-name" className="text-sm font-bold text-foreground">
                Tên đề tài / Dự án <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-project-name"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ví dụ: Hệ thống quản lý thư viện số SAGA"
                className="rounded-xl border-border/50 bg-background/80 h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-project-description" className="text-sm font-bold text-foreground">
                Mô tả dự án
              </Label>
              <Textarea
                id="edit-project-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Nhập mô tả ngắn gọn về đề tài của nhóm bạn..."
                className="rounded-xl resize-none border-border/50 bg-background/80 min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-border/40 pt-4 mt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl font-bold cursor-pointer h-11 px-5"
                onClick={() => setIsEditOpen(false)}
                disabled={updateProjectMutation.isPending}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer h-11 px-5"
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
