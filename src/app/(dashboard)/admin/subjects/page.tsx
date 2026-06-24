"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SubjectsTable, Subject } from "@/features/admin/components/subjects-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const subjects: Subject[] = [
  { id: "1", code: "SWE301", name: "Công nghệ phần mềm" },
  { id: "2", code: "PRN211", name: "Lập trình C# nâng cao" },
];

export default function SubjectsManagementPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="Quản lý Môn học" 
          description="Danh mục các môn học trong hệ thống." 
        />
        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Thêm môn học
        </Button>
      </div>
      
      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="pt-6">
          <SubjectsTable data={subjects} />
        </CardContent>
      </Card>
    </div>
  );
}
