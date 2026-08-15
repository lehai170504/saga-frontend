"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitCommit, AlertTriangle, CheckCircle2, ChevronRight, FileText, ArrowRight, Activity, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { IdentityMappingReview } from "@/features/integrations/components/identity-mapping-review";
import { useStudentProgress, useStudentActivities, useStudentContributionDetail, useTeamDetail } from "@/features/lecturer/hooks/useAnalytics";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useProjectDashboardStats } from "@/features/projects/hooks/useProjectDashboardStats";
import dynamic from 'next/dynamic';

// Lớp 2: Lazy loading biểu đồ nặng
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full rounded-2xl" /> });
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false });
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false });
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

export function StudentProfileClient({ courseId, studentId }: { courseId: string, studentId: string }) {
  const { data: studentsResponse, isLoading: isLoadingBasicInfo } = useCourseStudents(courseId);
  const studentInfo = React.useMemo(() => {
    if (!studentsResponse) return null;
    const withTeam = studentsResponse.studentsWithTeam.content.find(s => s.studentId === studentId);
    if (withTeam) return { ...withTeam, hasTeam: true };
    const withoutTeam = studentsResponse.studentsWithoutTeam.content.find(s => s.studentId === studentId);
    if (withoutTeam) return { ...withoutTeam, hasTeam: false };
    return null;
  }, [studentsResponse, studentId]);

  const teamId = studentInfo?.team?.teamId;
  const { data: progressData } = useStudentProgress(courseId, studentId);
  const { data: activitiesData, isLoading: isLoadingActivities } = useStudentActivities(courseId, studentId);
  const { data: contributionData } = useStudentContributionDetail(courseId, studentId);
  const { data: teamDetailData } = useTeamDetail(courseId, teamId || "");
  const projectId = teamDetailData?.project?.id;
  const { data: projectStats } = useProjectDashboardStats(projectId || "");

  const aggregate = contributionData?.currentAggregate;
  const warnings = aggregate?.warnings || [];

  const STUDENT = {
    name: studentInfo?.fullName || aggregate?.fullName || `SV ${studentId.substring(0, 8)}`,
    studentCode: studentInfo?.studentCode || aggregate?.studentCode || "Đang cập nhật",
    email: studentInfo?.email || (aggregate?.studentCode ? `${aggregate.studentCode.toLowerCase()}@fpt.edu.vn` : "Đang cập nhật"),
    group: teamDetailData?.teamName || studentInfo?.team?.teamName || "Chưa có nhóm",
    groupId: teamId,
    avatar: (studentInfo?.fullName || aggregate?.fullName || "U").charAt(0).toUpperCase(),
    riskLevel: warnings.length > 0 ? "high" : "low",
    status: "Active"
  };

  const RADAR_DATA = [
    { subject: 'Code', A: aggregate?.codeContributionScore || 0, fullMark: 100 },
    { subject: 'Tài liệu', A: aggregate?.documentContributionScore || 0, fullMark: 100 },
    { subject: 'Thiết kế', A: aggregate?.designContributionScore || 0, fullMark: 100 },
    { subject: 'Peer Review', A: aggregate?.peerReviewScore || 0, fullMark: 5 },
    { subject: 'Task', A: aggregate?.taskContributionScore || 0, fullMark: 100 },
  ];

  const TIMELINE = activitiesData?.activities?.content?.map(activity => ({
    type: activity.type.toLowerCase(),
    text: activity.title,
    time: new Date(activity.occurredAt).toLocaleString('vi-VN'),
    link: "#"
  })) || [];

  // Tính phần trăm đóng góp
  const commitPercentage = projectStats?.github?.commitCount
    ? Math.round(((progressData?.totalCommits || 0) / projectStats.github.commitCount) * 100)
    : 0;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full bg-background overflow-x-hidden pb-12">
      {/* Decorative Blur Background behind Banner */}
      <div className={`absolute top-0 left-0 w-full h-80 opacity-20 pointer-events-none transition-colors duration-700 ${STUDENT.riskLevel === 'high' ? 'bg-destructive' : 'bg-primary'}`} style={{ filter: 'blur(100px)' }}></div>

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href={`/lecturer/${courseId}`} className="hover:text-foreground transition-colors">Workspace</Link>
          <ChevronRight size={14} />
          <Link href={`/lecturer/${courseId}/students`} className="hover:text-foreground transition-colors">Danh sách Sinh viên</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-semibold">
            {isLoadingBasicInfo ? <Skeleton className="h-4 w-32 inline-block align-middle" /> : STUDENT.name}
          </span>
        </div>

        {/* Hero Banner */}
        <Card className={`rounded-[2rem] border-0 shadow-lg overflow-hidden relative backdrop-blur-md ${STUDENT.riskLevel === 'high' ? 'bg-destructive/10' : 'bg-primary/5'}`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${STUDENT.riskLevel === 'high' ? 'bg-destructive' : 'bg-primary'}`}></div>
          <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
            {isLoadingBasicInfo ? (
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-3xl" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-6 w-48 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl text-white ${STUDENT.riskLevel === 'high' ? 'bg-gradient-to-br from-destructive to-destructive/60' : 'bg-gradient-to-br from-primary to-primary/60'}`}>
                  {STUDENT.avatar}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">{STUDENT.name}</h1>
                    <Badge variant="outline" className={`font-bold ${STUDENT.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-muted/50 text-muted-foreground border-border"}`}>
                      {STUDENT.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
                    <span className="font-mono bg-muted/50 px-2 py-0.5 rounded border border-border/50">{STUDENT.studentCode}</span>
                    <span>•</span>
                    <span>{STUDENT.email}</span>
                  </div>
                  {/* AI Assessment Summary */}
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-background/50 border border-border/50 shadow-sm">
                    {STUDENT.riskLevel === 'high' ? (
                      <><AlertTriangle size={16} className="text-destructive" /> Cần chú ý: Tồn đọng cảnh báo chưa xử lý</>
                    ) : (
                      <><CheckCircle2 size={16} className="text-success" /> Hiệu suất ổn định: Không có cảnh báo bất thường</>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Identity Mapping on the Right Side of Hero Banner */}
            <div className="w-full xl:w-[380px] shrink-0">
              <IdentityMappingReview studentId={studentId} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">

          {/* Left Column: Stats & Ecosystem (5 columns) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Ecosystem Connect */}
            <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden group hover:border-primary/30 transition-colors h-[220px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Network size={18} /> Kết nối Dự án
                </h3>
                <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {STUDENT.group.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase">Nhóm hiện tại</p>
                        <p className="text-base font-bold text-foreground">{STUDENT.group}</p>
                      </div>
                    </div>
                  </div>

                  {STUDENT.groupId ? (
                    <Button variant="secondary" className="w-full rounded-xl bg-background border border-border/50 hover:bg-primary/5 hover:text-primary transition-colors group-hover:border-primary/30" asChild>
                      <Link href={`/lecturer/${courseId}/projects/${STUDENT.groupId}`}>
                        Xem Dashboard Nhóm <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground italic text-center py-2">
                      Chưa gia nhập nhóm
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <GitCommit size={20} />
                    </div>
                    {commitPercentage > 0 && (
                      <Badge variant="outline" className="font-bold bg-background text-[10px]">
                        {commitPercentage}% toàn đội
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-foreground">{progressData?.totalCommits || 0}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Commits Cá nhân</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-foreground">
                      {progressData?.completedTasks || 0}
                      <span className="text-lg text-muted-foreground/50">/{progressData?.totalTasks || 0}</span>
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Tasks Hoàn thành</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Radar Chart */}
            <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                  <Activity size={18} /> Phân tích Năng lực
                </h3>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                      <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={STUDENT.name} dataKey="A" stroke="#6366f1" fill="url(#colorUv)" fillOpacity={0.6} />
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <RechartsTooltip contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', background: 'rgba(var(--card), 0.9)', backdropFilter: 'blur(8px)', fontWeight: 'bold' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Timeline & Identity (7 columns) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Warning Details */}
            {warnings.length > 0 && (
              <Card className="rounded-[2rem] border-destructive/30 bg-destructive/5 shadow-sm border-dashed h-[220px] flex flex-col">
                <CardContent className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-destructive/20 hover:[&::-webkit-scrollbar-thumb]:bg-destructive/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-destructive text-lg leading-tight">Cảnh báo Cần xử lý</p>
                      <p className="text-sm text-muted-foreground font-medium">Hệ thống phát hiện {warnings.length} vấn đề nghiêm trọng.</p>
                    </div>
                  </div>
                  <div className="space-y-2 pl-1">
                    {warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm font-medium text-destructive/90 bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">
                        <span className="mt-0.5">•</span> <span>{w.message}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="rounded-[2rem] border-border/50 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-6 shrink-0">Nhật ký Hoạt động (Evidence Log)</h3>

                <div className="flex-1 overflow-y-auto pr-4 -mr-4 pl-4 -ml-4 pt-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full max-h-[500px]">
                  <div className="space-y-0">
                    {isLoadingActivities ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-6 pb-8">
                          <div className="w-3 h-3 rounded-full bg-muted shrink-0 mt-1" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : TIMELINE.length > 0 ? (
                      TIMELINE.map((item, idx) => (
                        <div key={idx} className="group flex gap-6 relative">
                          {/* Vertical Line */}
                          {idx !== TIMELINE.length - 1 && (
                            <div className="absolute left-[5px] top-5 bottom-[-16px] w-[2px] bg-muted/60" />
                          )}

                          {/* Dot */}
                          <div className="relative z-10 w-3 h-3 shrink-0 rounded-full bg-background border-2 border-primary ring-4 ring-background shadow-sm mt-1.5 group-hover:scale-150 transition-transform duration-300" />

                          {/* Content */}
                          <div className="flex-1 space-y-2 pb-8">
                            {/* Hover effect highlight */}
                            <div className="absolute -inset-x-4 -inset-y-2 bg-muted/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

                            <div className="flex items-center gap-3">
                              {item.type === 'commit' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-primary/10 text-primary border-primary/20 px-1.5 py-0"><GitCommit size={10} className="mr-1" /> Commit</Badge>}
                              {item.type === 'document' && <Badge variant="outline" className="text-[10px] uppercase font-bold bg-success/10 text-success border-success/20 px-1.5 py-0"><FileText size={10} className="mr-1" /> Document</Badge>}
                              <span className="text-xs text-muted-foreground font-semibold bg-background/50 px-2 py-0.5 rounded-md border border-border/50">{item.time}</span>
                            </div>

                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic py-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border/50">
                        Chưa có hoạt động nào được ghi nhận trong thời gian qua.
                      </div>
                    )}
                  </div>
                </div>


              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
