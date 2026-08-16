"use client";

import React from "react";
import Link from "next/link";
import { FolderKanban, Activity, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectType, ProjectResponse, ProjectDetailResponse } from "@/features/projects/types";
import { ProjectType as AdminProjectType } from "@/features/admin/api/projectTypeApi";
import { CreateProjectModal } from "./create-project-modal";

interface TeamHeroCardProps {
  teamName: string;
  projectName?: string;
  projectId?: string;
  courseId?: string;
  projectDetail?: ProjectDetailResponse | ProjectResponse | null;
  showScores: boolean;
  setShowScores: (show: boolean) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  projectTypeId: string;
  setProjectTypeId: (typeId: string) => void;
  projectTypes?: AdminProjectType[] | ProjectType[];
  isPending: boolean;
  handleCreateProject: (e: React.FormEvent) => void;
  isEnded?: boolean;
}

export function TeamHeroCard({
  teamName,
  projectName,
  projectId,
  courseId,
  projectDetail,
  showScores,
  setShowScores,
  isDialogOpen,
  setIsDialogOpen,
  newProjectName,
  setNewProjectName,
  projectTypeId,
  setProjectTypeId,
  projectTypes,
  isPending,
  handleCreateProject,
  isEnded,
}: TeamHeroCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-lg shadow-primary/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />

      <div className="space-y-4 relative z-10 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full shadow-[0_2px_10px_rgba(234,88,12,0.2)]">
            Nhóm của bạn
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground">{teamName}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 text-muted-foreground bg-background/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-border/50 inline-flex shadow-sm">
            <FolderKanban size={18} className="text-primary shrink-0" />
            <span className="font-extrabold text-sm text-foreground">
              {projectDetail?.name || projectName || "Chưa có đề tài"}
            </span>
          </div>

          {projectDetail?.projectType && (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 font-extrabold text-xs px-3 py-2 rounded-xl shadow-sm"
            >
              {projectDetail.projectType.code
                ? `${projectDetail.projectType.name} (${projectDetail.projectType.code})`
                : projectDetail.projectType.name}
            </Badge>
          )}
        </div>

        {projectDetail?.description && (
          <p className="text-xs text-foreground/80 font-medium max-w-2xl border-l-2 border-primary/30 pl-3 leading-relaxed">
            {projectDetail.description}
          </p>
        )}
      </div>

      <div className="w-full md:w-auto shrink-0 relative z-10 flex flex-wrap items-center gap-3">
        {projectId ? (
          <>
            <Button
              onClick={() => setShowScores(!showScores)}
              variant={showScores ? "secondary" : "outline"}
              className={`w-full sm:w-auto h-12 px-6 rounded-xl font-bold transition-all duration-300 ${showScores
                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground border-border/80"
                  : "border-border/60 hover:bg-muted text-foreground bg-background"
                }`}
            >
              <Activity size={18} className="mr-2 text-primary" strokeWidth={3} />
              {showScores ? "Ẩn điểm" : "Xem điểm"}
            </Button>

            <Link href={`/student/${courseId}/config`}>
              <Button className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]">
                <Settings size={18} className="mr-2" strokeWidth={3} />
                Cấu hình Dự án
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full md:w-auto h-12 px-6 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.4)]"
              disabled={isEnded}
            >
              <Plus size={18} className="mr-2" strokeWidth={3} />
              Khởi tạo Dự án
            </Button>

            <CreateProjectModal
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              teamName={teamName}
              projectName={newProjectName}
              setProjectName={setNewProjectName}
              projectTypeId={projectTypeId}
              setProjectTypeId={setProjectTypeId}
              projectTypes={projectTypes as AdminProjectType[]}
              isPending={isPending}
              handleCreateProject={handleCreateProject}
            />
          </>
        )}
      </div>
    </div>
  );
}
