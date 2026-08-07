import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CourseStudentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingStudentId: string | null;
  studentFormData: {
    studentId: string;
    name: string;
    email: string;
    status: string;
  };
  setStudentFormData: (data: {
    studentId: string;
    name: string;
    email: string;
    status: string;
  }) => void;
  onSave: () => void;
}

export function CourseStudentModal({
  isOpen,
  onOpenChange,
  editingStudentId,
  studentFormData,
  setStudentFormData,
  onSave,
}: CourseStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {editingStudentId ? "Sửa thông tin sinh viên" : "Thêm sinh viên"}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium mt-1">
            {editingStudentId ? "Cập nhật thông tin của sinh viên trong lớp học." : "Điền đầy đủ thông tin để thêm sinh viên vào lớp học."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mã Sinh Viên</Label>
            <Input
              className="rounded-xl h-10 focus-visible:ring-primary bg-background border-border/50 font-medium"
              value={studentFormData.studentId}
              onChange={(e) => setStudentFormData({ ...studentFormData, studentId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Họ và tên</Label>
            <Input
              className="rounded-xl h-10 focus-visible:ring-primary bg-background border-border/50 font-medium"
              value={studentFormData.name}
              onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input
              className="rounded-xl h-10 focus-visible:ring-primary bg-background border-border/50 font-medium"
              type="email"
              value={studentFormData.email}
              onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold h-10 px-6">
            Hủy
          </Button>
          <Button onClick={onSave} className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 shadow-sm">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
