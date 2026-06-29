"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Network,
  Activity,
  Calendar,
  Users,
  ShieldCheck,
  ArrowLeft,
  BookOpen,

  GraduationCap,
  Share2,



  Logs,
  Link2,
  Inbox,
  UserCheck,
  CalendarX,
  LogOut,
  Settings2,
  Database,
  FolderKanban
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const roleDisplay: Record<string, string> = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student: "Thành viên",
};

type NavItemType = {
  href: string;
  icon: React.ReactNode;
  label: string;
  action?: (e: React.MouseEvent) => void;
  hideChevron?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItemType[];
};

export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [studentClassId, setStudentClassId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "student") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStudentClassId(localStorage.getItem("saga-student-class"));

      const handleClassChange = () => {
        setStudentClassId(localStorage.getItem("saga-student-class"));
      };

      window.addEventListener("saga-student-class-changed", handleClassChange);
      return () => window.removeEventListener("saga-student-class-changed", handleClassChange);
    }
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getNavGroups = (): NavGroup[] => {
    if (!user) return [];

    const classIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
    const classId = classIdMatch && classIdMatch[1] !== 'interaction-graph' && classIdMatch[1] !== 'heatmap' ? classIdMatch[1] : null;

    switch (user.role) {
      case "admin":
        return [
          {
            title: "Tổng quan",
            items: [
              { href: "/admin", icon: <BarChart3 size={18} />, label: "Dashboard" },
            ]
          },
          {
            title: "Quản lý Cốt lõi",
            items: [
              { href: "/admin/users", icon: <Users size={18} />, label: "Người dùng" },
              { href: "/admin/academic-data", icon: <Database size={18} />, label: "Dữ liệu Học vụ" },
              { href: "/admin/classes", icon: <Network size={18} />, label: "Lớp PBL" },
            ]
          },
          {
            title: "Hệ thống",
            items: [
              { href: "/admin/evaluation-config", icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
              { href: "/admin/system-logs", icon: <Logs size={18} />, label: "Nhật ký hệ thống" },
              { href: "/admin/guide", icon: <BookOpen size={18} />, label: "Hướng dẫn" },
            ]
          }
        ];
      case "lecturer":
        if (classId) {
          return [
            {
              title: `Đang xem: LỚP ${classId.toUpperCase()}`,
              items: [
                { href: "/lecturer", icon: <ArrowLeft size={18} />, label: "Chọn lớp khác", hideChevron: true },
              ]
            },
            {
              title: "Quản lý Lớp học",
              items: [
                { href: `/lecturer/${classId}`, icon: <BarChart3 size={18} />, label: "Tổng quan lớp" },
                { href: `/lecturer/${classId}/students`, icon: <Users size={18} />, label: "Sinh viên" },
                { href: `/lecturer/${classId}/projects`, icon: <Network size={18} />, label: "Quản lý nhóm" },
              ]
            },
            {
              title: "Đánh giá & Điểm số",
              items: [
                { href: `/lecturer/${classId}/evaluation-config`, icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
                { href: `/lecturer/${classId}/grades`, icon: <GraduationCap size={18} />, label: "Bảng điểm tổng hợp" },
              ]
            },
            {
              title: "AI & Phân tích Đồ thị",
              items: [
                { href: `/lecturer/${classId}/interaction-graph`, icon: <Share2 size={18} />, label: "Mạng tương tác" },
                { href: `/lecturer/${classId}/heatmap`, icon: <Activity size={18} />, label: "Biểu đồ nhiệt" },
              ]
            }
          ];
        }
        return [
          {
            title: "Tổng quan",
            items: [
              { href: "/lecturer", icon: <BookOpen size={18} />, label: "Danh sách lớp học" },
            ]
          }
        ];
      case "student":
        const handleStudentSwitchClass = (e?: React.MouseEvent) => {
          e?.preventDefault();
          localStorage.removeItem("saga-student-semester");
          localStorage.removeItem("saga-student-class");
          window.dispatchEvent(new Event("saga-student-class-changed"));
          router.push("/student");
        };

        return [
          {
            title: studentClassId ? `Đang xem: LỚP ${studentClassId.toUpperCase()}` : "Điều hướng",
            items: [
              { href: "#", icon: <ArrowLeft size={18} />, label: "Chọn lớp khác", action: handleStudentSwitchClass, hideChevron: true },
            ]
          },
          {
            title: "Cá nhân & Nhóm",
            items: [
              { href: "/student", icon: <BarChart3 size={18} />, label: "Tổng quan nhóm" },
              { href: "/student/projects", icon: <Network size={18} />, label: "Danh sách nhóm" },
              { href: "/student/projects/create", icon: <FolderKanban size={18} />, label: "Cấu hình Project" },
              { href: "/student/burndown", icon: <Calendar size={18} />, label: "Tiến độ Task" },
              { href: "/student/contribution", icon: <Users size={18} />, label: "Đóng góp cá nhân" },
              { href: "/student/audit-logs", icon: <Logs size={18} />, label: "Nhật ký hoạt động" },
            ]
          },
          {
            title: "Tương tác",
            items: [
              { href: "/student/assessment", icon: <UserCheck size={18} />, label: "Đánh giá chéo" },
              { href: "/student/feedback", icon: <Inbox size={18} />, label: "Nhận xét" },
              { href: "/student/absence", icon: <CalendarX size={18} />, label: "Báo cáo vắng" },
            ]
          },
          {
            title: "AI & Phân tích Đồ thị",
            items: [
              { href: "/student/interaction-graph", icon: <Share2 size={18} />, label: "Mạng tương tác" },
              { href: "/student/heatmap", icon: <Activity size={18} />, label: "Biểu đồ nhiệt" },
            ]
          },
          {
            title: "Cài đặt",
            items: [
              { href: "/student/settings", icon: <Link2 size={18} />, label: "Kết nối tài khoản" },
            ]
          }
        ];
      default:
        return [];
    }
  };

  const navGroups = getNavGroups();

  const classIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
  const classId = classIdMatch && classIdMatch[1] !== 'interaction-graph' && classIdMatch[1] !== 'heatmap' ? classIdMatch[1] : null;

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="flex flex-col h-full bg-background/80 backdrop-blur-2xl text-card-foreground border-r border-border/40 transition-all duration-300 relative z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        {/* Decorative Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />

        {/* Toggle Collapse Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 shadow-md z-50 transition-colors cursor-pointer hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}

        {/* Mobile Profile Display */}
        <div className="p-5 border-b border-border/40 lg:hidden relative z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {user?.avatarInitials ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-bold text-sm text-foreground truncate">
                {user?.name ?? "Khách"}
              </p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                {user?.role === "admin" && (
                  <ShieldCheck size={12} className="text-emerald-500" />
                )}
                {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              {!isCollapsed && (
                <h4 className="px-3 text-[11px] font-black text-muted-foreground/50 uppercase tracking-widest select-none">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.href !== "#" && (
                      item.href === '/admin' ||
                        item.href === '/lecturer' ||
                        item.href === '/student' ||
                        item.href === '/student/projects' ||
                        (classId && item.href === `/lecturer/${classId}`)
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(`${item.href}/`)
                    );

                  return (
                    <NavItem
                      key={item.label}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      active={isActive}
                      hideChevron={item.hideChevron}
                      onClick={(e) => {
                        if (item.action) item.action(e);
                        if (onClose) onClose();
                      }}
                      isCollapsed={isCollapsed}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-border/40 relative z-10 bg-background/50 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group font-medium`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-[14px]">Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  onClick,
  isCollapsed = false,
  hideChevron = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  hideChevron?: boolean;
}) {
  const linkContent = (
    <Link
      href={href}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      className={`group relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all duration-300 font-medium overflow-hidden ${active
        ? "text-primary bg-primary/10 shadow-sm"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`}
    >
      {/* Active Indicator Pill */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-primary rounded-r-full shadow-[0_0_8px_rgba(249,115,22,0.6)] dark:shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
      )}

      {/* Background Hover Sweep Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />

      {/* Icon Wrapper */}
      <div className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110 group-hover:text-primary"}`}>
        {icon}
      </div>

      {/* Label */}
      {!isCollapsed && <span className="text-[14px] relative z-10 transition-colors duration-300">{label}</span>}

      {/* Subtle chevron icon for non-active hover state */}
      {!active && !isCollapsed && !hideChevron && (
        <ChevronRight size={14} className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/50" />
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
