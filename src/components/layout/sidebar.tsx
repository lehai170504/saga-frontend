"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNavigationConfig } from "@/config/navigation";
import { useCourse } from "@/features/courses/hooks/useCourses";


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
  ADMIN: "Quản trị viên",
  LECTURER: "Giảng viên",
  STUDENT: "Thành viên",
};



export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // 1. Xác định courseId từ URL
  const lecturerCourseIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
  const studentCourseIdMatch = pathname.match(/^\/student\/([^/]+)/);
  const courseId = (lecturerCourseIdMatch ? lecturerCourseIdMatch[1] : null) ||
    (studentCourseIdMatch && studentCourseIdMatch[1] !== "settings" ? studentCourseIdMatch[1] : null);

  // 2. Fetch course data
  const { data: course } = useCourse(courseId || "");

  // 3. Khởi tạo navigation
  const navGroups = getNavigationConfig(user?.applicationRole || "", courseId, course?.academicClass?.name || course?.courseCode);

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
              <AvatarImage src={user?.avatarUrl ?? "https://ui-avatars.com/api/?name=User&background=random"} alt={user?.fullName ?? "User"} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {user?.fullName?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-bold text-sm text-foreground truncate">
                {user?.fullName ?? "Khách"}
              </p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                {user?.applicationRole === "ADMIN" && (
                  <ShieldCheck size={12} className="text-success" />
                )}
                {user?.applicationRole ? roleDisplay[user.applicationRole] : "Chưa xác định"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar relative z-10">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${groupIndex * 100}ms` }}>
              {!isCollapsed && (
                <h4 className="px-3 text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest select-none">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.href !== "#" && (
                    item.exact
                      ? pathname === item.href
                      : (pathname === item.href || pathname.startsWith(`${item.href}/`) || (item.matchPaths && item.matchPaths.some(p => pathname.startsWith(p))))
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
        </div>

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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-primary rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)] dark:shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
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
