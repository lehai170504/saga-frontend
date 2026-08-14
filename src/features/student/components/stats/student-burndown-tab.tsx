"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamSprints, useBurndown } from "@/features/projects/hooks/useTeamSprints";
import {
  TrendingDown,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Info,
  Flame,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface StudentBurndownTabProps {
  courseId: string;
  teamId: string;
}

export function StudentBurndownTab({ courseId, teamId }: StudentBurndownTabProps) {
  const { data: sprintsData, isLoading: isLoadingSprints } = useTeamSprints(teamId);
  const sprints = useMemo(() => sprintsData?.sprints || [], [sprintsData?.sprints]);

  const [selectedSprintId, setSelectedSprintId] = useState<string>("");

  useEffect(() => {
    if (sprints.length > 0 && !selectedSprintId) {
      // Find active sprint or default to first sprint
      const activeSprint = sprints.find((s) => s.state === "ACTIVE" || s.state === "active");
      const defaultId = activeSprint ? activeSprint.sprintId : sprints[0].sprintId;
      requestAnimationFrame(() => setSelectedSprintId(defaultId));
    }
  }, [sprints, selectedSprintId]);

  const { data: burndown, isLoading: isLoadingBurndown, error: burndownError } = useBurndown(
    courseId,
    teamId,
    selectedSprintId
  );

  const points = burndown?.points || [];
  const totalScope = burndown?.totalScope ?? 0;
  const lastPoint = points.length > 0 ? points[points.length - 1] : null;

  const currentActual = lastPoint?.actualRemaining ?? totalScope;
  const currentIdeal = lastPoint?.idealRemaining ?? 0;
  const currentDone = lastPoint?.doneCount ?? 0;

  const isBehind = currentActual > currentIdeal;
  const isAhead = currentActual < currentIdeal;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  const chartData = points.map((p) => ({
    date: formatDateLabel(p.date),
    fullDate: p.date,
    idealRemaining: p.idealRemaining,
    actualRemaining: p.actualRemaining,
    doneCount: p.doneCount,
  }));

  if (isLoadingSprints) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (sprints.length === 0) {
    return (
      <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
          <Calendar size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Chưa có Sprint nào trong nhóm</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Nhóm của bạn chưa khởi tạo Sprint nào trên Jira. Vui lòng tạo Sprint tại mục &quot;Kế hoạch (Backlog)&quot; để xem biểu đồ tiến độ Burndown Chart.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Sprint Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 border border-border/50 p-6 rounded-[2rem] backdrop-blur-xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Flame size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Biểu đồ Tiến độ Sprint (Burndown Chart)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-medium pl-10">
            Đối chiếu số lượng task còn lại thực tế với đường tiêu thụ lý tưởng theo thời gian
          </p>
        </div>

        {/* Sprint Select */}
        <div className="w-full sm:w-64">
          <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
            <SelectTrigger className="w-full bg-background border border-border/60 rounded-xl h-11 focus:ring-2 focus:ring-primary/20 font-bold text-foreground">
              <SelectValue placeholder="Chọn Sprint" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 shadow-xl">
              {sprints.map((sprint) => (
                <SelectItem
                  key={sprint.sprintId}
                  value={sprint.sprintId}
                  className="rounded-lg cursor-pointer font-semibold py-2.5"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span>{sprint.sprintName}</span>
                    {sprint.state?.toUpperCase() === "ACTIVE" && (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold">
                        Đang diễn ra
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoadingBurndown ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-[420px] rounded-[2.5rem]" />
        </div>
      ) : burndownError ? (
        <Card className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không thể tải dữ liệu Burndown Chart</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Sprint này chưa có dữ liệu lịch trình hoặc chưa được liên kết với project Jira hợp lệ.
          </p>
        </Card>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Scope */}
            <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Tổng Scope (Tasks)
                </span>
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Layers size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-foreground">
                  {totalScope}
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Công việc trong Sprint {burndown?.sprintName}
                </p>
              </div>
            </Card>

            {/* Card 2: Actual Remaining */}
            <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Thực tế còn lại
                </span>
                <div
                  className={`p-2.5 rounded-xl ${isBehind
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-emerald-500/10 text-emerald-500"
                    }`}
                >
                  <TrendingDown size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div
                  className={`text-3xl font-black tracking-tight ${isBehind
                    ? "text-rose-500"
                    : isAhead
                      ? "text-emerald-500"
                      : "text-foreground"
                    }`}
                >
                  {currentActual}
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Mục tiêu lý tưởng: <strong className="text-foreground">{currentIdeal}</strong>
                </p>
              </div>
            </Card>

            {/* Card 3: Completed Tasks */}
            <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Đã Hoàn thành (Done)
                </span>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {currentDone}
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  Đạt {totalScope > 0 ? ((currentDone / totalScope) * 100).toFixed(1) : 0}% tổng Scope
                </p>
              </div>
            </Card>

            {/* Card 4: Sprint Status Banner */}
            <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Trạng thái Tiến độ
                </span>
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Clock size={18} />
                </div>
              </div>
              <div className="mt-4">
                {isBehind ? (
                  <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs font-extrabold py-1 px-3 rounded-xl">
                    ⚠️ Bị chậm tiến độ
                  </Badge>
                ) : isAhead ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-extrabold py-1 px-3 rounded-xl">
                    🚀 Vượt tiến độ
                  </Badge>
                ) : (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-extrabold py-1 px-3 rounded-xl">
                    ✅ Đúng kế hoạch
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground font-medium mt-2 leading-tight">
                  {isBehind
                    ? "Nhóm cần tập trung hoàn thành các task còn tồn đọng."
                    : "Nhóm đang duy trì tốc độ làm việc rất tốt."}
                </p>
              </div>
            </Card>
          </div>

          {/* Main Burndown Chart Card */}
          <Card className="rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
              <div>
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  Đường Tiêu thụ Công việc (Burn Rate)
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Thời gian: {burndown?.startDate || "N/A"} đến {burndown?.endDate || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="w-3 h-0.5 bg-primary rounded-full" />
                  <span>Lý tưởng (Ideal)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full" />
                  <span>Thực tế (Actual)</span>
                </div>
              </div>
            </div>

            {/* Chart Graphic */}
            <div className="h-[380px] w-full pt-4">
              {chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <Info size={32} />
                  <p className="text-sm font-semibold">Sprint chưa có mốc dữ liệu ngày</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis
                      dataKey="date"
                      stroke="currentColor"
                      className="text-[11px] font-bold text-muted-foreground"
                      tickLine={false}
                    />
                    <YAxis
                      stroke="currentColor"
                      className="text-[11px] font-bold text-muted-foreground"
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "1rem",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                      }}
                      formatter={(val: number | string | readonly (string | number)[] | undefined, name: string | number | undefined) => [
                        `${val ?? 0} task`,
                        name === "idealRemaining"
                          ? "Lý tưởng còn lại"
                          : name === "actualRemaining"
                            ? "Thực tế còn lại"
                            : "Đã hoàn thành",
                      ]}
                      labelFormatter={(label: React.ReactNode) => `Ngày: ${label}`}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value: string) => (
                        <span className="text-xs font-bold text-foreground">
                          {value === "idealRemaining" ? "Lý tưởng" : "Thực tế"}
                        </span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="idealRemaining"
                      name="idealRemaining"
                      stroke="var(--primary, #3b82f6)"
                      strokeDasharray="6 6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "var(--primary, #3b82f6)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actualRemaining"
                      name="actualRemaining"
                      stroke={isBehind ? "#f43f5e" : "#10b981"}
                      strokeWidth={3.5}
                      dot={{ r: 6, fill: isBehind ? "#f43f5e" : "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
