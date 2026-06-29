"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Phase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weight: number;
};

export function PhaseManager() {
  const [phases, setPhases] = useState<Phase[]>([
    { id: "p1", name: "Sprint 1 (Khởi tạo)", startDate: "2024-09-01", endDate: "2024-09-30", weight: 30 },
    { id: "p2", name: "Sprint 2 (Phát triển)", startDate: "2024-10-01", endDate: "2024-10-31", weight: 40 },
    { id: "p3", name: "Sprint 3 (Đóng gói)", startDate: "2024-11-01", endDate: "2024-11-30", weight: 30 },
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
      name: `Sprint ${phases.length + 1}`,
      startDate: "",
      endDate: "",
      weight: 0
    }]);
  };

  const totalWeight = phases.reduce((acc, p) => acc + p.weight, 0);

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Phân bổ Giai đoạn Đánh giá (Phases)
        </CardTitle>
        <CardDescription>
          Thiết lập lộ trình đánh giá Peer Review và tỷ trọng điểm số (Weight) cho từng Giai đoạn. Tổng tỷ trọng bắt buộc phải bằng 100%.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Total Weight Alert */}
        <div className={`p-4 rounded-xl border ${totalWeight === 100 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/10 border-destructive/20 text-destructive'} flex items-center justify-between`}>
          <div className="font-bold text-sm">Tổng tỷ trọng các Giai đoạn: {totalWeight}%</div>
          {totalWeight !== 100 && (
            <div className="text-xs font-medium">Vui lòng điều chỉnh để tổng tỷ trọng đạt chính xác 100%</div>
          )}
        </div>

        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.id} className="p-4 rounded-xl border border-border/50 bg-background/50 flex flex-col md:flex-row md:items-end gap-4 hover:border-primary/30 transition-colors">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Tên Giai đoạn</Label>
                <Input 
                  value={phase.name} 
                  onChange={(e) => updatePhase(phase.id, "name", e.target.value)}
                  className="h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20 font-bold" 
                />
              </div>
              
              <div className="w-full md:w-40 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Bắt đầu</Label>
                <Input 
                  type="date"
                  value={phase.startDate} 
                  onChange={(e) => updatePhase(phase.id, "startDate", e.target.value)}
                  className="h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20" 
                />
              </div>

              <div className="w-full md:w-40 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Kết thúc</Label>
                <Input 
                  type="date"
                  value={phase.endDate} 
                  onChange={(e) => updatePhase(phase.id, "endDate", e.target.value)}
                  className="h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20" 
                />
              </div>

              <div className="w-24 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Tỷ trọng (%)</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    value={phase.weight} 
                    onChange={(e) => updatePhase(phase.id, "weight", parseInt(e.target.value) || 0)}
                    className="h-10 rounded-xl bg-primary/5 border-primary/20 text-primary font-bold pr-8" 
                  />
                  <span className="absolute right-3 top-2.5 text-sm font-bold text-primary">%</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removePhase(phase.id)}
                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button 
            variant="outline" 
            onClick={addPhase}
            className="w-full h-12 border-dashed border-2 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-xl font-bold transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm Giai đoạn mới
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
