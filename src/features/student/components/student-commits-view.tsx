"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useProjectIntegrations } from "@/features/integrations/hooks/useProjectIntegrations";
import { useGithubBranches, useGithubCommits } from "@/features/projects/hooks/useProjects";
import { GithubBranchInfo, GithubCommitInfo } from "@/features/projects/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitCommit, GitBranch, Calendar, ExternalLink, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { CommitReviewBadge } from "@/components/shared/commit-review-badge";

interface StudentCommitsViewProps {
  courseId?: string;
}

export function StudentCommitsView({ courseId }: StudentCommitsViewProps) {

  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [page, setPage] = useState(0);
  const size = 10; // Page size of 10 commits per page

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId || "");
  const projectId = myTeamData?.project?.id || "";
  const { data: integrations, isLoading: isLoadingIntegrations } = useProjectIntegrations(projectId);

  const repos = React.useMemo(() => {
    const integrationRepos = (integrations?.githubRepositories || [])
      .filter((r) => r.status === "ACTIVE")
      .map((r) => ({
        repositoryId: String(r.repositoryId),
        fullName: r.fullName,
      }));

    if (integrationRepos.length > 0) return integrationRepos;

    return (myTeamData?.project?.repositories || []).map((r) => ({
      repositoryId: String(r.repositoryId),
      fullName: r.repositoryName,
    }));
  }, [integrations?.githubRepositories, myTeamData?.project?.repositories]);

  const selectedRepo = repos.find((r) => r.repositoryId === selectedRepoId);

  // Automatically select first repository when loaded
  useEffect(() => {
    if (repos.length > 0 && !selectedRepoId) {
      const timer = setTimeout(() => setSelectedRepoId(repos[0].repositoryId), 0);
      return () => clearTimeout(timer);
    }
  }, [repos, selectedRepoId]);

  // Load branches (page = 0, size = 100 to get all branches)
  const { data: branchesData, isLoading: isLoadingBranches } = useGithubBranches(
    projectId,
    selectedRepoId,
    0,
    100
  );

  // Extract branch list safely
  const branchesList: string[] = React.useMemo(() => {
    const rawContent = branchesData?.branches?.content || [];
    return rawContent
      .map((item: GithubBranchInfo | string) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") return (item as GithubBranchInfo).name || "";
        return "";
      })
      .filter(Boolean);
  }, [branchesData]);

  // Automatically select first branch (prefer main/master) when branches are loaded
  useEffect(() => {
    if (branchesList.length > 0) {
      if (!selectedBranch || !branchesList.includes(selectedBranch)) {
        const defaultBranch = branchesList.find((b) => b === "main" || b === "master") || branchesList[0];
        const timer = setTimeout(() => setSelectedBranch(defaultBranch), 0);
        return () => clearTimeout(timer);
      }
    } else {
      const timer = setTimeout(() => setSelectedBranch(""), 0);
      return () => clearTimeout(timer);
    }
  }, [branchesList, selectedBranch]);

  // Load commits for the selected branch
  const { data: commitData, isLoading: isLoadingCommits, isPlaceholderData } = useGithubCommits(
    projectId,
    selectedRepoId,
    selectedBranch,
    page,
    size
  );

  const isLoading = isLoadingTeam || isLoadingIntegrations || isLoadingBranches || (!!selectedBranch && isLoadingCommits);

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background">
      <div className="p-6 max-w-[1400px] mx-auto space-y-6 ">



        {/* Page Header */}
        <PageHeader
          title="Lịch sử Commit"
          description="Theo dõi danh sách các commit và đóng góp mã nguồn từ các nhánh của GitHub"
        />

        {isLoadingTeam ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : !myTeamData?.project ? (
          <Card className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-destructive">Nhóm chưa đăng ký đề tài</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Dự án của nhóm bạn chưa được khởi tạo. Vui lòng đăng ký đề tài tại mục &quot;Thông tin Nhóm&quot; trước khi xem lịch sử Commit.
            </p>
          </Card>
        ) : repos.length === 0 ? (
          <Card className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <GitBranch size={32} />
            </div>
            <h2 className="text-xl font-bold text-amber-600">Chưa liên kết GitHub Repository</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Dự án chưa liên kết với kho lưu trữ GitHub nào. Leader của nhóm cần cấu hình liên kết GitHub trong mục &quot;Thông tin Nhóm&quot; để đồng bộ dữ liệu.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Repository & Branch Selectors */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 border border-border/50 backdrop-blur-xl p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <GitBranch size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground">Bộ lọc mã nguồn</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Chọn Repository và Nhánh</p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2.5 w-full sm:w-72 shrink-0">
                {/* Repo Dropdown */}
                <div className="w-full">
                  <Select
                    value={selectedRepoId}
                    onValueChange={(val) => {
                      setSelectedRepoId(val);
                      setSelectedBranch("");
                      setPage(0);
                    }}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background/50 h-10 font-medium text-xs">
                      <SelectValue placeholder="Chọn repository..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-background">
                      {repos.map((repo) => (
                        <SelectItem
                          key={repo.repositoryId}
                          value={String(repo.repositoryId)}
                          className="rounded-lg text-xs font-medium cursor-pointer"
                        >
                          {repo.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Dropdown */}
                <div className="w-full sm:w-55">
                  <Select
                    value={selectedBranch}
                    onValueChange={(val) => {
                      setSelectedBranch(val);
                      setPage(0);
                    }}
                    disabled={branchesList.length === 0 || isLoadingBranches}
                  >
                    <SelectTrigger className="rounded-xl border-border bg-background/50 h-10 font-medium text-xs flex items-center gap-2">
                      {(isLoadingBranches || isLoadingCommits) && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                      )}
                      <SelectValue placeholder={isLoadingBranches ? "Đang tải branch..." : "Chọn branch..."} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-background">
                      {branchesList.map((branchName) => (
                        <SelectItem
                          key={branchName}
                          value={branchName}
                          className="rounded-lg text-xs font-medium cursor-pointer"
                        >
                          {branchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Commits List Section */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl bg-muted/20" />
                ))}
              </div>
            ) : !commitData?.commits?.content || commitData.commits.content.length === 0 ? (
              <Card className="rounded-[2rem] border border-border/50 bg-card/25 backdrop-blur-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto">
                  <GitCommit size={32} />
                </div>
                <h2 className="text-lg font-bold text-foreground">Không tìm thấy commit nào</h2>
                <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                  Hiện chưa có commit nào được đồng bộ từ kho lưu trữ hoặc nhánh này. Vui lòng đẩy code mới lên GitHub hoặc đồng bộ lại.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                    Danh sách Commit ({selectedRepo?.fullName || commitData?.repositoryName || "GitHub"})
                  </h4>
                  <Badge variant="secondary" className="rounded-full font-bold text-[10px] uppercase tracking-wide bg-primary/10 text-primary">
                    Trang {page + 1}
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  {commitData.commits.content.map((commit: GithubCommitInfo, index: number) => (
                    <Card
                      key={`${commit.sha || "commit"}-${index}`}
                      className="rounded-2xl border border-border bg-card/45 backdrop-blur-xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/25 group"
                    >
                      <div className="space-y-2.5 flex-1 min-w-0">
                        {/* Commit Message */}
                        <p className="text-sm font-extrabold text-foreground leading-normal break-words pr-2">
                          {commit.message}
                        </p>

                        {/* Commit Details / Metadata */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
                          {/* Author Info */}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 border border-primary/20">
                              {getInitials(commit.authorName)}
                            </div>
                            <span className="text-foreground font-bold">{commit.authorName}</span>
                            <span className="text-[11px] font-medium text-muted-foreground/75">({commit.authorLogin})</span>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar size={13} className="text-muted-foreground/60" />
                            <span>Đã commit: {formatDateTime(commit.committedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section: AI Review Badge, SHA Badge and Github link */}
                      <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                        <CommitReviewBadge review={commit.review} />
                        <Badge
                          variant="outline"
                          className="font-mono rounded-lg text-[11px] bg-muted/30 border-border font-bold py-1 px-2.5"
                        >
                          {(commit.sha || "").slice(0, 7)}
                        </Badge>
                        {commit.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <a href={commit.url} target="_blank" rel="noopener noreferrer" title="Xem trên GitHub">
                              <ExternalLink size={14} />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold text-xs cursor-pointer h-9 px-4 flex items-center gap-1.5"
                    disabled={page === 0 || isPlaceholderData}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft size={16} />
                    Trang trước
                  </Button>

                  <span className="text-xs text-muted-foreground font-bold">
                    Trang {page + 1}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold text-xs cursor-pointer h-9 px-4 flex items-center gap-1.5"
                    disabled={!commitData?.commits?.hasNext || isPlaceholderData}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Trang sau
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
