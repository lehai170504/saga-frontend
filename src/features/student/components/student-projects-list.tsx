"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Users, Zap, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";
import { useCreateTeamProject } from "@/features/projects/hooks/useProjects";
import { toast } from "sonner";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useSearchParams } from "next/navigation";
import { useContributionEvaluation } from "@/features/lecturer/hooks/useContribution";
import { useProjectTypes } from "@/features/admin/hooks/useProjectTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StudentOverviewActivityTab } from "@/features/student/components/stats/student-overview-activity-tab";
import { StudentSprintsView } from "@/features/student/components/student-sprints-view";

// Subcomponents
import { TeamHeroCard } from "./projects-list/team-hero-card";
import { TeamMembersList } from "./projects-list/team-members-list";
import { ContributionEvaluationSection } from "./projects-list/contribution-evaluation-section";

interface StudentProjectsListProps {
  courseId?: string;
}

export function StudentProjectsList({ courseId }: StudentProjectsListProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get("tab");

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || "overview");

  useEffect(() => {
    if (tabFromUrl && ["overview", "team", "peer-review"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const [showScores, setShowScores] = useState(false);
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});

  const { data: myTeamData, isLoading: isLoadingMyTeam, refetch } = useMyTeamMembers(courseId || "");
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId || "");

  const activeTeamId = myTeamData?.teamId || "";
  const createProjectMutation = useCreateTeamProject(activeTeamId);
  const { data: projectTypes } = useProjectTypes();
  const { data: evaluationData, isLoading: isLoadingEvaluation } = useContributionEvaluation(
    activeTeamId,
    showScores
  );

  const isLoading = isLoadingCourse || isLoadingMyTeam;

  useEffect(() => {
    let isMounted = true;
    requestAnimationFrame(() => {
      if (isMounted) setMounted(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    if (!projectTypeId) {
      toast.error("Vui lòng chọn loại dự án (Project Type)");
      return;
    }

    createProjectMutation.mutate(
      { name: projectName, courseId: courseId || "", projectTypeId },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setProjectName("");
          refetch();
        },
      }
    );
  };

  const toggleSprintExpand = (studentId: string) => {
    setExpandedSprints((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const projectId = myTeamData?.project?.id;
  const members = useMemo(() => myTeamData?.members?.content || [], [myTeamData]);

  // Sắp xếp Trưởng nhóm lên đầu
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (a.roleInTeam === "LEADER" && b.roleInTeam !== "LEADER") return -1;
      if (a.roleInTeam !== "LEADER" && b.roleInTeam === "LEADER") return 1;
      return 0;
    });
  }, [members]);

  const headerInfo = useMemo(() => {
    switch (activeTab) {
      case "team":
        return {
          title: "Thông tin Nhóm & Thành viên",
          description: courseData
            ? `Xem thông tin nhóm, danh sách thành viên và điểm số đóng góp dự án trong Khóa học ${
                courseData.courseCode || ""
              }`
            : "Xem thông tin nhóm, danh sách thành viên và điểm số đóng góp dự án",
        };
      case "peer-review":
        return {
          title: "Đánh giá chéo",
          description: courseData
            ? `Thực hiện tự đánh giá và đánh giá chéo thành viên trong nhóm theo từng Sprint cho Khóa học ${
                courseData.courseCode || ""
              }`
            : "Thực hiện tự đánh giá và đánh giá chéo thành viên trong nhóm theo từng Sprint",
        };
      default:
        return {
          title: "Tổng quan Hoạt động",
          description: courseData
            ? `Xem biểu đồ thống kê các hoạt động Jira, Commit và tương tác thành viên trong Khóa học ${
                courseData.courseCode || ""
              }`
            : "Xem biểu đồ thống kê các hoạt động Jira, Commit và tương tác thành viên",
        };
    }
  }, [activeTab, courseData]);

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6">
        {isLoading ? (
          <div className="glass-panel rounded-[2rem] p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-[2rem] bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
              <Skeleton className="h-24 w-full rounded-2xl bg-muted/40" />
            </div>
          </div>
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Bạn chưa tham gia vào nhóm nào trong khóa học này.
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            {/* Tabs Bar on top of Header */}
            <div className="flex items-center">
              <TabsList className="bg-card/60 border border-border/50 p-1.5 rounded-2xl h-auto backdrop-blur-xl shadow-sm inline-flex gap-2 shrink-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-xl px-5 py-2.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={16} />
                  <span>Tổng quan Hoạt động</span>
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="rounded-xl px-5 py-2.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users size={16} />
                  <span>Thông tin Nhóm & Thành viên</span>
                </TabsTrigger>
                <TabsTrigger
                  value="peer-review"
                  className="rounded-xl px-5 py-2.5 font-bold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck size={16} />
                  <span>Đánh giá chéo</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Header Section directly under Tabs */}
            <PageHeader title={headerInfo.title} description={headerInfo.description} />

            {/* Tab 1: Overview Activity Graph */}
            <TabsContent value="overview" className="focus-visible:outline-none space-y-6 mt-0">
              <StudentOverviewActivityTab courseId={courseId || ""} teamId={activeTeamId} />
            </TabsContent>

            {/* Tab 2: Team Info & Members */}
            <TabsContent value="team" className="focus-visible:outline-none space-y-8 mt-0">
              <div className="space-y-8">
                {/* Hero Card for Group Info */}
                <TeamHeroCard
                  teamName={myTeamData.teamName}
                  projectName={myTeamData.project?.name}
                  projectId={projectId}
                  courseId={courseId}
                  showScores={showScores}
                  setShowScores={setShowScores}
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  newProjectName={projectName}
                  setNewProjectName={setProjectName}
                  projectTypeId={projectTypeId}
                  setProjectTypeId={setProjectTypeId}
                  projectTypes={projectTypes}
                  isPending={createProjectMutation.isPending}
                  handleCreateProject={handleCreateProject}
                />

                {/* Members Section */}
                <TeamMembersList sortedMembers={sortedMembers} />

                {/* Contribution Evaluation Section */}
                {showScores && (
                  <ContributionEvaluationSection
                    isLoadingEvaluation={isLoadingEvaluation}
                    evaluationData={evaluationData}
                    expandedSprints={expandedSprints}
                    onToggleExpand={toggleSprintExpand}
                  />
                )}
              </div>
            </TabsContent>

            {/* Tab 3: Peer Review (Đánh giá chéo) */}
            <TabsContent value="peer-review" className="focus-visible:outline-none space-y-6 mt-0">
              <StudentSprintsView courseId={courseId || ""} hideHeader />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
