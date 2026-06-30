import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface ClassSettingsTabProps {
  classDetails: {
    className: string;
    subject: string;
    semester: string;
  };
}

export function ClassSettingsTab({ classDetails }: ClassSettingsTabProps) {
  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Cài đặt chung của Lớp</CardTitle>
        <CardDescription>Quản lý các thông tin cốt lõi của lớp học (Chỉ dành cho Admin).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Mã Lớp</Label>
            <Input value={classDetails.className} disabled className="bg-muted/50 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Môn học</Label>
            <Input value={classDetails.subject} disabled className="bg-muted/50 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Học kỳ</Label>
            <Input value={classDetails.semester} disabled className="bg-muted/50 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Phân công Giảng viên</Label>
            <Select defaultValue="gv1">
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn giảng viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gv1">Dr. Nguyen Van A</SelectItem>
                <SelectItem value="gv2">Dr. Tran Thi B</SelectItem>
                <SelectItem value="gv3">Prof. Le Minh C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Trạng thái lớp</Label>
            <Select defaultValue="active">
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang diễn ra</SelectItem>
                <SelectItem value="ended">Đã kết thúc</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button className="rounded-xl font-bold bg-primary" onClick={() => toast.success("Đã lưu cài đặt lớp học!")}>
            <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
