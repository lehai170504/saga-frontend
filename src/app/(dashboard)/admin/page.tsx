"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Users,
  GraduationCap,
  Network,
  Server,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { GraphProcessingChart } from "@/features/admin/components/graph-processing-chart";
import { SystemAnomalyChart } from "@/features/admin/components/system-anomaly-chart";
import { useSystemStats } from "@/features/admin/hooks/useSystemStats";
import { IntegrationHealthCards } from "@/features/admin/components/integration-health-cards";
import { RecentActivityFeed } from "@/features/admin/components/recent-activity-feed";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSystemStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Quản trị Hệ thống"
        description="Quản lý Dữ liệu Học thuật và Trạng thái Tích hợp API."
        workspace="Workspace Quản trị"
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-sm border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-8 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-24 mb-2 mt-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Người dùng (Profiles)
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">{stats?.totalProfiles || 0}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-success" /> Tài khoản hệ thống
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Khóa học
                </CardTitle>
                <div className="p-2 bg-success/10 rounded-xl">
                  <GraduationCap className="h-4 w-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                  Đã tạo trên hệ thống
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Nhóm (Teams)
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Network className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">{stats?.totalTeams || 0}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-success" /> Hoạt động
                </p>
              </CardContent>
            </Card>


            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Dự án (Projects)
                </CardTitle>
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <Server className="h-4 w-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">{stats?.totalProjects || 0}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  <span className="text-success font-bold">Đã thiết lập</span>
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          ) : (
            <GraphProcessingChart />
          )}
        </div>
        <div className="lg:col-span-1">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          ) : (
            <SystemAnomalyChart />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Integrations Card */}
        <IntegrationHealthCards />

        {/* Activity Feed Card */}
        <RecentActivityFeed />
      </div>
    </div>
  );
}
