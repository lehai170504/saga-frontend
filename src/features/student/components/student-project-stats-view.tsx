"use client";

import React, { useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectDashboardStats } from "@/features/projects/hooks/useProjectDashboardStats";
import { StudentMemberProgressTab } from "./stats/student-member-progress-tab";
import { ProjectContributionTab } from "@/features/lecturer/components/project-detail/project-contribution-tab";
import { BarChart3, UserCheck, Flame } from "lucide-react";

// Subcomponents
import { NoTopicRegisteredCard } from "./project-stats/no-topic-registered-card";
import { RolePermissionBanner } from "./project-stats/role-permission-banner";
import { OverallStatsTab } from "./project-stats/overall-stats-tab";

interface StudentProjectStatsViewProps {
  courseId?: string;
  hideHeader?: boolean;
}

export function StudentProjectStatsView({ courseId }: StudentProjectStatsViewProps) {
  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  const teamId = myTeamData?.teamId || "";

  const userRole = myTeamData?.roleInTeam || "MEMBER";
  const isLeader = userRole === "LEADER";

  // Members list for interaction & progress tab
  const membersList = useMemo(
    () =>
      (myTeamData?.members?.content || []).map((m) => ({
        studentId: m.studentId,
        fullName: m.fullName,
        studentCode: m.studentCode,
        roleInTeam: m.roleInTeam,
      })),
    [myTeamData]
  );

  const { data: stats, isLoading: isLoadingStats } = useProjectDashboardStats(projectId);



  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        {/* Header */}
        <PageHeader
          title="Thống kê Tiến độ Dự án"
          description="Tổng quan tiến độ thực hiện công việc (Jira), chỉ số đóng góp mã nguồn (GitHub), biểu đồ Burndown, tổng quan hoạt động, biểu đồ nhiệt và mạng tương tác"
        />

        {isLoadingTeam ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : !myTeamData?.project ? (
          <NoTopicRegisteredCard />
        ) : (
          <div className="space-y-6">
            {/* Role Permission Scope Info Banner */}
            <RolePermissionBanner isLeader={isLeader} />

            <Tabs defaultValue="overall" className="w-full space-y-6">
              <TabsList className="bg-muted/60 p-1.5 rounded-2xl border border-border/50 h-auto gap-1.5 flex-wrap">
                <TabsTrigger
                  value="overall"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart3 size={16} />
                  <span>Tổng quan & Đóng góp</span>
                </TabsTrigger>

                <TabsTrigger
                  value="member-progress"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <UserCheck size={16} className="text-blue-500" />
                  <span>Tiến độ Thành viên</span>
                </TabsTrigger>

                <TabsTrigger
                  value="slices"
                  className="rounded-xl px-5 py-2.5 font-extrabold text-xs tracking-wide data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  <Flame size={16} className="text-orange-500" />
                  <span>Đóng góp (Slices)</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Overall Stats */}
              <TabsContent value="overall" className="space-y-6 outline-none">
                <OverallStatsTab stats={stats} isLoadingStats={isLoadingStats} />
              </TabsContent>

              {/* Tab 2: Member Progress */}
              <TabsContent value="member-progress" className="outline-none">
                <StudentMemberProgressTab
                  courseId={courseId || ""}
                  isLeader={isLeader}
                  membersList={membersList}
                />
              </TabsContent>

              {/* Tab 3: Slices Tab */}
              <TabsContent value="slices" className="outline-none">
                <ProjectContributionTab courseId={courseId || ""} teamId={teamId} isEnded={true} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
