"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SemestersGrid, Semester } from "@/features/admin/components/semesters-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialSemesters: Semester[] = [
  { id: "1", name: "Spring 2026", startDate: "2026-01-05", endDate: "2026-04-20", status: "ended" },
  { id: "2", name: "Summer 2026", startDate: "2026-05-05", endDate: "2026-08-20", status: "active" },
  { id: "3", name: "Fall 2026", startDate: "2026-09-05", endDate: "2026-12-20", status: "upcoming" },
];

export default function SemestersManagementPage() {
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("10 phút trước");

  // Override Mode States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "", status: "upcoming" as const });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleForceSync = () => {
    setIsSyncing(true);
    toast.loading("Đang kết nối FAP để đồng bộ học kỳ...", { id: "sync-semesters" });
    
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Vừa xong");
      toast.success("Đã đồng bộ dữ liệu học kỳ mới nhất từ hệ thống!", { id: "sync-semesters" });
    }, 2000);
  };

  const handleOverrideToggle = (checked: boolean) => {
    if (checked) {
      toast.warning("Đã bật chế độ Khắc phục sự cố. Hãy cẩn thận khi nhập liệu thủ công!", { duration: 5000 });
    } else {
      toast.info("Đã tắt chế độ Khắc phục sự cố.");
    }
    setIsOverrideMode(checked);
  };

  // Manual Operations
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", startDate: "", endDate: "", status: "upcoming" });
    setIsModalOpen(true);
  };

  const openEditModal = (semester: Semester) => {
    setEditingId(semester.id);
    setFormData({ 
      name: semester.name, 
      startDate: semester.startDate, 
      endDate: semester.endDate, 
      status: semester.status 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin học kỳ!");
      return;
    }

    if (editingId) {
      // Edit
      setSemesters(semesters.map(s => s.id === editingId ? { ...s, ...formData, isManual: true } : s));
      toast.success("Cập nhật học kỳ thành công!");
    } else {
      // Create
      const newSemester: Semester = {
        id: Date.now().toString(),
        ...formData,
        isManual: true
      };
      setSemesters([...semesters, newSemester]);
      toast.success("Đã thêm học kỳ mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id));
    toast.success("Đã xóa học kỳ thành công!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản lý Học kỳ (Đồng bộ tự động)"
        description="Danh sách học kỳ được tự động đồng bộ từ hệ thống lõi (FAP). Mọi thao tác cấu hình học kỳ sẽ được thực hiện tại FAP."
        workspace="Workspace Quản trị"
      >
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex items-center justify-end gap-4 w-full">
            <div className="text-sm text-muted-foreground flex flex-col items-end">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Auto-sync enabled
              </span>
              <span className="text-xs mt-1">Cập nhật lần cuối: {lastSync}</span>
            </div>
            
            <Button 
              onClick={handleForceSync} 
              disabled={isSyncing}
              className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[160px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} /> 
              {isSyncing ? "Đang đồng bộ..." : "Ép đồng bộ ngay"}
            </Button>
          </div>

          {/* Override Mode Toggle Bar */}
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50 gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className={`w-5 h-5 ${isOverrideMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-bold text-foreground">Chế độ Khắc phục sự cố</p>
                <p className="text-xs text-muted-foreground">Chỉ bật khi FAP lỗi. Dữ liệu tay sẽ có tag [MANUAL].</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isOverrideMode && (
                <Button size="sm" onClick={openCreateModal} className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white">
                  <Plus className="w-3 h-3 mr-1" /> Tạo thủ công
                </Button>
              )}
              <Switch checked={isOverrideMode} onCheckedChange={handleOverrideToggle} />
            </div>
          </div>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
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
        <SemestersGrid 
          data={semesters} 
          isOverrideMode={isOverrideMode}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Manual Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingId ? "Sửa học kỳ (Manual)" : "Thêm học kỳ (Manual)"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chỉ nên sử dụng tính năng này khi hệ thống đồng bộ FAP gặp sự cố.
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} className="rounded-xl font-bold">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
