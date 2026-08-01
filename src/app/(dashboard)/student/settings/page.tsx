"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";
import {
  Key,
  RefreshCw,
  Settings as SettingsIcon,
  Link2,
  Globe,
  ChevronRight,
  Eye,
  EyeOff,
  Shield,
  Lock,
} from "lucide-react";
import { PersonalIntegrationPanel } from "@/features/integrations/components/personal-integration-panel";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);

  // General settings states
  const [timezone, setTimezone] = useState("GMT+7");

  // Change Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTimezone = localStorage.getItem("saga-timezone") || "GMT+7";

    const timer = setTimeout(() => {
      setTimezone(savedTimezone);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveGeneral = () => {
    localStorage.setItem("saga-timezone", timezone);
    toast.success("Cập nhật cấu hình cá nhân thành công!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin mật khẩu!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Đổi mật khẩu thành công!");
    }, 1500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16 bg-background text-foreground">
      <PageHeader
        title="Kết nối tài khoản & Cài đặt"
        description="Quản lý việc liên kết tài khoản GitHub & Jira cá nhân của sinh viên để đồng bộ hóa chỉ số đóng góp mã nguồn và tiến độ công việc."
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-80 animate-pulse bg-muted border border-border" />
          <Card className="h-80 animate-pulse bg-muted border border-border" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Main Account Integrations Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* INTEGRATION PANEL */}
            <PersonalIntegrationPanel />

            {/* INTEGRATION TIPS CARD */}
            <Card className="border border-primary/20 bg-primary/10 dark:bg-indigo-950/10 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start shadow-sm">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Link2 size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-foreground text-sm">Vì sao cần kết nối tài khoản?</h5>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                  SAGA Continuous Dashboard là nền tảng theo dõi và chấm điểm liên tục (Continuous Grading). Để hệ thống nhận diện đúng vai trò và số lượng đóng góp thực tế của bạn, việc kết nối thông qua Username GitHub và Jira cá nhân là bắt buộc. Hệ thống mã hóa bảo mật toàn bộ API Tokens của bạn.
                </p>
              </div>
            </Card>

          </div>

          {/* Right Preferences Settings Card (Span 1) */}
          <div className="space-y-6">
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-6 hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-foreground text-base mb-6 flex items-center gap-2">
                <SettingsIcon className="text-primary" size={18} />
                Cấu hình cá nhân
              </h3>
              <div className="space-y-6">



                {/* Timezone Selection */}
                <div className="space-y-2">
                  <Label htmlFor="timezone-select" className="text-muted-foreground text-xs font-bold flex items-center gap-1.5">
                    <Globe size={14} />
                    Múi giờ làm việc
                  </Label>
                  <div className="relative">
                    <select
                      id="timezone-select"
                      className="w-full h-10 bg-background border border-border rounded-xl px-3 text-xs font-bold focus:outline-none focus:ring-2 ring-primary24071 border-primary/20 shadow-sm appearance-none cursor-pointer text-foreground"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="GMT+7">Hà Nội (GMT+7)</option>
                      <option value="GMT+8">Singapore (GMT+8)</option>
                      <option value="GMT+0">London (GMT+0)</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-muted-foreground">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleSaveGeneral}
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Lưu cấu hình cá nhân
                </Button>
              </div>
            </Card>

            {/* Change Password Card */}
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-6 hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-foreground text-base mb-6 flex items-center gap-2">
                <Shield className="text-primary" size={18} />
                Đổi mật khẩu
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Mật khẩu hiện tại</Label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary26384 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Mật khẩu mới</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary27650 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Xác nhận mật khẩu mới</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary28933 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full h-10 mt-2 bg-card dark:hover:bg-muted text-foreground text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50 border border-border"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            </Card>

            {/* Quick Status / Profile Summary Card */}
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground font-extrabold flex items-center justify-center shadow-md shadow-primary/20">
                  LH
                </div>
                <div>
                  <h6 className="font-extrabold text-foreground text-xs">Lê Hoàng Hải</h6>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">MSSV: 102210123</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Lớp sinh hoạt:</span>
                  <span className="text-foreground font-bold">21T_DT1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Vai trò dự án:</span>
                  <span className="text-primary font-bold">Student Developer</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
