"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader
          title="Quản trị Hệ thống (System Admin)"
          description="Quản lý dữ liệu tổng thể, tài khoản và trạng thái kết nối API"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            Xuất báo cáo
          </Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
            Đồng bộ dữ liệu ngay
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số Giảng viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              45
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 trong học kỳ này
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số Sinh viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              1,248
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +340 trong học kỳ này
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lớp PBL Đang chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              32
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Hoạt động ổn định
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API Webhook Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              14.2k
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requests trong 24h qua
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">Trạng thái Tích hợp API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="font-semibold text-foreground">
                  Jira Software Cloud
                </p>
                <p className="text-sm text-muted-foreground">
                  Đồng bộ Issue, Sprint, Backlog
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-emerald-600">
                  Connected
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="font-semibold text-foreground">
                  GitHub Organization
                </p>
                <p className="text-sm text-muted-foreground">
                  Đồng bộ Commit, Pull Request, Review
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-emerald-600">
                  Connected
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="font-semibold text-foreground">
                  Hệ thống FAP (Nội bộ)
                </p>
                <p className="text-sm text-muted-foreground">
                  Đồng bộ danh sách Sinh viên, Giảng viên
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span className="text-sm font-medium text-amber-600">
                  Syncing
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">
              Hoạt động Quản trị gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    AD
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Quản trị viên</span> đã
                      thêm mới danh sách sinh viên cho lớp{" "}
                      <span className="font-medium">SE102.M21</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      2 giờ trước
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
