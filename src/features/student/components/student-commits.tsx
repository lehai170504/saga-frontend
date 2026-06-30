"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import { 
  GitCommit, 
  GitBranch, 
  RefreshCw, 
  Plus, 
  User, 
  Calendar, 
  FileCode, 
  PlusCircle, 
  MinusCircle,
  Search,
  ExternalLink,
  Info
} from "lucide-react";

interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  time: string;
  branch: string;
  additions: number;
  deletions: number;
}

const INITIAL_BRANCHES = [
  "main",
  "develop",
  "feature/auth",
  "feature/kanban-board",
  "bugfix/sidebar-overlap"
];

const INITIAL_COMMITS: Commit[] = [
  { hash: "a3f8b9d", message: "feat: style kanban task card borders with rotating conic gradient", author: "Trần Thị Bình", date: "2026-06-30", time: "11:24", branch: "feature/kanban-board", additions: 142, deletions: 12 },
  { hash: "f9d8a7c", message: "fix: prevent dual dev-build write conflict on next folder", author: "Nguyễn Văn An", date: "2026-06-30", time: "10:05", branch: "main", additions: 25, deletions: 4 },
  { hash: "8e7c6b5", message: "refactor: isolate student overview and kanban views to features folder", author: "Nguyễn Văn An", date: "2026-06-29", time: "15:40", branch: "develop", additions: 520, deletions: 480 },
  { hash: "7d6c5b4", message: "feat: add slot details and ongoing semester status tags", author: "Lê Văn Cường", date: "2026-06-29", time: "09:12", branch: "main", additions: 84, deletions: 8 },
  { hash: "5c4b3a2", message: "docs: update walkthrough.md with latest epic features", author: "Phạm Thị Dung", date: "2026-06-28", time: "18:30", branch: "develop", additions: 18, deletions: 2 },
  { hash: "9f8e7d6", message: "feat: connect jira sprint configuration state to localStorage", author: "Hoàng Văn Em", date: "2026-06-28", time: "14:15", branch: "feature/kanban-board", additions: 310, deletions: 42 },
  { hash: "b2a1c0d", message: "fix: adjust mobile sidebar drawer z-index alignment", author: "Trần Thị Bình", date: "2026-06-27", time: "22:10", branch: "bugfix/sidebar-overlap", additions: 45, deletions: 38 },
  { hash: "c3d4e5f", message: "feat: implement jira oauth token rotation callback", author: "Lê Văn Cường", date: "2026-06-27", time: "11:05", branch: "feature/auth", additions: 189, deletions: 15 },
  { hash: "d4e5f6a", message: "test: write mock tests for git repo integration validations", author: "Phạm Thị Dung", date: "2026-06-26", time: "16:45", branch: "feature/auth", additions: 92, deletions: 10 },
  { hash: "e5f6a7b", message: "feat: design group project setup form with GitHub integration", author: "Nguyễn Văn An", date: "2026-06-26", time: "09:30", branch: "develop", additions: 742, deletions: 65 },
  { hash: "f6a7b8c", message: "chore: update config.json with repository webhook secrets", author: "Hoàng Văn Em", date: "2026-06-25", time: "17:10", branch: "develop", additions: 5, deletions: 1 },
  { hash: "0a1b2c3", message: "feat: render peer evaluation configuration charts", author: "Trần Thị Bình", date: "2026-06-25", time: "14:20", branch: "develop", additions: 280, deletions: 14 },
  { hash: "1b2c3d4", message: "fix: handle empty state redirects in router guards", author: "Lê Văn Cường", date: "2026-06-24", time: "10:15", branch: "main", additions: 15, deletions: 8 },
  { hash: "2c3d4e5", message: "perf: optimize svg render pathways in contribution graph", author: "Nguyễn Văn An", date: "2026-06-24", time: "09:05", branch: "develop", additions: 42, deletions: 2 },
  { hash: "3d4e5f6", message: "feat: add localization properties for student settings", author: "Phạm Thị Dung", date: "2026-06-23", time: "16:40", branch: "main", additions: 68, deletions: 0 }
];

const TEAM_MEMBERS = [
  "Tất cả thành viên",
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Văn Cường",
  "Phạm Thị Dung",
  "Hoàng Văn Em"
];

export function StudentCommits() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Commits & Branches state
  const [branches, setBranches] = useState<string[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("Tất cả thành viên");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranch, selectedAuthor, searchQuery]);

  // New mock branch modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");

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

    const savedBranches = localStorage.getItem(`saga-commits-branches-${cls}`);
    const savedCommits = localStorage.getItem(`saga-commits-list-${cls}`);

    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    } else {
      setBranches(INITIAL_BRANCHES);
      localStorage.setItem(`saga-commits-branches-${cls}`, JSON.stringify(INITIAL_BRANCHES));
    }

    if (savedCommits) {
      setCommits(JSON.parse(savedCommits));
    } else {
      setCommits(INITIAL_COMMITS);
      localStorage.setItem(`saga-commits-list-${cls}`, JSON.stringify(INITIAL_COMMITS));
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedClass]);

  const handleSyncGit = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      
      // Simulate adding a new commit on sync
      const nextHash = Math.random().toString(16).substring(2, 9);
      const newSyncCommit: Commit = {
        hash: nextHash,
        message: "style: upgrade select menus, and details layouts for theme alignment",
        author: "Lê Văn Cường",
        date: new Date().toISOString().substring(0, 10),
        time: new Date().toTimeString().substring(0, 5),
        branch: "develop",
        additions: 38,
        deletions: 14
      };

      const updated = [newSyncCommit, ...commits];
      setCommits(updated);
      if (selectedClass) {
        localStorage.setItem(`saga-commits-list-${selectedClass}`, JSON.stringify(updated));
      }
      
      toast.success("Đồng bộ hóa Commits với GitHub Repository thành công!");
    }, 1500);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast.error("Vui lòng nhập tên nhánh!");
      return;
    }
    const cleanName = newBranchName.trim().toLowerCase().replace(/\s+/g, '-');
    if (branches.includes(cleanName)) {
      toast.error("Tên nhánh này đã tồn tại!");
      return;
    }

    const updatedBranches = [...branches, cleanName];
    setBranches(updatedBranches);
    if (selectedClass) {
      localStorage.setItem(`saga-commits-branches-${selectedClass}`, JSON.stringify(updatedBranches));
    }

    // Also add an initial commit for this branch
    const nextHash = Math.random().toString(16).substring(2, 9);
    const initCommit: Commit = {
      hash: nextHash,
      message: `chore: create branch ${cleanName} from develop`,
      author: "Nguyễn Văn An",
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toTimeString().substring(0, 5),
      branch: cleanName,
      additions: 1,
      deletions: 0
    };

    const updatedCommits = [initCommit, ...commits];
    setCommits(updatedCommits);
    if (selectedClass) {
      localStorage.setItem(`saga-commits-list-${selectedClass}`, JSON.stringify(updatedCommits));
    }

    setSelectedBranch(cleanName);
    setNewBranchName("");
    setIsModalOpen(false);
    toast.success(`Khởi tạo nhánh '${cleanName}' thành công!`);
  };

  if (!mounted) {
    return <div className="p-6 min-h-screen bg-background" />;
  }

  // Filter commits
  const filteredCommits = commits.filter(commit => {
    const matchesBranch = selectedBranch === "all" || commit.branch === selectedBranch;
    const matchesAuthor = selectedAuthor === "Tất cả thành viên" || commit.author === selectedAuthor;
    const matchesSearch = commit.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      commit.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesAuthor && matchesSearch;
  });

  // Calculate statistics
  const totalCommitsCount = filteredCommits.length;
  const totalAdditions = filteredCommits.reduce((acc, c) => acc + c.additions, 0);
  const totalDeletions = filteredCommits.reduce((acc, c) => acc + c.deletions, 0);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      <div className="relative p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-600">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <PageHeader
            title="Lịch sử Commit (GitHub)"
            description={`Xem, theo dõi hoạt động commits code trên các nhánh repository của ${getStudentGroup(selectedClass)} (Lớp ${getClassName(selectedClass)})`}
          />

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sync Button */}
            <Button 
              onClick={handleSyncGit}
              disabled={isSyncing}
              variant="outline"
              className="h-10 rounded-xl font-bold text-xs bg-background/50 backdrop-blur-md border-border/50 hover:bg-muted/40 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Đang đồng bộ..." : "Đồng bộ GitHub"}
            </Button>

            {/* Create Branch Button */}
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="h-10 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-orange-500 via-primary to-amber-500 text-white hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.45)] cursor-pointer"
            >
              <Plus size={14} className="mr-1.5" />
              Tạo Nhánh Mới
            </Button>
          </div>
        </div>

        {/* Git Stats Summary Card Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Tổng số Commits</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <GitCommit size={14} />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-foreground">{isLoading ? "-" : totalCommitsCount}</h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Trong nhánh đang hiển thị</p>
          </Card>

          <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Số dòng Code thêm</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <PlusCircle size={14} />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-500">+{isLoading ? "-" : totalAdditions.toLocaleString()}</h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Lines of code added</p>
          </Card>

          <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Số dòng Code xóa</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <MinusCircle size={14} />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-rose-500">-{isLoading ? "-" : totalDeletions.toLocaleString()}</h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Lines of code deleted</p>
          </Card>

          <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Tổng Files tác động</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <FileCode size={14} />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-indigo-500">{isLoading ? "-" : Math.round(totalCommitsCount * 2.3)}</h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">Sửa đổi trung bình 2.3 files/commit</p>
          </Card>
        </div>

        {/* Filter Bar Controls Card */}
        <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Branch Filter dropdown */}
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Chọn Nhánh</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-[180px] h-10 bg-background/50 border-border rounded-xl font-bold text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <GitBranch size={13} className="text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Nhánh Git" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="all" className="text-xs font-semibold">Tất cả các nhánh</SelectItem>
                    {branches.map(b => (
                      <SelectItem key={b} value={b} className="text-xs font-semibold">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author Filter dropdown */}
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Người đóng góp</Label>
                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger className="w-[180px] h-10 bg-background/50 border-border rounded-xl font-bold text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <User size={13} className="text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Người commit" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {TEAM_MEMBERS.map(member => (
                      <SelectItem key={member} value={member} className="text-xs font-semibold">
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Commit Message Search */}
            <div className="w-full md:max-w-xs space-y-1">
              <Label className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">Tìm kiếm Commit</Label>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  placeholder="Từ khóa commit hoặc mã hash..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border h-10 rounded-xl font-medium text-xs placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Commits Timeline Panel */}
        <Card className="rounded-[2rem] border border-border bg-card/25 dark:bg-card/20 backdrop-blur-3xl shadow-sm p-6 md:p-8">
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border/40 pb-4">
              <GitCommit className="text-primary" size={16} />
              <span>Dòng thời gian Commits ({totalCommitsCount})</span>
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted/30" />
                ))}
              </div>
            ) : filteredCommits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-bold text-xs uppercase tracking-wide border-2 border-dashed border-border/40 rounded-2xl">
                Không tìm thấy commit nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <>
                <div className="relative border-l border-border/40 pl-6 ml-4 space-y-6">
                  {(() => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const paginatedCommits = filteredCommits.slice(startIndex, startIndex + itemsPerPage);
                    
                    return paginatedCommits.map((commit) => {
                      const initials = commit.author.split(' ').map(n => n[0]).join('').substring(0, 2);
                      return (
                        <div key={commit.hash} className="relative group/commit">
                          
                          {/* Timeline Dot Marker */}
                          <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-background border border-primary flex items-center justify-center z-10 transition-colors group-hover/commit:bg-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover/commit:bg-background" />
                          </span>

                          {/* Commit Card Container */}
                          <div className="p-4 rounded-2xl border border-border/60 bg-card/45 dark:bg-zinc-950/80 hover:border-primary/40 hover:bg-card/65 transition-all duration-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            <div className="flex items-start gap-3.5 min-w-0">
                              {/* Author initials avatar */}
                              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                                {initials}
                              </div>

                              <div className="space-y-1.5 min-w-0 text-left">
                                <h4 className="text-xs font-bold text-foreground leading-relaxed line-clamp-1 group-hover/commit:text-primary transition-colors">
                                  {commit.message}
                                </h4>
                                
                                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                  <span className="text-foreground font-extrabold shrink-0">{commit.author}</span>
                                  <span className="text-border">•</span>
                                  
                                  {/* Branch tag indicator */}
                                  <span className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded text-[9px] border border-border/40 shrink-0">
                                    <GitBranch size={9} />
                                    {commit.branch}
                                  </span>

                                  <span className="text-border">•</span>
                                  <span className="flex items-center gap-1 shrink-0">
                                    <Calendar size={9} />
                                    {commit.date} {commit.time}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Section: Hash & Lines changes */}
                            <div className="flex items-center gap-3 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3.5 md:pt-0 border-border/40">
                              
                              {/* Lines Added / Deleted */}
                              <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider">
                                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                                  +{commit.additions}
                                </span>
                                <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                                  -{commit.deletions}
                                </span>
                              </div>

                              {/* Git Commit Hash code badge */}
                              <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); toast.info(`Đang mở chi tiết commit [${commit.hash}] trên GitHub...`); }}
                                className="flex items-center gap-1 text-[10px] font-black text-muted-foreground bg-muted hover:bg-muted/80 hover:text-foreground px-2.5 py-1 rounded-md border border-border/40 font-mono transition-colors"
                              >
                                <span>{commit.hash}</span>
                                <ExternalLink size={10} />
                              </a>

                            </div>

                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Pagination Controls */}
                {(() => {
                  const totalPages = Math.ceil(filteredCommits.length / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  
                  if (totalPages <= 1) return null;

                  return (
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-border/40 mt-6 gap-4">
                      <div className="text-[10px] font-black uppercase text-muted-foreground tracking-wide">
                        Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCommits.length)} trên {filteredCommits.length} commits
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                          className="h-8 rounded-lg text-[10px] font-extrabold uppercase tracking-wider px-3 border-border hover:bg-muted/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                  currentPage === pageNum
                                    ? "bg-primary text-primary-foreground font-black shadow-sm"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <Button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          className="h-8 rounded-lg text-[10px] font-extrabold uppercase tracking-wider px-3 border-border hover:bg-muted/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </Card>

        {/* CREATE BRANCH FORM MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-border p-6 rounded-3xl w-full max-w-sm space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-foreground">
                Tạo Nhánh Mới (Mock Branch)
              </h3>

              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="branch-name" className="text-[10px] font-bold text-muted-foreground uppercase">Tên nhánh (Branch Name)</Label>
                  <Input 
                    id="branch-name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Ví dụ: feature/dashboard-stats"
                    className="h-10 rounded-xl"
                  />
                  <div className="flex gap-1.5 p-2 border border-blue-100 dark:border-blue-950/40 bg-blue-50/10 rounded-lg text-[10px] text-muted-foreground leading-normal mt-1">
                    <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>Tên nhánh sẽ được chuẩn hóa thành dạng chữ thường không dấu, khoảng trắng thay bằng dấu gạch ngang (-).</span>
                  </div>
                </div>

                <div className="flex gap-3.5 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-10 rounded-xl"
                  >
                    Hủy bỏ
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  >
                    Tạo nhánh
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
