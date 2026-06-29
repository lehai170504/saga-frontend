"use client";
import React, { useState, use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Settings2, Calendar, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { TemplateSelector } from "@/features/lecturer/components/evaluation-config/template-selector";
import { PhaseManager } from "@/features/lecturer/components/evaluation-config/phase-manager";
import { PolicyOverrides } from "@/features/lecturer/components/evaluation-config/policy-overrides";

export default function ClassEvaluationConfigPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const [activeTab, setActiveTab] = useState("template");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    toast.loading("Đang lưu cấu hình đánh giá cho lớp...", { id: "save-class-config" });

    setTimeout(() => {
      setIsSaving(false);
      toast.success("Đã lưu thành công cấu hình lớp học!", { id: "save-class-config" });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/lecturer/${classId}`}>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cấu hình Đánh giá Nhóm</h1>
          <h2 className="text-2xl font-extrabold text-foreground">Lớp PBL4 - Nhúng (IT)</h2>
        </div>
      </div>

      <PageHeader
        title="Tùy chỉnh Đánh giá Đóng góp"
        description="Áp dụng Bộ khung hệ số, lên lịch các Phase đánh giá và tinh chỉnh ngưỡng Cảnh báo AI riêng cho lớp học này."
        workspace="Workspace Giảng viên"
      >
        <div className="flex justify-end w-full md:w-auto">
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[160px]"
          >
            <Save className={`w-4 h-4 mr-2 ${isSaving ? "animate-pulse" : ""}`} />
            {isSaving ? "Đang lưu..." : "Lưu Cấu hình Lớp"}
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="template" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col lg:flex-row w-full lg:w-auto h-auto lg:h-12 rounded-xl bg-muted/50 p-1 mb-8 gap-1">
          <TabsTrigger value="template" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Settings2 className="w-4 h-4 mr-2" /> Khung Hệ số & Multipliers
          </TabsTrigger>
          <TabsTrigger value="phases" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <Calendar className="w-4 h-4 mr-2" /> Giai đoạn Đánh giá (Phases)
          </TabsTrigger>
          <TabsTrigger value="overrides" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 lg:h-full px-4 sm:px-6">
            <AlertTriangle className="w-4 h-4 mr-2" /> Ghi đè Cảnh báo AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TemplateSelector />
        </TabsContent>

        <TabsContent value="phases" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PhaseManager />
        </TabsContent>

        <TabsContent value="overrides" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PolicyOverrides />
        </TabsContent>
      </Tabs>
    </div>
  );
}
