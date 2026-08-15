"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Edit2 } from "lucide-react";
import { ProjectResponse } from "@/features/projects/types";

interface ProjectDetailHeroCardProps {
  projectDetail?: ProjectResponse | null;
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
  return (
    <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group">
      <div className="space-y-2 flex-1 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">
            Dự án đang thực hiện
          </h3>
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
        <p className="text-lg font-black text-foreground mt-1">
          {projectDetail?.name || fallbackProjectName || "Đề tài chưa đặt tên"}
        </p>
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
  );
}
