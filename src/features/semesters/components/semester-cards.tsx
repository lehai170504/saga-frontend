"use client";

import { useState, useMemo } from "react";
import { useSemesters, useActiveSemester } from "../hooks/useSemesters";
import { CreateSemesterDialog } from "./create-semester-dialog";
import { SemesterActions } from "./semester-actions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Calendar, CalendarClock, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";

const ITEMS_PER_PAGE = 8;

export function SemesterCards() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: page, isLoading, error } = useSemesters({ size: 100 });
  const { data: activeSemesterData } = useActiveSemester();
  const { user } = useAuth();

  const isAdmin = user?.applicationRole === "ADMIN";
  const activeSemesterId = activeSemesterData?.semesterId;

  const semesters = useMemo(() => page?.content || [], [page?.content]);
  const totalPages = Math.max(1, Math.ceil(semesters.length / ITEMS_PER_PAGE));

  const paginatedSemesters = useMemo(() => {
    return semesters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [semesters, currentPage]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Danh mục Học kỳ"
        description="Quản lý danh sách các học kỳ trong hệ thống."
        workspace="Master Data"
      >
        {isAdmin && <CreateSemesterDialog />}
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive p-8 bg-destructive/10 rounded-2xl border border-destructive/20 font-medium">
          Đã có lỗi xảy ra khi tải danh sách học kỳ.
        </div>
      ) : semesters.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {paginatedSemesters.map((semester) => {
              const isActive = semester.id === activeSemesterId;

              return (
                <Card key={semester.id} className={`rounded-2xl border bg-card hover:shadow-md transition-all duration-300 flex flex-col h-full group relative ${isActive ? "border-emerald-500/50 shadow-emerald-500/10 shadow-sm" : "border-border/50 hover:border-primary/30"}`}>
                  <CardContent className="p-5 flex-grow flex flex-col relative">
                    {isAdmin && (
                      <div className="absolute top-4 right-4 flex items-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <SemesterActions semester={semester} isActive={isActive} />
                      </div>
                    )}

                    <div className="mb-4 pr-12">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mã học kỳ</p>
                        {isActive && (
                          <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-foreground leading-tight truncate" title={semester.code}>{semester.code}</h3>
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
              );
            })}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
              <div className="text-xs font-semibold text-muted-foreground">
                Hiển thị <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, semesters.length)}</span> trên tổng số <span className="font-bold text-foreground">{semesters.length}</span> học kỳ
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3 rounded-xl text-xs font-bold gap-1 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  <span>Trang trước</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                        pageNum === currentPage
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                          : "bg-card border border-border/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 rounded-xl text-xs font-bold gap-1 cursor-pointer disabled:opacity-40"
                >
                  <span>Trang sau</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
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
