"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, AtSign, Lock } from "lucide-react";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentType, setStudentType] = useState("regular");

  const handleRegister = () => {
    if (!name || !email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const roleName = studentType === "leader" ? "Trưởng nhóm" : "Thành viên";

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
            className="pl-9 focus-visible:ring-orange-500 rounded-xl"
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
            className="pl-9 focus-visible:ring-orange-500 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password" className="font-semibold">
          Mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 focus-visible:ring-orange-500 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-muted-foreground/20">
        <Label className="font-semibold text-sm">Bạn là:</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={studentType === "regular" ? "default" : "outline"}
            className={`rounded-xl h-9 text-xs ${studentType === "regular" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
            onClick={() => setStudentType("regular")}
          >
            Thành viên nhóm
          </Button>
          <Button
            type="button"
            variant={studentType === "leader" ? "default" : "outline"}
            className={`rounded-xl h-9 text-xs ${studentType === "leader" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
            onClick={() => setStudentType("leader")}
          >
            Trưởng nhóm (Leader)
          </Button>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 mt-2"
        onClick={handleRegister}
      >
        Tạo tài khoản sinh viên
      </Button>
    </div>
  );
}
