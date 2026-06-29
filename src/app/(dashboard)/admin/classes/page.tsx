"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClassesGrid, ClassRoom } from "@/features/admin/components/classes-card";
import { Button } from "@/components/ui/button";
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

  const handleImportCSV = () => {
    toast.loading("Đang import dữ liệu từ file CSV...", { id: "import-csv" });
    setTimeout(() => {
      toast.success("Import thành công 12 lớp học!", { id: "import-csv" });
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
      setClasses(classes.map(c => c.id === editingId ? { ...c, ...formData } : c));
      toast.success("Cập nhật lớp học thành công!");
    } else {
      // Create
      const newClass: ClassRoom = {
        id: Date.now().toString(),
        ...formData
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
        title="Quản lý Lớp học"
        description="Quản lý danh sách các lớp học và phân công Giảng viên/Môn học."
        workspace="Workspace Quản trị"
      >
        <div className="flex flex-col gap-4 w-full md:w-auto">
          {/* Action Row */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleImportCSV} className="hidden sm:flex rounded-xl h-12 font-bold shadow-sm bg-background">
              <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>
            <Button onClick={openCreateModal} className="rounded-xl h-12 font-bold shadow-sm min-w-[160px]">
              <Plus className="w-4 h-4 mr-2" /> Thêm lớp học
            </Button>
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
