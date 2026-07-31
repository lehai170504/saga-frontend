"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/axios";

export function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginUrl = `${API_BASE_URL}/api/auth/login`;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="bg-primary/10 p-4 rounded-full text-primary mb-2">
        <ShieldCheck size={48} />
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold">Xác thực tập trung</h3>
        <p className="text-sm text-muted-foreground">
          Hệ thống SAGA sử dụng xác thực qua Cognito. Vui lòng nhấn nút bên dưới để tiếp tục đăng nhập.
        </p>
      </div>

      <Button
        asChild
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 mt-4 text-md shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsLoggingIn(true)}
        disabled={isLoggingIn}
      >
        <a href={loginUrl}>
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang chuyển hướng...
            </>
          ) : (
            "Đăng nhập với SAGA Identity"
          )}
        </a>
      </Button>
    </div>
  );
}
