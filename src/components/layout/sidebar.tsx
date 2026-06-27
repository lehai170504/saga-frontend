"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  onClose?: () => void;
}

const roleDisplay = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
  student: "Thành viên",
};

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const getNavItems = () => {
    if (!user) return [];

    const classIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
    const classId = classIdMatch && classIdMatch[1] !== 'interaction-graph' && classIdMatch[1] !== 'heatmap' ? classIdMatch[1] : null;

    switch (user.role) {
      case "admin":
        return [
          {
            href: "/admin",
            icon: <BarChart3 size={18} />,
            label: "Tổng quan hệ thống",
          },
          {
            href: "/admin/users",
            icon: <Users size={18} />,
            label: "Quản lý Người dùng",
          },
          {
            href: "/admin/academic-data",
            icon: <Calendar size={18} />,
            label: "Quản lý Dữ liệu Học vụ",
          },
          {
            href: "/admin/classes",
            icon: <Network size={18} />,
            label: "Quản lý Lớp PBL",
          },
          {
            href: "/admin/system-logs",
            icon: <Logs size={18} />,
            label: "Nhật ký hệ thống",
          },
          {
            href: "/admin/guide",
            icon: <BookOpen size={18} />,
            label: "Hướng dẫn sử dụng",
          },
        ];
      case "lecturer":
        if (classId) {
          return [
            {
              href: "/lecturer",
              icon: <ArrowLeft size={18} />,
              label: "Chọn lớp khác",
            },
            {
              href: `/lecturer/${classId}`,
              icon: <BarChart3 size={18} />,
              label: "Tổng quan lớp",
            },
            {
              href: `/lecturer/${classId}/students`,
              icon: <Users size={18} />,
              label: "Quản lý sinh viên",
            },
            {
              href: `/lecturer/${classId}/assignments`,
              icon: <FileText size={18} />,
              label: "Quản lý bài tập",
            },
            {
              href: `/lecturer/${classId}/projects`,
              icon: <Network size={18} />,
              label: "Quản lý nhóm",
            },
            {
              href: `/lecturer/${classId}/grades`,
              icon: <GraduationCap size={18} />,
              label: "Quản lý điểm số",
            },
            {
              href: `/lecturer/${classId}/interaction-graph`,
              icon: <Share2 size={18} />,
              label: "Mạng tương tác",
            },
            {
              href: `/lecturer/${classId}/heatmap`,
              icon: <Activity size={18} />,
              label: "Biểu đồ nhiệt hoạt động",
            },
          ];
        }
        return [
          {
            href: "/lecturer",
            icon: <BookOpen size={18} />,
            label: "Danh sách lớp học",
          },
        ];
      case "student_leader":
      case "student":
        return [
          {
            href: "/student",
            icon: <BarChart3 size={18} />,
            label: "Tổng quan nhóm",
          },
          {
            href: "/student/burndown",
            icon: <Calendar size={18} />,
            label: "Tiến độ Task",
          },
          {
            href: "/student/contribution",
            icon: <Users size={18} />,
            label: "Đóng góp cá nhân",
          },
          {
            href: "/student/settings",
            icon: <Link2 size={18} />,
            label: "Kết nối tài khoản",
          },
          {
            href: "/student/feedback",
            icon: <Inbox size={18} />,
            label: "Hộp thư nhận xét",
          },
          {
            href: "/student/assessment",
            icon: <UserCheck size={18} />,
            label: "Đánh giá thành viên",
          },
          {
            href: "/student/absence",
            icon: <CalendarX size={18} />,
            label: "Báo cáo vắng & trễ",
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="flex flex-col h-full bg-card text-card-foreground border-r border-border">
      {/* Mobile Profile Display (Optional, can hide on desktop if header handles it) */}
      <div className="p-5 border-b border-border lg:hidden">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold dark:bg-orange-900/40 dark:text-orange-400">
              {user?.avatarInitials ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground truncate">
              {user?.name ?? "Khách"}
            </p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              {user?.role === "admin" && (
                <ShieldCheck size={12} className="text-emerald-500" />
              )}
              {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Menu Quản lý
        </div>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            onClick={onClose}
          />
        ))}
      </nav>
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
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${active
        ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
    >
      {icon}
      <span className="text-[15px]">{label}</span>
    </Link>
  );
}
