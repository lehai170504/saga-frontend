"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Mail, User, ShieldCheck, Camera, Key, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PersonalIntegrationPanel } from "@/features/integrations/components/personal-integration-panel";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleDisplay: Record<string, string> = {
  ADMIN: "Quản trị viên",
  LECTURER: "Giảng viên",
  STUDENT: "Thành viên",
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // State quản lý tab đang active
  const [activeTab, setActiveTab] = useState("profile");

  // State lưu trữ dữ liệu chỉnh sửa
  const [name, setName] = useState(user?.fullName || "");

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        const savedTab = sessionStorage.getItem("profile_modal_tab");
        if (savedTab) {
          setActiveTab(savedTab);
          sessionStorage.removeItem("profile_modal_tab");
        } else {
          setActiveTab("profile");
        }
      }
    }
  }, [isOpen]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Tên không được để trống!");
      return;
    }
    setIsSavingProfile(true);
    // Gọi API cập nhật user ở đây
    setTimeout(() => {
      toast.success("Đã cập nhật thông tin thành công!");
      setIsSavingProfile(false);
      setIsEditing(false);
    }, 1000);
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  // Reset form nếu đóng modal hoặc hủy
  const handleCancel = () => {
    setName(user?.fullName || "");
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[950px] p-0 overflow-hidden rounded-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex flex-col sm:flex-row w-full h-full sm:min-h-[500px] sm:max-h-[85vh]">
          {/* Left Sidebar */}
          <div className="w-full sm:w-56 bg-muted/30 border-b sm:border-b-0 sm:border-r border-border flex flex-col shrink-0">
            <DialogHeader className="p-6 pb-4 text-left">
              <DialogTitle className="text-xl font-bold">Hồ sơ cá nhân</DialogTitle>
              <DialogDescription className="text-xs">
                Quản lý tài khoản của bạn
              </DialogDescription>
            </DialogHeader>
            <TabsList className="flex flex-row sm:flex-col h-auto w-full bg-transparent p-4 sm:pt-0 gap-2 items-stretch justify-start overflow-x-auto">
              <TabsTrigger value="profile" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-semibold">
                <User className="w-4 h-4 mr-2" /> Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-semibold">
                <ShieldCheck className="w-4 h-4 mr-2" /> Bảo mật
              </TabsTrigger>
              {user.applicationRole === "STUDENT" && (
                <TabsTrigger value="settings" className="justify-start px-4 py-2.5 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none font-semibold">
                  <Mail className="w-4 h-4 mr-2" /> Cài đặt
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-background">
            <TabsContent value="profile" className="mt-0 space-y-4">
              <div className="flex flex-col items-center gap-4">
                {/* Avatar Area */}
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
                    <AvatarImage src="" alt={user.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold bg-primary/20">
                      {user.fullName?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera size={14} />
                  </Button>
                </div>

                {/* User Info Form */}
                <div className="w-full space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="profile-name"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="pl-9 rounded-xl focus-visible:ring-ring disabled:opacity-80"
                        placeholder="Nhập tên của bạn"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="profile-email"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-email"
                        value={user.email || "chưa có email"}
                        disabled
                        className="pl-9 rounded-xl bg-muted/50 cursor-not-allowed text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Vai trò hệ thống
                    </Label>
                    <div className="relative flex items-center p-3 rounded-xl border bg-muted/30">
                      <ShieldCheck
                        className={`h-5 w-5 mr-3 ${user.applicationRole === "ADMIN" ? "text-success" : "text-primary"}`}
                      />
                      <span className="font-medium text-sm">
                        {user.applicationRole ? roleDisplay[user.applicationRole] : "Chưa xác định"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 mt-2 w-full">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="rounded-xl w-full"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSavingProfile}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full font-bold gap-2"
                      >
                        {isSavingProfile && <RefreshCw className="w-4 h-4 animate-spin" />}
                        {isSavingProfile ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11"
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-4">
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
                      className="pl-9 pr-10 h-11 bg-background border border-border focus-visible:ring-ring rounded-xl text-sm transition-all"
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
                      className="pl-9 pr-10 h-11 bg-background border border-border focus-visible:ring-ring rounded-xl text-sm transition-all"
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
                      className="pl-9 pr-10 h-11 bg-background border border-border focus-visible:ring-ring rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            </TabsContent>

            {user.applicationRole === "STUDENT" && (
              <TabsContent value="settings" className="mt-0">
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-1">Tích hợp API</h4>
                  <p className="text-xs text-muted-foreground">Kết nối với Jira và GitHub để đồng bộ công việc.</p>
                </div>
                <PersonalIntegrationPanel />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
