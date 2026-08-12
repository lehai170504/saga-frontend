import React, { use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TemplateSelector } from "@/features/lecturer/components/evaluation-config/template-selector";

export default function ClassEvaluationConfigPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/lecturer/${courseId}`}>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cấu hình Đánh giá Nhóm</h1>
          <h2 className="text-2xl font-extrabold text-foreground">Lớp {courseId}</h2>
        </div>
      </div>

      <PageHeader
        title="Tùy chỉnh Đánh giá Đóng góp"
        description="Áp dụng Bộ khung hệ số phân bổ ngân sách 100% điểm Đóng góp (Slices) riêng cho lớp học này."
        workspace="Workspace Giảng viên"
      >
        
      </PageHeader>

      <div className="mt-4 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TemplateSelector courseId={courseId} />
      </div>
    </div>
  );
}
