"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCourseWeights, useTeamWeightsList, useUpdateCourseWeights, useUpdateConfigMode } from "../../hooks/useCourseWeight";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TeamConfig {
  groupId: string;
  groupName: string;
  configured: boolean;
  projectName?: string;
  codeWeight?: number;
  testWeight?: number;
  documentWeight?: number;
  researchWeight?: number;
}

export function CourseEvaluationConfigClient({ courseId }: { courseId: string }) {
  const { data: courseWeightsData, isLoading: isLoadingCourse } = useCourseWeights(courseId);
  const { data: teamWeightsList, isLoading: isLoadingTeams } = useTeamWeightsList(courseId);
  const updateCourseWeights = useUpdateCourseWeights(courseId);
  const updateConfigMode = useUpdateConfigMode(courseId);

  const [mode, setMode] = useState<"COURSE" | "TEAM">("COURSE");

  const [codeWeight, setCodeWeight] = useState<number>(40);
  const [testWeight, setTestWeight] = useState<number>(20);
  const [documentWeight, setDocumentWeight] = useState<number>(30);
  const [researchWeight, setResearchWeight] = useState<number>(10);

  // Sync mode and weights from backend on load
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (courseWeightsData) {
      if (courseWeightsData.mode) setMode(courseWeightsData.mode);
      setCodeWeight(courseWeightsData.codeWeight);
      setTestWeight(courseWeightsData.testWeight);
      setDocumentWeight(courseWeightsData.documentWeight);
      setResearchWeight(courseWeightsData.researchWeight);
    }
  }, [courseWeightsData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const totalWeight = codeWeight + testWeight + documentWeight + researchWeight;
  const isCourseValid = Math.abs(totalWeight - 100) <= 0.01;
  const isCourseModified = courseWeightsData && (
    codeWeight !== courseWeightsData.codeWeight ||
    testWeight !== courseWeightsData.testWeight ||
    documentWeight !== courseWeightsData.documentWeight ||
    researchWeight !== courseWeightsData.researchWeight
  );

  const handleSaveCourseWeights = () => {
    if (!isCourseValid) {
      toast.error("Tổng trọng số phải bằng ĐÚNG 100%");
      return;
    }
    updateCourseWeights.mutate({
      codeWeight,
      testWeight,
      documentWeight,
      researchWeight
    });
  };

  const handleApplyMode = () => {
    updateConfigMode.mutate(mode);
  };

  if (isLoadingCourse || isLoadingTeams) {
    return <Skeleton className="w-full h-96 rounded-2xl" />;
  }

  const rawList = teamWeightsList as unknown as { content?: TeamConfig[]; data?: TeamConfig[] };
  const teamListArray = (Array.isArray(teamWeightsList)
    ? teamWeightsList
    : rawList?.content || rawList?.data || []) as TeamConfig[];

  const allTeamsConfigured = teamListArray.every((t: TeamConfig) => t.configured) ?? false;
  const configuredCount = teamListArray.filter((t: TeamConfig) => t.configured).length ?? 0;
  const totalTeams = teamListArray.length ?? 0;

  return (
    <div className="space-y-8">
      {/* SECTION 1: MODE SELECTION */}
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Cấu hình Phân bổ Điểm Đóng góp (Contribution)
          </CardTitle>
          <CardDescription>
            Chọn chế độ áp dụng trọng số cho 4 tiêu chí: CODE, TEST, DOCUMENT, RESEARCH.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={mode} onValueChange={(val) => setMode(val as "COURSE" | "TEAM")} className="flex flex-col gap-4">
            <div className={cn("flex items-center space-x-2 border rounded-xl p-4 transition-colors", mode === "COURSE" ? "border-primary bg-primary/5" : "border-border")}>
              <RadioGroupItem value="COURSE" id="mode-course" />
              <Label htmlFor="mode-course" className="cursor-pointer font-bold w-full">
                Áp dụng chung cho toàn bộ Team (Course Mode)
                <p className="text-muted-foreground font-normal mt-1">
                  Mọi nhóm trong lớp sẽ dùng chung 1 bộ trọng số mặc định do bạn thiết lập bên dưới.
                </p>
              </Label>
            </div>
            <div className={cn("flex items-center space-x-2 border rounded-xl p-4 transition-colors", mode === "TEAM" ? "border-primary bg-primary/5" : "border-border")}>
              <RadioGroupItem value="TEAM" id="mode-team" />
              <Label htmlFor="mode-team" className="cursor-pointer font-bold w-full">
                Thiết lập riêng từng Team (Team Mode)
                <p className="text-muted-foreground font-normal mt-1">
                  Mỗi nhóm phải được thiết lập trọng số riêng dựa trên tính chất dự án. Không sử dụng trọng số mặc định.
                </p>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleApplyMode}
              disabled={updateConfigMode.isPending || (mode === courseWeightsData?.mode)}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
            >
              {updateConfigMode.isPending ? "Đang xử lý..." : "Áp dụng Chế độ này"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: SPECIFIC CONFIG BASED ON MODE */}
      {mode === "COURSE" ? (
        <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Trọng số chung của Môn học
            </CardTitle>
            <CardDescription>
              Thiết lập bộ trọng số mặc định cho tất cả các nhóm. Tổng 4 tiêu chí phải bằng đúng 100%.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold">1. Lập trình (Code)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={codeWeight}
                    onChange={(e) => setCodeWeight(parseFloat(e.target.value) || 0)}
                    className="h-12 text-center font-bold text-lg rounded-xl pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">2. Kiểm thử (Test)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={testWeight}
                    onChange={(e) => setTestWeight(parseFloat(e.target.value) || 0)}
                    className="h-12 text-center font-bold text-lg rounded-xl pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">3. Viết Tài liệu (Document)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={documentWeight}
                    onChange={(e) => setDocumentWeight(parseFloat(e.target.value) || 0)}
                    className="h-12 text-center font-bold text-lg rounded-xl pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold">4. Nghiên cứu (Research)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={researchWeight}
                    onChange={(e) => setResearchWeight(parseFloat(e.target.value) || 0)}
                    className="h-12 text-center font-bold text-lg rounded-xl pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <span className="font-bold">Tổng trọng số:</span>
              <span className={cn("font-bold text-2xl", isCourseValid ? "text-emerald-500" : "text-destructive")}>
                {totalWeight}%
              </span>
            </div>

            {isCourseModified && (
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveCourseWeights}
                  disabled={updateCourseWeights.isPending || !isCourseValid}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-10 px-6"
                >
                  {updateCourseWeights.isPending ? "Đang lưu..." : "Lưu Trọng số Môn học"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Danh sách Cấu hình Nhóm
            </CardTitle>
            <CardDescription>
              Tất cả các nhóm đều phải được thiết lập trọng số (✅) thì Chế độ theo Nhóm mới có thể kích hoạt.
              Vui lòng vào trang Chi tiết Nhóm để thiết lập.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className={cn(
              "p-4 rounded-xl border flex items-center justify-between mb-6",
              allTeamsConfigured ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700" : "bg-amber-500/10 border-amber-500/20 text-amber-700"
            )}>
              <div className="flex items-center gap-3">
                {allTeamsConfigured ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                <div>
                  <h4 className="font-bold">Tiến độ cấu hình</h4>
                  <p className="text-sm opacity-80">Đã cấu hình {configuredCount} / {totalTeams} nhóm</p>
                </div>
              </div>
            </div>

            {teamListArray.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
                Lớp học chưa có nhóm nào được khởi tạo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamListArray.map((team: TeamConfig) => (
                  <div key={team.groupId} className={cn(
                    "p-5 rounded-2xl border relative overflow-hidden transition-colors flex flex-col justify-between",
                    team.configured ? "bg-card border-emerald-500/30" : "bg-muted/30 border-border"
                  )}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{team.groupName}</h3>
                        {team.configured ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                            <CheckCircle2 className="w-3 h-3" /> Đã xong
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            <XCircle className="w-3 h-3" /> Chờ xử lý
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                        Dự án: {team.projectName || "Chưa chọn dự án"}
                      </p>
                    </div>

                    {team.configured ? (
                      <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-muted/50 p-3 rounded-xl">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Code:</span>
                          <span>{(team.codeWeight! * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Test:</span>
                          <span>{(team.testWeight! * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Doc:</span>
                          <span>{(team.documentWeight! * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rsrch:</span>
                          <span>{(team.researchWeight! * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-dashed text-center">
                        Nhóm chưa được thiết lập trọng số
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
