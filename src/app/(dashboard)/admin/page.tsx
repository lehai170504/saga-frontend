"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Users,
  GraduationCap,
  Network,
  Activity,
  Server,
  Clock,
  GitCommit,
  CheckCircle2,
  Database
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { GraphProcessingChart } from "@/features/admin/components/graph-processing-chart";
import { SystemAnomalyChart } from "@/features/admin/components/system-anomaly-chart";
import { useSystemStats } from "@/features/admin/hooks/useSystemStats";
import { IntegrationHealthCards } from "@/features/admin/components/integration-health-cards";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSystemStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Nhật ký Hệ thống gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="space-y-2 w-full mt-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 pl-2">
                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <GitCommit className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-destructive">Tiến trình MSR</span> vừa quét và đánh dấu 15 <span className="font-bold">Task Ảo</span> do thiếu liên kết Code (Task-Code Linkage).
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Vừa xong</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-primary">Process Mining</span> ghi nhận hiện tượng <span className="font-bold">Cày Deadline (Burst)</span> tăng 25% ở nhóm các lớp sáng thứ 2.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">15 phút trước</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Network className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-primary">SNA Module</span> đã hoàn tất tính toán <span className="font-bold">Độ bao phủ cộng tác</span> cho 32 đồ thị lớp học mới.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">5 giờ trước</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-success">Quản trị viên</span> vừa nhập dữ liệu và cấu trúc <strong>1,248 sinh viên</strong> vào hệ thống đồ thị.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">1 ngày trước</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
