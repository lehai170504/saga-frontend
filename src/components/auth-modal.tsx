// src/components/auth-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, AtSign } from "lucide-react";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl px-6 shadow-sm transition-all hover:-translate-y-0.5">
          Đăng nhập / Đăng ký
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-2xl border-slate-200 shadow-xl">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-center bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              SAGA Dashboard
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 font-medium">
              Hệ thống đánh giá liên tục PBL
            </DialogDescription>
          </DialogHeader>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger
                value="login"
                className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 pt-4 bg-slate-50/50 mt-2">
            {/* Form Đăng Nhập */}
            <TabsContent value="login" className="space-y-4 mt-0 outline-none">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">
                  Email / Tài khoản
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    placeholder="student@example.com"
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 font-semibold"
                  >
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
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl h-11 mt-2">
                Đăng nhập
              </Button>
            </TabsContent>

            {/* Form Đăng Ký */}
            <TabsContent
              value="register"
              className="space-y-4 mt-0 outline-none"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">
                  Họ và Tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="reg-email"
                  className="text-slate-700 font-semibold"
                >
                  Email sinh viên
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reg-email"
                    placeholder="sv@edu.vn"
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="reg-password"
                  className="text-slate-700 font-semibold"
                >
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 mt-2">
                Tạo tài khoản
              </Button>
            </TabsContent>

            {/* Divider & Social Login */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500 font-medium">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 h-11"
              >
                {/* Đã thay Github icon từ thư viện bằng Inline SVG */}
                <svg
                  className="mr-2 h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-semibold text-slate-700 h-11 transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4 fill-current text-[#0052CC]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.53 2.308a3.1 3.1 0 0 0-4.385 0L.438 9.015a3.1 3.1 0 0 0 0 4.385l6.707 6.707a3.1 3.1 0 0 0 4.385 0l6.707-6.707a3.1 3.1 0 0 0 0-4.385L11.53 2.308Zm8.769 4.385a3.1 3.1 0 0 0-4.384 0l-6.708 6.707a3.1 3.1 0 0 0 0 4.385l6.708 6.707a3.1 3.1 0 0 0 4.384 0l6.708-6.707a3.1 3.1 0 0 0 0-4.385l-6.708-6.707Z" />
                </svg>
                Jira
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
