import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { GitCommit, MessageSquare, CheckCircle2 } from "lucide-react";

interface DrillDownDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
  date: string | null;
}

export function DrillDownDrawer({ open, onClose, date }: DrillDownDrawerProps) {
  // Dữ liệu giả lập cho Drawer
  const mockDetails = [
    {
      id: 1,
      type: "commit",
      user: "Minh Anh",
      action: "feat: update heatmap UI integration",
      time: "10:30 AM",
      icon: <GitCommit className="w-4 h-4 text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      id: 2,
      type: "comment",
      user: "Hoang Long",
      action: "Đã review và approve PR #45",
      time: "14:15 PM",
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      id: 3,
      type: "task",
      user: "Thu Hien",
      action: "Hoàn thành SAGA-102: API Setup",
      time: "16:45 PM",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-50",
    },
  ];

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] bg-background flex flex-col outline-none">
        <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col">
          <DrawerHeader className="bg-card border-b border-border pb-6 pt-8 rounded-t-xl px-6">
            <DrawerTitle className="text-2xl font-extrabold text-foreground text-left">
              Chi tiết hoạt động
            </DrawerTitle>
            <DrawerDescription className="text-sm font-medium text-muted-foreground mt-1 text-left">
              Dữ liệu tổng hợp ngày {date || "đang chọn"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="bg-card rounded-2xl border border-border p-2 shadow-sm">
              {mockDetails.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors ${
                    index !== mockDetails.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-full shrink-0 mt-0.5 ${item.bg}`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm truncate">
                        {item.user}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground shrink-0">
                        • {item.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
