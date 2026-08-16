"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2 } from "lucide-react";
import { CourseStudent } from "@/features/courses/types";
import { useUpdateStudentGroup } from "@/features/courses/hooks/useCourseStudents";
import { useQueryClient } from "@tanstack/react-query";

interface EditStudentGroupDialogProps {
  courseId: string;
  student: CourseStudent;
}

export function EditStudentGroupDialog({ courseId, student }: EditStudentGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentRole = student.team?.teamMembers.find(m => m.studentId === student.studentId)?.roleInTeam;
  
  // States
  const [group, setGroup] = useState(student.team?.teamName || "");
  const [isLeader, setIsLeader] = useState(currentRole === "LEADER");

  const updateMutation = useUpdateStudentGroup();
  const queryClient = useQueryClient();

  const handleUpdate = () => {
    updateMutation.mutate(
      { courseId, studentId: student.studentId, data: { group: group.trim(), leader: isLeader } },
      {
        onSuccess: () => {
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["courses", courseId, "students"] });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        setGroup(student.team?.teamName || "");
        setIsLeader(currentRole === "LEADER");
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhóm sinh viên</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">{student.fullName}</p>
            <p className="text-xs text-muted-foreground">{student.studentCode} • {student.email}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Tên nhóm</Label>
            <Input 
              id="group" 
              value={group} 
              onChange={(e) => setGroup(e.target.value)} 
              placeholder="VD: Group 1 (Để trống để xóa khỏi nhóm)" 
            />
          </div>

          <div className="flex items-center justify-between border border-border/50 p-3 rounded-xl bg-muted/20">
            <div className="space-y-0.5">
              <Label className="font-bold">Vai trò Nhóm trưởng</Label>
              <p className="text-xs text-muted-foreground">Đặt sinh viên này làm Leader của nhóm.</p>
            </div>
            <Switch checked={isLeader} onCheckedChange={setIsLeader} disabled={!group.trim()} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
