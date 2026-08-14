"use client";

import { usePersonalIntegrations, useDeleteJiraIntegration, useDeleteGithubIntegration } from "../hooks/usePersonalIntegrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { API_BASE_URL, ApiError } from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

export function PersonalIntegrationPanel() {
  const { data, isLoading, error } = usePersonalIntegrations();
  const { mutate: deleteJira, isPending: isDeletingJira } = useDeleteJiraIntegration();
  const { mutate: deleteGithub, isPending: isDeletingGithub } = useDeleteGithubIntegration();
  const user = useAuthStore((s) => s.user);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Check if account is not active or access was denied due to account status
  const isAccountInactive =
    (user?.accountStatus && user.accountStatus !== "ACTIVE") ||
    (error instanceof ApiError &&
      (error.errorName === "ACCOUNT_STATUS_ACCESS_DENIED" ||
        error.message?.toLowerCase().includes("not active") ||
        error.status === 403));

  // Allow graceful fallback if API returns error (e.g. 403/404 or uninitialized profile)
  const connections = (data && !error) ? (data.connections || []) : [];
  const jiraConnection = connections.find((c) => c.provider === "JIRA" && c.status === "ACTIVE");
  const githubConnection = connections.find((c) => c.provider === "GITHUB" && c.status === "ACTIVE");

  const handleConnectJira = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("integration_redirect_back", window.location.pathname);
      sessionStorage.setItem("open_profile_modal", "true");
      sessionStorage.setItem("profile_modal_tab", "settings");
    }
    window.location.assign(`${API_BASE_URL}/api/me/integrations/jira/connect`);
  };

  const handleConnectGithub = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("integration_redirect_back", window.location.pathname);
      sessionStorage.setItem("open_profile_modal", "true");
      sessionStorage.setItem("profile_modal_tab", "settings");
    }
    window.location.assign(`${API_BASE_URL}/api/me/integrations/github/connect`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(error || isAccountInactive) && (
        <div className="col-span-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0 text-amber-500" />
          <span>
            {isAccountInactive
              ? "Tài khoản của bạn chưa ở trạng thái hoạt động. Vui lòng xác nhận qua email hoặc liên hệ Quản trị viên hoặc Giảng viên để được xác minh và kích hoạt tài khoản."
              : "Tài khoản của bạn chưa được phân vào môn học/nhóm nào. Vui lòng liên hệ giảng viên hoặc quản trị viên để tham gia môn học trước khi cài đặt tích hợp."}
          </span>
        </div>
      )}

      {/* Jira Card */}
      <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-border transition-all duration-300">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Jira Software
                {jiraConnection?.status === "ACTIVE" && (
                  <ShieldCheck size={18} className="text-emerald-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-1.5">Kết nối tài khoản Jira để đồng bộ task.</CardDescription>
            </div>
            {jiraConnection?.status === "ACTIVE" ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-3 py-1">Đã kết nối</Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground font-bold px-3 py-1">Chưa kết nối</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col">
          {jiraConnection ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="text-sm">
                <p className="text-muted-foreground">Tài khoản kết nối</p>
                <p className="font-semibold text-foreground">{jiraConnection.displayName} ({jiraConnection.email})</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Ngày xác thực</p>
                <p className="font-medium">{jiraConnection.verifiedAt ? new Date(jiraConnection.verifiedAt).toLocaleString("vi-VN") : "N/A"}</p>
              </div>
              <Button
                variant="destructive"
                className="w-full rounded-xl font-bold mt-auto"
                onClick={() => deleteJira()}
                disabled={isDeletingJira}
              >
                {isDeletingJira ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Ngắt kết nối
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <Button
                onClick={handleConnectJira}
                disabled={!!error || isAccountInactive}
                className="rounded-xl px-6 font-bold shadow-sm bg-[#0052CC] hover:bg-[#0052CC]/90 text-white mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="mr-2 h-4 w-4" /> Liên kết với Jira
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Card */}
      <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-border transition-all duration-300">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                GitHub
                {githubConnection?.status === "ACTIVE" && (
                  <ShieldCheck size={18} className="text-emerald-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-1.5">Kết nối tài khoản GitHub để đồng bộ commit.</CardDescription>
            </div>
            {githubConnection?.status === "ACTIVE" ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-3 py-1">Đã kết nối</Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground font-bold px-3 py-1">Chưa kết nối</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col">
          {githubConnection ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="text-sm">
                <p className="text-muted-foreground">Tài khoản kết nối</p>
                <p className="font-semibold text-foreground">{githubConnection.displayName} ({githubConnection.email})</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Ngày xác thực</p>
                <p className="font-medium">{githubConnection.verifiedAt ? new Date(githubConnection.verifiedAt).toLocaleString("vi-VN") : "N/A"}</p>
              </div>
              <Button
                variant="destructive"
                className="w-full rounded-xl font-bold mt-auto"
                onClick={() => deleteGithub()}
                disabled={isDeletingGithub}
              >
                {isDeletingGithub ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Ngắt kết nối
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <Button
                onClick={handleConnectGithub}
                disabled={!!error || isAccountInactive}
                className="rounded-xl px-6 font-bold shadow-sm bg-[#24292F] hover:bg-[#24292F]/90 text-white mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="mr-2 h-4 w-4" /> Liên kết với GitHub
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
