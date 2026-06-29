import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, Bug, Combine, Info, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export function DataIntegrationRules() {
  // Lock variables to enforce academic standards
  const sliceBase = "story-points";
  const enableGithubCheck = true;
  const enableBugPenalty = true;

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> Tích hợp Dữ liệu (Jira & GitHub)
          </CardTitle>
          <CardDescription>
            Cấu hình mỏ neo dữ liệu (Data Anchors) của hệ thống. <strong>Tất cả các nguồn tích hợp đều được khóa cứng</strong> nhằm đảm bảo AI thu thập bằng chứng đánh giá một cách minh bạch và chống gian lận.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* LEFT COLUMN: RULES CONFIGURATION */}
            <div className="xl:col-span-2 space-y-8">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-sm font-medium">
                <Lock className="w-4 h-4" /> Các tham số đối soát dữ liệu đa nền tảng đã được thiết lập mặc định theo chuẩn ngành SE.
              </div>

              {/* JIRA INTEGRATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2">
                  <Combine className="w-5 h-5" />
                  <h3>Nguồn Tích hợp Jira (Cơ sở tính Slices)</h3>
                </div>
                <div className="p-5 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-90">
                  <RadioGroup value={sliceBase} disabled className="gap-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-primary/50 bg-primary/5 cursor-not-allowed">
                      <RadioGroupItem value="story-points" id="r1" className="mt-1" />
                      <Label htmlFor="r1" className="cursor-not-allowed space-y-1">
                        <span className="block font-bold text-base text-primary">Dựa trên Story Points (Mặc định bắt buộc)</span>
                        <span className="block text-sm text-muted-foreground font-normal leading-snug">
                          Đề cao năng lực hoàn thành công việc. Task 5 point sẽ được 5 Slices (nhân với hệ số công việc), bất kể sinh viên hoàn thành trong 1 giờ hay 10 giờ. Ngăn chặn triệt để việc "ngâm task" để gian lận thời gian.
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 bg-muted/50 opacity-50 cursor-not-allowed">
                      <RadioGroupItem value="time-logged" id="r2" className="mt-1" />
                      <Label htmlFor="r2" className="cursor-not-allowed space-y-1">
                        <span className="block font-bold text-base line-through">Dựa trên Time Logged (Sweat Equity)</span>
                        <span className="block text-sm text-muted-foreground font-normal leading-snug">
                          Tính năng này bị khóa vì vi phạm định luật Parkinson. Việc tính điểm theo giờ dễ dẫn đến tình trạng sinh viên cố tình kéo dài thời gian code để ăn gian điểm Slices.
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* GITHUB INTEGRATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold mb-2">
                  <GitBranch className="w-5 h-5" />
                  <h3>Nguồn Tích hợp GitHub (Bằng chứng AI)</h3>
                </div>
                <div className="p-5 rounded-xl border border-border/50 bg-background/50 space-y-4 opacity-90">

                  <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 opacity-70">
                    <div className="space-y-1 mr-4">
                      <Label className="font-bold text-sm">Xác thực "Ghosting" (No-code warning)</Label>
                      <p className="text-xs text-muted-foreground">Kích hoạt Cờ Đỏ nếu một Task code trên Jira chuyển sang Done nhưng không có bất kỳ Commit/PR nào khớp trên GitHub.</p>
                    </div>
                    <Switch checked={enableGithubCheck} disabled />
                  </div>

                  <div className="space-y-3 p-3 rounded-lg bg-card border border-border/50 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 mr-4">
                        <Label className="font-bold text-sm flex items-center gap-1.5">
                          <Bug className="w-4 h-4 text-destructive" /> Đo lường Nợ kỹ thuật (Technical Debt)
                        </Label>
                        <p className="text-xs text-muted-foreground">Tự động đề xuất trừ hệ số Slices nếu tỷ lệ Bug do sinh viên đó gây ra (liên kết từ Jira) vượt ngưỡng cấu hình.</p>
                      </div>
                      <Switch checked={enableBugPenalty} disabled />
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50 ml-1">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Ngưỡng tỷ lệ Bug tối đa</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">&gt;</span>
                        <Input type="number" value={30} disabled className="w-20 h-8 text-center font-bold bg-muted" />
                        <span className="text-sm font-medium">% Tổng số Task</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ACADEMIC BASIS */}
            <div className="xl:col-span-1">
              <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Cơ sở Đánh giá Dữ liệu</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm text-muted-foreground pt-4">
                  <div className="space-y-4">

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-base text-blue-600 dark:text-blue-400">1. Value vs. Effort (Jira)</h4>
                      <p className="text-xs leading-relaxed">
                        Hệ thống bắt buộc tính Slices theo <strong>Story Points (Giá trị)</strong> thay vì <strong>Time Logged (Nỗ lực)</strong>. Điều này dựa trên <em>Định luật Parkinson: "Công việc luôn tự mở rộng ra để lấp đầy thời gian được ấn định cho nó"</em>. Nếu chấm điểm theo giờ làm, sinh viên sẽ có xu hướng code chậm lại hoặc khai khống giờ (inflate hours) để trục lợi. Story Points đánh giá đúng giá trị đầu ra (Outcome-based).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-base text-zinc-800 dark:text-zinc-200">2. Bằng chứng Mật mã (GitHub)</h4>
                      <p className="text-xs leading-relaxed">
                        Việc kéo Jira Card sang cột "Done" cực kỳ dễ dàng và dễ bị thao túng. Tích hợp GitHub cung cấp <strong>Cryptographic Proof of Work</strong> (Bằng chứng công việc bằng mật mã). Nếu Jira = Done nhưng GitHub = Không có Commit, đó là hành vi mạo danh công sức của người khác (Freerider).
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-base text-destructive">3. Ngưỡng Bug 30% (Nợ Kỹ thuật)</h4>
                      <p className="text-xs leading-relaxed">
                        Trong kỹ nghệ phần mềm, lập trình viên tạo ra quá nhiều Bug không chỉ không đóng góp mà còn là <strong>Net Negative Producing Programmer</strong> (Lập trình viên âm tính), vì họ bắt người khác phải tốn thời gian sửa lỗi của mình. Ngưỡng 30% Bug/Task là ranh giới để AI kích hoạt phạt Slices, ép sinh viên phải test kỹ trước khi hoàn thành task.
                      </p>
                    </div>

                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <h4 className="font-bold text-foreground">Kết luận</h4>
                    <p className="text-xs">
                      Việc khóa các tính năng đối soát dữ liệu nhằm loại bỏ hoàn toàn cảm tính của con người ra khỏi việc chấm điểm. "Trust, but verify" (Tin tưởng, nhưng phải xác minh bằng Data).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
