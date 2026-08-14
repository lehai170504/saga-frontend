"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Info, Search, FileSpreadsheet, CheckCircle2, AlertTriangle, Filter, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContributionEvaluation, useOverrideContribution } from "@/features/lecturer/hooks/useContribution";
import { ContributionAdjustment, ContributionEvaluationResponse } from "@/features/lecturer/types/contribution";
import { courseApi } from "@/features/courses/api/courseApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LecturerContributionPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();

  // Fetch Danh sách Sinh viên & Lọc ra các Nhóm (Teams)
  const { data: studentsData, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["courseStudents", courseId],
    queryFn: () => courseApi.getCourseStudents(courseId),
    enabled: !!courseId
  });

  const realTeams = useMemo(() => {
    if (!studentsData?.studentsWithTeam?.content) return [];
    const teamMap = new Map();
    studentsData.studentsWithTeam.content.forEach(student => {
      if (student.team && !teamMap.has(student.team.teamId)) {
        teamMap.set(student.team.teamId, {
          id: student.team.teamId,
          name: student.team.teamName
        });
      }
    });
    return Array.from(teamMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [studentsData]);

  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [overrideReason, setOverrideReason] = useState("");

  // Update selectedTeamId when realTeams are loaded
  useEffect(() => {
    if (realTeams.length > 0 && !selectedTeamId) {
      requestAnimationFrame(() => setSelectedTeamId(realTeams[0].id));
    } else if (realTeams.length > 0 && !realTeams.find(t => t.id === selectedTeamId)) {
      requestAnimationFrame(() => setSelectedTeamId(realTeams[0].id));
    }
  }, [realTeams, selectedTeamId]);

  // Check if selected team has a project
  const hasProject = useMemo(() => {
    if (!studentsData?.studentsWithTeam?.content || !selectedTeamId) return false;
    const teamStudents = studentsData.studentsWithTeam.content.filter(s => s.team?.teamId === selectedTeamId);
    return teamStudents.length > 0 && !!teamStudents[0].team?.projectId;
  }, [studentsData, selectedTeamId]);

  // Hooks gọi API (Không cần sprintId nữa theo Swagger mới). Chỉ gọi khi có project.
  const { data: apiData, isLoading } = useContributionEvaluation(selectedTeamId, hasProject);
  const overrideMutation = useOverrideContribution();

  // State local để quản lý Override (vì API chưa có, ta dùng state giả lập UI)
  const [localAdjustments, setLocalAdjustments] = useState<Record<string, ContributionAdjustment>>({});

  // Dynamic mock data based on real students if API fails
  const dynamicMockData = useMemo(() => {
    if (!studentsData?.studentsWithTeam?.content) return undefined;
    const teamStudents = studentsData.studentsWithTeam.content.filter(s => s.team?.teamId === selectedTeamId);
    if (teamStudents.length === 0) return undefined;

    // NẾU NHÓM CHƯA KẾT NỐI PROJECT -> Không render mock data, để cho rơi vào Empty State!
    if (!teamStudents[0].team?.projectId) return undefined;

    return {
      teamId: selectedTeamId,
      projectId: teamStudents[0].team.projectId,
      teamName: teamStudents[0].team?.teamName || "Nhóm",
      evaluatedAt: new Date().toISOString(),
      members: teamStudents.map((s, idx) => ({
        studentId: s.studentId,
        fullName: s.fullName,
        studentCode: s.studentCode,
        email: s.email,
        role: s.team?.teamMembers?.find(tm => tm.studentId === s.studentId)?.roleInTeam || "MEMBER",
        codeContributionScore: 80 - idx * 10,
        codeContributionPercentage: 40.0 - idx * 5,
        documentContributionScore: 20 + idx * 10,
        documentContributionPercentage: 10.0 + idx * 5,
        designContributionScore: 0,
        designContributionPercentage: 0.0,
        finalContributionPercentage: 50.0,
        taskContributionScore: 100,
        taskContributionPercentage: 50.0,
        peerReviewScore: 15 + (idx % 5),
        evidenceCount: 10,
        warnings: idx === 1 ? [{ code: "AI_WARN", message: "AI: Ghosting 5 ngày", severity: "HIGH" }] : [],
        sprintBreakdowns: []
      }))
    } as ContributionEvaluationResponse;
  }, [studentsData, selectedTeamId]);

  // Dùng mock data nếu API lỗi hoặc đang dev
  const teamData = apiData || dynamicMockData;

  // Lọc sinh viên theo tên
  const filteredMembers = useMemo(() => {
    if (!teamData || !teamData.members) return [];
    return teamData.members.filter(m =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teamData, searchQuery]);

  // Xử lý khi Giảng viên nhập % Override
  const handleOverrideChange = (studentId: string, value: string, originalPercentage: number) => {
    const newFinalPercentage = parseFloat(value);

    // Nếu rỗng hoặc NaN, xóa bỏ override của sinh viên này
    if (isNaN(newFinalPercentage) || value === "") {
      setLocalAdjustments(prev => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      return;
    }

    const adjustmentPercentage = newFinalPercentage - originalPercentage;

    setLocalAdjustments(prev => ({
      ...prev,
      [studentId]: {
        studentId,
        adjustmentPercentage,
        proposedPercentage: newFinalPercentage,
        note: prev[studentId]?.note || ""
      }
    }));
  };

  const handleSaveOverride = async () => {
    const adjustments = Object.values(localAdjustments);
    if (adjustments.length === 0) {
      toast.error("Không có thay đổi nào để lưu!");
      return;
    }
    if (!overrideReason.trim()) {
      toast.error("Vui lòng nhập lý do (văn bản chung) cho quyết định ghi đè này.");
      return;
    }

    try {
      // Vì API thiết kế 1 request / 1 sinh viên, nên phải Promise.all
      await Promise.all(
        adjustments.map((adj) =>
          overrideMutation.mutateAsync({
            teamId: selectedTeamId,
            data: {
              studentId: adj.studentId,
              proposedPercentage: adj.proposedPercentage / 100, // API expect decimal (0.1 = 10%)
              reason: overrideReason,
              lecturerId: user?.localProfileId
            }
          })
        )
      );
      toast.success("Đã lưu quyết định ghi đè thành công!");
      setLocalAdjustments({});
      setOverrideReason("");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu ghi đè. Vui lòng thử lại!");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-x-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <CheckCircle2 size={14} />
              Quyết định Điểm Thành phần
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
             Bảng điểm
            </h1>
            <p className="text-muted-foreground font-medium">Theo dõi % đóng góp của sinh viên dựa trên Task/Commit và thực hiện ghi đè (override) nếu cần thiết.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-border/50 h-10 font-bold text-success bg-success/10 dark:hover:bg-emerald-950/30">
              <FileSpreadsheet size={16} className="mr-2" />
              Xuất Excel (FAP Format)
            </Button>
            <Button
              className={`rounded-xl h-10 font-bold transition-all duration-300 ${
                overrideMutation.isPending || Object.keys(localAdjustments).length === 0 || !overrideReason.trim()
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70 hover:bg-muted'
                  : 'bg-success hover:bg-success/90 text-white shadow-md shadow-success/20'
              }`}
              onClick={handleSaveOverride}
              disabled={overrideMutation.isPending || Object.keys(localAdjustments).length === 0 || !overrideReason.trim()}
            >
              {overrideMutation.isPending ? (
                <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Đang lưu...</span>
              ) : (
                <span className="flex items-center"><Save size={16} className="mr-2" /> Lưu Ghi đè (Override)</span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter and Content Card */}
        <Card className="rounded-[2rem] shadow-sm border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border/50 flex flex-col lg:flex-row items-center justify-between gap-4 bg-muted/20">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Team Selector */}
                <div className="w-full sm:w-[250px]">
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId} disabled={isLoadingTeams || realTeams.length === 0}>
                    <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 font-medium">
                      <SelectValue placeholder={isLoadingTeams ? "Đang tải nhóm..." : (realTeams.length === 0 ? "Chưa có nhóm nào" : "Chọn nhóm")} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {realTeams.map((team: { id: string; name: string }) => (
                        <SelectItem key={team.id} value={team.id} className="rounded-lg">{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm sinh viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background border-border/50 rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-xl border border-border/50 w-full lg:w-auto">
                <Info size={16} className="text-primary flex-shrink-0" />
                <span>% Hệ thống = (% Code + % Doc + % Design). Giảng viên nhập trực tiếp % mới để ghi đè.</span>
              </div>
            </div>

            {/* Lý do Override Chung */}
            {Object.keys(localAdjustments).length > 0 && (
              <div className={`p-5 border-b animate-in slide-in-from-top-2 transition-colors duration-300 ${!overrideReason.trim() ? 'bg-destructive/10 border-destructive/20' : 'bg-success/10 border-success/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${!overrideReason.trim() ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className={`text-sm font-bold uppercase tracking-wider ${!overrideReason.trim() ? 'text-destructive' : 'text-success'}`}>
                      Lý do bắt buộc cho quyết định ghi đè của Nhóm này *
                    </label>
                    <Input
                      placeholder="Ví dụ: Nhóm có thành viên nghỉ ốm dài hạn..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className={`bg-background rounded-xl border-2 h-11 focus-visible:ring-0 ${!overrideReason.trim() ? 'border-destructive/40 focus-visible:border-destructive placeholder:text-destructive/50' : 'border-success/40 focus-visible:border-success'}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            {(isLoading || isLoadingTeams) ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : (!teamData || !teamData.projectId || filteredMembers.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className="w-24 h-24 mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/20 rounded-full border border-primary/10 shadow-inner flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-primary opacity-50" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Chưa có kết quả đánh giá đóng góp</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Nhóm này hiện tại <b>chưa kết nối với bất kỳ Dự án nào</b>,
                  hoặc chưa có dữ liệu chấm điểm Slices từ hệ thống.
                </p>
                <Button variant="outline" className="border-border/50 text-foreground hover:bg-muted" onClick={() => window.location.href = `/lecturer/${courseId}/projects`}>
                  <ChevronRight size={16} className="mr-2" />
                  Đi tới trang Quản lý Đề tài
                </Button>
              </div>
            ) : (
              <div className="overflow-auto max-h-[calc(100vh-320px)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&>div]:overflow-visible">
                <Table>
                  <TableHeader className="bg-muted/90 sticky top-0 z-20 shadow-sm backdrop-blur-md">
                    <TableRow>
                      <TableHead className="w-[100px] font-bold text-muted-foreground">Mã SV</TableHead>
                      <TableHead className="font-bold text-muted-foreground min-w-[150px]">Họ và Tên</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-center">Vai trò</TableHead>
                      <TableHead className="font-bold text-muted-foreground text-center" title="Điểm Peer Review (Max 20)">Peer Review</TableHead>
                      <TableHead className="text-center font-bold text-muted-foreground">% Code</TableHead>
                      <TableHead className="text-center font-bold text-muted-foreground">% Doc</TableHead>
                      <TableHead className="text-center font-bold text-muted-foreground">% Design</TableHead>
                      <TableHead className="text-center font-bold text-muted-foreground">Cảnh báo AI</TableHead>
                      <TableHead className="text-center bg-primary/5 font-bold text-primary border-x border-primary/20 min-w-[120px]">% H.Thống</TableHead>
                      <TableHead className="text-center bg-primary/5 font-bold text-primary min-w-[140px]">% GV Chốt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                          {isLoading ? "Đang tải dữ liệu..." : "Không tìm thấy dữ liệu nhóm này"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((student) => {
                        const adjustment = localAdjustments[student.studentId];
                        const isOverridden = !!adjustment;
                        const finalDisplayValue = isOverridden
                          ? (student.finalContributionPercentage + adjustment.adjustmentPercentage).toFixed(1)
                          : student.finalContributionPercentage.toFixed(1);

                        return (
                          <TableRow key={student.studentId} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="font-medium text-muted-foreground">{student.studentCode}</TableCell>
                            <TableCell className="font-bold text-foreground">{student.fullName}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="bg-muted/50 hover:bg-muted font-semibold">
                                {student.role || "MEMBER"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-medium text-muted-foreground">{student.peerReviewScore}/20</TableCell>

                            {/* Slices Breakdown */}
                            <TableCell className="text-center font-medium">{student.codeContributionPercentage}%</TableCell>
                            <TableCell className="text-center font-medium">{student.documentContributionPercentage}%</TableCell>
                            <TableCell className="text-center font-medium">{student.designContributionPercentage}%</TableCell>

                            <TableCell className="text-center">
                              {student.warnings && student.warnings.length > 0 ? (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs font-bold whitespace-nowrap" title={student.warnings.map(w => w.message).join(", ")}>
                                  <AlertTriangle size={12} /> Cờ đỏ
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-bold whitespace-nowrap">
                                  <CheckCircle2 size={12} /> Hợp lệ
                                </div>
                              )}
                            </TableCell>

                            {/* System Score */}
                            <TableCell className="text-center bg-primary/5 border-x border-primary/20">
                              <span className="font-bold text-primary text-lg">{student.finalContributionPercentage.toFixed(1)}%</span>
                            </TableCell>

                            {/* Manual Override Score */}
                            <TableCell className="text-center bg-primary/5 px-2">
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max="100"
                                  className={`w-[80px] mx-auto text-center font-bold text-lg border-2 pr-4 ${isOverridden
                                    ? 'border-primary text-primary focus-visible:ring-primary shadow-sm bg-background'
                                    : 'border-transparent text-primary bg-transparent focus-visible:ring-primary hover:border-primary/30'
                                    }`}
                                  defaultValue={finalDisplayValue}
                                  onBlur={(e) => handleOverrideChange(student.studentId, e.target.value, student.finalContributionPercentage)}
                                />
                                <span className="absolute right-[calc(50%-32px)] top-1/2 -translate-y-1/2 text-primary font-bold text-sm select-none pointer-events-none">%</span>
                                {isOverridden && (
                                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" title="Đã thay đổi" />
                                )}
                              </div>
                              {isOverridden && (
                                <div className="text-[10px] text-muted-foreground mt-1 font-medium">
                                  Chênh lệch: {adjustment.adjustmentPercentage > 0 ? '+' : ''}{adjustment.adjustmentPercentage.toFixed(1)}%
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
