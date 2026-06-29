"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck, LogOut, User as UserIcon, Bell, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { MobileMenuButton } from "@/components/layout/mobile-buttons";

const roleDisplay: Record<string, string> = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
  student: "Thành viên",
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
      <header className="h-[72px] bg-background/80 backdrop-blur-2xl border-b border-border/40 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 gap-4 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] w-full transition-all duration-300 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:via-transparent before:to-transparent before:pointer-events-none">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 relative z-10">
          {onMenuClick && (
            <div className="lg:hidden flex items-center">
              <MobileMenuButton onClick={onMenuClick} />
            </div>
          )}
          <Link href="/" className="hidden lg:flex items-center group relative">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/logo-nav.png"
              alt="SAGA Logo"
              width={240}
              height={72}
              priority
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 relative z-10"
              style={{ width: "auto" }}
            />
          </Link>
          <div className="h-8 w-px bg-border/40 hidden lg:block mx-2" />
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-2xl px-2 hidden md:flex items-center relative z-10">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Tìm kiếm lớp học, sinh viên, tài liệu..."
              className="w-full pl-10 bg-primary/5 border-transparent hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-background transition-all duration-300 rounded-full h-11 shadow-sm text-[15px]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex items-center gap-1.5 opacity-60 group-focus-within:opacity-100 transition-opacity">
              <kbd className="inline-flex h-6 items-center gap-1 rounded-md border border-border/50 bg-background/50 px-2 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
                <Command size={12} /> K
              </kbd>
            </div>
          </div>
        </div>
        <div className="flex-1 md:hidden" />

        {/* Right side: Notifications + Theme toggle + User Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 relative z-10">

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full relative bg-muted/30 hover:bg-muted/80 border border-transparent hover:border-border/50 transition-all duration-300 hover:scale-105"
            aria-label="Thông báo"
            onClick={() => toast.info("Tính năng thông báo đang được phát triển")}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse shadow-[0_0_8px_rgba(243,24,66,0.8)]"></span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full relative bg-muted/30 hover:bg-muted/80 border border-transparent hover:border-border/50 transition-all duration-300 hover:scale-105"
            aria-label="Thay đổi giao diện"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="relative h-5 w-5 flex items-center justify-center">
              <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
            </div>
          </Button>

          <div className="h-6 w-px bg-border/40 mx-2 hidden sm:block" />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1 sm:pl-4 sm:pr-1 gap-3 rounded-full hover:bg-primary/5 cursor-pointer border border-transparent hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="text-right hidden sm:block transition-transform duration-300 group-hover:-translate-x-1">
                  <p className="text-sm font-bold text-foreground leading-tight flex justify-end items-center gap-1.5">
                    {user?.role === "admin" && (
                      <ShieldCheck size={14} className="text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                    )}
                    {user?.name ?? "Khách"}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
                  </p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-background shadow-md ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src="" alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-black text-sm">
                    {user?.avatarInitials ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-2xl border-border/40 bg-background/95 backdrop-blur-xl p-2 animate-in slide-in-from-top-2">
              <DropdownMenuLabel className="font-black text-xs text-muted-foreground uppercase tracking-widest px-3 pt-2 pb-1">Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40 my-2" />
              <DropdownMenuItem
                className="cursor-pointer rounded-xl font-medium px-3 py-2.5 transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                onClick={() => setIsProfileOpen(true)}
              >
                <UserIcon className="mr-3 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/40 my-2" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/30 rounded-xl px-3 py-2.5 transition-colors group"
              >
                <LogOut className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
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
