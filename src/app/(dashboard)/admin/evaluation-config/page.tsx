"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { AiWarningRules } from "@/features/admin/components/evaluation-config/ai-warning-rules";
import { OverrideRequests } from "@/features/admin/components/evaluation-config/override-requests";
import { useGetWeightRequests } from "@/features/admin/hooks/useContributionWeight";
import { ContributionWeightRequest } from "@/features/admin/api/contributionWeightApi";

export default function EvaluationConfigPage() {
  const [activeTab, setActiveTab] = useState("ai-warnings");

  const { data: requestsResponse } = useGetWeightRequests();
  const requests = Array.isArray(requestsResponse) ? requestsResponse : ((requestsResponse as unknown as { content?: ContributionWeightRequest[] })?.content ?? []);
  const hasPendingRequests = requests.some((r: ContributionWeightRequest) => r.status === "PENDING");


  return (
    <div className="space-y-8 ">
      <PageHeader
        title="Chính sách Đánh giá Toàn hệ thống"
        description="Thiết lập các ngưỡng cảnh báo của AI, cấu hình Bộ khung hệ số chuẩn (SE) và quản lý yêu cầu kiểm duyệt toàn hệ thống."
        workspace="Workspace Quản trị"
      >

      </PageHeader>

      <Tabs defaultValue="ai-warnings" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 h-auto rounded-2xl bg-muted/50 border border-border/50 p-1.5 gap-2">
          <TabsTrigger value="ai-warnings" className="rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Ngưỡng Cảnh báo AI
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative rounded-xl px-8 py-3 font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <ClipboardCheck className="w-4 h-4" /> Yêu cầu Kiểm duyệt
            {hasPendingRequests && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
            )}
          </TabsTrigger>
        </TabsList>


        <TabsContent value="ai-warnings" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AiWarningRules />
        </TabsContent>

        <TabsContent value="requests" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OverrideRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
