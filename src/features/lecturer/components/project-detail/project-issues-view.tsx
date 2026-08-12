"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGithubIssues } from "@/features/projects/hooks/useProjects";
import { GithubIssueInfo } from "@/features/projects/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, CircleDot } from "lucide-react";

interface ProjectIssuesViewProps {
  projectId: string;
  repositories?: { repositoryId: number; repositoryName: string }[];
}

export function ProjectIssuesView({ projectId, repositories = [] }: ProjectIssuesViewProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string>("all");
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: issueData, isLoading: isLoadingIssues, isPlaceholderData } = useGithubIssues(
    projectId,
    selectedRepoId === "all" ? undefined : selectedRepoId,
    page,
    size
  );

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="p-6 min-h-[400px] bg-background" />;
  }

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
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
    <div className="w-full space-y-6">
      {repositories.length === 0 ? (
        <Card className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <CircleDot size={32} />
          </div>
          <h2 className="text-xl font-bold text-amber-600">Chưa liên kết GitHub Repository</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Dự án chưa liên kết với kho lưu trữ GitHub nào. Leader của nhóm cần cấu hình liên kết GitHub để đồng bộ dữ liệu.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/40 border border-border/50 backdrop-blur-xl p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                <CircleDot size={16} />
              </div>
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-foreground">Bộ lọc Issues</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Lọc theo Repository</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2.5 w-full sm:w-auto sm:max-w-[50%] shrink-0">
              <div className="w-full">
                <Select
                  value={selectedRepoId}
                  onValueChange={(val) => {
                    setSelectedRepoId(val);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="rounded-xl border-border bg-background/50 h-10 font-medium text-xs w-full sm:min-w-[288px] [&>span]:truncate">
                    <SelectValue placeholder="Tất cả repository..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-background">
                    <SelectItem value="all" className="rounded-lg text-xs font-medium cursor-pointer">
                      Tất cả repository
                    </SelectItem>
                    {repositories.map((repo) => (
                      <SelectItem
                        key={repo.repositoryId}
                        value={String(repo.repositoryId)}
                        className="rounded-lg text-xs font-medium cursor-pointer"
                      >
                        {repo.repositoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoadingIssues ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl bg-muted/20" />
              ))}
            </div>
          ) : !issueData?.issues?.content || issueData.issues.content.length === 0 ? (
            <Card className="rounded-[2rem] border border-border/50 bg-card/25 backdrop-blur-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto">
                <CircleDot size={32} />
              </div>
              <h2 className="text-lg font-bold text-foreground">Không tìm thấy Issue nào</h2>
              <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                Hiện chưa có issue nào được tạo trong các kho lưu trữ GitHub hoặc không khớp với bộ lọc.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                  Danh sách GitHub Issues
                </h4>
                <Badge variant="secondary" className="rounded-full font-bold text-[10px] uppercase tracking-wide bg-primary/10 text-primary">
                  Trang {page + 1}
                </Badge>
              </div>

              <div className="space-y-3.5">
                {issueData.issues.content.map((issue: GithubIssueInfo, index: number) => {
                  const isClosed = issue.state?.toLowerCase() === 'closed';
                  return (
                    <Card
                      key={`${issue.issueId || "issue"}-${index}`}
                      className="rounded-2xl border border-border bg-card/45 backdrop-blur-xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/25 group"
                    >
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 shrink-0 ${isClosed ? 'text-purple-500' : 'text-emerald-500'}`}>
                            {isClosed ? <CheckCircle2 size={18} /> : <CircleDot size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-foreground leading-normal break-words pr-2">
                              {issue.title}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground mt-2">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center shrink-0 border border-primary/20">
                                  {getInitials(issue.authorLogin || "")}
                                </div>
                                <span className="text-foreground font-bold">{issue.authorLogin}</span>
                              </div>
                              
                              <Badge variant="outline" className={`h-5 px-2 text-[10px] rounded-full border-0 font-bold ${isClosed ? 'bg-purple-500/10 text-purple-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                {issue.state}
                              </Badge>

                              <div className="flex items-center gap-1.5 text-[11px]">
                                <Calendar size={13} className="text-muted-foreground/60" />
                                <span>{formatDateTime(issue.createdAt || "")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <Badge
                          variant="outline"
                          className="font-mono rounded-lg text-[11px] bg-muted/30 border-border font-bold py-1 px-2.5"
                        >
                          #{issue.number}
                        </Badge>
                        {issue.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="w-8 h-8 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <a href={issue.url} target="_blank" rel="noopener noreferrer" title="Xem trên GitHub">
                              <ExternalLink size={14} />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

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
                  disabled={!issueData?.issues?.hasNext || isPlaceholderData}
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
  );
}
