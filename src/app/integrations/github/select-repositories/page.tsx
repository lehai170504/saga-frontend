"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, GitBranch, ArrowRight, Search, CheckSquare, Square } from "lucide-react";
import { projectIntegrationApi } from "@/features/integrations/api/projectIntegrationApi";
import { useAuth } from "@/features/auth/hooks/useAuth";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

type GitHubRepository = {
  repositoryId: number;
  fullName: string;
  defaultBranch: string;
  status: string;
  lastSyncedAt: string | null;
};

type GitHubInstallationData = {
  projectId: string;
  installationId: number;
  accountLogin: string;
  accountType: string;
  repositories: GitHubRepository[];
};

export default function GitHubSelectRepositoriesPage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const [data, setData] = useState<GitHubInstallationData | null>(null);
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("integration_callback_result");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as GitHubInstallationData;
          if (parsed.repositories && parsed.projectId && parsed.installationId) {
            requestAnimationFrame(() => setData(parsed));
            // Default select all
            requestAnimationFrame(() => setSelectedRepoIds(parsed.repositories.map(r => r.repositoryId)));
            return;
          }
        } catch (e) {
          console.error("Failed to parse callback data", e);
        }
      }
      toast.error("Không tìm thấy dữ liệu cấu hình GitHub.");
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

  const filteredRepos = data.repositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleRepo = (repoId: number) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId)
        ? prev.filter((id) => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRepoIds(data.repositories.map((r) => r.repositoryId));
  };

  const handleDeselectAll = () => {
    setSelectedRepoIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRepoIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một Repository.");
      return;
    }

    setIsSubmitting(true);
    try {
      await projectIntegrationApi.linkGithubRepositories(data.projectId, {
        installationId: data.installationId,
        repositoryIds: selectedRepoIds,
      });
      toast.success("Liên kết GitHub Repositories thành công!");
      sessionStorage.removeItem("integration_callback_result");

      const redirectBack = sessionStorage.getItem("integration_redirect_back");
      router.replace(redirectBack || "/student");
    } catch (err: unknown) {
      const _err = err as Error;
      console.error(err);
      toast.error(_err.message || "Có lỗi xảy ra khi liên kết Repositories.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-6">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <Card className="max-w-2xl w-full rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-lg p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center pb-6 border-b border-border/40">
          <div className="mx-auto p-3.5 bg-primary/10 text-primary rounded-2xl w-fit mb-4">
            <GithubIcon className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">Liên kết GitHub Repositories</CardTitle>
          <CardDescription className="text-sm font-medium mt-1">
            Tài khoản: <span className="font-bold text-foreground">@{data.accountLogin}</span> ({data.accountType === "User" ? "Cá nhân" : "Tổ chức"})
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm kho lưu trữ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-background border-border text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-9 rounded-xl text-xs font-bold gap-1"
                >
                  <CheckSquare size={14} />
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="h-9 rounded-xl text-xs font-bold gap-1"
                >
                  <Square size={14} />
                  Bỏ chọn
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 border border-border/40 rounded-2xl p-2 bg-background/30">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => {
                  const isChecked = selectedRepoIds.includes(repo.repositoryId);
                  return (
                    <div
                      key={repo.repositoryId}
                      onClick={() => handleToggleRepo(repo.repositoryId)}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-200 ${isChecked
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-border/50 bg-transparent hover:bg-muted/10"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }} // Handled by container onClick
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{repo.fullName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <GitBranch size={10} />
                          <span>Mặc định: {repo.defaultBranch || "main"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-muted-foreground font-medium text-xs">
                  Không tìm thấy Repository nào khớp với từ khóa tìm kiếm.
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground font-semibold flex justify-between px-1">
              <span>Đã chọn:</span>
              <span className="text-primary font-bold">{selectedRepoIds.length} / {data.repositories.length} Repositories</span>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4 border-t border-border mt-4">
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
                className="rounded-xl px-6 font-bold bg-[#24292F] hover:bg-[#24292F]/90 text-white gap-2"
                disabled={isSubmitting || selectedRepoIds.length === 0}
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
