"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable, User } from "@/features/admin/components/users-table";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - sau này sẽ gọi từ API
const users: User[] = [
  { id: "1", name: "Nguyễn Văn A", email: "a@fpt.edu.vn", role: "student", status: "active" },
  { id: "2", name: "Trần Thị B", email: "b@fpt.edu.vn", role: "lecturer", status: "active" },
];

export default function UsersManagementPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader 
        title="Quản lý Người dùng" 
        description="Xem danh sách sinh viên và giảng viên trong hệ thống. (Chế độ chỉ xem)" 
      />
      
      <Card className="rounded-2xl shadow-sm border-border">
        <CardContent className="pt-6">
          <UsersTable data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
