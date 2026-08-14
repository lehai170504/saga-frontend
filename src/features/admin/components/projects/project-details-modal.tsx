import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Info
} from "lucide-react";
import { useProjectDetail, useProjectStats, useUpdateProject } from "../../hooks/useProjects";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import { Progress } from "@/components/ui/progress";
import { UpdateGroupWeightsModal } from "./update-group-weights-modal";

interface ProjectDetailsModalProps {
  projectId: string;
  trigger?: React.ReactNode;
}

export function ProjectDetailsModal({ projectId, trigger }: ProjectDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: project, isLoading: isLoadingProject } = useProjectDetail(open ? projectId : null);
  const { data: stats, isLoading: isLoadingStats } = useProjectStats(open ? projectId : null);
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
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setIsEditing(false);
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
            <Info className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] rounded-3xl bg-background/95 backdrop-blur-3xl border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-3xl pb-4 border-b border-border/50">
          <div className="flex justify-between items-start pt-2 pr-6">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5 text-indigo-500" />
              </div>
              Chi tiết Dự án
            </DialogTitle>

            {project && !isEditing && (
              <div className="flex items-center gap-2">
                <UpdateGroupWeightsModal project={project} />
                <Button
                  variant="ghost"
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
        </DialogHeader>

        <div className="space-y-8 py-4">
          {isLoadingProject ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : project ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="p-5 rounded-2xl border border-border/50 bg-card/40 shadow-sm space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Tên dự án</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl bg-muted/20 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Mô tả</label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-xl bg-muted/20 border-border/50 min-h-[100px]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
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
                    <div>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {project.description || "Chưa có mô tả cho dự án này."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nhóm phụ trách</span>
                        <p className="font-semibold text-sm mt-1">{project.team.teamName}</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cập nhật lần cuối</span>
                        <p className="font-semibold text-sm mt-1">{new Date(project.updatedAt).toLocaleDateString("vi-VN")}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-base font-extrabold mb-4 flex items-center gap-2">
                  <KanbanSquare className="w-5 h-5 text-blue-500" />
                  Tiến độ & Tương tác
                </h4>

                {isLoadingStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Task Stats */}
                    <div className="p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-blue-500/5 to-transparent space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Công việc (Tasks)</span>
                        <span className="text-2xl font-black text-blue-500">{stats.tasks.total}</span>
                      </div>
                      <Progress value={stats.tasks.completionPercentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1 text-emerald-500 font-medium">
                          <CheckCircle2 className="w-4 h-4" /> {stats.tasks.completed} Hoàn thành
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Clock className="w-4 h-4" /> {stats.tasks.incomplete} Đang xử lý
                        </span>
                      </div>
                    </div>

                    {/* GitHub Stats */}
                    <div className="p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-zinc-500/5 to-transparent space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">GitHub Activity</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background/50 border border-border/50">
                          <GitBranch className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-lg font-bold">{stats.github.repositoryCount}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Repos</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background/50 border border-border/50">
                          <GitCommit className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-lg font-bold">{stats.github.commitCount}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Commits</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background/50 border border-border/50">
                          <GitPullRequest className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-lg font-bold">{stats.github.pullRequestCount}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">PRs</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border/50">
                    Không có dữ liệu thống kê
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy thông tin dự án.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
