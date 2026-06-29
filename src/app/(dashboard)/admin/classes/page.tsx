"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClassesGrid, ClassRoom } from "@/features/admin/components/classes-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import { useRouter } from "next/navigation";
import { ClassModal } from "@/features/admin/components/class-modal";

const initialClasses: ClassRoom[] = [
  { id: "1", className: "SE1801", subject: "Dự án phát triển web", lecturer: "Dr. Nguyen Van A" },
  { id: "2", className: "SE1802", subject: "Lập trình C# nâng cao", lecturer: "Mr. Tran Thi B" },
  { id: "3", className: "SE1803", subject: "Nhập môn Lập trình", lecturer: "Dr. Le Van C" },
  { id: "4", className: "SE1804", subject: "Kiểm thử phần mềm", lecturer: "Ms. Pham Thi D" },
  { id: "5", className: "SE1805", subject: "Hệ cơ sở dữ liệu", lecturer: "Mr. Hoang Van E" },
];

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("5 phút trước");

  // Override Mode States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ className: "", subject: "", lecturer: "" });

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleForceSync = () => {
    setIsSyncing(true);
    toast.loading("Đang kết nối FAP để đồng bộ danh sách lớp học...", { id: "sync-classes" });

    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Vừa xong");
      toast.success("Đã đồng bộ danh sách phân công lớp học mới nhất!", { id: "sync-classes" });
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
      toast.success("Import thành công 12 lớp học (Thủ công)!", { id: "import-csv" });
    }, 2000);
  };

  // Manual Operations
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ className: "", subject: "", lecturer: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cls: ClassRoom) => {
    setEditingId(cls.id);
    setFormData({ className: cls.className, subject: cls.subject, lecturer: cls.lecturer });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.className || !formData.subject || !formData.lecturer) {
      toast.error("Vui lòng điền đầy đủ thông tin lớp học!");
      return;
    }

    if (editingId) {
      // Edit
      setClasses(classes.map(c => c.id === editingId ? { ...c, ...formData, isManual: true } : c));
      toast.success("Cập nhật lớp học thành công!");
    } else {
      // Create
      const newClass: ClassRoom = {
        id: Date.now().toString(),
        ...formData,
        isManual: true
      };
      setClasses([...classes, newClass]);
      toast.success("Đã thêm lớp học mới thành công!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    toast.success("Đã xóa lớp học thành công!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản lý Lớp học (Đồng bộ tự động)"
        description="Danh sách các lớp học được tự động sinh ra và phân công Giảng viên/Môn học từ hệ thống lõi."
        workspace="Workspace Quản trị"
      >
        <div className="flex flex-col gap-4 w-full md:w-auto">
          {/* Action Row */}
          <div className="flex items-center justify-end gap-4 w-full">
            <div className="text-sm text-muted-foreground flex flex-col items-end">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Đã bật tự động đồng bộ
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
              <div className="bg-muted/40 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ClassesGrid
          data={classes}
          onViewDetails={(cls) => router.push(`/admin/classes/${cls.id}`)}
          isOverrideMode={isOverrideMode}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {/* Manual Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
      />
    </div>
  );
}
