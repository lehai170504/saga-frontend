"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStudentCourse } from "@/context/StudentCourseContext";
import { useCourseStudents, useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import {
  useCreateTeamProject,
  useProjectDetail,
  useUpdateProjectDetail,
} from "@/features/projects/hooks/useProjects";
import { isCourseEnded } from "@/lib/course-utils";
import { useProjectTypes } from "@/features/admin/hooks/useProjectTypes";
import { ProjectIntegrationPanel } from "@/features/integrations/components/project-integration-panel";
import { SyncStatusMonitor } from "@/features/integrations/components/sync-status-monitor";

// Subcomponents
import { NoTeamBanner } from "./project-create/no-team-banner";
import { ProjectCreateForm } from "./project-create/project-create-form";
import { ProjectDetailHeroCard } from "./project-create/project-detail-hero-card";
import { ProjectInfoSidebar } from "./project-create/project-info-sidebar";
import { EditProjectDialog } from "./project-create/edit-project-dialog";

export function StudentProjectCreate() {
  const { courseId, course, isLoading: isLoadingCourse } = useStudentCourse();
  const { user, isLoading: isLoadingAuth } = useAuth();

  const isStudent = user?.applicationRole === "STUDENT";

  const { data: studentsData, isLoading: isLoadingStudents, refetch: refetchStudents } = useCourseStudents(
    courseId,
    undefined,
    { enabled: !isStudent }
  );

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch: refetchMyTeam } = useMyTeamMembers(
    courseId,
    { enabled: isStudent }
  );

  const myProfileId = user?.localProfileId;
  const myStudentRecord = studentsData?.studentsWithTeam?.content?.find((s) => s.studentId === myProfileId);

  const myTeam = isStudent
    ? myTeamData
      ? {
        teamId: myTeamData.teamId,
        teamName: myTeamData.teamName,
        projectId: myTeamData.project?.id,
        projectName: myTeamData.project?.name || "",
      }
      : null
    : myStudentRecord?.team;

  const myRole = isStudent
    ? myTeamData?.roleInTeam
    : myStudentRecord?.team?.teamMembers?.find((m) => m.studentId === myProfileId)?.roleInTeam;

  const { mutate: createProject, isPending: isCreating } = useCreateTeamProject(myTeam?.teamId || "");
  const { data: projectDetail } = useProjectDetail(myTeam?.projectId || "");
  const updateProjectMutation = useUpdateProjectDetail(myTeam?.projectId || "");

  const [projectName, setProjectName] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const { data: projectTypes } = useProjectTypes();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const isLoading = isLoadingCourse || isLoadingAuth || (isStudent ? isLoadingMyTeam : isLoadingStudents);
  const refetch = isStudent ? refetchMyTeam : refetchStudents;
  const isEnded = isCourseEnded(course);

  const handleOpenEdit = () => {
    setEditName(projectDetail?.name || myTeam?.projectName || "");
    setEditDescription(projectDetail?.description || "");
    setIsEditOpen(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Vui lòng điền tên đề tài dự án.");
      return;
    }

    updateProjectMutation.mutate(
      {
        name: editName.trim(),
        description: editDescription.trim() || null,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          refetch();
        },
      }
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Vui lòng điền tên đề tài dự án");
      return;
    }

    if (!projectTypeId) {
      toast.error("Vui lòng chọn loại dự án (Project Type)");
      return;
    }

    createProject(
      { name: projectName, projectTypeId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background p-6 space-y-6">
        <Skeleton className="h-20 rounded-2xl bg-muted/30" />
        <Skeleton className="h-96 rounded-3xl bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <PageHeader
          title="Cấu hình & Kết nối Dự án Nhóm"
          description={course ? `Khóa học ${course.courseCode || ""}` : "Đang tải dữ liệu khóa học..."}
        />

        {!myTeam ? (
          <NoTeamBanner />
        ) : !myTeam.projectId ? (
          <ProjectCreateForm
            myRole={myRole}
            projectName={projectName}
            setProjectName={setProjectName}
            projectTypeId={projectTypeId}
            setProjectTypeId={setProjectTypeId}
            projectTypes={projectTypes}
            course={course}
            teamName={myTeam.teamName}
            isCreating={isCreating}
            handleCreateProject={handleCreateProject}
            isEnded={isEnded}
          />
        ) : (
          <div className="space-y-6">
            {/* Top Row: Project Detail & Integrations (2 cols) + Team Info Sidebar (1 col) */}
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="lg:col-span-2 space-y-6">
                <ProjectDetailHeroCard
                  projectDetail={projectDetail}
                  fallbackProjectName={myTeam.projectName}
                  isLeader={myRole === "LEADER"}
                  onOpenEdit={handleOpenEdit}
                  isEnded={isEnded}
                />

                <ProjectIntegrationPanel projectId={myTeam.projectId} isEnded={isEnded} />
              </div>

              <ProjectInfoSidebar teamName={myTeam.teamName} myRole={myRole} />
            </div>

            {/* Bottom Row: Full-width Sync Status Table */}
            <div className="space-y-6">
              <SyncStatusMonitor projectId={myTeam.projectId} />
            </div>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <EditProjectDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        editName={editName}
        setEditName={setEditName}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        isUpdating={updateProjectMutation.isPending}
        handleUpdateProject={handleUpdateProject}
      />
    </div>
  );
}
