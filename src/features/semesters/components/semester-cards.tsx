"use client";

import { useSemesters } from "../hooks/useSemesters";
import { CreateSemesterDialog } from "./create-semester-dialog";
import { SemesterActions } from "./semester-actions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, Calendar, CalendarClock, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function SemesterCards() {
  const { data: page, isLoading, error } = useSemesters();
  const { user } = useAuth();

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
        Đã có lỗi xảy ra khi tải danh sách học kỳ.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Danh mục Học kỳ"
        description="Quản lý danh sách các học kỳ trong hệ thống."
        workspace="Master Data"
      >
        {isAdmin && <CreateSemesterDialog />}
      </PageHeader>

      {page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {page.content.map((semester) => (
            <Card key={semester.id} className="rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col h-full group relative">
              <CardContent className="p-5 flex-grow flex flex-col relative">
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <SemesterActions semester={semester} />
                  </div>
                )}

                <div className="mb-4 pr-12">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mã học kỳ</p>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{semester.code}</h3>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-[13px] text-foreground font-semibold">
                    <CalendarDays size={14} className="text-muted-foreground shrink-0" />
                    <span className="line-clamp-1">{semester.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <CalendarClock size={14} className="shrink-0 text-emerald-500" />
                    <span>Bắt đầu: {new Date(semester.startDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <CalendarClock size={14} className="shrink-0 text-destructive/80" />
                    <span>Kết thúc: {new Date(semester.endDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/20 rounded-[2rem] border border-border/50 border-dashed">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground mt-1">Hiện chưa có học kỳ nào được tạo.</p>
        </div>
      )}
    </div>
  );
}
