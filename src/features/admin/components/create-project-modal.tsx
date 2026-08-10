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
import { FolderGit2, Loader2, Plus } from "lucide-react";
import { useCreateProject } from "../hooks/useProjects";
import { toast } from "sonner";

interface CreateProjectModalProps {
  teamId: string;
  trigger?: React.ReactNode;
}

export function CreateProjectModal({ teamId, trigger }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const createProject = useCreateProject();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    createProject.mutate(
      { teamId, data: { name } },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
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
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-background/80 backdrop-blur-2xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-primary" />
            </div>
            Tạo Dự án Mới
          </DialogTitle>
          <DialogDescription>
            Khởi tạo một dự án mới cho nhóm này.
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
              className="rounded-xl bg-muted/20 border-border/50 focus-visible:ring-primary/20"
              autoFocus
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl hover:bg-muted/50"
            disabled={createProject.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createProject.isPending}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
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
