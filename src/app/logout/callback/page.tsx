"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function LogoutCallbackPage() {
  useEffect(() => {
    // Xóa trạng thái người dùng ở phía FE
    useAuthStore.getState().logoutLocalOnlyOrClearState();

    // Về trang chủ (trang chủ có code tự động redirect ra form đăng nhập nếu cần, hoặc hiển thị nút Login)
    window.location.replace("/");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <p className="text-muted-foreground font-medium animate-pulse">
        Đang xử lý đăng xuất...
      </p>
    </div>
  );
}
