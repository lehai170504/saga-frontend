"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type Phase = {
  id: string;
  name: string;
  weight: number;
  sprints: Sprint[];
};

export function PhaseManager() {
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "p1",
      name: "Phase 1 (Design & Setup)",
      weight: 30,
      sprints: [
        { id: "s1", name: "Sprint 1", startDate: "2024-09-01", endDate: "2024-09-14" },
        { id: "s2", name: "Sprint 2", startDate: "2024-09-15", endDate: "2024-09-30" }
      ]
    },
    {
      id: "p2",
      name: "Phase 2 (Core Dev)",
      weight: 40,
      sprints: [
        { id: "s3", name: "Sprint 3", startDate: "2024-10-01", endDate: "2024-10-15" }
      ]
    },
    {
      id: "p3",
      name: "Phase 3 (Testing & Release)",
      weight: 30,
      sprints: [
        { id: "s4", name: "Sprint 4", startDate: "2024-10-16", endDate: "2024-10-31" }
      ]
    },
  ]);

  const updatePhase = (id: string, field: keyof Phase, value: string | number) => {
    setPhases(phases.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter(p => p.id !== id));
  };

  const addPhase = () => {
    setPhases([...phases, {
      id: Date.now().toString(),
      name: `Phase ${phases.length + 1}`,
      weight: 0,
      sprints: []
    }]);
  };

  const addSprint = (phaseId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          sprints: [...p.sprints, {
            id: Date.now().toString(),
            name: `Sprint ${p.sprints.length + 1}`,
            startDate: "",
            endDate: ""
          }]
        };
      }
      return p;
    }));
  };

  const updateSprint = (phaseId: string, sprintId: string, field: keyof Sprint, value: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          sprints: p.sprints.map(s => s.id === sprintId ? { ...s, [field]: value } : s)
        };
      }
      return p;
    }));
  };

  const removeSprint = (phaseId: string, sprintId: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          sprints: p.sprints.filter(s => s.id !== sprintId)
        };
      }
      return p;
    }));
  };

  const totalWeight = phases.reduce((acc, p) => acc + p.weight, 0);

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Phân bổ Phase & Sprint
        </CardTitle>
        <CardDescription>
          Thiết lập lộ trình đánh giá Peer Review theo từng <strong>Phase</strong> (điểm chốt sổ) và các <strong>Sprint</strong> (điểm kiểm soát thực thi) bên trong. Tổng tỷ trọng các Phase bắt buộc phải bằng 100%.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Total Weight Alert */}
        <div className={`p-4 rounded-xl border ${totalWeight === 100 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive'} flex items-center justify-between`}>
          <div className="font-bold text-sm">Tổng tỷ trọng các Phase: {totalWeight}%</div>
          {totalWeight !== 100 && (
            <div className="text-xs font-medium">Vui lòng điều chỉnh để tổng tỷ trọng đạt chính xác 100%</div>
          )}
        </div>

        <div className="space-y-6">
          {phases.map((phase) => (
            <div key={phase.id} className="p-5 rounded-2xl border border-border bg-background/50 flex flex-col gap-4 shadow-sm relative overflow-hidden transition-all hover:border-primary/30">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40"></div>

              {/* Phase Header */}
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Layers className="w-3 h-3" /> Tên Phase</Label>
                  <Input
                    value={phase.name}
                    onChange={(e) => updatePhase(phase.id, "name", e.target.value)}
                    className="h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20 font-black text-lg"
                  />
                </div>

                <div className="w-full md:w-32 space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Tỷ trọng (%)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={phase.weight}
                      onChange={(e) => updatePhase(phase.id, "weight", parseInt(e.target.value) || 0)}
                      className="h-10 rounded-xl bg-primary/10 border-primary/20 text-primary font-black pr-8 text-lg"
                    />
                    <span className="absolute right-3 top-2.5 text-sm font-bold text-primary">%</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhase(phase.id)}
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
                  title="Xóa Phase"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Sprints List */}
              <div className="pl-4 md:pl-8 space-y-3 mt-2 border-l-2 border-dashed border-border">
                {phase.sprints.map((sprint) => (
                  <div key={sprint.id} className="flex flex-col sm:flex-row sm:items-end gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Tên Sprint</Label>
                      <Input
                        value={sprint.name}
                        onChange={(e) => updateSprint(phase.id, sprint.id, "name", e.target.value)}
                        className="h-8 text-sm rounded-lg border-border/50 bg-background"
                        placeholder="VD: Sprint 1"
                      />
                    </div>
                    <div className="w-full sm:w-36 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Bắt đầu</Label>
                      <Input
                        type="date"
                        value={sprint.startDate}
                        onChange={(e) => updateSprint(phase.id, sprint.id, "startDate", e.target.value)}
                        className="h-8 text-sm rounded-lg border-border/50 bg-background"
                      />
                    </div>
                    <div className="w-full sm:w-36 space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase">Kết thúc</Label>
                      <Input
                        type="date"
                        value={sprint.endDate}
                        onChange={(e) => updateSprint(phase.id, sprint.id, "endDate", e.target.value)}
                        className="h-8 text-sm rounded-lg border-border/50 bg-background"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSprint(phase.id, sprint.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                      title="Xóa Sprint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addSprint(phase.id)}
                  className="h-8 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm Sprint vào {phase.name.split(' ')[0]}
                </Button>
              </div>

            </div>
          ))}

          <Button
            variant="outline"
            onClick={addPhase}
            className="w-full h-14 border-dashed border-2 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-2xl font-bold transition-all text-base bg-background/50"
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm Phase Mới
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
