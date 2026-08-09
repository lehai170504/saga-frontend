"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 border-border/50 hover:bg-muted"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title={`Chi tiết Khóa học`}
          description={`ID: ${courseId}`}
        />
      </div>

      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-3xl border border-border/40 shadow-sm min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground mb-3">
          Tính năng đang được phát triển
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Màn hình quản lý chi tiết Khóa học dành cho Admin đang trong giai đoạn chờ Backend cung cấp các API chuẩn (chuẩn <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm font-mono">/api/admin/courses</code>).
        </p>

        <Button
          className="mt-8 rounded-xl font-bold px-8 h-12"
          onClick={() => router.push("/master-data/courses")}
        >
          Quay lại danh sách
        </Button>
      </div>
    </div>
  );
}
