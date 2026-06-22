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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SidebarProps {
  onClose?: () => void;
}

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

  return (
    <aside className="flex flex-col h-full bg-card text-card-foreground">
      {/* User Profile Section */}
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
            <p className="text-xs text-muted-foreground truncate">
              {user?.role === "instructor" ? "Giảng viên" : user?.group ?? "Sinh viên"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem
          href="/dashboard"
          icon={<BarChart3 size={18} />}
          label="Tổng quan"
          active={pathname === "/dashboard" || pathname === "/"}
          onClick={onClose}
        />
        <NavItem
          href="/interaction-graph"
          icon={<Network size={18} />}
          label="Mạng tương tác"
          active={pathname === "/interaction-graph"}
          onClick={onClose}
        />
        <NavItem
          href="/heatmap"
          icon={<Activity size={18} />}
          label="Heatmap hoạt động"
          active={pathname === "/heatmap"}
          onClick={onClose}
        />
        <NavItem
          href="/burndown"
          icon={<Calendar size={18} />}
          label="Tiến độ Task"
          active={pathname === "/burndown"}
          onClick={onClose}
        />
        <NavItem
          href="/contribution"
          icon={<Users size={18} />}
          label="Đóng góp cá nhân"
          active={pathname === "/contribution"}
          onClick={onClose}
        />
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="p-4 border-t border-border space-y-1">
        <NavItem
          href="/settings"
          icon={<Settings size={18} />}
          label="Cài đặt"
          active={pathname === "/settings"}
          onClick={onClose}
        />
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium ${active
          ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
    >
      {icon}
      <span className="text-[15px]">{label}</span>
    </Link>
  );
}
