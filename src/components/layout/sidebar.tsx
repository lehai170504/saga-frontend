"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Network,
  Activity,
  Calendar,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/");
    onClose?.();
  };

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          {
            href: "/admin",
            icon: <BarChart3 size={18} />,
            label: "Tổng quan hệ thống",
          },
          {
            href: "/admin/settings",
            icon: <Settings size={18} />,
            label: "Cài đặt & Tích hợp",
          },
        ];
      case "lecturer":
        return [
          {
            href: "/lecturer",
            icon: <BarChart3 size={18} />,
            label: "Tổng quan lớp",
          },
          {
            href: "/lecturer/interaction-graph",
            icon: <Network size={18} />,
            label: "Mạng tương tác",
          },
          {
            href: "/lecturer/heatmap",
            icon: <Activity size={18} />,
            label: "Heatmap hoạt động",
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
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="flex flex-col h-full bg-card text-card-foreground">
      <div className="p-5 border-b border-border">
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

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

      <div className="p-4 border-t border-border space-y-1">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span className="text-[15px]">Đăng xuất</span>
        </Button>
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
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${
        active
          ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[15px]">{label}</span>
    </Link>
  );
}
