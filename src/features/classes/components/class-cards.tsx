"use client";

import { useState, useMemo } from "react";
import { useClasses } from "../hooks/useClasses";
import { CreateClassDialog } from "./create-class-dialog";
import { ClassActions } from "./class-actions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Network, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";

const ITEMS_PER_PAGE = 8;

export function ClassCards() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: page, isLoading, error } = useClasses({ size: 100 });
  const { user } = useAuth();

  const isAdmin = user?.applicationRole === "ADMIN";

  const classes = useMemo(() => page?.content || [], [page?.content]);
  const totalPages = Math.max(1, Math.ceil(classes.length / ITEMS_PER_PAGE));

  const paginatedClasses = useMemo(() => {
    return classes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [classes, currentPage]);

  return (
    <div className="space-y-8">
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
      ) : classes.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {paginatedClasses.map((clazz) => (
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

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
              <div className="text-xs font-semibold text-muted-foreground">
                Hiển thị <span className="font-bold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-bold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, classes.length)}</span> trên tổng số <span className="font-bold text-foreground">{classes.length}</span> lớp học
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
          <Network className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground mt-1">Hiện chưa có lớp học nào được tạo.</p>
        </div>
      )}
    </div>
  );
}
