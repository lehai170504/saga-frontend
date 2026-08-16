"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudentProgress } from "@/features/projects/hooks/useStudentProgress";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CheckSquare,
  CheckCircle2,
  GitCommit,
  TrendingUp,
  Crown,
  UserCheck,
  Layers,
  AlertCircle,
  BarChart2,
  Bug,
  BookOpen,
  Zap,
  HelpCircle,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface MemberItem {
  studentId: string;
  fullName: string;
  studentCode: string;
  roleInTeam: string;
}

interface StudentMemberProgressTabProps {
  courseId: string;
  isLeader: boolean;
  membersList: MemberItem[];
}

export function StudentMemberProgressTab({
  courseId,
  isLeader,
  membersList,
}: StudentMemberProgressTabProps) {
  const { user } = useAuth();
  const currentStudentId = user?.localProfileId || "";

  // State for selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const targetStudentId = selectedStudentId ||
    (isLeader
      ? (currentStudentId && membersList.some((m) => m.studentId === currentStudentId) ? currentStudentId : (membersList[0]?.studentId ?? ""))
      : (currentStudentId || (membersList[0]?.studentId ?? "")));

  const { data: progressData, isLoading, error } = useStudentProgress(courseId, targetStudentId);

  const selectedMemberInfo = membersList.find((m) => m.studentId === targetStudentId);

  // Task type styling helper
  const getTaskTypeBadge = (type: string) => {
    switch (type.toUpperCase()) {
      case "FEATURE":
        return { label: "Tính năng (Feature)", icon: <Zap size={14} />, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", hex: "#6366f1" };
      case "STORY":
        return { label: "User Story", icon: <BookOpen size={14} />, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", hex: "#10b981" };
      case "BUG":
        return { label: "Sửa lỗi (Bug)", icon: <Bug size={14} />, color: "bg-destructive/10 text-destructive border-destructive/20", hex: "#ef4444" };
      case "REQUEST":
        return { label: "Yêu cầu (Request)", icon: <Layers size={14} />, color: "bg-purple-500/10 text-purple-500 border-purple-500/20", hex: "#a855f7" };
      case "TASK":
      default:
        return { label: "Công việc (Task)", icon: <CheckSquare size={14} />, color: "bg-primary/10 text-primary border-primary/20", hex: "#ea580c" };
    }
  };

  const taskDistributionEntries = Object.entries(progressData?.taskDistribution || {});

  // Chart 1 Data: Task Completion Ratio (Donut Chart)
  const completionPieData = [
    { name: "Đã hoàn thành (Done)", value: progressData?.completedTasks || 0, color: "#10b981" },
    { name: "Chưa hoàn thành", value: Math.max(0, (progressData?.totalTasks || 0) - (progressData?.completedTasks || 0)), color: "#f59e0b" },
  ];

  // Chart 2 Data: Task Distribution Bar Chart
  const distributionBarData = taskDistributionEntries.map(([typeKey, count]) => ({
    name: getTaskTypeBadge(typeKey).label,
    rawKey: typeKey,
    count: count,
    fill: getTaskTypeBadge(typeKey).hex,
  }));

  // Chart 3 Data: Radar Graph (Biểu đồ Đa giác / Mạng nhện Đánh giá Đóng góp 5 chiều)
  const totalTasksCount = Math.max(1, progressData?.totalTasks || 1);
  const radarData = [
    { subject: "Tỷ lệ Hoàn thành", value: Math.round(progressData?.overallCompletionRate || 0), fullMark: 100 },
    { subject: "Task Jira", value: Math.min(100, Math.round(((progressData?.totalTasks || 0) / 20) * 100)), fullMark: 100 },
    { subject: "Commits Git", value: Math.min(100, Math.round(((progressData?.totalCommits || 0) / 40) * 100)), fullMark: 100 },
    { subject: "Feature & Story", value: Math.min(100, Math.round((((progressData?.taskDistribution?.FEATURE || 0) + (progressData?.taskDistribution?.STORY || 0)) / totalTasksCount) * 100)), fullMark: 100 },
    { subject: "Sửa lỗi Bug", value: Math.min(100, Math.round(((progressData?.taskDistribution?.BUG || 0) / totalTasksCount) * 100)), fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Selector & Role Scope Banner */}
      <div className="p-5 rounded-[2rem] bg-card/60 border border-border/50 backdrop-blur-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl shrink-0 ${isLeader ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
              {isLeader ? <Crown size={20} /> : <UserCheck size={20} />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground tracking-tight">
                {isLeader ? "Tiến độ Thành viên nhóm" : "Tiến độ Công việc Cá nhân"}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {isLeader
                  ? "Xem chỉ số giao việc, biểu đồ tỷ lệ hoàn thành task Jira và đồ thị đa giác năng lực của từng thành viên."
                  : "Chỉ số hoàn thành task và biểu đồ chỉ số đóng góp của riêng bạn."}
              </p>
            </div>
          </div>

          {/* Member Selector (Leader Only) */}
          {isLeader ? (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-muted-foreground hidden md:inline">Chọn thành viên:</span>
              <Select value={targetStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-full sm:w-[260px] h-11 rounded-xl bg-background border-border/60 font-bold text-xs shadow-sm focus:ring-primary/20">
                  <SelectValue placeholder="Chọn thành viên...">
                    {(() => {
                      if (!selectedMemberInfo) return "Chọn thành viên...";
                      let name = (selectedMemberInfo.fullName || "").trim();
                      if (selectedMemberInfo.studentCode) {
                        name = name.replace(new RegExp(`\\s*\\(${selectedMemberInfo.studentCode}\\)`, 'gi'), '').trim();
                      }
                      name = name.replace(/\s*\([A-Za-z]{2,4}\d{4,6}\)$/g, '').trim();
                      return name;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5} className="rounded-xl border-border/50 shadow-xl">
                  {membersList.map((m) => (
                    <SelectItem key={m.studentId} value={m.studentId} className="rounded-lg font-semibold text-xs cursor-pointer py-2">
                      <span className="flex items-center justify-between gap-2 w-full">
                        <span>{m.fullName} ({m.studentCode})</span>
                        {m.roleInTeam === "LEADER" && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black px-1.5 py-0">
                            👑 Leader
                          </Badge>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-extrabold text-xs px-3 py-1.5 rounded-full shrink-0">
              👤 Báo cáo cá nhân
            </Badge>
          )}
        </div>

        {/* Selected Member Info Header Badge */}
        {selectedMemberInfo && (
          <div className="flex items-center gap-2.5 pt-3 border-t border-border/30 text-xs">
            <span className="text-muted-foreground font-medium">Đang xem báo cáo của:</span>
            <span className="font-extrabold text-foreground bg-muted/40 px-3 py-1 rounded-lg border border-border/40 flex items-center gap-1.5">
              {selectedMemberInfo.fullName}
              <span className="text-muted-foreground font-normal">({selectedMemberInfo.studentCode})</span>
              {selectedMemberInfo.roleInTeam === "LEADER" && (
                <span className="text-[10px] text-amber-500 font-bold ml-1">👑 Trưởng nhóm</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Main Content Loading / Error / Cards */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl bg-muted/40" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 rounded-3xl bg-muted/40" />
            <Skeleton className="h-72 rounded-3xl bg-muted/40" />
            <Skeleton className="h-72 rounded-3xl bg-muted/40" />
          </div>
        </div>
      ) : error ? (
        <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle size={36} className="mx-auto text-destructive" />
          <h4 className="text-lg font-bold text-destructive">Không thể tải dữ liệu tiến độ</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Đã có lỗi xảy ra khi truy vấn tiến độ thành viên. Vui lòng kiểm tra lại quyền truy cập hoặc thử lại sau.
          </p>
        </Card>
      ) : progressData ? (
        <div className="space-y-6">
          {/* Top 4 KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Tasks */}
            <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Tổng số Task
                </span>
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <CheckSquare size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-foreground">
                  {progressData.totalTasks}
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">Task Jira được giao</p>
              </div>
            </Card>

            {/* Card 2: Completed Tasks */}
            <Card className="rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Task Hoàn thành
                </span>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {progressData.completedTasks}
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">Đã chuyển sang Done</p>
              </div>
            </Card>

            {/* Card 3: Overall Completion Rate */}
            <Card className="rounded-2xl p-5 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                  Tỷ lệ Tự Hoàn thành
                </span>
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black tracking-tight text-foreground">
                    {progressData.overallCompletionRate.toFixed(1)}%
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progressData.overallCompletionRate >= 70
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : progressData.overallCompletionRate >= 30
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                  >
                    {progressData.overallCompletionRate >= 70 ? "Tốt" : progressData.overallCompletionRate >= 30 ? "Trung bình" : "Cần đẩy nhanh"}
                  </Badge>
                </div>
                <Progress value={progressData.overallCompletionRate} className="h-2 rounded-full bg-muted" />
              </div>
            </Card>

            {/* Card 4: Total Commits */}
            <Card className="rounded-2xl p-5 border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Tổng số Commit
                </span>
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <GitCommit size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                  {progressData.totalCommits}
                </div>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">Lần đẩy mã nguồn GitHub</p>
              </div>
            </Card>
          </div>

          {/* Recharts Visualizations Grid (3 Charts & Radar Graph) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Completion Ratio Donut Chart */}
            <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <PieChartIcon size={18} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-foreground">Biểu đồ Tỷ lệ Hoàn thành</h4>
                  <p className="text-xs text-muted-foreground">Tỷ lệ công việc đã Done</p>
                </div>
              </div>

              <div className="h-56 w-full relative flex items-center justify-center">
                {progressData.totalTasks === 0 ? (
                  <div className="text-muted-foreground italic text-xs">Chưa có task nào được giao.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {completionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {progressData.totalTasks > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-foreground">{progressData.overallCompletionRate.toFixed(1)}%</span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">Hoàn thành</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30 text-xs">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-bold text-foreground block text-[11px]">Xong: {progressData.completedTasks}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div>
                    <span className="font-bold text-foreground block text-[11px]">Còn: {Math.max(0, progressData.totalTasks - progressData.completedTasks)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chart 2: Task Type Distribution Bar Chart */}
            <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <BarChart2 size={18} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-foreground">Biểu đồ Loại Task Jira</h4>
                  <p className="text-xs text-muted-foreground">Phân bổ loại Issue Type</p>
                </div>
              </div>

              <div className="h-56 w-full">
                {distributionBarData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic text-xs">
                    Chưa có dữ liệu phân bổ task.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionBarData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Bar dataKey="count" name="Số lượng task" radius={[6, 6, 0, 0]}>
                        {distributionBarData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40 text-xs flex items-center justify-between">
                <span className="text-muted-foreground font-medium text-[11px]">Tổng số loại:</span>
                <span className="font-extrabold text-foreground">{taskDistributionEntries.length} loại</span>
              </div>
            </Card>

            {/* Graph 3: Radar Chart (Đồ thị Đa giác / Mạng nhện Đánh giá Đóng góp 5 chiều) */}
            <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                  <Activity size={18} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-foreground">Đồ thị Đa giác Đóng góp</h4>
                  <p className="text-xs text-muted-foreground">Đánh giá cân bằng năng lực (Radar Graph)</p>
                </div>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="var(--border)" opacity={0.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: "bold", fill: "var(--foreground)" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="Chỉ số đóng góp" dataKey="value" stroke="oklch(0.65 0.22 30)" fill="oklch(0.65 0.22 30)" fillOpacity={0.4} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 text-center">
                🕸️ Radar Graph 5 chiều đóng góp sinh viên
              </div>
            </Card>
          </div>

          {/* Original Bottom Section: Task Distribution Breakdown Details & Summary Box */}
          <Card className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <BarChart2 size={18} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-foreground">Phân bổ loại Task (Task Distribution)</h4>
                  <p className="text-xs text-muted-foreground">Thống kê cơ cấu các loại công việc Jira được giao cho thành viên</p>
                </div>
              </div>
            </div>

            {taskDistributionEntries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground italic text-xs">
                Chưa có dữ liệu phân bổ task cho thành viên này.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Distribution Progress Items */}
                <div className="space-y-4">
                  {taskDistributionEntries.map(([typeKey, count]) => {
                    const typeInfo = getTaskTypeBadge(typeKey);
                    const percentage = progressData.totalTasks > 0 ? (count / progressData.totalTasks) * 100 : 0;

                    return (
                      <div key={typeKey} className="space-y-1.5 p-3 rounded-2xl bg-muted/20 border border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-bold text-foreground">
                            <span className={`p-1.5 rounded-lg ${typeInfo.color}`}>{typeInfo.icon}</span>
                            {typeInfo.label}
                          </span>
                          <span className="font-extrabold text-foreground">
                            {count} task <span className="text-muted-foreground font-normal">({percentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2 rounded-full bg-muted/50" />
                      </div>
                    );
                  })}

                  {progressData.unclassifiedTasks > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <HelpCircle size={14} /> Task chưa phân loại
                      </span>
                      <span className="font-bold text-foreground">{progressData.unclassifiedTasks} task</span>
                    </div>
                  )}
                </div>

                {/* Right Side Info Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      Tóm tắt Đóng góp
                    </span>
                    <h5 className="text-lg font-bold text-foreground">
                      {selectedMemberInfo?.fullName || "Thành viên"}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Thành viên đã hoàn thành <strong className="text-foreground">{progressData.completedTasks}</strong> trên tổng số <strong className="text-foreground">{progressData.totalTasks}</strong> task được giao với <strong className="text-foreground">{progressData.totalCommits}</strong> lượt push code GitHub.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/10 text-xs">
                    <div className="p-2.5 rounded-xl bg-background/60 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-bold block uppercase">Hoàn thành</span>
                      <span className="font-black text-emerald-500 text-sm">{progressData.completedTasks} / {progressData.totalTasks}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background/60 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase block">Commits</span>
                      <span className="font-black text-indigo-500 text-sm">{progressData.totalCommits} commit</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
