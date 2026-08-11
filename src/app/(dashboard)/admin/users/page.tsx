"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable } from "@/features/admin/components/users-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useUsers, useToggleUserStatus } from "@/features/admin/hooks/useUsers";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 500);
  const [role, setRole] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [page, setPage] = useState(0);

  const { data: usersData, isLoading } = useUsers({
    keyword: debouncedKeyword || undefined,
    role: role !== "all" ? role : undefined,
    accountStatus: accountStatus !== "all" ? accountStatus : undefined,
    page: page,
    size: 20,
  });

  const { mutateAsync: toggleStatus } = useToggleUserStatus();

  const handleToggleStatus = async (userId: string, currentStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING") => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await toggleStatus({ id: userId, status: newStatus });
      toast.success(`Đã cập nhật trạng thái người dùng thành công.`);
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setAccountStatus(value);
    setPage(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Phân quyền Người dùng (RBAC)"
        description="Quản lý danh sách người dùng trên hệ thống SAGA. Admin có thể xem vai trò, cấp hoặc thu hồi quyền truy cập của từng tài khoản."
        workspace="Workspace Quản trị"
      >
      </PageHeader>
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
            <UsersTable
              data={usersData?.content || []}
              pageIndex={usersData?.number || 0}
              totalPages={usersData?.totalPages || 0}
              totalElements={usersData?.totalElements || 0}
              keyword={keyword}
              role={role}
              accountStatus={accountStatus}
              onPageChange={setPage}
              onKeywordChange={handleKeywordChange}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
