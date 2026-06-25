"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ProfileModal } from "@/features/user/components/profile-modal";

const roleDisplay: Record<string, string> = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
  student: "Thành viên",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  // State quản lý việc đóng/mở Profile Modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/");
  };

  return (
    <>
      <header className="h-16 border-b bg-card border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 gap-2 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="hidden lg:block">
            <Image
              src="/logo-nav.png"
              alt="SAGA Logo"
              width={240}
              height={72}
              priority
              className="h-7 w-auto object-contain transition-transform hover:scale-[1.02]"
            />
          </Link>
          <div className="h-6 w-px bg-border hidden lg:block mx-2" />
        </div>

        {/* Spacer to push right content to the end */}
        <div className="flex-1" />

        {/* Right side: Theme toggle + User Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Chuyển đổi giao diện"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1 pl-2 gap-2 rounded-full hover:bg-accent cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-tight flex justify-end items-center gap-1">
                    {user?.role === "admin" && (
                      <ShieldCheck size={14} className="text-emerald-500" />
                    )}
                    {user?.name ?? "Khách"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src="" alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-sm dark:bg-orange-900/40 dark:text-orange-400">
                    {user?.avatarInitials ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsProfileOpen(true)}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Render Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
