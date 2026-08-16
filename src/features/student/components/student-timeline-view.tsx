"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Calendar, Users, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useProjectSprints, useCreateSprint, useStartSprint, useCloseSprint, useUpdateSprint, useDeleteSprint } from "@/features/projects/hooks/useTeamSprints";
import { isCourseEnded } from "@/lib/course-utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sprint } from "@/features/projects/types";

// Subcomponents
import { TimelineHeroCard } from "./timeline/timeline-hero-card";
import { TimelineCard } from "./timeline/timeline-card";
import { TimelineCreateSprintModal, TimelineEditSprintModal, TimelineDeleteSprintModal } from "./timeline/timeline-sprint-modals";
import { formatDateTimeForInput } from "./timeline/timeline-helpers";

interface StudentTimelineViewProps {
  courseId?: string;
}

export function StudentTimelineView({ courseId }: StudentTimelineViewProps) {

  // Create sprint modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [startingSprintId, setStartingSprintId] = useState<string | null>(null);
  const [closingSprintId, setClosingSprintId] = useState<string | null>(null);

  // Edit sprint modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editSprintId, setEditSprintId] = useState("");
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editIdempotencyKey, setEditIdempotencyKey] = useState("");
  const [autoStartSprintId, setAutoStartSprintId] = useState<string | null>(null);

  // Delete sprint modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sprintToDelete, setSprintToDelete] = useState<Sprint | null>(null);
  const [deleteIdempotencyKey, setDeleteIdempotencyKey] = useState("");

  // Expanded sprint state for inline dropdown
  const [expandedSprintId, setExpandedSprintId] = useState<string | null>(null);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const projectId = myTeamData?.project?.id || "";
  const { data: sprintsData, isLoading: isLoadingSprints } = useProjectSprints(projectId);
  const createSprintMutation = useCreateSprint(projectId);
  const startSprintMutation = useStartSprint(projectId);
  const closeSprintMutation = useCloseSprint(projectId);
  const updateSprintMutation = useUpdateSprint(projectId);
  const deleteSprintMutation = useDeleteSprint(projectId);

  const isLoading = isLoadingTeam || isLoadingCourse || (!!projectId && isLoadingSprints);
  const isEnded = isCourseEnded(courseData);
  const isLeader = true;



  useEffect(() => {
    if (isCreateOpen) {
      const timer = setTimeout(() => setIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isCreateOpen]);

  useEffect(() => {
    if (isEditOpen) {
      const timer = setTimeout(() => setEditIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isEditOpen]);

  useEffect(() => {
    if (isDeleteOpen) {
      const timer = setTimeout(() => setDeleteIdempotencyKey(crypto.randomUUID()), 0);
      return () => clearTimeout(timer);
    }
  }, [isDeleteOpen]);

  const sprints = sprintsData?.sprints || [];

  // Sort sprints chronologically by startDate
  const sortedSprints = [...sprints].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      toast.error("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
      return;
    }

    createSprintMutation.mutate(
      {
        name: name.trim(),
        goal: goal.trim(),
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        idempotencyKey
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setName("");
          setGoal("");
          setStartDate("");
          setEndDate("");
        }
      }
    );
  };

  const handleStartSprint = (sprintId: string) => {
    const targetSprint = sprints.find((s) => s.sprintId === sprintId);
    if (targetSprint && (!targetSprint.startDate || !targetSprint.endDate)) {
      toast.info("Vui lòng cập nhật thời gian bắt đầu và kết thúc trước khi khởi động Sprint.");
      setAutoStartSprintId(sprintId);
      handleOpenEdit(targetSprint);
      return;
    }

    setStartingSprintId(sprintId);
    const key = crypto.randomUUID();
    startSprintMutation.mutate(
      { sprintId, idempotencyKey: key },
      {
        onSettled: () => setStartingSprintId(null)
      }
    );
  };

  const handleCloseSprint = (sprintId: string) => {
    setClosingSprintId(sprintId);
    const key = crypto.randomUUID();
    closeSprintMutation.mutate(
      { sprintId, idempotencyKey: key },
      {
        onSettled: () => setClosingSprintId(null)
      }
    );
  };

  const handleOpenEdit = (sprint: Sprint) => {
    setEditSprintId(sprint.sprintId);
    setEditName(sprint.sprintName);
    setEditGoal(sprint.goal || "");
    setEditStartDate(formatDateTimeForInput(sprint.startDate));
    setEditEndDate(formatDateTimeForInput(sprint.endDate));
    setIsEditOpen(true);
  };

  const handleUpdateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Vui lòng nhập tên Sprint.");
      return;
    }

    if (editStartDate && editEndDate && new Date(editEndDate) <= new Date(editStartDate)) {
      toast.error("Ngày kết thúc phải diễn ra sau ngày bắt đầu.");
      return;
    }

    updateSprintMutation.mutate(
      {
        sprintId: editSprintId,
        name: editName.trim(),
        goal: editGoal.trim(),
        startDate: editStartDate ? new Date(editStartDate).toISOString() : null,
        endDate: editEndDate ? new Date(editEndDate).toISOString() : null,
        idempotencyKey: editIdempotencyKey
      },
      {
        onSuccess: () => {
          const currentEditId = editSprintId;
          const isAutoStart = autoStartSprintId === currentEditId;

          setIsEditOpen(false);
          setEditName("");
          setEditGoal("");
          setEditStartDate("");
          setEditEndDate("");
          setEditSprintId("");
          setAutoStartSprintId(null);

          if (isAutoStart) {
            setStartingSprintId(currentEditId);
            const key = crypto.randomUUID();
            startSprintMutation.mutate(
              { sprintId: currentEditId, idempotencyKey: key },
              {
                onSettled: () => setStartingSprintId(null)
              }
            );
          }
        }
      }
    );
  };

  const handleDeleteSprint = () => {
    if (!sprintToDelete) return;
    deleteSprintMutation.mutate(
      {
        sprintId: sprintToDelete.sprintId,
        idempotencyKey: deleteIdempotencyKey
      },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setSprintToDelete(null);
        }
      }
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1200px] mx-auto space-y-8 ">
        <PageHeader
          title="Timeline Tiến Độ"
          description={
            courseData
              ? `Theo dõi toàn bộ lộ trình các Sprints dự án cho Khóa học ${courseData.courseCode || ""}`
              : "Đang tải dữ liệu khóa học..."
          }
        >
          {!isLoading && isLeader && !isEnded && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg h-11 px-5 cursor-pointer transition-all"
            >
              + Tạo Sprint
            </Button>
          )}
        </PageHeader>

        {!isLoading && myTeamData && (
          <TimelineHeroCard
            teamName={myTeamData.teamName}
            projectName={myTeamData.project?.name}
          />
        )}

        {isLoading ? (
          <div className="space-y-8 pl-10 relative border-l-2 border-muted/30 ml-4 py-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[51px] top-1.5 w-6 h-6 rounded-full bg-muted animate-pulse" />
                <Skeleton className="h-32 w-full rounded-3xl bg-muted/40" />
              </div>
            ))}
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : !projectId ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <ShieldAlert size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
            <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa liên kết dự án nào để xem Timeline.</p>
          </div>
        ) : sortedSprints.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-[2rem] border-dashed">
            <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h4 className="text-lg font-bold text-foreground">Không có Sprint nào</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Không tìm thấy Sprint nào được đồng bộ cho dự án này. Vui lòng kiểm tra lại cấu hình trên Jira.
            </p>
          </div>
        ) : (
          <div className="relative pl-8 md:pl-12 border-l border-border/70 ml-4 md:ml-6 py-4 space-y-12">
            {/* Ambient Line highlight */}
            <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-primary via-blue-500 to-emerald-500 pointer-events-none opacity-60" />

            {sortedSprints.map((sprint) => (
              <TimelineCard
                key={sprint.sprintId}
                sprint={sprint}
                projectId={projectId}
                isLeader={isLeader && !isEnded}
                isStarting={startingSprintId === sprint.sprintId}
                isClosing={closingSprintId === sprint.sprintId}
                isAnyMutating={startSprintMutation.isPending || closeSprintMutation.isPending}
                isExpanded={expandedSprintId === sprint.sprintId}
                onToggleExpand={() =>
                  setExpandedSprintId((prev) => (prev === sprint.sprintId ? null : sprint.sprintId))
                }
                onStartSprint={handleStartSprint}
                onCloseSprint={handleCloseSprint}
                onOpenEdit={handleOpenEdit}
                onOpenDelete={(s) => {
                  setSprintToDelete(s);
                  setIsDeleteOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Sprint Dialog */}
      <TimelineCreateSprintModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        name={name}
        onNameChange={setName}
        goal={goal}
        onGoalChange={setGoal}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onSubmit={handleCreateSprint}
        isPending={createSprintMutation.isPending}
      />

      {/* Edit Sprint Dialog */}
      <TimelineEditSprintModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editName={editName}
        onEditNameChange={setEditName}
        editGoal={editGoal}
        onEditGoalChange={setEditGoal}
        editStartDate={editStartDate}
        onEditStartDateChange={setEditStartDate}
        editEndDate={editEndDate}
        onEditEndDateChange={setEditEndDate}
        onSubmit={handleUpdateSprint}
        isPending={updateSprintMutation.isPending}
        isAutoStart={!!autoStartSprintId}
      />

      {/* Delete Sprint Dialog */}
      <TimelineDeleteSprintModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        sprintToDelete={sprintToDelete}
        onConfirmDelete={handleDeleteSprint}
        isPending={deleteSprintMutation.isPending}
      />
    </div>
  );
}
