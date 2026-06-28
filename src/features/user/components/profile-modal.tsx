"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";

import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Mail, User, ShieldCheck, Camera, Loader2, Key, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleDisplay: Record<string, string> = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student: "Thành viên",
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // State lưu trữ dữ liệu chỉnh sửa
  const [name, setName] = useState(user?.name || "");

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Tên không được để trống!");
      return;
    }
    // Gọi API cập nhật user ở đây
    toast.success("Đã cập nhật thông tin thành công!");
    setIsEditing(false);
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

  const { theme, setTheme } = useTheme();
  const [githubToken, setGithubToken] = useState("");
  const [jiraToken, setJiraToken] = useState("");
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);
  const [isValidatingJira, setIsValidatingJira] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleValidateToken = async (type: "github" | "jira") => {
    const token = type === "github" ? githubToken : jiraToken;
    const setter = type === "github" ? setIsValidatingGithub : setIsValidatingJira;
    const label = type === "github" ? "GitHub" : "Jira";

    if (!token.trim()) {
      toast.error(`Vui lòng nhập ${label} Token trước!`);
      return;
    }

    setter(true);
    toast.loading(`Đang xác thực ${label} Token...`, { id: `validate-${type}` });

    await new Promise((res) => setTimeout(res, 1500));
    setter(false);

    if (token.length > 6) {
      toast.success(`✅ ${label} Token hợp lệ! Kết nối thành công.`, { id: `validate-${type}`, duration: 3000 });
    } else {
      toast.error(`❌ ${label} Token không hợp lệ. Vui lòng kiểm tra lại.`, { id: `validate-${type}`, duration: 4000 });
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    toast.loading("Đang lưu cấu hình...", { id: "save-config" });
    await new Promise((res) => setTimeout(res, 1200));
    setIsSavingSettings(false);
    toast.success("Cấu hình đã được lưu thành công!", { id: "save-config", duration: 3000 });
  };

  // Reset form nếu đóng modal hoặc hủy
  const handleCancel = () => {
    setName(user?.name || "");
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
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden rounded-2xl">
        <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col sm:flex-row w-full h-full sm:min-h-[500px] sm:max-h-[85vh]">
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
              {user.role === "student" && (
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
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-3xl font-bold dark:bg-orange-900/40 dark:text-orange-400">
                      {user.avatarInitials ?? "?"}
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
                        className={`h-5 w-5 mr-3 ${user.role === "admin" ? "text-emerald-500" : "text-blue-500"}`}
                      />
                      <span className="font-medium text-sm">
                        {user.role ? roleDisplay[user.role] : "Chưa xác định"}
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full font-bold"
                      >
                        Lưu thay đổi
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
                    <Key className="absolute left-3 h-4 w-4 text-slate-400" />
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
                    <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
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
                    <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
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

            {user.role === "student" && (
              <TabsContent value="settings" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold mb-1">Tích hợp API</h4>
                      <p className="text-xs text-muted-foreground">Kết nối với Jira và GitHub.</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold">GitHub Personal Access Token</Label>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxx"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          className="bg-background border-border focus-visible:ring-orange-500"
                        />
                        <Button
                          variant="secondary"
                          className="w-full shrink-0"
                          onClick={() => handleValidateToken("github")}
                          disabled={isValidatingGithub}
                        >
                          {isValidatingGithub ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Xác thực...</> : "Xác thực Token"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs font-bold">Jira API Token</Label>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="password"
                          placeholder="Nhập Jira token..."
                          value={jiraToken}
                          onChange={(e) => setJiraToken(e.target.value)}
                          className="bg-background border-border focus-visible:ring-orange-500"
                        />
                        <Button
                          variant="secondary"
                          className="w-full shrink-0"
                          onClick={() => handleValidateToken("jira")}
                          disabled={isValidatingJira}
                        >
                          {isValidatingJira ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Xác thực...</> : "Xác thực Token"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-border">
                  <Button variant="default" onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-primary hover:bg-primary/90 font-bold text-primary-foreground rounded-xl w-full h-11">
                    {isSavingSettings ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : "Lưu cấu hình"}
                  </Button>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
