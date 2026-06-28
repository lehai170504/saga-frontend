"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const roleName = "Sinh viên";

    toast.success(
      `Tài khoản "${name}" (${roleName}) đã được tạo! Hệ thống sẽ liên hệ qua email.`,
      { duration: 4000 },
    );
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-semibold">
          Họ và Tên
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9 focus-visible:ring-ring rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email" className="font-semibold">
          Email sinh viên
        </Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-email"
            placeholder="sv@student.edu.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 focus-visible:ring-ring rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password" className="font-semibold">
          Mật khẩu
        </Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10 focus-visible:ring-ring rounded-xl"
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
        onClick={handleRegister}
      >
        Tạo tài khoản sinh viên
      </Button>
    </div>
  );
}
