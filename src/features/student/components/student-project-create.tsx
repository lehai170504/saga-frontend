"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FolderKanban, GitBranch, Compass, RefreshCw, CheckCircle2, Link2, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";

export function StudentProjectCreate() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Project Info states
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");

  // GitHub integration states
  type GithubRepo = { id: string; type: string; url: string; branch: string };
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([
    { id: "1", type: "Frontend", url: "", branch: "main" },
    { id: "2", type: "Backend", url: "", branch: "main" }
  ]);
  const [isTestingGithub, setIsTestingGithub] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  // Jira integration states
  const [jiraUrl, setJiraUrl] = useState("");
  const [jiraProjectKey, setJiraProjectKey] = useState("");
  const [isTestingJira, setIsTestingJira] = useState(false);
  const [jiraConnected, setJiraConnected] = useState(false);

  const subjectsData = [
    { code: "WDP301", name: "Dự án phát triển web", classId: "wdp301-pbl", className: "SE1801", project: "Nhóm PBL-01" },
    { code: "PRN211", name: "Lập trình C# nâng cao", classId: "prn211-pbl", className: "SE1802", project: "Nhóm PBL-02" },
    { code: "CS101", name: "Nhập môn Lập trình", classId: "cs101-pbl", className: "SE1803", project: "Nhóm PBL-03" },
    { code: "SWT301", name: "Kiểm thử phần mềm", classId: "swt301-pbl", className: "SE1804", project: "Nhóm PBL-04" },
    { code: "DBI202", name: "Hệ cơ sở dữ liệu", classId: "dbi202-pbl", className: "SE1805", project: "Nhóm PBL-05" },
  ];

  const getClassName = (classId: string) => {
    if (!classId) return "";
    const match = subjectsData.find((c) => c.classId === classId);
    if (match) return `${match.code} - Lớp ${match.className}`;
    return classId.toUpperCase();
  };

  const getStudentGroup = (classId: string) => {
    const match = subjectsData.find((c) => c.classId === classId);
    return match ? match.project : "Nhóm PBL-01";
  };

  useEffect(() => {
    setMounted(true);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";

    setSelectedSemester(sem);
    setSelectedClass(cls);

    if (cls) {
      const savedTopic = localStorage.getItem(`saga-project-topic-${cls}`) || "";
      const savedDesc = localStorage.getItem(`saga-project-desc-${cls}`) || "";
      const savedGitUrl = localStorage.getItem(`saga-project-git-url-${cls}`) || "";
      const savedGitBranch = localStorage.getItem(`saga-project-git-branch-${cls}`) || "main";
      const savedGitConn = localStorage.getItem(`saga-project-git-conn-${cls}`) === "true";
      const savedJiraUrl = localStorage.getItem(`saga-project-jira-url-${cls}`) || "";
      const savedJiraKey = localStorage.getItem(`saga-project-jira-key-${cls}`) || "";
      const savedJiraConn = localStorage.getItem(`saga-project-jira-conn-${cls}`) === "true";

      setTopicName(savedTopic);
      setDescription(savedDesc);

      try {
        const savedGitReposStr = localStorage.getItem(`saga-project-git-repos-${cls}`);
        if (savedGitReposStr) {
          setGithubRepos(JSON.parse(savedGitReposStr));
        }
      } catch (e) {
        // Fallback to default
      }

      setGithubConnected(savedGitConn);
      setJiraUrl(savedJiraUrl);
      setJiraProjectKey(savedJiraKey);
      setJiraConnected(savedJiraConn);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedClass]);

  const handleAddRepo = () => {
    setGithubRepos([...githubRepos, { id: Date.now().toString(), type: "Khác", url: "", branch: "main" }]);
  };

  const updateRepo = (id: string, field: keyof GithubRepo, value: string) => {
    setGithubRepos(githubRepos.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRepo = (id: string) => {
    setGithubRepos(githubRepos.filter(r => r.id !== id));
  };

  const handleTestGithub = () => {
    const hasEmptyUrl = githubRepos.some(r => !r.url);
    if (hasEmptyUrl) {
      toast.error("Vui lòng điền URL GitHub Repository trước");
      return;
    }
    setIsTestingGithub(true);
    setTimeout(() => {
      setIsTestingGithub(false);
      setGithubConnected(true);
      if (selectedClass) {
        localStorage.setItem(`saga-project-git-conn-${selectedClass}`, "true");
      }
      toast.success("Kết nối thử nghiệm đến GitHub Repository thành công!");
    }, 1500);
  };

  const handleTestJira = () => {
    if (!jiraUrl || !jiraProjectKey) {
      toast.error("Vui lòng điền đầy đủ URL Jira và Project Key trước");
      return;
    }
    setIsTestingJira(true);
    setTimeout(() => {
      setIsTestingJira(false);
      setJiraConnected(true);
      if (selectedClass) {
        localStorage.setItem(`saga-project-jira-conn-${selectedClass}`, "true");
      }
      toast.success("Kết nối thử nghiệm đến Jira Cloud thành công!");
    }, 1500);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) {
      toast.error("Vui lòng điền tên đề tài dự án");
      return;
    }
    if (!githubConnected || !jiraConnected) {
      toast.warning("Vui lòng hoàn thành Thử nghiệm Kết nối GitHub và Jira trước khi lưu.");
      return;
    }

    if (selectedClass) {
      localStorage.setItem(`saga-project-topic-${selectedClass}`, topicName);
      localStorage.setItem(`saga-project-desc-${selectedClass}`, description);
      localStorage.setItem(`saga-project-git-repos-${selectedClass}`, JSON.stringify(githubRepos));
      localStorage.setItem(`saga-project-jira-url-${selectedClass}`, jiraUrl);
      localStorage.setItem(`saga-project-jira-key-${selectedClass}`, jiraProjectKey);

      toast.success(`Đã lưu cấu hình dự án cho ${getStudentGroup(selectedClass)} thành công!`);
    }
  };

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  const activeGroup = getStudentGroup(selectedClass);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">

        {/* Header Section */}
        <PageHeader
          title="Cấu hình & Kết nối Dự án Nhóm"
          description={`Tạo/cập nhật thông tin dự án, kết nối GitHub & Jira để lưu trữ mã nguồn và quản lý tasks cho ${activeGroup} (Lớp ${getClassName(selectedClass)})`}
        />

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 rounded-3xl lg:col-span-2 bg-muted/30" />
            <Skeleton className="h-96 rounded-3xl bg-muted/30" />
          </div>
        ) : (
          <form onSubmit={handleSaveProject} className="grid gap-6 lg:grid-cols-3 items-start">

            {/* Left/Main Column: Project Details & Repository Integrations (Span 2) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Project Topic registration Card */}
              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                    <FolderKanban size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">Đăng ký Đề tài Dự án</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Thông tin đề tài của nhóm bạn</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="topic-name" className="text-xs font-bold text-muted-foreground">Tên đề tài / Dự án</Label>
                    <Input
                      id="topic-name"
                      placeholder="Ví dụ: Hệ thống quản lý thư viện số SAGA"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      className="h-11 rounded-xl bg-background border-border font-medium text-xs focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs font-bold text-muted-foreground">Mô tả tóm tắt dự án</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả tóm tắt tính năng chính, bài toán nghiệp vụ mà dự án của nhóm bạn giải quyết..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="rounded-xl bg-background border-border font-medium text-xs focus-visible:ring-primary resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </Card>

              {/* Integrations settings Card */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* GitHub integration */}
                <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                        <GitBranch size={20} />
                      </div>

                      {githubConnected ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase">
                          <CheckCircle2 size={10} className="fill-current" />
                          Đã liên kết
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-muted/40 text-muted-foreground rounded-full text-[10px] font-bold uppercase">
                          Chưa liên kết
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-foreground text-sm">Kho lưu trữ GitHub (Code)</h4>
                      <p className="text-muted-foreground text-[10px] font-medium mt-1 leading-relaxed">
                        Kết nối kho lưu trữ chung của nhóm để tự động đồng bộ hóa commits và các nhánh code.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {githubRepos.map((repo) => (
                        <div key={repo.id} className="relative p-3 rounded-xl border border-border/50 bg-background/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={repo.type}
                              onChange={(e) => updateRepo(repo.id, 'type', e.target.value)}
                              className="h-7 w-24 px-2 text-[10px] font-bold uppercase bg-muted border-none focus-visible:ring-1"
                              placeholder="Loại Repo"
                            />
                            {githubRepos.length > 1 && (
                              <button type="button" onClick={() => removeRepo(repo.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-muted-foreground uppercase">Repository URL</Label>
                            <Input
                              placeholder="https://github.com/org/repo"
                              value={repo.url}
                              onChange={(e) => updateRepo(repo.id, 'url', e.target.value)}
                              className="h-9 rounded-lg bg-background border-border font-medium text-xs"
                            />
                          </div>
                        </div>
                      ))}

                      <Button type="button" onClick={handleAddRepo} variant="ghost" className="w-full h-9 rounded-xl text-xs border border-dashed border-border/50 text-muted-foreground hover:text-foreground">
                        <Plus size={14} className="mr-1" /> Thêm Repository khác
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleTestGithub}
                    disabled={isTestingGithub}
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold text-xs bg-background hover:bg-muted/40 border-border cursor-pointer transition-colors shadow-sm"
                  >
                    {isTestingGithub ? (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Đang kết nối...
                      </>
                    ) : (
                      "Thử nghiệm Kết nối GitHub"
                    )}
                  </Button>
                </Card>

                {/* Jira Integration */}
                <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                        <Compass size={20} />
                      </div>

                      {jiraConnected ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase">
                          <CheckCircle2 size={10} className="fill-current" />
                          Đã liên kết
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-muted/40 text-muted-foreground rounded-full text-[10px] font-bold uppercase">
                          Chưa liên kết
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-foreground text-sm">Quản lý Tasks Jira</h4>
                      <p className="text-muted-foreground text-[10px] font-medium mt-1 leading-relaxed">
                        Kết nối Jira Board của nhóm để đồng bộ các Tasks, phục vụ việc vẽ Burndown Chart tự động.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="jira-url" className="text-[10px] font-bold text-muted-foreground uppercase">Jira Cloud Server URL</Label>
                        <Input
                          id="jira-url"
                          placeholder="https://your-domain.atlassian.net"
                          value={jiraUrl}
                          onChange={(e) => setJiraUrl(e.target.value)}
                          className="h-9 rounded-lg bg-background border-border font-medium text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="jira-key" className="text-[10px] font-bold text-muted-foreground uppercase">Jira Project Key</Label>
                        <Input
                          id="jira-key"
                          placeholder="Ví dụ: SAGA"
                          value={jiraProjectKey}
                          onChange={(e) => setJiraProjectKey(e.target.value)}
                          className="h-9 rounded-lg bg-background border-border font-medium text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleTestJira}
                    disabled={isTestingJira}
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold text-xs bg-background hover:bg-muted/40 border-border cursor-pointer transition-colors shadow-sm"
                  >
                    {isTestingJira ? (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Đang kết nối...
                      </>
                    ) : (
                      "Thử nghiệm Kết nối Jira"
                    )}
                  </Button>
                </Card>

              </div>

            </div>

            {/* Right Column: Information & Submit Button (Span 1) */}
            <div className="space-y-6">

              <Card className="rounded-[2rem] border border-border bg-card/45 backdrop-blur-xl shadow-sm p-6 space-y-6">
                <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2 border-b border-border/40 pb-4">
                  <ShieldCheck className="text-primary" size={16} />
                  <span>Xác nhận thông tin</span>
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Học kỳ:</span>
                    <span className="text-foreground text-right font-extrabold">{selectedSemester ? selectedSemester.toUpperCase().replace('-', ' ') : "-"}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Lớp học:</span>
                    <span className="text-foreground text-right font-extrabold">{getClassName(selectedClass)}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground">Nhóm dự án:</span>
                    <span className="text-primary text-right font-extrabold">{activeGroup}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl font-black text-xs uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
                >
                  Lưu cấu hình Project
                </Button>
              </Card>

              {/* Informative tips */}
              <Card className="border border-orange-100 dark:border-orange-950/40 bg-orange-50/20 dark:bg-orange-950/5 rounded-3xl p-5 flex gap-3.5 items-start shadow-sm text-left">
                <Link2 className="text-orange-500 shrink-0" size={16} />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-foreground text-[11px] uppercase tracking-wide">Lưu ý kết nối</h4>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed">
                    Mỗi nhóm chỉ cần cấu hình kho lưu trữ GitHub và Jira một lần duy nhất. Dữ liệu cấu hình sẽ được chia sẻ chung cho các thành viên trong nhóm phục vụ việc tổng hợp biểu đồ liên tục.
                  </p>
                </div>
              </Card>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
