"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck, LogOut, User as UserIcon, Bell, Search } from "lucide-react";
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
      <header className="h-16 border-b bg-card/80 backdrop-blur-md border-border flex items-center justify-between px-2 sm:px-6 sticky top-0 z-40 gap-2 sm:gap-4 shadow-sm w-full">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {onMenuClick && (
            <div className="lg:hidden flex items-center">
              <MobileMenuButton onClick={onMenuClick} />
            </div>
          )}
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

        {/* Global Search */}
        <div className="flex-1 max-w-2xl px-2 hidden md:flex items-center">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Tìm kiếm lớp học, sinh viên, tài liệu... (Ctrl+K)"
              className="w-full pl-9 bg-muted/40 border-transparent hover:bg-muted/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all rounded-full h-10 shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
        <div className="flex-1 md:hidden" />

        {/* Right side: Notifications + Theme toggle + User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full relative hover:bg-muted"
            aria-label="Thông báo"
            onClick={() => toast.info("Tính năng thông báo đang được phát triển")}
          >
            <Bell className="h-[18px] w-[18px] text-muted-foreground" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse"></span>
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Chuyển đổi giao diện"
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
          </Button>

          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1 sm:pl-3 gap-3 rounded-full hover:bg-accent cursor-pointer border border-transparent hover:border-border/50 transition-all"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-foreground leading-tight flex justify-end items-center gap-1.5">
                    {user?.role === "admin" && (
                      <ShieldCheck size={14} className="text-emerald-500" />
                    )}
                    {user?.name ?? "Khách"}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
                  </p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-border/50">
                  <AvatarImage src="" alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {user?.avatarInitials ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/50">
              <DropdownMenuLabel className="font-bold">Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer rounded-md font-medium"
                onClick={() => setIsProfileOpen(true)}
              >
                <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Hồ sơ cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer font-bold text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-950/30 rounded-md"
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
