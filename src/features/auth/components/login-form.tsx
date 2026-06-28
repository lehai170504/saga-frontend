"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, Eye, EyeOff, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password States
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error("Vui lòng nhập email để khôi phục mật khẩu!");
      return;
    }
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setIsForgotPasswordOpen(false);
      setForgotPasswordEmail("");
      toast.success("Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn!");
    }, 1500);
  };

  // Hàm hỗ trợ điền nhanh tài khoản demo
  const fillDemoAccount = (role: string) => {
    setPassword("123456");
    if (role === "admin") setEmail("admin@saga.edu.vn");
    if (role === "lecturer") setEmail("gv@saga.edu.vn");
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
      <div className="bg-muted p-3 rounded-xl mb-4">
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
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
            className="pl-9 focus-visible:ring-ring rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-semibold">
            Mật khẩu
          </Label>
          <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/90 font-medium cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-foreground">
                  Quên mật khẩu
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-muted-foreground mt-2">
                  Nhập địa chỉ email liên kết với tài khoản của bạn. Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="font-semibold text-xs">
                    Email khôi phục
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="student@saga.edu.vn"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="pl-9 focus-visible:ring-ring rounded-xl h-11"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 transition-colors"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi yêu cầu
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10 focus-visible:ring-ring rounded-xl"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 mt-2"
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
