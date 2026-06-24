"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ClassesTable, ClassRoom } from "@/features/admin/components/classes-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

const classes: ClassRoom[] = [
  { id: "1", className: "SE102.M21", subject: "Công nghệ phần mềm", lecturer: "Dr. Nguyen Van A" },
  { id: "2", className: "PRN211.F01", subject: "Lập trình C# nâng cao", lecturer: "Mr. Tran Thi B" },
];

export default function ClassesManagementPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Quản lý Lớp học" 
          description="Danh sách các lớp học, gán giảng viên và quản lý sinh viên." 
        />
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">
            <Upload className="h-4 w-4 mr-2" /> Import Sinh viên
          </Button>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Thêm lớp học
          </Button>
        </div>
      </div>
      
      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="pt-6">
          <ClassesTable data={classes} />
        </CardContent>
      </Card>
    </div>
  );
}
