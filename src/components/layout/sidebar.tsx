"use client";

import { useState, useEffect } from "react";
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
  FileText,
  GraduationCap,
  Share2,
  Logs,
  Link2,
  Inbox,
  UserCheck,
  CalendarX,
  LogOut,
  ChevronRight,
  Database
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SidebarProps {
  onClose?: () => void;
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type NavGroup = {
  title: string;
  items: NavItemType[];
};

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [hasStudentSelection, setHasStudentSelection] = useState(false);

  useEffect(() => {
    const checkSelection = () => {
      setHasStudentSelection(!!localStorage.getItem("saga-student-class"));
    };
    checkSelection();
    window.addEventListener("saga-student-class-changed", checkSelection);
    return () => {
      window.removeEventListener("saga-student-class-changed", checkSelection);
    };
  }, []);

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
              { href: "/admin/system-logs", icon: <Logs size={18} />, label: "Nhật ký hệ thống" },
              { href: "/admin/guide", icon: <BookOpen size={18} />, label: "Hướng dẫn" },
            ]
          }
        ];
      case "lecturer":
        if (classId) {
          return [
            {
              title: "Điều hướng",
              items: [
                { href: "/lecturer", icon: <ArrowLeft size={18} />, label: "Chọn lớp khác" },
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
              title: "Học tập & Đánh giá",
              items: [
                { href: `/lecturer/${classId}/assignments`, icon: <FileText size={18} />, label: "Bài tập" },
                { href: `/lecturer/${classId}/grades`, icon: <GraduationCap size={18} />, label: "Điểm số" },
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
        const studentGroups: NavGroup[] = [];
        
        if (hasStudentSelection) {
          studentGroups.push({
            title: "Điều hướng",
            items: [
              {
                href: "/student",
                icon: <ArrowLeft size={18} />,
                label: "Đổi môn học khác",
                onClick: (e) => {
                  e.preventDefault();
                  localStorage.removeItem("saga-student-semester");
                  localStorage.removeItem("saga-student-class");
                  window.dispatchEvent(new Event("saga-student-class-changed"));
                  router.push("/student");
                }
              }
            ]
          });
        }
        
        studentGroups.push(
          {
            title: "Cá nhân & Nhóm",
            items: [
              { href: "/student", icon: <BarChart3 size={18} />, label: "Tổng quan nhóm" },
              { href: "/student/burndown", icon: <Calendar size={18} />, label: "Tiến độ Task" },
              { href: "/student/contribution", icon: <Users size={18} />, label: "Đóng góp cá nhân" },
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
            title: "Cài đặt",
            items: [
              { href: "/student/settings", icon: <Link2 size={18} />, label: "Kết nối tài khoản" },
            ]
          }
        );
        return studentGroups;
      default:
        return [];
    }
  };

  const navGroups = getNavGroups();

  return (
    <aside className="flex flex-col h-full bg-background/80 backdrop-blur-2xl text-card-foreground border-r border-border/40 transition-all duration-300 relative z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      {/* Decorative Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />

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
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <h4 className="px-3 text-[11px] font-black text-muted-foreground/50 uppercase tracking-widest select-none">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href || (item.href !== '/admin' && item.href !== '/lecturer' && item.href !== '/student' && pathname.startsWith(item.href))}
                  onClick={(e) => {
                    if (item.onClick) {
                      item.onClick(e);
                    }
                    if (onClose) onClose();
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-border/40 relative z-10 bg-background/50 backdrop-blur-md">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group font-medium"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px]">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium overflow-hidden ${
        active
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
      <span className="text-[14px] relative z-10 transition-colors duration-300">{label}</span>
      
      {/* Subtle chevron icon for non-active hover state */}
      {!active && (
        <ChevronRight size={14} className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/50" />
      )}
    </Link>
  );
}
