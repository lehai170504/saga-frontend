"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import { projectIntegrationApi } from "@/features/integrations/api/projectIntegrationApi";
import { useAuth } from "@/features/auth/hooks/useAuth";

type JiraSite = {
  cloudId: string;
  name: string;
  siteUrl: string;
};

type JiraAuthorizationData = {
  projectId: string;
  sites: JiraSite[];
};

export default function JiraSelectSitePage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const [data, setData] = useState<JiraAuthorizationData | null>(null);
  const [selectedCloudId, setSelectedCloudId] = useState("");
  const [jiraProjectId, setJiraProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("integration_callback_result");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as JiraAuthorizationData;
          if (parsed.sites && parsed.projectId) {
            setData(parsed);
            if (parsed.sites.length > 0) {
              setSelectedCloudId(parsed.sites[0].cloudId);
            }
            return;
          }
        } catch (e) {
          console.error("Failed to parse callback data", e);
        }
      }
      toast.error("Không tìm thấy dữ liệu cấu hình Jira.");
      router.replace("/student");
    }
  }, [router]);

  if (!data || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCloudId) {
      toast.error("Vui lòng chọn một Jira Site.");
      return;
    }
    if (!jiraProjectId.trim()) {
      toast.error("Vui lòng nhập Jira Project Key / ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      await projectIntegrationApi.linkJiraProject(data.projectId, {
        cloudId: selectedCloudId,
        jiraProjectId: jiraProjectId.trim(),
      });
      toast.success("Liên kết dự án Jira thành công!");
      sessionStorage.removeItem("integration_callback_result");

      const redirectBack = sessionStorage.getItem("integration_redirect_back");
      router.replace(redirectBack || "/student");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Có lỗi xảy ra khi liên kết Jira.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-6">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <Card className="max-w-xl w-full rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-lg p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto p-3.5 bg-primary/10 text-primary rounded-2xl w-fit mb-4">
            <Globe size={24} />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">Liên kết Jira Project</CardTitle>
          <CardDescription className="text-sm font-medium mt-1">
            Chọn không gian Jira và nhập ID dự án của bạn để hoàn tất kết nối.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                1. Chọn Jira Site
              </Label>
              <div className="grid gap-3">
                {data.sites.map((site) => (
                  <label
                    key={site.cloudId}
                    className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${selectedCloudId === site.cloudId
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-transparent hover:bg-muted/15"
                      }`}
                  >
                    <input
                      type="radio"
                      name="jira-site"
                      value={site.cloudId}
                      checked={selectedCloudId === site.cloudId}
                      onChange={() => setSelectedCloudId(site.cloudId)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">{site.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{site.siteUrl}</p>
                    </div>
                    {selectedCloudId === site.cloudId && (
                      <ShieldCheck size={18} className="text-primary shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jira-project-id" className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                2. Nhập Jira Project Key hoặc ID
              </Label>
              <Input
                id="jira-project-id"
                placeholder="Ví dụ: PROJ"
                value={jiraProjectId}
                onChange={(e) => setJiraProjectId(e.target.value)}
                className="h-11 rounded-xl bg-background border-border font-medium text-xs focus-visible:ring-primary"
                required
              />
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wide">
                Key này thường xuất hiện ở phần đầu của các Task ID (ví dụ: PROJ-123).
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl font-bold hover:bg-muted/50"
                onClick={() => {
                  sessionStorage.removeItem("integration_callback_result");
                  router.replace("/student");
                }}
                disabled={isSubmitting}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="rounded-xl px-6 font-bold bg-[#0052CC] hover:bg-[#0052CC]/90 text-white gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất liên kết"}
                {!isSubmitting && <ArrowRight size={16} />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
