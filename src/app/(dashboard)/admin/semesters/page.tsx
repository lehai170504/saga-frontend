"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SemestersTable, Semester } from "@/features/admin/components/semesters-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const semesters: Semester[] = [
  { id: "1", name: "Spring 2026", startDate: "2026-01-05", endDate: "2026-04-20" },
  { id: "2", name: "Summer 2026", startDate: "2026-05-05", endDate: "2026-08-20" },
];

export default function SemestersManagementPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Quản lý Học kỳ" 
          description="Cấu hình danh sách học kỳ trong hệ thống." 
        />
        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Thêm học kỳ
        </Button>
      </div>
      
      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="pt-6">
          <SemestersTable data={semesters} />
        </CardContent>
      </Card>
    </div>
  );
}
