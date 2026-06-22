"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Network,
  Activity,
  Calendar,
  Users,
  Settings,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-full bg-white text-slate-700">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-lg font-bold text-slate-800">Lê Hoàng Hải</h1>
        <p className="text-sm text-slate-500">Sinh viên</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavItem
          href="/dashboard"
          icon={<BarChart3 size={20} />}
          label="Tổng quan lớp"
          active={pathname === "/dashboard" || pathname === "/"}
          onClick={onClose}
        />
        <NavItem
          href="/interaction-graph"
          icon={<Network size={20} />}
          label="Mạng tương tác"
          active={pathname === "/interaction-graph"}
          onClick={onClose}
        />
        <NavItem
          href="/heatmap"
          icon={<Activity size={20} />}
          label="Heatmap hoạt động"
          active={pathname === "/heatmap"}
          onClick={onClose}
        />
        <NavItem
          href="/burndown"
          icon={<Calendar size={20} />}
          label="Tiến độ Task"
          active={pathname === "/burndown"}
          onClick={onClose}
        />
        <NavItem
          href="/contribution"
          icon={<Users size={20} />}
          label="Đóng góp cá nhân"
          active={pathname === "/contribution"}
          onClick={onClose}
        />
      </nav>

      <div className="p-4 border-t border-slate-100">
        <NavItem
          href="/settings"
          icon={<Settings size={20} />}
          label="Cài đặt"
          active={pathname === "/settings"}
          onClick={onClose}
        />
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
          ? "bg-orange-50 text-orange-600"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      <span className="text-[15px]">{label}</span>
    </Link>
  );
}
