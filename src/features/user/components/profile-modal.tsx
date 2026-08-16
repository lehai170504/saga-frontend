"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Mail, ShieldCheck, GraduationCap, Edit2, Check, X, Loader2 } from "lucide-react";
import { PersonalIntegrationPanel } from "@/features/integrations/components/personal-integration-panel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateProfile } from "@/features/user/hooks/useUpdateProfile";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roleDisplay: Record<string, string> = {
  ADMIN: "Quản trị viên Hệ thống",
  LECTURER: "Giảng viên",
  STUDENT: "Sinh viên",
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || user?.avatar || "");

  const updateProfileMutation = useUpdateProfile();

  if (!user) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      setFullName(user.fullName || "");
      setAvatarUrl(user.avatarUrl || user.avatar || "");
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      toast.error("Tên không được để trống");
      return;
    }
    updateProfileMutation.mutate(
      { fullName, avatarUrl },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden rounded-[2rem] border-border/50 flex flex-col max-h-[90vh]">

        {/* Fixed Header */}
        <DialogHeader className="px-6 md:px-8 pt-6 md:pt-8 pb-4 shrink-0 bg-card border-b border-border/50 relative z-10">
          <DialogTitle className="text-2xl font-black tracking-tight">Hồ sơ & Cài đặt</DialogTitle>
        </DialogHeader>

        {/* Content Area: Two Columns on Desktop */}
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden bg-muted/10 relative">

          {/* Left Column: User Profile Details */}
          <div className="w-full md:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-border/50 bg-card md:overflow-y-auto">
            {/* Cover Photo */}
            <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative shrink-0">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <div className="px-6 pb-8 -mt-10 relative">
              {/* User Avatar */}
              <Avatar className="h-24 w-24 border-4 border-card shadow-lg mb-4">
                <AvatarImage src={user?.avatarUrl || user?.avatar || ""} alt={user.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {user.fullName?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>

              {/* Basics */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shrink-0 ${user.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                      {user.accountStatus === 'ACTIVE' ? 'Hoạt động' : user.accountStatus || 'Unknown'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleEditToggle} className="h-7 text-xs font-bold rounded-full">
                    {isEditing ? <X className="w-3.5 h-3.5 mr-1" /> : <Edit2 className="w-3.5 h-3.5 mr-1" />}
                    {isEditing ? "Hủy" : "Chỉnh sửa"}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Họ và tên</label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-9 rounded-xl font-medium"
                        placeholder="Nhập họ và tên..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">URL Ảnh đại diện</label>
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="h-9 rounded-xl font-medium text-xs"
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      className="w-full h-9 rounded-xl font-bold mt-2"
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                      Lưu thay đổi
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-black text-foreground mb-1">{user.fullName}</h2>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> <span>{user.email}</span>
                    </p>
                  </>
                )}
              </div>

              {/* Roles / Metadata */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 flex items-center gap-3 hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Vai trò hệ thống</p>
                    <p className="text-sm font-bold text-foreground">{roleDisplay[user.applicationRole] || "Chưa xác định"}</p>
                  </div>
                </div>

                {user.applicationRole === "STUDENT" && (
                  <div className="p-3.5 rounded-xl border border-border/50 bg-muted/10 flex items-center gap-3 hover:border-emerald-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Mã sinh viên</p>
                      <p className="text-sm font-bold text-foreground uppercase">{user.email?.split("@")[0] || "Không xác định"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Integrations */}
          <div className="flex-1 bg-card/30 md:overflow-y-auto">
            {user.applicationRole === "STUDENT" ? (
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-black tracking-tight mb-2">Tích hợp Hệ thống</h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kết nối tài khoản của bạn với Jira và GitHub để hệ thống tự động ghi nhận khối lượng công việc.
                  </p>
                </div>
                <div className="pb-4">
                  <PersonalIntegrationPanel />
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 flex flex-col items-center justify-center h-full text-center opacity-50">
                <ShieldCheck className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-foreground">Tài khoản Giảng viên</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Tài khoản của bạn không cần kết nối với các công cụ phát triển phần mềm.
                </p>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
