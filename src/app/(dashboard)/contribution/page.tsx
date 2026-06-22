"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  studentSkillData,
  teamContributionRows,
} from "@/mock-data/contribution";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/DataState";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { GitCommit } from "lucide-react";

const avatarColors = [
  "bg-slate-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-teal-500",
  "bg-amber-500",
];

export default function ContributionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Individual Contribution"
        description="Multi-dimensional skill profile and team ranking — Sprint 4"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-1 border-slate-200/60 shadow-sm rounded-2xl bg-white flex flex-col pt-2">
          <SectionHeader
            title="Skill radar"
            description="Minh Anh vs Group average"
          />
          <CardContent className="px-6 pb-6 pt-4 flex-1 flex items-center justify-center">
            <div className="w-full h-80 flex items-center justify-center">
              {isLoading ? (
                <Skeleton className="w-[280px] h-[280px] rounded-full opacity-40" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="65%"
                    data={studentSkillData}
                  >
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Radar
                      name="Minh Anh"
                      dataKey="A"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      fill="#f97316"
                      fillOpacity={0.2}
                    />
                    <Radar
                      name="Group Avg"
                      dataKey="B"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="none"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm rounded-2xl bg-white flex flex-col pt-2">
          <SectionHeader
            title="Group ranking"
            description="Click vào thành viên để xem chi tiết"
          />
          <CardContent className="px-0 pb-2">
            {teamContributionRows.length === 0 && !isLoading ? (
              <EmptyState message="Chưa có dữ liệu đóng góp trong Sprint này" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-y border-slate-100 hover:bg-transparent">
                    <TableHead className="w-[50px] pl-6 text-xs font-semibold text-slate-500 uppercase">
                      #
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase">
                      Member
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase">
                      Commits
                    </TableHead>
                    <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 uppercase">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow
                          key={idx}
                          className="border-b border-slate-50"
                        >
                          <TableCell className="pl-6">
                            <Skeleton className="h-4 w-4" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="w-9 h-9 rounded-full" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-8 ml-auto" />
                          </TableCell>
                          <TableCell className="pr-6">
                            <Skeleton className="h-6 w-10 rounded-full ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                    : teamContributionRows.map((row, index) => {
                        let scoreBadgeClass =
                          row.score >= 8.0
                            ? "bg-emerald-100/80 text-emerald-600"
                            : row.score >= 5.0
                              ? "bg-orange-100/80 text-orange-600"
                              : "bg-red-100/80 text-red-500";
                        return (
                          <TableRow
                            key={row.id}
                            onClick={() => setSelectedUser(row)}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                          >
                            <TableCell className="pl-6 font-medium text-slate-400 text-sm">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  name={row.name}
                                  bgColorClass={
                                    avatarColors[index % avatarColors.length]
                                  }
                                />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-900 text-sm">
                                    {row.name}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {row.role}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-700 text-sm">
                              {row.commits}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${scoreBadgeClass}`}
                              >
                                {row.score.toFixed(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Drill-down Drawer */}
      <Sheet open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <SheetContent className="bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-xl">Báo cáo cá nhân</SheetTitle>
            <SheetDescription>
              Phân tích hiệu suất của {selectedUser?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <UserAvatar
                name={selectedUser?.name || "U"}
                className="w-14 h-14 text-xl"
              />
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {selectedUser?.name}
                </h3>
                <p className="text-slate-500 text-sm">{selectedUser?.role}</p>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 pt-4 border-b pb-2">
              Commits gần đây
            </h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <GitCommit className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      fix: Handle API response error state
                    </p>
                    <p className="text-xs text-slate-500">2 giờ trước</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
