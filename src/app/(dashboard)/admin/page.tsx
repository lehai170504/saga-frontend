"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Users,
  GraduationCap,
  Network,
  Activity,
  RefreshCw,
  Server,
  Clock,
  GitCommit,
  CheckCircle2,
  Database
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Vừa xong");

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    toast.loading("Đang đồng bộ dữ liệu với FAP...", { id: "sync-fap" });
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Vừa xong");
      toast.success("Đồng bộ dữ liệu tổng thể thành công!", { id: "sync-fap", duration: 3000 });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản trị Hệ thống (Auto-Sync)"
        description="Giám sát tiến trình tự động đồng bộ Dữ liệu Học thuật (FAP) và Trạng thái Tích hợp API."
        workspace="Workspace Quản trị"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground flex flex-col items-end">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" /> Auto-sync enabled
            </span>
            <span className="text-xs mt-1">Cập nhật lần cuối: {lastSync}</span>
          </div>

          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[160px]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} /> 
            {isSyncing ? "Đang đồng bộ..." : "Force Sync All"}
          </Button>
        </div>
      </PageHeader>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-sm border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-8 rounded-lg" />
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
                  Giảng viên (Đã đồng bộ)
                </CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">45</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đã map với hệ thống
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Sinh viên (Đã đồng bộ)
                </CardTitle>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">1,248</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Đã map với hệ thống
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  Lớp học Tự động sinh
                </CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Network className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">32</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Thuộc Học kỳ Fall 2026
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border-border hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground">
                  API Requests (24h)
                </CardTitle>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-foreground">14.2k</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.9%</span> Success rate
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Integrations Card */}
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-muted-foreground" />
              Trạng thái Tích hợp & Đồng bộ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                      <Database className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Hệ thống FAP (Nội bộ)</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Auto-sync: Học kỳ, Môn học, Lớp, Users</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      CONNECTED
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">Last sync: {lastSync}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="currentColor">
                        <path d="M11.53 2c0 2.4-1.97 4.35-4.35 4.35h-5C1 6.35 0 7.35 0 8.53v5c0 1.18 1 2.15 2.18 2.15h5c2.38 0 4.35 1.95 4.35 4.35v2.82c0 1.18 1 2.15 2.18 2.15h5c1.18 0 2.18-1 2.18-2.15v-5c0-2.4 1.95-4.35 4.35-4.35h2.82c1.18 0 2.15-1 2.15-2.18v-5c0-1.18-1-2.15-2.15-2.15h-5c-2.4 0-4.35-1.95-4.35-4.35V1C13.71 0 12.71 0 11.53 0v2zm-4.35 12.53c-2.4 0-4.35 1.95-4.35 4.35v2.82c0 1.18 1 2.15 2.18 2.15h5c1.18 0 2.18-1 2.18-2.15v-5c0-2.4-1.97-4.35-4.35-4.35h-.66z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Jira Software Cloud</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Webhook WebSockets Status</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      CONNECTED
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">Last ping: 2m ago</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-zinc-900 dark:text-zinc-100" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">GitHub Organization</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Webhook WebSockets Status</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold tracking-wide">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      CONNECTED
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">Last ping: 15s ago</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

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
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-orange-600 dark:text-orange-500">Cron Job (FAP)</span> vừa tự động tạo thêm <strong>32 Lớp học</strong> cho học kỳ mới.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{lastSync}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-orange-600 dark:text-orange-500">Cron Job (FAP)</span> đã map xong danh sách <strong>1,248 sinh viên</strong> vào các lớp.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">15 phút trước</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-card">
                    <GitCommit className="h-4 w-4" />
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold text-purple-600 dark:text-purple-400">GitHub Webhook</span> xác thực kết nối organization thành công.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">5 giờ trước</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start relative before:absolute before:left-5 before:top-10 before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-border/60 last:before:hidden">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center font-black text-xs shrink-0 z-10 ring-4 ring-card">
                    AD
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm text-foreground">
                      <span className="font-bold">Quản trị viên</span> đã vô hiệu hóa tài khoản sinh viên vi phạm nội quy.
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
