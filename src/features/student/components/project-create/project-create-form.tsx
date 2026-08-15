"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderKanban, ShieldCheck, Loader2, Plus } from "lucide-react";
import { ProjectType } from "@/features/admin/api/projectTypeApi";
import { Course } from "@/features/courses/types";

interface ProjectCreateFormProps {
  myRole?: string;
  projectName: string;
  setProjectName: (val: string) => void;
  projectTypeId: string;
  setProjectTypeId: (val: string) => void;
  projectTypes?: ProjectType[];
  course?: Course | null;
  teamName: string;
  isCreating: boolean;
  handleCreateProject: (e: React.FormEvent) => void;
}

export function ProjectCreateForm({
  myRole,
  projectName,
  setProjectName,
  projectTypeId,
  setProjectTypeId,
  projectTypes,
  course,
  teamName,
  isCreating,
  handleCreateProject,
}: ProjectCreateFormProps) {
  return (
    <form onSubmit={handleCreateProject} className="grid gap-6 lg:grid-cols-3 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3 border-b border-border/40 pb-4">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
              <FolderKanban size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">
                Đăng ký Đề tài Dự án
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">
                Thông tin đề tài của nhóm bạn
              </p>
            </div>
          </div>

          {myRole === "LEADER" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="project-name" className="text-xs font-bold text-muted-foreground">
                  Tên đề tài / Dự án
                </Label>
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
                  <SelectTrigger className="w-full h-11 rounded-xl border-border bg-background font-medium text-xs">
                    <SelectValue placeholder="Chọn loại dự án..." />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5} className="rounded-xl border-border/50 shadow-xl">
                    {!projectTypes || projectTypes.length === 0 ? (
                      <SelectItem
                        value="none"
                        disabled
                        className="rounded-lg py-2.5 text-xs text-muted-foreground italic font-medium cursor-not-allowed"
                      >
                        Không có loại dự án nào
                      </SelectItem>
                    ) : (
                      projectTypes.map((pt) => (
                        <SelectItem
                          key={pt.projectTypeId}
                          value={pt.projectTypeId}
                          className="rounded-lg cursor-pointer font-semibold py-2.5 text-xs"
                        >
                          {pt.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-muted/30 border border-border/50 rounded-2xl text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Chưa có dự án nào được đăng ký cho nhóm này.
                <br />
                Chỉ Leader của nhóm mới có quyền tạo dự án.
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
              <span className="text-primary text-right font-extrabold">{teamName}</span>
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
  );
}
