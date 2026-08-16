"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, ExternalLink, Calendar, Info, CheckCircle2, Link2, Key } from "lucide-react";
import { Notification } from "../types";
import { formatNotificationRelativeTime } from "../utils/formatTime";

interface NotificationDetailModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (actionUrl: string) => void;
}

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onNavigate,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const handleActionClick = () => {
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
    }
    onClose();
  };

  const formattedFullDate = (() => {
    try {
      return new Date(notification.createdAt).toLocaleString("vi-VN", {
        dateStyle: "full",
        timeStyle: "medium",
      });
    } catch {
      return notification.createdAt;
    }
  })();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Bell size={14} className="animate-pulse" />
            <span>Chi tiết Thông báo</span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-extrabold ml-auto">
              {notification.type || "SYSTEM"}
            </span>
          </div>
          <DialogTitle className="text-lg font-extrabold text-foreground leading-snug">
            {notification.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1 font-medium">
            <Calendar size={13} className="text-primary/70" />
            <span>{formatNotificationRelativeTime(notification.createdAt)} ({formattedFullDate})</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Full Message Text Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Info size={12} /> Nội dung thông báo đầy đủ
            </label>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-xs sm:text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto custom-scrollbar">
              {notification.message}
            </div>
          </div>

          {/* Technical Metadata Fields Box */}
          <div className="bg-card p-3.5 rounded-2xl border border-border/40 space-y-2 text-xs font-semibold">
            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1"><Key size={12} /> ID Thông báo:</span>
              <span className="font-mono text-foreground font-bold select-all">{notification.id}</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Trạng thái đọc:</span>
              <span className={notification.read ? "text-emerald-600 font-extrabold" : "text-amber-600 font-extrabold"}>
                {notification.read ? "Đã đọc (READ)" : "Chưa đọc (UNREAD)"}
              </span>
            </div>

            {notification.actionUrl && (
              <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1 border-t border-border/30">
                <span className="flex items-center gap-1"><Link2 size={12} /> Đường dẫn đính kèm:</span>
                <span className="font-mono text-primary font-bold truncate max-w-[220px] select-all">
                  {notification.actionUrl}
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 flex-col sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-10 text-xs font-bold cursor-pointer w-full sm:w-auto"
          >
            Đóng
          </Button>

          {notification.actionUrl && (
            <Button
              type="button"
              onClick={handleActionClick}
              className="rounded-xl h-10 text-xs font-bold bg-primary text-primary-foreground gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <ExternalLink size={14} />
              <span>Truy cập liên kết (Action URL)</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
