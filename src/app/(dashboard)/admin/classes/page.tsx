"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClassesGrid, ClassRoom } from "@/features/admin/components/classes-card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
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
import { useRouter } from "next/navigation";

const initialClasses: ClassRoom[] = [
  { id: "1", className: "SE102.M21", subject: "Công nghệ phần mềm", lecturer: "Dr. Nguyen Van A" },
  { id: "2", className: "PRN211.F01", subject: "Lập trình C# nâng cao", lecturer: "Mr. Tran Thi B" },
  { id: "3", className: "CS101.A01", subject: "Nhập môn Lập trình", lecturer: "Dr. Le Van C" },
];

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
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
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Quản lý Lớp học"
          description="Danh sách các lớp học, phân công giảng viên và quản lý sinh viên."
        />
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl shadow-sm text-foreground bg-background border-border">
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Thêm lớp học
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editingId ? "Sửa thông tin lớp học" : "Thêm lớp học mới"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Vui lòng nhập các thông tin cần thiết để {editingId ? "cập nhật" : "tạo mới"} lớp học.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="className" className="text-right font-medium text-foreground">
                    Tên lớp
                  </Label>
                  <Input
                    id="className"
                    placeholder="VD: SE102.M21"
                    className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right font-medium text-foreground">
                    Môn học
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Nhập tên môn học..."
                    className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lecturer" className="text-right font-medium text-foreground">
                    Giảng viên
                  </Label>
                  <Input
                    id="lecturer"
                    placeholder="VD: Dr. Nguyen Van A"
                    className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                    value={formData.lecturer}
                    onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} className="rounded-xl font-bold">Lưu thay đổi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
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
          onEdit={openEditModal}
          onDelete={handleDelete}
          onViewDetails={(cls) => router.push(`/admin/classes/${cls.id}`)}
        />
      )}
    </div>
  );
}
