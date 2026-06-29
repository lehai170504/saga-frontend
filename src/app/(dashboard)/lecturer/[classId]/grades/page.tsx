"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Info, Search, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
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

const MOCK_GRADES = [
  { id: "SV-001", name: "Nguyễn Văn A", group: "Nhóm 1", sysScore: 9.5, manualScore: 9.5, details: { slices: 540, percentage: "40%", aiFlag: false }, overrideNote: "" },
  { id: "SV-002", name: "Trần Thị B", group: "Nhóm 1", sysScore: 6.0, manualScore: 7.0, details: { slices: 210, percentage: "15%", aiFlag: true }, overrideNote: "Nhận vơ công sức, du di cho qua" },
  { id: "SV-003", name: "Lê Văn C", group: "Nhóm 1", sysScore: 8.5, manualScore: 8.5, details: { slices: 450, percentage: "45%", aiFlag: false }, overrideNote: "" },
  { id: "SV-004", name: "Phạm Hoàng D", group: "Nhóm 2", sysScore: 4.0, manualScore: 4.0, details: { slices: 120, percentage: "10%", aiFlag: true }, overrideNote: "Ghosting quá 5 ngày" },
  { id: "SV-005", name: "Vũ Mai E", group: "Nhóm 2", sysScore: 8.0, manualScore: 8.0, details: { slices: 400, percentage: "30%", aiFlag: false }, overrideNote: "" },
];

export default function MasterGradebookPage() {
  const [grades, setGrades] = useState(MOCK_GRADES);
  const [isSaving, setIsSaving] = useState(false);

  const handleManualScoreChange = (id: string, value: string) => {
    const newScore = parseFloat(value);
    setGrades(grades.map(g => g.id === id ? { ...g, manualScore: isNaN(newScore) ? g.sysScore : newScore } : g));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-xs font-bold">
              <CheckCircle2 size={14} />
              Final Evaluation Export
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Bảng Điểm Tổng Hợp
            </h1>
            <p className="text-muted-foreground font-medium">Đối chiếu phần trăm Slices của toàn bộ sinh viên và xuất báo cáo nộp lên FAP</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-border/50 h-10 font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
              <FileSpreadsheet size={16} className="mr-2" />
              Xuất Excel (FAP Format)
            </Button>
            <Button
              className="rounded-xl h-10 font-bold bg-primary hover:bg-primary/90"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Đang lưu...</span>
              ) : (
                <span className="flex items-center"><Save size={16} className="mr-2" /> Chốt Điểm & Lưu</span>
              )}
            </Button>
          </div>
        </div>

        <Card className="rounded-[2rem] shadow-sm border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sinh viên..."
                  className="pl-9 bg-background border-border/50 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-3 py-1.5 rounded-xl border border-border/50">
                <Info size={14} className="text-primary" />
                <span>Điểm Hệ thống = Điểm base của nhóm × % Đóng góp (đã trừ phạt AI)</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[100px] font-bold text-muted-foreground">ID</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Sinh viên</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Nhóm</TableHead>
                    <TableHead className="text-center font-bold text-muted-foreground">Tổng Slices</TableHead>
                    <TableHead className="text-center font-bold text-muted-foreground">% Cổ phần</TableHead>
                    <TableHead className="text-center font-bold text-muted-foreground">Cảnh báo AI</TableHead>
                    <TableHead className="text-center bg-indigo-500/5 font-bold text-indigo-600 border-x border-indigo-500/10">Điểm Đề Xuất (Hệ Thống)</TableHead>
                    <TableHead className="text-center bg-primary/5 font-black text-primary border-r border-primary/10">Điểm Chốt Cuối (GV)</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Lý do Ghi đè (Nếu có)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((student) => {
                    const isOverridden = student.sysScore !== student.manualScore;
                    return (
                      <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-muted-foreground">{student.id}</TableCell>
                        <TableCell className="font-bold text-foreground">{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-muted/50 hover:bg-muted font-semibold">
                            {student.group}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium text-muted-foreground">{student.details.slices}</TableCell>
                        <TableCell className="text-center font-black text-indigo-500">{student.details.percentage}</TableCell>
                        <TableCell className="text-center">
                          {student.details.aiFlag ? (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs font-bold">
                              <AlertTriangle size={12} /> Có cờ đỏ
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md text-xs font-bold">
                              <CheckCircle2 size={12} /> Hợp lệ
                            </div>
                          )}
                        </TableCell>

                        {/* System Score */}
                        <TableCell className="text-center bg-indigo-500/5 border-x border-indigo-500/10">
                          <span className="font-bold text-indigo-600 text-lg">{student.sysScore.toFixed(1)}</span>
                        </TableCell>

                        {/* Manual Override Score */}
                        <TableCell className="text-center bg-primary/5 border-r border-primary/10 relative">
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            max="10"
                            className={`w-20 mx-auto text-center font-black text-lg border-2 ${isOverridden ? 'border-amber-500 text-amber-600 focus-visible:ring-amber-500' : 'border-transparent text-primary bg-transparent focus-visible:ring-primary'}`}
                            defaultValue={student.manualScore}
                            onBlur={(e) => handleManualScoreChange(student.id, e.target.value)}
                          />
                          {isOverridden && (
                            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" title="Điểm đã bị ghi đè" />
                          )}
                        </TableCell>

                        {/* Notes */}
                        <TableCell>
                          <Input
                            placeholder="Thêm lý do..."
                            defaultValue={student.overrideNote}
                            className="bg-transparent border-transparent hover:border-border/50 focus-visible:bg-background"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
