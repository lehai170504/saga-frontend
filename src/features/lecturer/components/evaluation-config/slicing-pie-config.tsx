"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, PieChart, Settings2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export function SlicingPieConfig() {
  const [sprints, setSprints] = useState<Sprint[]>([
    { id: "s1", name: "Sprint 1", startDate: "2024-09-01", endDate: "2024-09-14" },
    { id: "s2", name: "Sprint 2", startDate: "2024-09-15", endDate: "2024-09-30" },
    { id: "s3", name: "Sprint 3", startDate: "2024-10-01", endDate: "2024-10-15" }
  ]);

  const [multipliers, setMultipliers] = useState({
    code: 2.0,
    design: 1.5,
    docs: 1.0,
    maxSp: 13,
    minRetro: 0.5,
    maxRetro: 1.1
  });

  const addSprint = () => {
    setSprints([...sprints, {
      id: Date.now().toString(),
      name: `Sprint ${sprints.length + 1}`,
      startDate: "",
      endDate: ""
    }]);
  };

  const updateSprint = (sprintId: string, field: keyof Sprint, value: string) => {
    setSprints(sprints.map(s => s.id === sprintId ? { ...s, [field]: value } : s));
  };

  const removeSprint = (sprintId: string) => {
    setSprints(sprints.filter(s => s.id !== sprintId));
  };

  const updateMultiplier = (field: keyof typeof multipliers, value: number) => {
    setMultipliers(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Slicing Pie Global Config */}
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" /> Cấu hình Cổ phần (Slicing Pie)
          </CardTitle>
          <CardDescription>
            Thiết lập hệ số nhân (Multipliers) và giới hạn quy chuẩn Scrum để tính toán điểm đóng góp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-4 rounded-xl border border-border bg-background/50 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/40"></div>
              <Label className="text-xs font-bold text-muted-foreground uppercase">Hệ số Retrospective</Label>
              <p className="text-[10px] text-muted-foreground">Điều chỉnh tăng/giảm phần trăm tổng Slices cuối Sprint thông qua bầu chọn công khai.</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Thưởng (Max)</span>
                  <Input type="number" step="0.1" value={multipliers.maxRetro} onChange={e => updateMultiplier('maxRetro', parseFloat(e.target.value))} className="w-20 h-8 text-right font-bold text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-semibold text-destructive">Phạt (Min)</span>
                  <Input type="number" step="0.1" value={multipliers.minRetro} onChange={e => updateMultiplier('minRetro', parseFloat(e.target.value))} className="w-20 h-8 text-right font-bold text-destructive" />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl border border-border bg-background/50 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500/40"></div>
              <Label className="text-xs font-bold text-muted-foreground uppercase">Giới hạn Scrum (SP)</Label>
              <p className="text-[10px] text-muted-foreground">Ngăn chặn khai khống Story Points. Yêu cầu sinh viên chia nhỏ Epic/Task nếu vượt quá ngưỡng.</p>
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between items-center gap-4 pt-2">
                  <span className="text-sm font-semibold">Max SP / Task</span>
                  <Input type="number" step="1" value={multipliers.maxSp} onChange={e => updateMultiplier('maxSp', parseInt(e.target.value))} className="w-20 h-8 text-right font-bold text-violet-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex gap-3 text-sm text-primary/80">
            <Info className="w-5 h-5 shrink-0" />
            <p><strong>SAGA Standard:</strong> Slices cuối kỳ = ∑ (SP Task × Hệ số Công việc) × Hệ số Retrospective. Quy trình đảm bảo tính minh bạch tuyệt đối theo thời gian thực.</p>
          </div>
        </CardContent>
      </Card>

      {/* Sprint Manager */}
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Quản lý Sprints
          </CardTitle>
          <CardDescription>
            Thiết lập lộ trình dự án. Không phân chia Phase, mọi sự tập trung dồn vào đánh giá liên tục (Continuous Assessment) qua từng Sprint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {sprints.map((sprint) => (
              <div key={sprint.id} className="flex flex-col sm:flex-row sm:items-end gap-3 p-4 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition-colors relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1 h-full bg-border group-hover:bg-primary transition-colors"></div>
                <div className="flex-1 space-y-1.5 pl-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Tên Sprint</Label>
                  <Input
                    value={sprint.name}
                    onChange={(e) => updateSprint(sprint.id, "name", e.target.value)}
                    className="h-10 font-bold rounded-lg border-border/50 bg-background"
                    placeholder="VD: Sprint 1"
                  />
                </div>
                <div className="w-full sm:w-40 space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Ngày Bắt đầu</Label>
                  <Input
                    type="date"
                    value={sprint.startDate}
                    onChange={(e) => updateSprint(sprint.id, "startDate", e.target.value)}
                    className="h-10 text-sm rounded-lg border-border/50 bg-background"
                  />
                </div>
                <div className="w-full sm:w-40 space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Ngày Kết thúc</Label>
                  <Input
                    type="date"
                    value={sprint.endDate}
                    onChange={(e) => updateSprint(sprint.id, "endDate", e.target.value)}
                    className="h-10 text-sm rounded-lg border-border/50 bg-background"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSprint(sprint.id)}
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                  title="Xóa Sprint"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addSprint}
            className="w-full h-12 border-dashed border-2 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-xl font-bold transition-all text-sm bg-background/50 mt-4"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm Sprint Mới
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
