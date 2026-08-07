"use client";

import { useSubjects } from "../hooks/useSubjects";
import { CreateSubjectDialog } from "./create-subject-dialog";
import { SubjectActions } from "./subject-actions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, BookOpen, Clock, Layers } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function SubjectCards() {
  const { data: page, isLoading, error } = useSubjects();
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
        Đã có lỗi xảy ra khi tải danh sách môn học.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Danh mục Môn học"
        description="Quản lý danh sách các môn học trong hệ thống."
        workspace="Master Data"
      >
        {isAdmin && <CreateSubjectDialog />}
      </PageHeader>

      {page?.content && page.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {page.content.map((subject) => (
            <Card key={subject.id} className="rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 flex flex-col h-full group relative">
              {isAdmin && <SubjectActions subject={subject} />}
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="mb-4 pr-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Mã môn học</p>
                  <h3 className="text-xl font-bold text-foreground leading-tight">{subject.subjectCode}</h3>
                </div>

                <div className="flex flex-col gap-2.5 mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-[13px] text-foreground font-semibold">
                    <Layers size={14} className="text-muted-foreground shrink-0" />
                    <span className="line-clamp-1">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Clock size={14} className="shrink-0" />
                    <span>Ngày tạo: {new Date(subject.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/20 rounded-[2rem] border border-border/50 border-dashed">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Không có dữ liệu</h3>
          <p className="text-sm text-muted-foreground mt-1">Hiện chưa có môn học nào được tạo.</p>
        </div>
      )}
    </div>
  );
}
