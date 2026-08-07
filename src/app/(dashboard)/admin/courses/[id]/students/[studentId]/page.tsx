"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, GitCommit, AlertTriangle, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { IdentityMappingReview } from "@/features/integrations/components/identity-mapping-review";

import { useStudentProgress, useStudentActivities, useStudentContributionDetail, useTeamDetail } from "@/features/lecturer/hooks/useAnalytics";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStudentProfilePage({ params }: { params: Promise<{ id: string, studentId: string }> }) {
  const { id: courseId, studentId } = React.use(params);

  const { data: studentsResponse, isLoading: isLoadingBasicInfo } = useCourseStudents(courseId);
  const studentInfo = React.useMemo(() => {
    if (!studentsResponse) return null;
    const withTeam = studentsResponse.studentsWithTeam.content.find(s => s.studentId === studentId);
    if (withTeam) return { ...withTeam, hasTeam: true };
    const withoutTeam = studentsResponse.studentsWithoutTeam.content.find(s => s.studentId === studentId);
    if (withoutTeam) return { ...withoutTeam, hasTeam: false };
    return null;
  }, [studentsResponse, studentId]);

  const { data: progressData } = useStudentProgress(courseId, studentId);
  const { data: activitiesData, isLoading: isLoadingActivities } = useStudentActivities(courseId, studentId);
  const { data: contributionData } = useStudentContributionDetail(courseId, studentId);

  const aggregate = contributionData?.currentAggregate;
  const warnings = aggregate?.warnings || [];

  const { data: teamDetailData } = useTeamDetail(courseId, studentInfo?.team?.teamId || "");

  const STUDENT = {
    name: studentInfo?.fullName || aggregate?.fullName || `SV ${studentId.substring(0, 8)}`,
    studentCode: studentInfo?.studentCode || aggregate?.studentCode || "Đang cập nhật",
    email: studentInfo?.email || (aggregate?.studentCode ? `${aggregate.studentCode.toLowerCase()}@fpt.edu.vn` : "Đang cập nhật"),
    group: teamDetailData?.teamName || studentInfo?.team?.teamName || "Chưa có nhóm",
    avatar: (studentInfo?.fullName || aggregate?.fullName || "U").charAt(0).toUpperCase(),
    riskLevel: warnings.length > 0 ? "high" : "low",
    status: "Active" // Backend doesn't return accountStatus in course students yet, assume Active
  };

  const RADAR_DATA = aggregate ? [
    { subject: 'Code', A: aggregate.codeContributionScore || 0, fullMark: 100 },
    { subject: 'Tài liệu', A: aggregate.documentContributionScore || 0, fullMark: 100 },
    { subject: 'Thiết kế', A: aggregate.designContributionScore || 0, fullMark: 100 },
    { subject: 'Peer Review', A: aggregate.peerReviewScore || 0, fullMark: 5 },
    { subject: 'Task', A: aggregate.taskContributionScore || 0, fullMark: 100 },
  ] : [];

  const TIMELINE = activitiesData?.activities?.content?.map(activity => ({
    type: activity.type.toLowerCase(),
    text: activity.title,
    time: new Date(activity.occurredAt).toLocaleString('vi-VN'),
    link: "#"
  })) || [];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background overflow-hidden">
      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/admin/courses/${courseId}`} className="hover:text-foreground transition-colors">Quản trị Khóa học</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-semibold">
            {isLoadingBasicInfo ? <Skeleton className="h-4 w-32 inline-block align-middle" /> : STUDENT.name}
          </span>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {isLoadingBasicInfo ? (
            <div className="flex items-center gap-5">
              <Skeleton className="w-20 h-20 rounded-2xl" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {STUDENT.avatar}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">{STUDENT.name}</h1>
                  <Badge variant="outline" className={STUDENT.status === "Active" ? "bg-success/10 text-success border-success/20 font-bold" : "bg-muted/50 text-muted-foreground border-border font-bold"}>
                    {STUDENT.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
                  <span>ID: {STUDENT.studentCode}</span>
                  <span>•</span>
                  <span>{STUDENT.email}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/50">
                    <User size={12} />
                    {STUDENT.group}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-stretch">

          {/* Left Column: Stats & Radar Chart */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="rounded-[2rem] border-border/50 bg-card shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Năng lực Đa chiều</h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={STUDENT.name} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <GitCommit size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">COMMITS</p>
                    <p className="text-2xl font-bold text-foreground">{progressData?.totalCommits || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">TASKS DONE</p>
                    <p className="text-2xl font-bold text-foreground">{progressData?.completedTasks || 0} / {progressData?.totalTasks || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Indicator */}
            {STUDENT.riskLevel === 'low' ? (
              <Card className="rounded-2xl border-border/50 bg-success/5 shadow-sm border-dashed">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-success">Tình trạng Tốt</p>
                    <p className="text-xs text-muted-foreground font-medium">Không phát hiện rủi ro nào đáng kể.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-border/50 bg-destructive/5 shadow-sm border-dashed">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-destructive">Phát hiện Rủi ro</p>
                      <p className="text-xs text-muted-foreground font-medium">Có {warnings.length} cảnh báo đang chờ xử lý.</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 pl-1">
                    {warnings.map((w, i) => (
                      <div key={i} className="text-xs font-medium text-destructive/80 bg-destructive/10 px-2 py-1 rounded-md">
                        • {w.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Timeline */}
          <Card className="lg:col-span-7 rounded-[2rem] border-border/50 bg-card shadow-sm overflow-hidden flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6">Dấu vết Hoạt động (Evidence)</h3>

              <div className="relative flex-1 pl-4 border-l-2 border-muted/50 space-y-8">
                {isLoadingActivities ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2 mb-6">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))
                ) : TIMELINE.length > 0 ? (
                  TIMELINE.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary ring-4 ring-background" />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === 'commit' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-primary/10 text-primary border-primary/20"><GitCommit size={10} className="mr-1" /> Commit</Badge>}
                          {item.type === 'document' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-success/10 text-success border-success/20"><FileText size={10} className="mr-1" /> Document</Badge>}

                          <span className="text-xs text-muted-foreground font-medium">{item.time}</span>
                        </div>

                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic py-4">Chưa có hoạt động nào được ghi nhận.</div>
                )}
              </div>

              <Button variant="outline" className="w-full mt-6 rounded-xl border-dashed">
                Xem toàn bộ lịch sử
              </Button>
            </CardContent>
          </Card>


        </div>

        {/* Identity Mapping Review Section */}
        <div className="mt-6">
          <IdentityMappingReview studentId={studentId} />
        </div>
      </div>
    </div>
  );
}
