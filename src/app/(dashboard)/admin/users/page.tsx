"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Users, GraduationCap, UserCircle2, ShieldAlert } from "lucide-react";
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
    toast.success(`Đã cập nhật quyền truy cập người dùng thành ${newStatus === "active" ? "Cho phép" : "Vô hiệu hóa"}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Phân quyền Người dùng (RBAC)"
        description="Quản lý danh sách người dùng trên hệ thống SAGA. Admin có thể xem vai trò, cấp hoặc thu hồi quyền truy cập của từng tài khoản."
        workspace="Workspace Quản trị"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng Người Dùng</p>
                <p className="text-3xl font-black text-foreground">{users.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="text-primary" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Sinh viên Active</p>
                <p className="text-3xl font-black text-foreground">
                  {users.filter(u => u.role === 'student' && u.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <GraduationCap className="text-emerald-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-500 uppercase tracking-wider">Giảng viên Active</p>
                <p className="text-3xl font-black text-foreground">
                  {users.filter(u => u.role === 'lecturer' && u.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <UserCircle2 className="text-blue-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-500 uppercase tracking-wider">Tài khoản bị Khóa</p>
                <p className="text-3xl font-black text-foreground">
                  {users.filter(u => u.status === 'inactive').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                <ShieldAlert className="text-rose-500" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
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
