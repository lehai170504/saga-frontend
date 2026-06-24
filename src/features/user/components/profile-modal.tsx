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
import { useAuth } from "@/context/AuthContext";
import { Mail, User, ShieldCheck, Camera } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Hồ sơ cá nhân
          </DialogTitle>
          <DialogDescription className="text-center">
            Quản lý thông tin tài khoản SAGA Dashboard của bạn.
          </DialogDescription>
        </DialogHeader>

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
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
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
      </DialogContent>
    </Dialog>
  );
}
