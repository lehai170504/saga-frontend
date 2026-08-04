"use client";

import { useClasses } from "../hooks/useClasses";
import { CreateClassDialog } from "./create-class-dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Network, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function ClassCards() {
  const { data: page, isLoading, error } = useClasses();
  const { user } = useAuth();
  const router = useRouter();

  const isAdmin = user?.applicationRole === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
        Đã có lỗi xảy ra khi tải danh sách lớp học.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Danh mục Lớp PBL"
        description="Quản lý danh sách các lớp học dự án."
        workspace="Master Data"
      >
        {isAdmin && <CreateClassDialog />}
      </PageHeader>

      {page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {page.content.map((clazz) => (
            <Card
              key={clazz.id}
              className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group overflow-hidden relative cursor-pointer h-full flex flex-col"
              onClick={() => {
                if (user?.applicationRole === "ADMIN") {
                  router.push(`/admin/classes/${clazz.id}`);
                } else if (user?.applicationRole === "LECTURER") {
                  router.push(`/lecturer/${clazz.id}`);
                }
              }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Network size={64} className="text-primary transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <CardContent className="p-6 relative z-10 flex flex-col flex-grow gap-0">
                <div className="min-h-[4.5rem] flex flex-col justify-start mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary/80 mb-1">Mã lớp</p>
                  <h3 className="text-2xl font-black tracking-tight text-foreground leading-tight">{clazz.classCode}</h3>
                </div>

                <div className="space-y-3 mt-auto pt-3 border-t border-border/40">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} className="text-primary/70 shrink-0" />
                    <span className="font-medium line-clamp-1">{clazz.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                    <Clock size={14} className="shrink-0" />
                    <span>Tạo ngày: {new Date(clazz.createdAt).toLocaleDateString("vi-VN")}</span>
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
