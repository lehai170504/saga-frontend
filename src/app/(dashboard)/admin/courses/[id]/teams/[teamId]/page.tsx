"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Activity, BarChart, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/shared/Skeleton";
import { MetricCard } from "@/components/shared/MetricCard";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useTeamDetail, useTeamMembers, useTeamInteractions, useTeamHeatmap, useSprintVelocity, useEarlyWarnings } from "@/features/lecturer/hooks/useAnalytics";
import { useTeamSprints } from "@/features/admin/hooks/useTeamSprints";
import { InteractionGraph } from "@/features/admin/components/team-analytics/interaction-graph";
import { TeamHeatmap } from "@/features/admin/components/team-analytics/team-heatmap";
import { SprintVelocityChart } from "@/features/admin/components/team-analytics/sprint-velocity-chart";
import { toast } from "sonner";
import { subWeeks, format } from "date-fns";

export default function AdminTeamAnalyticsPage({ params }: { params: Promise<{ id: string; teamId: string }> }) {
  const router = useRouter();
  const { id: courseId, teamId } = React.use(params);

  const [activeTab, setActiveTab] = useState("overview");

  // Fetch Course details
  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);

  // Fetch Team Details (Sử dụng hook chung từ Lecturer)
  const { data: teamDetail, isLoading: isLoadingTeam } = useTeamDetail(courseId, teamId);
  const { data: teamMembersPage, isLoading: isLoadingMembers } = useTeamMembers(courseId, teamId);

  // Fetch Sprints
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(teamId);

  // Analytics Hooks
  const { data: interactionsData, isLoading: isLoadingInteractions } = useTeamInteractions(courseId, teamId);

  // Heatmap: Lấy từ 12 tuần trước
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subWeeks(new Date(), 12), 'yyyy-MM-dd');
  const { data: heatmapData, isLoading: isLoadingHeatmap } = useTeamHeatmap(courseId, teamId, startDate, endDate);

  const { data: velocityData, isLoading: isLoadingVelocity } = useSprintVelocity(courseId, teamId);
  const { data: earlyWarnings } = useEarlyWarnings(courseId);

  const teamWarningsCount = Array.isArray(earlyWarnings)
    ? earlyWarnings.filter(w => w.teamId === teamId).length
    : 0;

  const isLoading = isLoadingCourse || isLoadingTeam || isLoadingSprints || isLoadingMembers;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80 transition-all"
            onClick={() => router.push(`/admin/courses/${courseId}`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium backdrop-blur-md">
            <Activity size={16} className="animate-pulse" />
            <span>Admin Team Analytics</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-md" />
          </div>
        ) : (
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-3">
              {teamDetail?.teamName || "Chi tiết Nhóm"}
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
              Dự án: {teamDetail?.project?.name || "Chưa chọn dự án"} • Lớp: {course?.clazz?.classCode || course?.name}
            </p>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Tổng thành viên"
          value={isLoading ? "-" : (teamDetail?.members?.content?.length || 0).toString()}
          icon={<Users className="w-4 h-4" />}
        />
        <MetricCard
          title="Tổng Sprint"
          value={isLoading ? "-" : (sprintsData?.sprints?.length || 0).toString()}
          icon={<CheckCircle2 className="w-4 h-4 text-success" />}
        />
        <MetricCard
          title="Điểm Contribution"
          value={isLoading ? "-" : "N/A"}
          icon={<BarChart className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="Cảnh báo hệ thống"
          value={isLoading ? "-" : teamWarningsCount.toString()}
          icon={<Activity className="w-4 h-4 text-destructive" />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full sm:w-[600px] grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="sprints" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Sprints & Đánh giá
          </TabsTrigger>
          <TabsTrigger value="graph" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Interaction Graph
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Heatmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Thành viên Nhóm</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMembers ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : teamMembersPage?.content && teamMembersPage.content.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembersPage.content.map((member) => (
                    <div key={member.studentId} className="flex items-center p-4 border border-border/50 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm mr-4">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.studentId}`} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {(member.student?.name || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{member.student?.name || "Chưa rõ"}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.student?.studentCode || "Chưa có mã"}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ml-2 whitespace-nowrap ${member.roleInTeam === "LEADER"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                        }`}>
                        {member.roleInTeam === "LEADER" ? "Trưởng nhóm" : "Thành viên"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Chưa có dữ liệu thành viên</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sprints" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Danh sách Sprints</CardTitle>
              <CardDescription>Các Sprint của dự án và dữ liệu Peer Review tương ứng.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSprints ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : (
                <div className="space-y-4">
                  {sprintsData?.sprints?.map((sprint) => (
                    <div key={sprint.sprintId} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{sprint.sprintName}</h3>
                        <p className="text-sm text-muted-foreground">Mục tiêu: {sprint.goal || "Không có"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : "TBD"} - {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : "TBD"}
                        </p>
                      </div>
                      <Button variant="outline" className="rounded-xl font-bold bg-primary/5 text-primary border-primary/20 hover:bg-primary/10" onClick={() => {
                        toast.info("Đang tải dữ liệu Peer Review cho Sprint này...");
                      }}>
                        Xem Peer Review
                      </Button>
                    </div>
                  ))}
                  {(!sprintsData?.sprints || sprintsData.sprints.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground font-medium">
                      Chưa có Sprint nào được tạo.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card shadow-sm mt-6">
            <CardHeader>
              <CardTitle>Vận tốc làm việc (Sprint Velocity)</CardTitle>
              <CardDescription>So sánh điểm ước tính và điểm thực tế hoàn thành qua các Sprint.</CardDescription>
            </CardHeader>
            <CardContent>
              <SprintVelocityChart data={velocityData} isLoading={isLoadingVelocity} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Interaction Graph (Node-Edge)</CardTitle>
              <CardDescription>Mạng tương tác Peer Review giữa các thành viên.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-0">
              <InteractionGraph data={interactionsData} isLoading={isLoadingInteractions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Heatmap Hoạt động</CardTitle>
              <CardDescription>Tần suất Commit và Hoạt động nhóm.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-0">
              <TeamHeatmap data={heatmapData} isLoading={isLoadingHeatmap} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
