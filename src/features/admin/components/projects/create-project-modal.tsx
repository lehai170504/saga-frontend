import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderGit2, Loader2, Plus, AlertCircle } from "lucide-react";
import { useCreateProject } from "../../hooks/useProjects";
import { useProjectTypes } from "../../hooks/useProjectTypes";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";

interface CreateProjectModalProps {
  teamId: string;
  trigger?: React.ReactNode;
}

export function CreateProjectModal({ teamId, trigger }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");

  const createProject = useCreateProject();
  const { data: projectTypes, isLoading: isLoadingTypes } = useProjectTypes();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    if (!projectTypeId) {
      toast.error("Vui lòng chọn loại dự án");
      return;
    }

    createProject.mutate(
      { teamId, data: { name, description, projectTypeId } },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDescription("");
          setProjectTypeId("");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="rounded-xl h-8 border-primary/20 text-primary hover:bg-primary/10">
            <Plus className="w-4 h-4 mr-1" />
            Tạo dự án
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl bg-background/80 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-primary" />
            </div>
            Tạo Dự án Mới
          </DialogTitle>
          <DialogDescription>
            Khởi tạo một dự án mới cho nhóm này. Bắt buộc phải chọn Loại Dự án để áp dụng đúng trọng số đánh giá.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Tên dự án <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Ví dụ: Hệ thống Quản lý SAGA..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/20 h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Loại Dự án (Project Type) <span className="text-destructive">*</span>
            </label>
            {isLoadingTypes ? (
              <Skeleton className="h-11 w-full rounded-xl" />
            ) : (
              <Select value={projectTypeId} onValueChange={setProjectTypeId}>
                <SelectTrigger className="w-full h-11 rounded-xl bg-muted/20 border-border/50 focus:ring-primary/20">
                  <SelectValue placeholder="-- Chọn loại dự án --" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {projectTypes?.map((type: { projectTypeId: string; name: string; description: string }) => (
                    <SelectItem key={type.projectTypeId} value={type.projectTypeId} className="rounded-xl cursor-pointer py-2">
                      <div className="flex flex-col">
                        <span className="font-semibold">{type.name}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {(!projectTypes || projectTypes.length === 0) && (
                    <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Chưa có loại dự án nào được định nghĩa
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Mô tả thêm
            </label>
            <Textarea
              placeholder="Ghi chú về dự án..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/20 resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl hover:bg-muted/50 h-10"
            disabled={createProject.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !projectTypeId || createProject.isPending}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
          >
            {createProject.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Khởi tạo"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
