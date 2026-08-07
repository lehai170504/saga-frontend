import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface CourseSettingsTabProps {
  classDetails: {
    className: string;
    subject: string;
    semester: string;
    codeWeight?: number;
    docWeight?: number;
    designWeight?: number;
    instructorId?: string;
  };
}

import { useLecturers } from "@/features/user/hooks/useUsers";
import { Loader2 } from "lucide-react";

export function CourseSettingsTab({ classDetails }: CourseSettingsTabProps) {
  const { data: lecturers, isLoading: isLoadingLecturers } = useLecturers();

  return (
    <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
      <CardHeader className="border-b border-border/50 pb-5 mb-5">
        <CardTitle className="text-xl font-bold text-foreground">Cài đặt chung của Lớp</CardTitle>
        <CardDescription className="text-sm font-medium mt-1">Quản lý các thông tin cốt lõi của lớp học (Chỉ dành cho Admin).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mã Lớp</Label>
            <Input value={classDetails.className} disabled className="bg-muted/30 rounded-xl h-10 font-medium text-foreground border-border/50" />
          </div>
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Môn học</Label>
            <Input value={classDetails.subject} disabled className="bg-muted/30 rounded-xl h-10 font-medium text-foreground border-border/50" />
          </div>
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Học kỳ</Label>
            <Input value={classDetails.semester} disabled className="bg-muted/30 rounded-xl h-10 font-medium text-foreground border-border/50" />
          </div>
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phân công Giảng viên</Label>
            <Select defaultValue={classDetails.instructorId}>
              <SelectTrigger className="rounded-xl h-10 font-medium bg-card">
                <SelectValue placeholder="Chọn giảng viên" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {isLoadingLecturers ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : lecturers?.content && lecturers.content.length > 0 ? (
                  lecturers.content.map((lecturer: { id: string; fullName: string }) => (
                    <SelectItem key={lecturer.id} value={lecturer.id} className="font-medium rounded-lg">
                      {lecturer.fullName}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">Không có dữ liệu</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trạng thái lớp</Label>
            <Select defaultValue="active">
              <SelectTrigger className="rounded-xl h-10 font-medium bg-card">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="active" className="font-medium rounded-lg">Đang diễn ra</SelectItem>
                <SelectItem value="ended" className="font-medium rounded-lg">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled" className="font-medium rounded-lg">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end pt-5 border-t border-border/50 mt-8">
          <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-10 transition-all shadow-sm" onClick={() => toast.success("Đã lưu cài đặt lớp học!")}>
            <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
