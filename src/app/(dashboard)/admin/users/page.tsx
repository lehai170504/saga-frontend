"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable } from "@/features/admin/components/users/users-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";
import { useUsers, useToggleUserStatus } from "@/features/admin/hooks/useUsers";
import { useDebounce } from "use-debounce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UsersManagementPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 500);
  const [role, setRole] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [page, setPage] = useState(0);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING" } | null>(null);

  const { data: usersData, isLoading } = useUsers({
    keyword: debouncedKeyword || undefined,
    role: role !== "all" ? role : undefined,
    accountStatus: accountStatus !== "all" ? accountStatus : undefined,
    page: page,
    size: 20,
  });

  const { mutateAsync: toggleStatus } = useToggleUserStatus();

  const handleToggleStatus = (userId: string, currentStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING") => {
    setSelectedUser({ id: userId, status: currentStatus });
    setIsAlertOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await toggleStatus({ id: selectedUser.id, status: newStatus });
    } finally {
      setIsAlertOpen(false);
      setSelectedUser(null);
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
    <div className="space-y-8 ">
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
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {selectedUser?.status === "ACTIVE" ? "vô hiệu hóa (Inactive)" : "kích hoạt (Active)"} tài khoản này không? Hành động này sẽ ảnh hưởng đến khả năng truy cập hệ thống của người dùng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleStatus}
              className={`rounded-xl ${selectedUser?.status === "ACTIVE" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
