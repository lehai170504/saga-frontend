"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SemestersGrid, Semester } from "@/features/admin/components/semesters-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/shared/Skeleton";

const initialSemesters: Semester[] = [
  { id: "1", name: "Spring 2026", startDate: "2026-01-05", endDate: "2026-04-20" },
  { id: "2", name: "Summer 2026", startDate: "2026-05-05", endDate: "2026-08-20" },
];

export default function SemestersManagementPage() {
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSemester, setNewSemester] = useState({ name: "", startDate: "", endDate: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: string) => {
    // In a real app, you might want an alert confirmation here
    setSemesters(semesters.filter(s => s.id !== id));
    toast.success("Đã xóa học kỳ thành công!");
  };

  const handleCreate = () => {
    if (!newSemester.name || !newSemester.startDate || !newSemester.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const semester: Semester = {
      id: Date.now().toString(),
      ...newSemester
    };
    setSemesters([...semesters, semester]);
    setIsCreateModalOpen(false);
    setNewSemester({ name: "", startDate: "", endDate: "" });
    toast.success("Đã thêm học kỳ mới thành công!");
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Quản lý Học kỳ"
          description="Cấu hình danh sách học kỳ trong hệ thống."
        />
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Thêm học kỳ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Thêm học kỳ mới</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Tạo một học kỳ mới để hệ thống có thể bắt đầu ghi nhận dữ liệu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-medium text-foreground">
                  Tên học kỳ
                </Label>
                <Input
                  id="name"
                  placeholder="VD: Fall 2026"
                  className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                  value={newSemester.name}
                  onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start" className="text-right font-medium text-foreground">
                  Bắt đầu
                </Label>
                <Input
                  id="start"
                  type="date"
                  className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                  value={newSemester.startDate}
                  onChange={(e) => setNewSemester({ ...newSemester, startDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end" className="text-right font-medium text-foreground">
                  Kết thúc
                </Label>
                <Input
                  id="end"
                  type="date"
                  className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                  value={newSemester.endDate}
                  onChange={(e) => setNewSemester({ ...newSemester, endDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} className="rounded-xl font-bold">Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <div className="bg-muted/40 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SemestersGrid data={semesters} onDelete={handleDelete} />
      )}
    </div>
  );
}
