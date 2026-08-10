"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, ArrowRight, Flag, MoreVertical, Loader2 } from "lucide-react";
import { Sprint } from "@/features/projects/types";
import { getSprintStatus } from "./timeline-helpers";

interface TimelineCardProps {
  sprint: Sprint;
  isLeader: boolean;
  isStarting: boolean;
  isClosing: boolean;
  isAnyMutating: boolean;
  onClick: () => void;
  onStartSprint: (sprintId: string) => void;
  onCloseSprint: (sprintId: string) => void;
  onOpenEdit: (sprint: Sprint) => void;
  onOpenDelete: (sprint: Sprint) => void;
}

export function TimelineCard({
  sprint,
  isLeader,
  isStarting,
  isClosing,
  isAnyMutating,
  onClick,
  onStartSprint,
  onCloseSprint,
  onOpenEdit,
  onOpenDelete,
}: TimelineCardProps) {
  const status = getSprintStatus(sprint);
  const hasDates = sprint.startDate && sprint.endDate;

  return (
    <div className="relative group transition-all duration-300">
      {/* Timeline Bullet Node */}
      <div
        className={`absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-4 border-background transition-transform duration-300 group-hover:scale-125 z-10 flex items-center justify-center ${status.timelineNodeStyle}`}
      >
        {status.label === "Đã hoàn thành" && (
          <div className="w-1.5 h-1.5 rounded-full bg-background" />
        )}
      </div>

      {/* Timeline Card */}
      <Card
        onClick={onClick}
        className={`rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.99] hover:border-primary/40 cursor-pointer ${status.cardStyle}`}
      >
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Card Header with Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {sprint.sprintName}
            </h3>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Badge variant="outline" className={`${status.style} rounded-full font-bold px-4 py-1.5 text-xs`}>
                {status.label}
              </Badge>

              {status.label === "Sắp tới" && isLeader && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartSprint(sprint.sprintId);
                  }}
                  disabled={isAnyMutating}
                  size="sm"
                  className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg h-8 px-4 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isStarting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Đang bắt đầu...
                    </>
                  ) : (
                    "Bắt đầu"
                  )}
                </Button>
              )}

              {(status.label === "Đang hoạt động" || status.label === "Sắp kết thúc" || status.label === "Quá hạn") && isLeader && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseSprint(sprint.sprintId);
                  }}
                  disabled={isAnyMutating}
                  size="sm"
                  className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-white shadow-md hover:shadow-lg h-8 px-4 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isClosing ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Đang đóng...
                    </>
                  ) : (
                    "Đóng Sprint"
                  )}
                </Button>
              )}

              {status.label !== "Đã hoàn thành" && isLeader && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center transition-all"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[120px] p-1.5 animate-in fade-in duration-200">
                    <DropdownMenuItem
                      onClick={() => onOpenEdit(sprint)}
                      className="rounded-xl px-3 py-2 text-xs font-bold text-foreground cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                    >
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onOpenDelete(sprint)}
                      className="rounded-xl px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                    >
                      Xóa Sprint
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Running Dates */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-muted/50 text-muted-foreground rounded-2xl shrink-0 border border-border/10">
                <Clock size={16} />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  Thời gian hoạt động
                </p>
                <p className={`text-sm ${status.dateStyle}`}>
                  {hasDates ? (
                    <>
                      {(() => { const d = new Date(sprint.startDate!); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}
                      <ArrowRight size={12} className="inline-block mx-2 text-muted-foreground" />
                      {(() => { const d = new Date(sprint.endDate!); return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`; })()}
                    </>
                  ) : (
                    <span className="text-muted-foreground/75 italic font-medium">Chưa thiết lập</span>
                  )}
                </p>
              </div>
            </div>

            {/* Sprint Goal */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-muted/50 text-muted-foreground rounded-2xl shrink-0 border border-border/10">
                <Flag size={16} />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  Mục tiêu Sprint
                </p>
                <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
                  {sprint.goal || (
                    <span className="text-muted-foreground/75 italic">Không có mục tiêu nào được thiết lập</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
