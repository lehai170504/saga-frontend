"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubjectsGrid, Subject } from "@/features/admin/components/subjects-card";
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

const initialSubjects: Subject[] = [
  { id: "1", code: "SWE301", name: "Công nghệ phần mềm" },
  { id: "2", code: "PRN211", name: "Lập trình C# nâng cao" },
  { id: "3", code: "PRO192", name: "Lập trình hướng đối tượng" },
  { id: "4", code: "DBI202", name: "Hệ cơ sở dữ liệu" },
];

export default function SubjectsManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", name: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      setSubjects(subjects.map(s => s.id === editingId ? { ...s, ...formData } : s));
      toast.success("Cập nhật môn học thành công!");
    } else {
      // Create
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData
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
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Quản lý Môn học"
          description="Danh mục các môn học trong hệ thống."
        />
        <div className="flex gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm">
                <Plus className="h-4 w-4 mr-2" /> Thêm môn học
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editingId ? "Sửa thông tin môn học" : "Thêm môn học mới"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Vui lòng nhập các thông tin cần thiết để {editingId ? "cập nhật" : "tạo mới"} môn học.
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
              <div className="bg-muted/40 rounded-xl p-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SubjectsGrid
          data={subjects}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
