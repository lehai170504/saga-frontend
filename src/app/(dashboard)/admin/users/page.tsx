"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable, User } from "@/features/admin/components/users-table";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";

// Mock data - sau này sẽ gọi từ API
const initialUsers: User[] = [
  { id: "1", name: "Nguyễn Văn A", email: "a@fpt.edu.vn", role: "student", status: "active" },
  { id: "2", name: "Trần Thị B", email: "b@fpt.edu.vn", role: "lecturer", status: "active" },
  { id: "3", name: "Lê Minh C", email: "c@fpt.edu.vn", role: "student", status: "inactive" },
  { id: "4", name: "Phạm Hữu D", email: "d@fpt.edu.vn", role: "lecturer", status: "inactive" },
  { id: "5", name: "Hoàng Thanh E", email: "e@fpt.edu.vn", role: "student", status: "active" },
];

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleStatus = (userId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    toast.success(`Đã cập nhật trạng thái người dùng thành ${newStatus === "active" ? "Hoạt động" : "Vô hiệu hóa"}`);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Quản lý Người dùng"
        description="Xem danh sách, tìm kiếm và quản lý trạng thái tài khoản sinh viên/giảng viên."
      />

      <Card className="rounded-2xl shadow-sm border-border bg-card">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
              </div>
              <div className="rounded-2xl border border-border overflow-hidden">
                <Skeleton className="h-12 w-full rounded-none border-b border-border" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-none border-b border-border/50" />
                ))}
              </div>
            </div>
          ) : (
            <UsersTable data={users} onToggleStatus={handleToggleStatus} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
