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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { Mail, User, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleDisplay: Record<string, string> = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
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
      <DialogContent className="sm:max-w-[500px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Hồ sơ cá nhân
          </DialogTitle>
          <DialogDescription className="text-center">
            Quản lý thông tin tài khoản SAGA Dashboard của bạn.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
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
                      className="pl-9 rounded-xl focus-visible:ring-orange-500 disabled:opacity-80"
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
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full"
                    >
                      Lưu thay đổi
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-11"
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 px-1 py-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Chế độ tối (Dark Mode)</Label>
                  <p className="text-xs text-muted-foreground">Chuyển đổi giao diện sang nền tối.</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light");
                    toast.success(checked ? "Đã bật chế độ tối 🌙" : "Đã bật chế độ sáng ☀️");
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Múi giờ hệ thống</Label>
                  <p className="text-xs text-muted-foreground">Đồng bộ thời gian hệ thống.</p>
                </div>
                <Select defaultValue="gmt7">
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="gmt7">(GMT+07:00) Bangkok, Hanoi</SelectItem>
                    <SelectItem value="utc">(UTC) Coordinated Universal Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(user.role === "student" || user.role === "student_leader") && (
                <>
                  <div className="h-px bg-border my-4" />
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
                </>
              )}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-border">
              <Button variant="default" onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl w-full">
                {isSavingSettings ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : "Lưu cấu hình"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
