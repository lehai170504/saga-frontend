"use client";

import { useClasses } from "../hooks/useClasses";
import { CreateClassDialog } from "./create-class-dialog";
import { ClassActions } from "./class-actions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Network, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/shared/Skeleton";

export function ClassCards() {
  const { data: page, isLoading, error } = useClasses();
  const { user } = useAuth();

  const isAdmin = user?.applicationRole === "ADMIN";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Danh mục Lớp PBL"
        description="Quản lý danh sách các lớp học dự án."
        workspace="Master Data"
      >
        {isAdmin && <CreateClassDialog />}
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
          Đã có lỗi xảy ra khi tải danh sách lớp học.
        </div>
      ) : page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {page.content.map((clazz) => (
            <Card
              key={clazz.id}
              className="rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col h-full group relative"
            >
              {isAdmin && <ClassActions clazz={clazz} />}
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="mb-4 pr-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mã lớp</p>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{clazz.classCode}</h3>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-[13px] text-foreground font-semibold">
                    <Users size={14} className="text-muted-foreground shrink-0" />
                    <span className="line-clamp-1">{clazz.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Clock size={14} className="shrink-0" />
                    <span>Ngày tạo: {new Date(clazz.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/20 rounded-[2rem] border border-border/50 border-dashed">
          <Network className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground mt-1">Hiện chưa có lớp học nào được tạo.</p>
        </div>
      )}
    </div>
  );
}
