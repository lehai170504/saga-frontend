"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { useNotificationsList, useMarkAsRead, useUnreadCount } from "@/features/notifications/hooks/useNotifications";
import { formatNotificationRelativeTime, formatNotificationFullTime } from "@/features/notifications/utils/formatTime";
import { GitBranch, Compass, MessageSquare, Check, Bell, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const size = 15;

  const { data: notificationsData, isLoading } = useNotificationsList(page, size);
  const { data: unreadData } = useUnreadCount();
  const { mutate: markAsRead, isPending: isMarking } = useMarkAsRead();

  const notifications = notificationsData?.content || [];
  const totalPages = notificationsData?.totalPages || 0;
  const unreadCount = unreadData?.unreadCount || 0;

  const handleMarkAsRead = (id: string, actionUrl: string | null) => {
    markAsRead(id);
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    if (notifications.length === 0) return;
    const unreadNotifs = notifications.filter((n) => !n.read);
    if (unreadNotifs.length === 0) {
      toast.info("Tất cả thông báo ở trang này đã được đọc.");
      return;
    }
    unreadNotifs.forEach((n) => markAsRead(n.id));
    toast.success("Đã đánh dấu đã đọc các thông báo trên trang hiện tại!");
  };

  const getIconAndBg = (type?: string) => {
    let iconBg = "bg-primary/10 text-primary";
    let icon = <Bell size={18} />;

    if (type === "jira") {
      iconBg = "bg-primary/10 text-primary";
      icon = <Compass size={18} />;
    } else if (type === "feedback") {
      iconBg = "bg-primary/10 text-primary";
      icon = <MessageSquare size={18} />;
    } else if (type === "absence") {
      iconBg = "bg-success/10 text-success";
      icon = <Check size={18} />;
    } else if (type === "github" || type === "git") {
      iconBg = "bg-primary/10 text-primary";
      icon = <GitBranch size={18} />;
    }

    return { icon, iconBg };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Tất cả Thông báo"
        description="Xem lại toàn bộ lịch sử thông báo, cập nhật từ hệ thống, Jira và đánh giá."
        workspace="Trung tâm Thông báo"
      >
        <Button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || isMarking}
          className="rounded-xl px-4 py-2 font-medium bg-background text-foreground border border-border/50 hover:bg-muted/50 hover:text-foreground shadow-sm transition-all"
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
          Đánh dấu tất cả đã đọc
        </Button>
      </PageHeader>

      <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden min-h-[500px]">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
              <div className="p-4 bg-primary/5 rounded-full mb-4">
                <Bell className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Không có thông báo nào</h3>
              <p className="text-sm mt-1">Bạn chưa nhận được thông báo nào từ hệ thống.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map((notif) => {
                const { icon, iconBg } = getIconAndBg(notif.type?.toLowerCase());

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id, notif.actionUrl)}
                    className={`flex items-start gap-4 p-5 sm:px-8 cursor-pointer transition-all duration-300 hover:bg-muted/30 group ${!notif.read ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
                      }`}
                  >
                    <div className={`p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
                      {icon}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className={`text-base truncate ${!notif.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                          {notif.title}
                        </h4>
                        <span
                          className="text-xs font-medium text-muted-foreground shrink-0 whitespace-nowrap mt-1"
                          title={formatNotificationFullTime(notif.createdAt)}
                        >
                          {formatNotificationRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${!notif.read ? "text-foreground/90 font-medium" : "text-muted-foreground"}`}>
                        {notif.message}
                      </p>
                    </div>

                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 self-center shadow-[0_0_8px_rgba(99,102,241,0.6)] ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between p-5 sm:px-8 border-t border-border/40 bg-background/30">
              <span className="text-xs font-medium text-muted-foreground">
                Trang {page + 1} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
