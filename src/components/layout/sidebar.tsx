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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white flex flex-col hidden md:flex">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-indigo-600">SAGA</h1>
        <p className="text-sm text-slate-500">Continuous Assessment</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          href="/"
          icon={<BarChart3 size={20} />}
          label="Tổng quan lớp"
          active={pathname === "/"}
        />
        <NavItem
          href="/interaction-graph"
          icon={<Network size={20} />}
          label="Mạng tương tác"
          active={pathname === "/interaction-graph"}
        />
        <NavItem
          href="/heatmap"
          icon={<Activity size={20} />}
          label="Heatmap hoạt động"
          active={pathname === "/heatmap"}
        />
        <NavItem
          href="/burndown"
          icon={<Calendar size={20} />}
          label="Tiến độ Task"
          active={pathname === "/burndown"}
        />
        <NavItem
          href="/contribution"
          icon={<Users size={20} />}
          label="Đóng góp cá nhân"
          active={pathname === "/contribution"}
        />
      </nav>
      <div className="p-4 border-t">
        <NavItem
          href="/settings"
          icon={<Settings size={20} />}
          label="Cài đặt"
          active={pathname === "/settings"}
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-600 font-medium"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
