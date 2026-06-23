"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Hàm hỗ trợ điền nhanh tài khoản demo
  const fillDemoAccount = (role: string) => {
    setPassword("123456");
    if (role === "admin") setEmail("admin@saga.edu.vn");
    if (role === "lecturer") setEmail("gv@saga.edu.vn");
    if (role === "leader") setEmail("leader@student.edu.vn");
    if (role === "student") setEmail("member@student.edu.vn");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu!");
      return;
    }

    setIsLoggingIn(true);

    try {
      await login(email, password);

      // Phân quyền theo email nhập vào (Giả lập FE)
      let userRole = "student";
      if (email.includes("admin")) userRole = "admin";
      else if (email.includes("gv") || email.includes("lecturer"))
        userRole = "lecturer";
      else if (email.includes("leader")) userRole = "student_leader";

      let redirectPath = "/dashboard";
      let roleName = "Sinh viên";

      switch (userRole) {
        case "admin":
          redirectPath = "/admin";
          roleName = "Quản trị viên";
          break;
        case "lecturer":
          redirectPath = "/lecturer";
          roleName = "Giảng viên";
          break;
        case "student_leader":
          redirectPath = "/student";
          roleName = "Trưởng nhóm";
          break;
        case "student":
        default:
          redirectPath = "/student";
          roleName = "Thành viên";
          break;
      }

      toast.success(`Đăng nhập thành công! Vai trò: ${roleName}`);
      onSuccess();
      router.push(redirectPath);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Khu vực chọn nhanh tài khoản Demo */}
      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl mb-4">
        <Label className="text-xs font-semibold text-slate-500 mb-2 block">
          Tài khoản Demo (Click để điền nhanh):
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fillDemoAccount("admin")}
          >
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fillDemoAccount("lecturer")}
          >
            Giảng viên
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fillDemoAccount("leader")}
          >
            Trưởng nhóm
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fillDemoAccount("student")}
          >
            Sinh viên
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold">
          Email / Tài khoản
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            placeholder="Nhập email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 focus-visible:ring-orange-500 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-semibold">
            Mật khẩu
          </Label>
          <a
            href="#"
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            Quên mật khẩu?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 focus-visible:ring-orange-500 rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
      </div>
      <Button
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl h-11 mt-2"
        onClick={handleLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </div>
  );
}
