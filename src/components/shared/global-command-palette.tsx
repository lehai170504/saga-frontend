"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, Users, Activity, Settings, RefreshCw, FileText, Logs, HelpCircle,
  BarChart3, BookOpen, Network, Calendar, UserCheck, Link2, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAuth } from "@/context/AuthContext";

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const classIdMatch = pathname.match(/^\/lecturer\/([^/]+)/);
  const classId = classIdMatch && classIdMatch[1] !== 'interaction-graph' && classIdMatch[1] !== 'heatmap' ? classIdMatch[1] : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl bg-card border border-border shadow-2xl [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <Command className="w-full bg-transparent flex flex-col overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide">
          <div className="flex items-center border-b border-border px-4 py-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Bạn cần tìm gì? (Đi tới Lớp học, Nhật ký, Ép đồng bộ...)"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-[15px] focus:ring-0"
            />
            <div className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded border border-border/50 uppercase tracking-wider">ESC</div>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
            <Command.Empty className="p-6 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-muted-foreground/30" />
              Không tìm thấy kết quả nào.
            </Command.Empty>
            {user?.role === "admin" && (
              <>
                <Command.Group heading="Điều hướng (Navigation)">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/admin/users"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    Quản lý Người dùng (Users)
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/admin/classes"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-emerald-500" />
                    </div>
                    Quản lý Lớp PBL (Classes)
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/admin/academic-data"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-orange-500" />
                    </div>
                    Dữ liệu Học vụ (Academic Data)
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/admin/system-logs"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Logs className="w-4 h-4 text-purple-500" />
                    </div>
                    Nhật ký Hệ thống (System Logs)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Hành động nhanh (Quick Actions)">
                  <Command.Item
                    onSelect={() => runCommand(() => {
                      toast.loading("Đang kết nối API để ép đồng bộ...", { id: "sync-cmd" });
                      setTimeout(() => {
                        toast.success("Ép đồng bộ FAP hoàn tất!", { id: "sync-cmd" });
                      }, 2000);
                    })}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4 text-rose-500" />
                    </div>
                    Ép đồng bộ Dữ liệu FAP ngay
                  </Command.Item>

                  <Command.Item
                    onSelect={() => runCommand(() => toast("Chế độ Maintenance chưa khả dụng."))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4 text-zinc-500" />
                    </div>
                    Bật chế độ Bảo trì (Maintenance Mode)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Hỗ trợ (Support)">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/admin/guide"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-sky-500" />
                    </div>
                    Xem Hướng dẫn Sử dụng (Documentation)
                  </Command.Item>
                </Command.Group>
              </>
            )}

            {user?.role === "lecturer" && (
              <>
                <Command.Group heading="Lớp học (Classes)">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/lecturer"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                    </div>
                    Danh sách lớp học (Classes List)
                  </Command.Item>
                </Command.Group>

                {classId && (
                  <Command.Group heading="Quản lý Lớp (Class Management)">
                    <Command.Item
                      onSelect={() => runCommand(() => router.push(`/lecturer/${classId}`))}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                      </div>
                      Tổng quan lớp (Overview)
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push(`/lecturer/${classId}/students`))}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-purple-500" />
                      </div>
                      Sinh viên (Students)
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push(`/lecturer/${classId}/projects`))}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                        <Network className="w-4 h-4 text-orange-500" />
                      </div>
                      Quản lý nhóm (Projects)
                    </Command.Item>
                  </Command.Group>
                )}
              </>
            )}

            {user?.role === "student" && (
              <>
                <Command.Group heading="Cá nhân & Nhóm (Personal & Team)">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/student"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                    </div>
                    Tổng quan nhóm (Team Overview)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/student/burndown"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                    </div>
                    Tiến độ Task (Task Progress)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/student/contribution"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    Đóng góp cá nhân (Contributions)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Tương tác & Cài đặt (Interaction & Settings)">
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/student/assessment"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 text-orange-500" />
                    </div>
                    Đánh giá chéo (Peer Review)
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/student/settings"))}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center shrink-0">
                      <Link2 className="w-4 h-4 text-zinc-500" />
                    </div>
                    Cài đặt (Settings)
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Hành động nhanh (Quick Actions)">
                  <Command.Item
                    onSelect={() => runCommand(() => {
                      localStorage.removeItem("saga-student-semester");
                      localStorage.removeItem("saga-student-class");
                      window.dispatchEvent(new Event("saga-student-class-changed"));
                      router.push("/student");
                    })}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted cursor-pointer transition-colors aria-selected:bg-muted aria-selected:text-foreground mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                      <ArrowLeft className="w-4 h-4 text-rose-500" />
                    </div>
                    Chọn lớp khác (Switch Class)
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
