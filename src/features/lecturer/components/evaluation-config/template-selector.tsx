"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, CheckCircle2, XCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCourseContributionWeights,
  useUpdateCourseContributionWeights,
  useCourseContributionTeamWeights,
  useUpdateCourseContributionMode
} from "../../hooks/useContribution";
import { TeamContributionWeightItem } from "../../types/contribution";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamWeightModal } from "./team-weight-modal";

export function TemplateSelector({ courseId }: { courseId: string }) {
  const { data: courseWeightsData, isLoading: isLoadingCourse } = useCourseContributionWeights(courseId);
  const { data: teamWeightsData, isLoading: isLoadingTeam } = useCourseContributionTeamWeights(courseId);

  const { mutate: updateCourseWeights, isPending: isUpdatingCourse } = useUpdateCourseContributionWeights();
  const { mutate: updateMode, isPending: isUpdatingMode } = useUpdateCourseContributionMode();

  const [mode, setMode] = useState<"COURSE" | "TEAM">("COURSE");

  const [customCodeWeight, setCustomCodeWeight] = useState<number | null>(null);
  const [customTestWeight, setCustomTestWeight] = useState<number | null>(null);
  const [customDocumentWeight, setCustomDocumentWeight] = useState<number | null>(null);
  const [customResearchWeight, setCustomResearchWeight] = useState<number | null>(null);

  const [selectedTeam, setSelectedTeam] = useState<TeamContributionWeightItem | null>(null);

  useEffect(() => {
    if (teamWeightsData?.mode) {
      setMode(teamWeightsData.mode);
    }
  }, [teamWeightsData?.mode]);

  const codeWeight = customCodeWeight ?? (courseWeightsData ? Number((courseWeightsData.codeWeight ?? 40).toFixed(2)) : 40);
  const testWeight = customTestWeight ?? (courseWeightsData ? Number((courseWeightsData.testWeight ?? 20).toFixed(2)) : 20);
  const documentWeight = customDocumentWeight ?? (courseWeightsData ? Number((courseWeightsData.documentWeight ?? 30).toFixed(2)) : 30);
  const researchWeight = customResearchWeight ?? (courseWeightsData ? Number((courseWeightsData.researchWeight ?? 10).toFixed(2)) : 10);

  const totalCourseWeight = (codeWeight + testWeight + documentWeight + researchWeight).toFixed(2);
  const isCourseValid = parseFloat(totalCourseWeight) === 100;

  const isCourseModified = courseWeightsData && (
    codeWeight !== courseWeightsData.codeWeight ||
    testWeight !== courseWeightsData.testWeight ||
    documentWeight !== courseWeightsData.documentWeight ||
    researchWeight !== courseWeightsData.researchWeight
  );

  const teams = teamWeightsData?.teams || [];
  const isAllTeamsConfigured = teams.every(t =>
    t.source !== "COURSE" &&
    (t.codeWeight || 0) + (t.testWeight || 0) + (t.documentWeight || 0) + (t.researchWeight || 0) > 99.9
  );

  const handleSaveCourseWeights = () => {
    if (!isCourseValid) {
      toast.error("Tổng trọng số phải bằng ĐÚNG 100%");
      return;
    }

    const cw = codeWeight;
    const tw = testWeight;
    const dw = documentWeight;
    const rw = Math.round((100 - cw - tw - dw) * 100) / 100; // Strictly guarantee sum is 100

    updateCourseWeights(
      { courseId, data: { codeWeight: cw, testWeight: tw, documentWeight: dw, researchWeight: rw } },
      {
        onSuccess: () => {
          toast.success("Đã lưu trọng số chung thành công!");
          // Switch to COURSE mode implicitly if they were on TEAM mode
          if (mode === "TEAM") {
            handleSaveMode("COURSE");
          }
        },
        onError: (err: Error) => {
          const resErr = err as Error & { response?: { data?: { message?: string } } };
          toast.error(resErr?.response?.data?.message || "Có lỗi xảy ra khi lưu thay đổi");
        }
      }
    );
  };

  const handleSaveMode = (newMode: "COURSE" | "TEAM") => {
    updateMode(
      { courseId, data: { mode: newMode } },
      {
        onSuccess: () => {
          toast.success(`Đã chuyển sang chế độ ${newMode === "COURSE" ? "Toàn khóa" : "Theo từng nhóm"}!`);
        },
        onError: (err: Error) => {
          const resErr = err as Error & { response?: { data?: { message?: string, error?: string } } };
          const msg = resErr?.response?.data?.message;
          const errorCode = resErr?.response?.data?.error;

          if (errorCode === "TEAM_MODE_CONFIGURATION_INCOMPLETE" || msg?.includes("INCOMPLETE") || msg?.includes("weight override")) {
            toast.error("Một hoặc nhiều Team chưa được cấu hình. Vui lòng thiết lập trọng số cho TỪNG nhóm trước khi áp dụng chế độ này.");
          } else {
            toast.error(msg || "Có lỗi xảy ra khi chuyển chế độ");
          }
          // Revert mode back if failed
          setMode(teamWeightsData?.mode || "COURSE");
        }
      }
    );
  };

  const handleActivateTeamMode = () => {
    handleSaveMode("TEAM");
  };

  const handleActivateCourseMode = () => {
    handleSaveMode("COURSE");
  };

  if (isLoadingCourse || isLoadingTeam) {
    return <Skeleton className="w-full h-96 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings2 className="w-6 h-6" /> Chế Độ Cấu Hình Trọng Số (Contribution Mode)
          </CardTitle>
          <CardDescription>
            Bạn có thể chọn áp dụng một bộ trọng số chung cho tất cả các nhóm, hoặc thiết lập trọng số riêng cho từng nhóm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={mode}
            onValueChange={(val) => {
              setMode(val as "COURSE" | "TEAM");
              if (val === "COURSE" && teamWeightsData?.mode !== "COURSE") {
                handleActivateCourseMode();
              }
            }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <div className={`flex items-center space-x-3 border p-4 rounded-2xl cursor-pointer transition-all ${mode === "COURSE" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
              <RadioGroupItem value="COURSE" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer font-bold flex flex-col gap-1">
                <span>Áp dụng chung (Course Mode)</span>
                <span className="text-xs font-normal text-muted-foreground">Tất cả các nhóm sử dụng chung một bộ trọng số</span>
              </Label>
            </div>
            <div className={`flex items-center space-x-3 border p-4 rounded-2xl cursor-pointer transition-all ${mode === "TEAM" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
              <RadioGroupItem value="TEAM" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer font-bold flex flex-col gap-1">
                <span>Thiết lập riêng (Team Mode)</span>
                <span className="text-xs font-normal text-muted-foreground">Mỗi nhóm sẽ có bộ trọng số khác nhau</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* COURSE MODE UI */}
      {mode === "COURSE" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="xl:col-span-2 space-y-6">
            <Card className="rounded-2xl border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Trọng số chung
                </CardTitle>
                <CardDescription>
                  Tổng 4 trọng số phải bằng đúng 100%. Áp dụng cho toàn bộ các nhóm trong khóa học.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold w-1/3">1. Lập trình (Code)</Label>
                      <div className="flex items-center gap-2 w-2/3">
                        <Input
                          type="number"
                          step="0.01"
                          value={codeWeight}
                          onChange={(e) => setCustomCodeWeight(parseFloat(e.target.value) || 0)}
                          className="h-10 text-center font-bold"
                        />
                        <span className="text-sm font-medium w-6">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold w-1/3">2. Kiểm thử (Test)</Label>
                      <div className="flex items-center gap-2 w-2/3">
                        <Input
                          type="number"
                          step="0.01"
                          value={testWeight}
                          onChange={(e) => setCustomTestWeight(parseFloat(e.target.value) || 0)}
                          className="h-10 text-center font-bold"
                        />
                        <span className="text-sm font-medium w-6">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold w-1/3">3. Viết Tài liệu (Docs)</Label>
                      <div className="flex items-center gap-2 w-2/3">
                        <Input
                          type="number"
                          step="0.01"
                          value={documentWeight}
                          onChange={(e) => setCustomDocumentWeight(parseFloat(e.target.value) || 0)}
                          className="h-10 text-center font-bold"
                        />
                        <span className="text-sm font-medium w-6">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold w-1/3">4. Nghiên cứu (Research)</Label>
                      <div className="flex items-center gap-2 w-2/3">
                        <Input
                          type="number"
                          step="0.01"
                          value={researchWeight}
                          onChange={(e) => setCustomResearchWeight(parseFloat(e.target.value) || 0)}
                          className="h-10 text-center font-bold"
                        />
                        <span className="text-sm font-medium w-6">%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end border-t pt-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Tổng cộng:</span>
                        <span className={`font-bold text-lg ${!isCourseValid ? "text-destructive" : "text-emerald-500"}`}>
                          {totalCourseWeight}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isCourseModified && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveCourseWeights}
                      disabled={isUpdatingCourse || !isCourseValid}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
                    >
                      {isUpdatingCourse ? "Đang lưu..." : "Lưu Trọng Số Chung"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1">
            <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Đang dùng (Course)</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Lập trình (Code):</span>
                    <strong className="text-foreground">{courseWeightsData?.codeWeight != null ? courseWeightsData.codeWeight.toFixed(2) : "40"}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kiểm thử (Test):</span>
                    <strong className="text-foreground">{courseWeightsData?.testWeight != null ? courseWeightsData.testWeight.toFixed(2) : "20"}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Viết tài liệu (Docs):</span>
                    <strong className="text-foreground">{courseWeightsData?.documentWeight != null ? courseWeightsData.documentWeight.toFixed(2) : "30"}%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nghiên cứu (Research):</span>
                    <strong className="text-foreground">{courseWeightsData?.researchWeight != null ? courseWeightsData.researchWeight.toFixed(2) : "10"}%</strong>
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-border/50 text-xs">
                  <p>Lần cập nhật cuối: {courseWeightsData?.lastUpdatedAt ? new Date(courseWeightsData.lastUpdatedAt).toLocaleDateString("vi-VN") : "Chưa có thay đổi"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TEAM MODE UI */}
      {mode === "TEAM" && (
        <Card className="rounded-2xl border-border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Thiết lập theo Team
            </CardTitle>
            <CardDescription>
              Tất cả các nhóm phải được cấu hình đầy đủ (✅) trước khi bạn có thể Áp dụng chế độ này.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => {
                const totalWeight = (team.codeWeight || 0) + (team.testWeight || 0) + (team.documentWeight || 0) + (team.researchWeight || 0);
                const isConfigured = team.source !== "COURSE" && totalWeight > 99.9 && totalWeight < 100.1; // Allow small float drift

                return (
                  <div key={team.teamId} className="border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{team.teamName}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">Project: {team.projectName}</p>
                      </div>
                      {isConfigured ? (
                        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Đã cấu hình
                        </div>
                      ) : (
                        <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold">
                          <XCircle className="w-4 h-4" /> Thiếu
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-end">
                      {isConfigured ? (
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Code: {Math.round(team.codeWeight || 0)}% | Test: {Math.round(team.testWeight || 0)}%</p>
                          <p>Docs: {Math.round(team.documentWeight || 0)}% | Rsch: {Math.round(team.researchWeight || 0)}%</p>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Chưa thiết lập trọng số
                        </div>
                      )}

                      <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedTeam(team)}>
                        Thiết lập
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {teams.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-2xl">
                Không tìm thấy nhóm nào trong khóa học này.
              </div>
            )}

            {/* Activate Team Mode button if current actual mode is not TEAM or if we just want to reinforce it */}
            {teamWeightsData?.mode !== "TEAM" && (
              <div className="flex justify-end pt-6 mt-6 border-t">
                <Button
                  onClick={handleActivateTeamMode}
                  disabled={isUpdatingMode || !isAllTeamsConfigured}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
                >
                  {isUpdatingMode ? "Đang xử lý..." : "Áp Dụng Chế Độ Theo Team"}
                </Button>
              </div>
            )}

            {teamWeightsData?.mode === "TEAM" && (
              <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-xl mt-6 flex items-center gap-2 text-sm font-bold border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
                Đang sử dụng chế độ đánh giá theo từng Team.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTeam && (
        <TeamWeightModal
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          team={selectedTeam}
        />
      )}
    </div>
  );
}
