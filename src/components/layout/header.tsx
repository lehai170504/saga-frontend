"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck, LogOut, User as UserIcon, Bell, Search, Command, MessageSquare, GitBranch, Compass, Check } from "lucide-react";
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

  // State quản lý thông báo
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "GitHub Commits mới",
      description: "Nguyễn Văn An đã đẩy 3 commits lên nhánh main",
      time: "2 phút trước",
      type: "github",
      read: false,
    },
    {
      id: "2",
      title: "Cảnh báo trễ hạn",
      description: "Bạn có 2 tasks Jira sắp trễ hạn trong Sprint 3",
      time: "15 phút trước",
      type: "jira",
      read: false,
    },
    {
      id: "3",
      title: "Nhận xét mới",
      description: "Giảng viên Dr. Nguyen Van A đã phản hồi báo cáo tiến độ",
      time: "1 giờ trước",
      type: "feedback",
      read: true,
    },
    {
      id: "4",
      title: "Đơn báo cáo vắng mặt",
      description: "Đơn báo cáo vắng mặt Slot 3 ngày 2026-06-28 đã được duyệt",
      time: "1 ngày trước",
      type: "absence",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Đã đánh dấu tất cả thông báo là đã đọc!");
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full relative bg-muted/30 hover:bg-muted/80 border border-transparent hover:border-border/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                aria-label="Thông báo"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse shadow-[0_0_8px_rgba(243,24,66,0.8)]"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-[360px] rounded-[2rem] p-3 border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Bell size={13} className="text-primary animate-pulse" />
                  Thông báo
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </span>
                
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-primary hover:underline cursor-pointer"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-0.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.map((notif) => {
                    let iconBg = "bg-purple-500/10 text-purple-500";
                    let icon = <GitBranch size={13} />;
                    
                    if (notif.type === "jira") {
                      iconBg = "bg-sky-500/10 text-sky-500";
                      icon = <Compass size={13} />;
                    } else if (notif.type === "feedback") {
                      iconBg = "bg-amber-500/10 text-amber-500";
                      icon = <MessageSquare size={13} />;
                    } else if (notif.type === "absence") {
                      iconBg = "bg-emerald-500/10 text-emerald-500";
                      icon = <Check size={13} />;
                    }

                    return (
                      <DropdownMenuItem 
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-colors border border-transparent outline-none focus:bg-muted/40 ${
                          notif.read ? "opacity-75 hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10 border-primary/10"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                          {icon}
                        </div>
                        
                        <div className="flex-1 space-y-0.5 text-left min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className={`text-xs truncate ${notif.read ? "font-bold text-foreground/80" : "font-black text-foreground"}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-bold text-muted-foreground shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                            {notif.description}
                          </p>
                        </div>
                        
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 self-center" />
                        )}
                      </DropdownMenuItem>
                    );
                  })
                )}
              </div>

              <DropdownMenuSeparator className="bg-border/40 my-2" />
              
              <DropdownMenuItem 
                onClick={() => router.push(user?.role === "student" ? "/student/audit-logs" : "/lecturer")}
                className="justify-center text-center text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer py-2 rounded-xl focus:bg-muted/40 outline-none"
              >
                Xem tất cả nhật ký
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
