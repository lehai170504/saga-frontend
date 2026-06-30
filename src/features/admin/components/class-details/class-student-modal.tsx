import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClassStudentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingStudentId: string | null;
  studentFormData: {
    studentId: string;
    name: string;
    email: string;
    status: string;
  };
  setStudentFormData: (data: any) => void;
  onSave: () => void;
}

export function ClassStudentModal({
  isOpen,
  onOpenChange,
  editingStudentId,
  studentFormData,
  setStudentFormData,
  onSave,
}: ClassStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {editingStudentId ? "Sửa thông tin sinh viên" : "Thêm sinh viên thủ công"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Chỉ dùng chức năng này khi FAP bị lỗi hoặc không thể tự động đồng bộ.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Mã SV</Label>
            <Input
              className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
              value={studentFormData.studentId}
              onChange={(e) => setStudentFormData({ ...studentFormData, studentId: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Họ và tên</Label>
            <Input
              className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
              value={studentFormData.name}
              onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">Email</Label>
            <Input
              className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
              value={studentFormData.email}
              onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} className="rounded-xl font-bold">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
