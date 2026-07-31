"use client";

import { useState } from "react";
import { useProjectIntegrations, useDeleteProjectJiraIntegration, useDeleteGithubRepository, useLinkJiraProject, useLinkGithubRepositories } from "../hooks/useProjectIntegrations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/axios";

export function ProjectIntegrationPanel({ projectId }: { projectId: string }) {
  const { data: projectIntegration, isLoading, error } = useProjectIntegrations(projectId);
  const { mutate: deleteJira, isPending: isDeletingJira } = useDeleteProjectJiraIntegration(projectId);
  const { mutate: deleteGithubRepo, isPending: isDeletingGithubRepo } = useDeleteGithubRepository(projectId);

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

  const jira = projectIntegration?.jira;
  const githubRepositories = projectIntegration?.githubRepositories || [];

  const handleConnectJira = () => {
    window.location.assign(`${API_BASE_URL}/api/projects/${projectId}/jira/connect`);
  };

  const handleInstallGithub = () => {
    window.location.assign(`${API_BASE_URL}/api/projects/${projectId}/github/install`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Jira Card */}
      <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                Jira Project
                {jira?.status === "ACTIVE" && <ShieldCheck size={18} className="text-emerald-500" />}
              </CardTitle>
              <CardDescription className="mt-1.5">Kết nối với Jira Project để đồng bộ Issue.</CardDescription>
            </div>
            {jira ? (
              <Badge variant="outline" className={`${jira.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"} font-bold px-3 py-1`}>
                {jira.status}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground font-bold px-3 py-1">Chưa kết nối</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col justify-between">
          {jira ? (
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
                className="w-full rounded-xl font-bold mt-4"
                onClick={() => deleteJira()}
                disabled={isDeletingJira}
              >
                {isDeletingJira ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Ngắt kết nối Jira
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 my-auto">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <Button onClick={handleConnectJira} className="rounded-xl px-6 font-bold shadow-sm bg-[#0052CC] hover:bg-[#0052CC]/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Liên kết với Jira
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Sau khi kết nối, hệ thống sẽ yêu cầu bạn chọn Site và Project.
              </p>
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
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-1 flex flex-col justify-between">
          {githubRepositories.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {githubRepositories.map((repo) => (
                  <div key={repo.repositoryId} className="flex items-center justify-between p-3 border border-border/50 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" title={repo.fullName}>{repo.fullName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] uppercase">{repo.status}</Badge>
                        <span className="text-[10px] text-muted-foreground">Branch: {repo.defaultBranch}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full shrink-0"
                      onClick={() => deleteGithubRepo(repo.repositoryId)}
                      disabled={isDeletingGithubRepo}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={handleInstallGithub} variant="outline" className="w-full rounded-xl font-bold mt-2 border-dashed border-2">
                <Plus className="mr-2 h-4 w-4" /> Thêm Repository khác
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 my-auto">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <Button onClick={handleInstallGithub} className="rounded-xl px-6 font-bold shadow-sm bg-[#24292F] hover:bg-[#24292F]/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Cài đặt GitHub App
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Sau khi cài đặt, hệ thống sẽ quét các repository mà bạn cấp quyền.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
