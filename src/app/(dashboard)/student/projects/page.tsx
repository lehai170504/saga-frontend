"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Crown, Bookmark } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";

interface GroupMember {
  name: string;
  role: string;
  email: string;
  initials: string;
}

interface ProjectGroup {
  id: number;
  name: string;
  topic: string;
  leader: string;
  members: GroupMember[];
}

const MOCK_GROUPS: ProjectGroup[] = [
  {
    id: 1,
    name: "Nhóm PBL-01",
    topic: "Hệ thống quản lý thư viện số SAGA",
    leader: "Nguyễn Văn An",
    members: [
      { name: "Nguyễn Văn An", role: "Trưởng nhóm / Backend Developer", email: "annvse180001@fpt.edu.vn", initials: "A" },
      { name: "Trần Thị Bình", role: "Frontend Developer / UI Designer", email: "binhttse180002@fpt.edu.vn", initials: "B" },
      { name: "Lê Văn Cường", role: "DevOps Engineer", email: "cuonglvse180003@fpt.edu.vn", initials: "C" },
      { name: "Phạm Thị Dung", role: "Quality Assurance (QA)", email: "dungptse180004@fpt.edu.vn", initials: "D" },
      { name: "Hoàng Văn Em", role: "Fullstack Developer", email: "emhvse180005@fpt.edu.vn", initials: "E" },
    ]
  },
  {
    id: 2,
    name: "Nhóm PBL-02",
    topic: "App ứng dụng đặt đồ ăn trực tuyến FPT Food",
    leader: "Mr. Tran Thi B",
    members: [
      { name: "Mr. Tran Thi B", role: "Trưởng nhóm / Mobile Lead", email: "tranb@fpt.edu.vn", initials: "B" },
      { name: "Vũ Văn Giang", role: "Frontend Developer", email: "giangvv@fpt.edu.vn", initials: "G" },
      { name: "Bùi Thị Hằng", role: "Backend Developer", email: "hangbt@fpt.edu.vn", initials: "H" },
      { name: "Đỗ Văn Inh", role: "Tester", email: "inhdv@fpt.edu.vn", initials: "I" },
    ]
  },
  {
    id: 3,
    name: "Nhóm PBL-03",
    topic: "Nền tảng thi và học thử trực tuyến Coursera-Lite",
    leader: "Dr. Le Van C",
    members: [
      { name: "Dr. Le Van C", role: "Trưởng nhóm / AI Developer", email: "clevan@fpt.edu.vn", initials: "C" },
      { name: "Ngô Thị Phương", role: "Frontend Developer", email: "phuongnt@fpt.edu.vn", initials: "P" },
      { name: "Lý Thị Kim", role: "Database Admin", email: "kimlt@fpt.edu.vn", initials: "K" },
      { name: "Phạm Văn Hải", role: "Backend Developer", email: "haipv@fpt.edu.vn", initials: "H" },
      { name: "Hoàng Thị Mai", role: "Business Analyst (BA)", email: "maiht@fpt.edu.vn", initials: "M" },
    ]
  },
  {
    id: 4,
    name: "Nhóm PBL-04",
    topic: "Cổng thông tin hỗ trợ tìm nhà trọ trọ sinh viên",
    leader: "Ms. Pham Thi D",
    members: [
      { name: "Ms. Pham Thi D", role: "Trưởng nhóm / Fullstack Lead", email: "dpham@fpt.edu.vn", initials: "D" },
      { name: "Dương Văn Nam", role: "UI/UX Designer", email: "namdv@fpt.edu.vn", initials: "N" },
      { name: "Đỗ Thị Thu", role: "Backend Developer", email: "thudt@fpt.edu.vn", initials: "T" },
      { name: "Lê Văn Sang", role: "Frontend Developer", email: "sanglv@fpt.edu.vn", initials: "S" },
      { name: "Trần Văn Khánh", role: "Quality Control", email: "khanhtv@fpt.edu.vn", initials: "K" },
    ]
  },
  {
    id: 5,
    name: "Nhóm PBL-05",
    topic: "Hệ thống quản lý điểm danh thông minh điểm danh",
    leader: "Mr. Hoang Van E",
    members: [
      { name: "Mr. Hoang Van E", role: "Trưởng nhóm / Backend Lead", email: "ehoang@fpt.edu.vn", initials: "E" },
      { name: "Ngô Thị Thu", role: "Frontend Developer", email: "thunt@fpt.edu.vn", initials: "T" },
      { name: "Vũ Thị Vân", role: "Mobile Developer", email: "vanvt@fpt.edu.vn", initials: "V" },
      { name: "Bùi Văn Lâm", role: "Tester / QA", email: "lambv@fpt.edu.vn", initials: "L" },
    ]
  }
];

export default function StudentProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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
    setTimeout(() => setMounted(true), 0);
    const sem = localStorage.getItem("saga-student-semester") || "";
    const cls = localStorage.getItem("saga-student-class") || "";
    
    setTimeout(() => setSelectedClass(cls), 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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
          title="Danh sách nhóm dự án"
          description={`Danh sách thành viên và đề tài của các nhóm trong Lớp ${getClassName(selectedClass)}`}
        />

        {isLoading ? (
          <Card className="rounded-[2rem] border border-border/40 bg-card/20 backdrop-blur-xl shadow-sm overflow-hidden p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl bg-muted/40" />
            ))}
          </Card>
        ) : (
          <div className="space-y-4">
            {MOCK_GROUPS.map((group) => {
              const isOwnGroup = group.name === activeGroup;
              const otherMembers = group.members.filter(m => m.name !== group.leader);

              return (
                <div 
                  key={group.id}
                  className={`relative rounded-3xl p-5 md:p-6 transition-all duration-300 border flex flex-col gap-4 ${
                    isOwnGroup 
                      ? "bg-gradient-to-br from-primary/10 via-indigo-500/5 to-transparent border-primary dark:border-primary/90 shadow-[0_0_30px_rgba(234,88,12,0.35)] dark:shadow-[0_0_35px_rgba(234,88,12,0.25)]" 
                      : "bg-card/25 dark:bg-card/20 backdrop-blur-3xl border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-card/40"
                  }`}
                >
                  {/* Top Row: Group Identity & Leader */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isOwnGroup 
                            ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(234,88,12,0.3)]" 
                            : "bg-muted/50 text-muted-foreground"
                        }`}>
                          {group.name}
                        </span>
                        {isOwnGroup && (
                          <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                            Nhóm của bạn
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <FolderKanban size={14} className="text-primary shrink-0" />
                        {group.topic}
                      </h3>
                    </div>

                    {/* Leader Highlight */}
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 w-fit shrink-0 shadow-[0_2px_8px_rgba(234,88,12,0.05)]">
                      <Crown size={14} className="text-primary fill-current shrink-0 animate-bounce" />
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wide">Trưởng nhóm</span>
                        <span className="text-xs font-black text-primary truncate max-w-[130px]">{group.leader}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Member Names list (on its own line) */}
                  <div className="border-t border-border/20 pt-4 mt-1 space-y-2">
                    <div className="text-[9px] font-black text-muted-foreground uppercase tracking-wide">Thành viên trong nhóm</div>
                    <div className="flex flex-wrap gap-1.5">
                      {otherMembers.map((member, i) => (
                        <div 
                          key={i} 
                          className="bg-muted/30 border border-border/10 rounded-full px-3 py-1 text-xs font-bold text-foreground/80 hover:bg-muted/50 transition-colors"
                        >
                          {member.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
