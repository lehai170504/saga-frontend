"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FolderGit2,
  Loader2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  KanbanSquare,
  CheckCircle2,
  Clock,
  Edit2,
  X,
  Save,
  ArrowLeft
} from "lucide-react";
import { useProjectDetail, useProjectStats, useUpdateProject } from "@/features/admin/hooks/useProjects";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import { Progress } from "@/components/ui/progress";
import { UpdateGroupWeightsModal } from "@/features/admin/components/projects/update-group-weights-modal";

export default function AdminProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: project, isLoading: isLoadingProject } = useProjectDetail(projectId);
  const { data: stats, isLoading: isLoadingStats } = useProjectStats(projectId);
  const updateProject = useUpdateProject();



  const handleUpdate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    updateProject.mutate(
      { projectId, data: { name, description } },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl h-10 w-10 text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-indigo-500" />
            </div>
            Chi tiết Dự án
          </h1>
          <p className="text-muted-foreground mt-1">Thông tin, tiến độ và thống kê hoạt động của dự án.</p>
        </div>
      </div>

      <div className="space-y-8">
        {isLoadingProject ? (
          <div className="space-y-4 bg-card border border-border/50 rounded-3xl p-6">
            <Skeleton className="h-8 w-1/2 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : project ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm space-y-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">Thông tin chung</h3>
                {!isEditing && (
                  <div className="flex items-center gap-2">
                    <UpdateGroupWeightsModal project={project} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl hover:bg-muted/50"
                      onClick={() => {
                        setName(project.name);
                        setDescription(project.description || "");
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Sửa thông tin
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4 border-t border-border/50 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Tên dự án</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Mô tả</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-xl bg-background min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-xl">
                      <X className="w-4 h-4 mr-1" /> Hủy
                    </Button>
                    <Button size="sm" onClick={handleUpdate} disabled={updateProject.isPending} className="rounded-xl">
                      {updateProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                      Lưu lại
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-muted/30 p-4 rounded-2xl">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      {project.description || "Chưa có mô tả cho dự án này."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-muted/20 p-4 rounded-2xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nhóm phụ trách</span>
                      <p className="font-semibold text-base mt-1 text-primary">{project.team.teamName}</p>
                    </div>
                    <div className="bg-muted/20 p-4 rounded-2xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cập nhật lần cuối</span>
                      <p className="font-semibold text-base mt-1">{new Date(project.updatedAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="p-6 rounded-3xl border border-border/50 bg-card shadow-sm">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <KanbanSquare className="w-5 h-5 text-blue-500" />
                Tiến độ & Tương tác
              </h4>

              {isLoadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Task Stats */}
                  <div className="p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <KanbanSquare className="w-16 h-16" />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-semibold">Công việc (Tasks)</span>
                      <span className="text-3xl font-black text-blue-500">{stats.tasks.total}</span>
                    </div>
                    <Progress value={stats.tasks.completionPercentage} className="h-2 relative z-10" />
                    <div className="flex justify-between text-sm relative z-10">
                      <span className="flex items-center gap-1.5 text-emerald-500 font-medium bg-emerald-500/10 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" /> {stats.tasks.completed} Hoàn thành
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-500 font-medium bg-amber-500/10 px-2 py-1 rounded-lg">
                        <Clock className="w-4 h-4" /> {stats.tasks.incomplete} Đang xử lý
                      </span>
                    </div>
                  </div>

                  {/* GitHub Stats */}
                  <div className="p-5 rounded-2xl border border-zinc-500/20 bg-gradient-to-br from-zinc-500/10 to-transparent space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Hoạt động GitHub</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/80 border border-border/50 shadow-sm">
                        <GitBranch className="w-5 h-5 text-muted-foreground mb-2" />
                        <span className="text-xl font-bold">{stats.github.repositoryCount}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide mt-1">Repos</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/80 border border-border/50 shadow-sm">
                        <GitCommit className="w-5 h-5 text-muted-foreground mb-2" />
                        <span className="text-xl font-bold">{stats.github.commitCount}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide mt-1">Commits</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-background/80 border border-border/50 shadow-sm">
                        <GitPullRequest className="w-5 h-5 text-muted-foreground mb-2" />
                        <span className="text-xl font-bold">{stats.github.pullRequestCount}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide mt-1">PRs</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border/50 bg-muted/10">
                  Không có dữ liệu thống kê nào được ghi nhận cho dự án này.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border/50 rounded-3xl">
            <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-foreground">Không tìm thấy dự án</h3>
            <p className="mt-1">Dự án này không tồn tại hoặc bạn không có quyền truy cập.</p>
            <Button onClick={() => router.back()} variant="outline" className="mt-4 rounded-xl">
              Quay lại danh sách
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
