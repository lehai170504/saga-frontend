import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, Bug, Combine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export function DataIntegrationRules() {
  const [sliceBase, setSliceBase] = useState("story-points");
  const [enableGithubCheck, setEnableGithubCheck] = useState(true);
  const [enableBugPenalty, setEnableBugPenalty] = useState(true);

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> Tích hợp Dữ liệu (Jira & GitHub)
        </CardTitle>
        <CardDescription>
          Cấu hình cách hệ thống rút trích dữ liệu từ các nền tảng ngoại vi để làm cơ sở tính toán Slices và kích hoạt bộ lọc xác thực (Validation Filter) cho AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* JIRA INTEGRATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-2">
            <Combine className="w-5 h-5" />
            <h3>Nguồn Tích hợp Jira (Cơ sở tính Slices)</h3>
          </div>
          <div className="p-5 rounded-xl border border-border/50 bg-background/50 space-y-4">
            <RadioGroup value={sliceBase} onValueChange={setSliceBase} className="gap-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="story-points" id="r1" className="mt-1" />
                <Label htmlFor="r1" className="cursor-pointer space-y-1">
                  <span className="block font-bold text-base">Dựa trên Story Points (Khuyến nghị)</span>
                  <span className="block text-sm text-muted-foreground font-normal leading-snug">
                    Đề cao năng lực hoàn thành công việc. Task 5 point sẽ được 5 Slices (nhân với hệ số công việc), bất kể sinh viên hoàn thành trong 1 giờ hay 10 giờ. Ngăn chặn việc ngâm task để gian lận thời gian.
                  </span>
                </Label>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="time-logged" id="r2" className="mt-1" />
                <Label htmlFor="r2" className="cursor-pointer space-y-1">
                  <span className="block font-bold text-base">Dựa trên Time Logged (Sweat Equity)</span>
                  <span className="block text-sm text-muted-foreground font-normal leading-snug">
                    Đề cao công sức và thời gian bỏ ra. Slices = Số giờ đã log × Hệ số công việc. Yêu cầu AI rà soát chặt chẽ để phát hiện các trường hợp Logged Time cao bất thường so với Estimate.
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
          <div className="p-5 rounded-xl border border-border/50 bg-background/50 space-y-4">

            <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50">
              <div className="space-y-1 mr-4">
                <Label htmlFor="gh-check" className="font-bold text-sm cursor-pointer">Xác thực "Ghosting" (No-code warning)</Label>
                <p className="text-xs text-muted-foreground">Kích hoạt Cờ Đỏ nếu một Task code trên Jira chuyển sang Done nhưng không có bất kỳ Commit/PR nào khớp trên GitHub.</p>
              </div>
              <Switch id="gh-check" checked={enableGithubCheck} onCheckedChange={setEnableGithubCheck} />
            </div>

            <div className="space-y-3 p-3 rounded-lg bg-card border border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1 mr-4">
                  <Label htmlFor="bug-penalty" className="font-bold text-sm flex items-center gap-1.5 cursor-pointer">
                    <Bug className="w-4 h-4 text-destructive" /> Đo lường Nợ kỹ thuật (Technical Debt)
                  </Label>
                  <p className="text-xs text-muted-foreground">Tự động đề xuất trừ hệ số Slices nếu tỷ lệ Bug do sinh viên đó gây ra (liên kết từ Jira) vượt ngưỡng cấu hình.</p>
                </div>
                <Switch id="bug-penalty" checked={enableBugPenalty} onCheckedChange={setEnableBugPenalty} />
              </div>
              {enableBugPenalty && (
                <div className="flex items-center gap-3 pt-3 border-t border-border/50 ml-1">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Ngưỡng tỷ lệ Bug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{">"}</span>
                    <Input type="number" defaultValue={30} className="w-20 h-8 text-center font-bold" />
                    <span className="text-sm font-medium">% Tổng số Task</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </CardContent>
    </Card>
  );
}
