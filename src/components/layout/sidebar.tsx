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
  AlertTriangle,
  TrendingDown,
  Clock,
  Logs,
  Link2,
  UserCheck,
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

const roleDisplay = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
  student: "Thành viên",
};

export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
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
        ];
      case "lecturer":
        if (classId) {
          return [
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
            {
              href: `/lecturer/${classId}/risks`,
              icon: <AlertTriangle size={18} />,
              label: "Cảnh báo rủi ro",
            },
            {
              href: `/lecturer/${classId}/burndown`,
              icon: <TrendingDown size={18} />,
              label: "Tiến độ Sprint",
            },
            {
              href: `/lecturer/${classId}/timeline`,
              icon: <Clock size={18} />,
              label: "Nhật ký hoạt động",
            },
          ];
        }
        return [];
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
            href: "/student/assessment",
            icon: <UserCheck size={18} />,
            label: "Đánh giá thành viên",
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const classIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
  const classId = classIdMatch && classIdMatch[1] !== 'interaction-graph' && classIdMatch[1] !== 'heatmap' ? classIdMatch[1] : null;

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="relative flex flex-col h-full bg-card text-card-foreground">
        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40 dark:hover:text-orange-400 shadow-md z-50 transition-colors cursor-pointer hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Profile Display */}
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
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="mb-4 px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Menu Quản lý
            </div>
          )}
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              onClick={onClose}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto p-3 border-t border-border space-y-1">
          {user?.role === "lecturer" && classId && (
            <NavItem
              href="/lecturer"
              icon={<ArrowLeft size={18} />}
              label="Chọn lớp khác"
              onClick={onClose}
              isCollapsed={isCollapsed}
            />
          )}
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}) {
  const linkContent = (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${active
        ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="text-[14px] truncate">{label}</span>}
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
