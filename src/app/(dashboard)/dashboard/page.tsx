"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { weeklyActivityData } from "@/mock-data/overview";
import {
  GitCommit,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";

const recentActivities = [
  {
    user: "Minh Anh",
    action: "đã merge PR #142",
    time: "2 phút trước",
    status: "Success",
    bg: "bg-orange-50",
    icon: <GitCommit className="h-4 w-4 text-orange-500" />,
  },
  {
    user: "Hoang Long",
    action: "đã bình luận trên Jira PBL-118",
    time: "11 phút trước",
    status: "Active",
    bg: "bg-blue-50",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
  },
  {
    user: "Thu Hien",
    action: "đã đóng task 'DB scripts'",
    time: "34 phút trước",
    status: "Done",
    bg: "bg-emerald-50",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  },
];

export default function OverviewDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Tổng quan — Sprint 4"
        description="Nhóm PBL-07 · CSE391 Công nghệ phần mềm"
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))
          : [...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="border-slate-200/60 shadow-sm rounded-2xl bg-white p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100">
                    <GitCommit className="h-5 w-5" />
                  </div>
                  <div className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
                    +12%
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800">
                  1.284
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng số Commits
                </p>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm rounded-2xl bg-white flex flex-col pt-2">
          <SectionHeader
            title="Mã nguồn & Tương tác"
            description="Chỉ số hoạt động hàng ngày"
          />
          <CardContent className="px-2 pb-6">
            <div className="h-80 w-full mt-4">
              {isLoading ? (
                <Skeleton className="w-full h-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis dataKey="name" hide />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="#f97316"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-slate-200/60 shadow-sm rounded-2xl bg-white flex flex-col pt-2">
          <SectionHeader title="Hoạt động gần đây" />
          <CardContent className="p-6">
            {recentActivities.length === 0 ? (
              <EmptyState message="Chưa có hoạt động mới" />
            ) : (
              <div className="space-y-6">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className={`p-2 rounded-full ${act.bg} shrink-0`}>
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{act.user}</p>
                      <p className="text-xs text-slate-500">{act.action}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 rounded-full transition-all"
                    >
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
