"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Edit2 } from "lucide-react";
import { ProjectResponse, ProjectDetailResponse } from "@/features/projects/types";

interface ProjectDetailHeroCardProps {
  projectDetail?: ProjectDetailResponse | ProjectResponse | null;
  fallbackProjectName?: string;
  isLeader: boolean;
  onOpenEdit: () => void;
}

export function ProjectDetailHeroCard({
  projectDetail,
  fallbackProjectName,
  isLeader,
  onOpenEdit,
}: ProjectDetailHeroCardProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const formattedCreated = formatDate(projectDetail?.createdAt);
  const formattedUpdated = formatDate(projectDetail?.updatedAt);

  return (
    <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group">
      <div className="space-y-3 flex-1 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2.5">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">
              Dự án đang thực hiện
            </h3>
            {projectDetail?.projectType && (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full"
              >
                {projectDetail.projectType.code
                  ? `${projectDetail.projectType.name} (${projectDetail.projectType.code})`
                  : projectDetail.projectType.name}
              </Badge>
            )}
          </div>

          {isLeader && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-1.5 px-3 py-1 cursor-pointer h-7 shadow-sm hover:shadow-md"
              onClick={onOpenEdit}
            >
              <Edit2 size={11} className="transition-transform group-hover:rotate-12" />
              Sửa thông tin
            </Button>
          )}
        </div>

        <p className="text-xl font-black text-foreground">
          {projectDetail?.name || fallbackProjectName || "Đề tài chưa đặt tên"}
        </p>

        {projectDetail?.description ? (
          <p className="text-sm text-foreground/80 font-medium leading-relaxed max-w-2xl border-l-2 border-primary/30 pl-3">
            {projectDetail.description}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic max-w-2xl border-l-2 border-border/40 pl-3">
            Chưa có mô tả chi tiết cho đề tài này.
          </p>
        )}

        {(formattedCreated || formattedUpdated) && (
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider pt-1">
            {formattedCreated && <span>Ngày tạo: {formattedCreated}</span>}
            {formattedUpdated && <span>Cập nhật: {formattedUpdated}</span>}
          </div>
        )}
      </div>

      <div className="p-4 bg-primary/10 text-primary rounded-2xl shrink-0 hidden md:block border border-primary/10 shadow-sm">
        <FolderKanban size={28} />
      </div>
    </Card>
  );
}
