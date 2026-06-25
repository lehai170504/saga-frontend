"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubjectsGrid, Subject } from "@/features/admin/components/subjects-card";
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

const initialSubjects: Subject[] = [
  { id: "1", code: "SWE301", name: "Công nghệ phần mềm" },
  { id: "2", code: "PRN211", name: "Lập trình C# nâng cao" },
  { id: "3", code: "PRO192", name: "Lập trình hướng đối tượng" },
  { id: "4", code: "DBI202", name: "Hệ cơ sở dữ liệu" },
  { id: "5", code: "SWT301", name: "Kiểm thử phần mềm" },
  { id: "6", code: "SWP391", name: "Dự án phát triển phần mềm" },
];

export default function SubjectsManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("10 phút trước");

  // Override Mode States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", name: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleForceSync = () => {
    setIsSyncing(true);
    toast.loading("Đang kết nối FAP để đồng bộ môn học...", { id: "sync-subjects" });
    
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Vừa xong");
      toast.success("Đã đồng bộ danh mục môn học mới nhất từ hệ thống!", { id: "sync-subjects" });
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

  const handleImportCSV = () => {
    toast.loading("Đang import dữ liệu từ file CSV...", { id: "import-csv" });
    setTimeout(() => {
      toast.success("Import thành công 40 môn học (Manual Override)!", { id: "import-csv" });
    }, 2000);
  };

  // Manual Operations
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ code: "", name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({ code: subject.code, name: subject.name });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      toast.error("Vui lòng điền đầy đủ thông tin môn học!");
      return;
    }

    if (editingId) {
      // Edit
      setSubjects(subjects.map(s => s.id === editingId ? { ...s, ...formData, isManual: true } : s));
      toast.success("Cập nhật môn học thành công!");
    } else {
      // Create
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
        isManual: true
      };
      setSubjects([...subjects, newSubject]);
      toast.success("Đã thêm môn học mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success("Đã xóa môn học thành công!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản lý Môn học (Đồng bộ tự động)"
        description="Danh mục các môn học Master Data được đồng bộ trực tiếp từ hệ thống FAP."
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
                <>
                  <Button variant="outline" size="sm" onClick={handleImportCSV} className="h-8 text-xs font-bold bg-background">
                    <Upload className="w-3 h-3 mr-1" /> Import CSV
                  </Button>
                  <Button size="sm" onClick={openCreateModal} className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus className="w-3 h-3 mr-1" /> Tạo thủ công
                  </Button>
                </>
              )}
              <Switch checked={isOverrideMode} onCheckedChange={handleOverrideToggle} />
            </div>
          </div>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SubjectsGrid 
          data={subjects} 
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
              {editingId ? "Sửa môn học (Manual)" : "Thêm môn học (Manual)"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chỉ nên sử dụng tính năng này khi hệ thống đồng bộ FAP gặp sự cố.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right font-medium text-foreground">
                Mã môn
              </Label>
              <Input
                id="code"
                placeholder="VD: SWE301"
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input uppercase"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-foreground">
                Tên môn
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên môn học..."
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
