"use client";

import { useState } from "react";
import {
  useProjectIntegrations,
  useDeleteProjectJiraIntegration,
  useDeleteGithubRepository,
  useReconnectGithubRepository,
} from "../hooks/useProjectIntegrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Trash2, ShieldCheck, AlertCircle, RefreshCw, GitBranch } from "lucide-react";
import { API_BASE_URL } from "@/lib/axios";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10";
    case "CONNECTING":
    case "BACKFILLING":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/10";
    case "DEGRADED":
    case "DISCONNECTED":
      return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10";
    default:
      return "bg-muted text-muted-foreground hover:bg-muted";
  }
};

export function ProjectIntegrationPanel({ projectId }: { projectId: string }) {
  const { data: projectIntegration, isLoading, error } = useProjectIntegrations(projectId);
  const { mutate: deleteJira, isPending: isDeletingJira } = useDeleteProjectJiraIntegration(projectId);
  const { mutate: deleteGithubRepo, isPending: isDeletingGithubRepo } = useDeleteGithubRepository(projectId);
  const { mutate: reconnectGithubRepo, isPending: isReconnecting } = useReconnectGithubRepository(projectId);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "JIRA" | "GITHUB";
    repoId?: number;
    repoName?: string;
  } | null>(null);

  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);

  const jira = projectIntegration?.jira;
  const isJiraConnected = !!jira && jira.status !== "DISCONNECTED";
  const githubRepositories = projectIntegration?.githubRepositories || [];

  const activeRepo = githubRepositories.find((r) => r.repositoryId === selectedRepoId) || githubRepositories[0];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Đã có lỗi xảy ra khi tải thông tin kết nối Project.
      </div>
    );
  }

  const handleConnectJira = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("integration_redirect_back", window.location.pathname);
    }
    window.location.assign(`${API_BASE_URL}/api/projects/${projectId}/jira/connect`);
  };

  const handleInstallGithub = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("integration_redirect_back", window.location.pathname);
    }
    window.location.assign(`${API_BASE_URL}/api/projects/${projectId}/github/install`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Jira Card */}
        <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Jira Project
                  {isJiraConnected && jira?.status === "ACTIVE" && <ShieldCheck size={18} className="text-emerald-500" />}
                </CardTitle>
                <CardDescription className="mt-1.5">Kết nối với Jira Project để đồng bộ Issue.</CardDescription>
              </div>
              {isJiraConnected ? (
                <Badge variant="outline" className={`${jira.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"} font-bold px-3 py-1`}>
                  {jira.status}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground font-bold px-3 py-1">Chưa kết nối</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-between">
            {isJiraConnected ? (
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-muted-foreground">URL Site</p>
                  <p className="font-semibold text-foreground break-all">{jira.siteUrl}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Project Key</p>
                  <p className="font-semibold text-foreground">{jira.projectKey}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Đồng bộ lần cuối</p>
                  <p className="font-medium">{jira.lastSyncedAt ? new Date(jira.lastSyncedAt).toLocaleString("vi-VN") : "N/A"}</p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full rounded-xl font-bold mt-4 cursor-pointer"
                  onClick={() => setDeleteConfirm({ type: "JIRA" })}
                  disabled={isDeletingJira}
                >
                  {isDeletingJira ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Ngắt kết nối Jira
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 my-auto py-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground text-center">
                  Chưa liên kết Jira Project. Nhấn nút bên dưới để bắt đầu xác thực qua OAuth.
                </p>
                <Button onClick={handleConnectJira} className="rounded-xl px-6 font-bold shadow-sm bg-[#0052CC] hover:bg-[#0052CC]/90 text-white gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" /> Liên kết Jira Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* GitHub Card */}
        <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  GitHub Repositories
                </CardTitle>
                <CardDescription className="mt-1.5">Kết nối với các GitHub Repository để phân tích code.</CardDescription>
              </div>
              {githubRepositories.length > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1">
                  Đã nối {githubRepositories.length} Repo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-between">
            {githubRepositories.length > 0 ? (
              <div className="space-y-4">
                {/* Repository Dropdown Tab Selector */}
                <div className="flex items-center justify-between gap-3 p-2 bg-muted/40 rounded-xl border border-border/50">
                  <span className="text-xs font-bold text-muted-foreground shrink-0 flex items-center gap-1.5 pl-1">
                    <GitBranch size={14} className="text-primary" /> Chọn Repo:
                  </span>
                  <select
                    value={activeRepo?.repositoryId || ""}
                    onChange={(e) => setSelectedRepoId(Number(e.target.value))}
                    className="h-9 px-3 rounded-lg bg-background border border-border/60 text-xs font-extrabold text-foreground outline-none cursor-pointer hover:border-primary transition-all max-w-[170px] truncate"
                  >
                    {githubRepositories.map((r) => (
                      <option key={r.repositoryId} value={r.repositoryId}>
                        {r.fullName} ({r.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Selected Repository Box */}
                {activeRepo && (
                  <div className="p-4 border border-border/50 rounded-2xl bg-card/60 backdrop-blur-md space-y-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm text-foreground truncate" title={activeRepo.fullName}>
                          {activeRepo.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-[10px] uppercase font-extrabold px-2 py-0.5 ${getStatusBadgeClass(activeRepo.status)}`}>
                            {activeRepo.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-semibold">Branch: {activeRepo.defaultBranch}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {(activeRepo.status === "DISCONNECTED" || activeRepo.status === "DEGRADED") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Kết nối lại"
                            className="text-primary hover:text-primary hover:bg-primary/10 rounded-full shrink-0 cursor-pointer"
                            onClick={() => reconnectGithubRepo(activeRepo.repositoryId)}
                            disabled={isReconnecting}
                          >
                            {isReconnecting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                          </Button>
                        )}

                        {activeRepo.status !== "DISCONNECTED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0 cursor-pointer"
                            onClick={() => setDeleteConfirm({ type: "GITHUB", repoId: activeRepo.repositoryId, repoName: activeRepo.fullName })}
                            disabled={isDeletingGithubRepo}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleInstallGithub} variant="outline" className="w-full rounded-xl font-bold mt-2 border-dashed border-2 cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" /> Thêm Repository khác
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 my-auto py-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground text-center">
                  Chưa liên kết GitHub Repository nào. Nhấn nút bên dưới để cài đặt GitHub App.
                </p>
                <Button onClick={handleInstallGithub} className="rounded-xl px-6 font-bold shadow-sm bg-[#24292F] hover:bg-[#24292F]/90 text-white gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" /> Liên kết GitHub Repositories
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[440px] rounded-[2rem] p-6 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl space-y-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <AlertCircle className="text-destructive" size={20} />
              {deleteConfirm?.type === "JIRA" ? "Xác nhận ngắt kết nối Jira" : "Xác nhận ngắt kết nối Repository"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground pt-2 leading-relaxed font-medium">
              {deleteConfirm?.type === "JIRA"
                ? "Bạn có chắc chắn muốn ngắt kết nối Jira Project khỏi dự án này? Thao tác này sẽ ngừng tự động đồng bộ các Issue từ Jira."
                : `Bạn có chắc chắn muốn ngắt kết nối repository "${deleteConfirm?.repoName}" khỏi dự án này?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              variant="outline"
              className="rounded-xl font-bold text-xs cursor-pointer"
              onClick={() => setDeleteConfirm(null)}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl font-bold text-xs gap-2 cursor-pointer"
              onClick={() => {
                if (deleteConfirm?.type === "JIRA") {
                  deleteJira(undefined, { onSuccess: () => setDeleteConfirm(null) });
                } else if (deleteConfirm?.type === "GITHUB" && deleteConfirm.repoId) {
                  deleteGithubRepo(deleteConfirm.repoId, { onSuccess: () => setDeleteConfirm(null) });
                }
              }}
              disabled={isDeletingJira || isDeletingGithubRepo}
            >
              {(isDeletingJira || isDeletingGithubRepo) ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {deleteConfirm?.type === "JIRA" ? "Ngắt kết nối Jira" : "Ngắt kết nối Repository"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

