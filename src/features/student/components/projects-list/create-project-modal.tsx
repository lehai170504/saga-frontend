"use client";

import React from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectType } from "@/features/admin/api/projectTypeApi";

interface CreateProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  projectName: string;
  setProjectName: (name: string) => void;
  projectTypeId: string;
  setProjectTypeId: (typeId: string) => void;
  projectTypes?: ProjectType[];
  isPending: boolean;
  handleCreateProject: (e: React.FormEvent) => void;
}

export function CreateProjectModal({
  isOpen,
  onOpenChange,
  teamName,
  projectName,
  setProjectName,
  projectTypeId,
  setProjectTypeId,
  projectTypes,
  isPending,
  handleCreateProject,
}: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-extrabold tracking-tight">Khởi tạo Dự án mới</DialogTitle>
          <DialogDescription className="text-sm mt-1 text-muted-foreground/80">
            Tạo một không gian làm việc mới cho <span className="font-bold text-primary">{teamName}</span>. Sau khi khởi tạo, bạn có thể liên kết dự án với Jira và GitHub.
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

          <div className="space-y-2 mt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Loại Dự án <span className="text-destructive">*</span>
            </Label>
            <Select value={projectTypeId} onValueChange={setProjectTypeId}>
              <SelectTrigger className="rounded-xl h-12 bg-muted/30 border-border/50 focus-visible:ring-primary/30 focus-visible:bg-background font-medium transition-all">
                <SelectValue placeholder="Chọn loại dự án..." />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5} className="rounded-xl border-border/50 shadow-xl">
                {!projectTypes || projectTypes.length === 0 ? (
                  <SelectItem value="none" disabled className="rounded-lg py-2.5 text-xs text-muted-foreground italic font-medium cursor-not-allowed">
                    Không có loại dự án nào
                  </SelectItem>
                ) : (
                  projectTypes.map((pt) => (
                    <SelectItem key={pt.projectTypeId} value={pt.projectTypeId} className="rounded-lg cursor-pointer font-semibold py-2.5">
                      {pt.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border/40 mt-6">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl h-11 px-6 font-bold hover:bg-muted/50 mt-4"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-xl h-11 px-6 font-bold flex items-center justify-center mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              disabled={isPending}
            >
              {isPending ? (
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
  );
}
