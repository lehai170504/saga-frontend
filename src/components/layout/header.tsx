"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/context/FilterContext";
import { useAuth } from "@/context/AuthContext";

const roleDisplay = {
  admin: "Quản trị viên",
  lecturer: "Giảng viên",
  student_leader: "Trưởng nhóm",
  student: "Thành viên",
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const { selectedGroup, setSelectedGroup, selectedSprint, setSelectedSprint } =
    useFilter();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-card border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/" className="hidden lg:block">
          <Image
            src="/logo-nav.png"
            alt="SAGA Logo"
            width={240}
            height={72}
            priority
            className="w-36 h-auto"
          />
        </Link>
        <div className="h-6 w-px bg-border hidden lg:block" />
      </div>

      {/* Global Filters */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {/* Chi hien thi chon Nhom cho Admin hoac Giang vien */}
        {(user?.role === "admin" || user?.role === "lecturer") && (
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[130px] h-9 text-xs font-medium bg-background border-border">
              <SelectValue placeholder="Chọn nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pbl-07">Nhóm PBL-07</SelectItem>
              <SelectItem value="pbl-08">Nhóm PBL-08</SelectItem>
              <SelectItem value="pbl-09">Nhóm PBL-09</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Tat ca deu duoc chon Sprint */}
        <Select value={selectedSprint} onValueChange={setSelectedSprint}>
          <SelectTrigger className="w-[120px] h-9 text-xs font-medium bg-background border-border">
            <SelectValue placeholder="Chọn Sprint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sprint-1">Sprint 1</SelectItem>
            <SelectItem value="sprint-2">Sprint 2</SelectItem>
            <SelectItem value="sprint-3">Sprint 3</SelectItem>
            <SelectItem value="sprint-4">Sprint 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Right side: Theme toggle + User */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Chuyển đổi giao diện"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-foreground leading-tight flex justify-end items-center gap-1">
            {user?.role === "admin" && (
              <ShieldCheck size={14} className="text-emerald-500" />
            )}
            {user?.name ?? "Khách"}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.role ? roleDisplay[user.role] : "Chưa xác định"}
          </p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src="" alt={user?.name ?? "User"} />
          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-sm dark:bg-orange-900/40 dark:text-orange-400">
            {user?.avatarInitials ?? "?"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
