"use client";

import React, { useState, useEffect } from "react";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  RefreshCw,
  GraduationCap,
  Code,
  Globe,
  Database,
  BookOpen,
  Terminal,
  Cpu,
  ArrowRight
} from "lucide-react";

// Mock semesters & subject cards data
const semestersData = [
  { id: "summer-2026", name: "Summer 2026" },
  { id: "spring-2026", name: "Spring 2026" },
  { id: "fall-2025", name: "Fall 2025" },
];

interface Subject {
  id: string;
  code: string;
  name: string;
  icon: "code" | "globe" | "database" | "book" | "terminal" | "cpu";
  classes: { 
    id: string; 
    name: string; 
    project: string;
    lecturer: string;
    slot: string;
  }[];
}

const subjectsData: Record<string, Subject[]> = {
  "summer-2026": [
    {
      id: "cse391",
      code: "CSE391",
      name: "Công nghệ phần mềm",
      icon: "code",
      classes: [
        { id: "cse391-pbl07", name: "Lớp SE102.O12", project: "Nhóm PBL-07", lecturer: "Thầy Nguyễn Văn A", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    },
    {
      id: "prn231",
      code: "PRN231",
      name: "Lập trình Web với .NET",
      icon: "globe",
      classes: [
        { id: "prn231-pbl02", name: "Lớp SE103.A11", project: "Nhóm PBL-02", lecturer: "Cô Trần Thị B", slot: "Slot 2 (9:30 - 11:45)" },
      ]
    }
  ],
  "spring-2026": [
    {
      id: "swp391",
      code: "SWP391",
      name: "Dự án Phát triển Phần mềm",
      icon: "terminal",
      classes: [
        { id: "swp391-pbl03", name: "Lớp SE104.M21", project: "Nhóm PBL-03", lecturer: "Thầy Lê Hoàng C", slot: "Slot 3 (12:30 - 14:45)" },
      ]
    },
    {
      id: "swr302",
      code: "SWR302",
      name: "Yêu cầu phần mềm",
      icon: "book",
      classes: [
        { id: "swr302-pbl01", name: "Lớp SE105.D11", project: "Nhóm PBL-01", lecturer: "Cô Phạm Thanh D", slot: "Slot 4 (15:00 - 17:15)" },
      ]
    }
  ],
  "fall-2025": [
    {
      id: "prn211",
      code: "PRN211",
      name: "Lập trình C# cơ bản",
      icon: "cpu",
      classes: [
        { id: "prn211-pbl05", name: "Lớp SE106.T12", project: "Nhóm PBL-05", lecturer: "Thầy Vũ Minh E", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    },
    {
      id: "mad101",
      code: "MAD101",
      name: "Toán rời rạc ứng dụng",
      icon: "database",
      classes: [
        { id: "mad101-pbl04", name: "Lớp SE107.V11", project: "Nhóm PBL-04", lecturer: "Cô Ngô Phương F", slot: "Slot 2 (9:30 - 11:45)" },
      ]
    }
  ],
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [activeSemester, setActiveSemester] = useState("");
  const [activeClass, setActiveClass] = useState("");

  // States for dynamic selection interface
  const [selectedSemester, setSelectedSemester] = useState("summer-2026");
  const [globalClassSelect, setGlobalClassSelect] = useState("all");

  useEffect(() => {
    setIsMounted(true);

    const loadSelection = () => {
      const sem = localStorage.getItem("saga-student-semester") || "";
      const cls = localStorage.getItem("saga-student-class") || "";
      setActiveSemester(sem);
      setActiveClass(cls);
    };

    loadSelection();

    window.addEventListener("saga-student-class-changed", loadSelection);
    return () => {
      window.removeEventListener("saga-student-class-changed", loadSelection);
    };
  }, []);

  const handleConfirmCardSelection = (subjectId: string, classId: string) => {
    if (!selectedSemester || !classId) {
      toast.error("Vui lòng chọn lớp học đầy đủ.");
      return;
    }
    localStorage.setItem("saga-student-semester", selectedSemester);
    localStorage.setItem("saga-student-class", classId);
    setActiveSemester(selectedSemester);
    setActiveClass(classId);
    toast.success("Truy cập Dashboard môn học thành công!");

    // Dispatch custom event to notify components
    window.dispatchEvent(new Event("saga-student-class-changed"));
  };

  const handleSwitchClass = () => {
    localStorage.removeItem("saga-student-semester");
    localStorage.removeItem("saga-student-class");
    setActiveSemester("");
    setActiveClass("");
    setGlobalClassSelect("all");

    window.dispatchEvent(new Event("saga-student-class-changed"));
  };

  const getSemesterName = (semId: string) => {
    return semestersData.find((s) => s.id === semId)?.name ?? semId;
  };

  const getClassName = (semId: string, classId: string) => {
    if (!semId || !classId) return "";
    const subjects = subjectsData[semId] || [];
    for (const sub of subjects) {
      const cls = sub.classes.find((c) => c.id === classId);
      if (cls) return `${sub.name} - ${cls.name}`;
    }
    return classId;
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case "code":
        return <Code className="w-8 h-8 text-primary" />;
      case "globe":
        return <Globe className="w-8 h-8 text-primary" />;
      case "database":
        return <Database className="w-8 h-8 text-primary" />;
      case "book":
        return <BookOpen className="w-8 h-8 text-primary" />;
      case "terminal":
        return <Terminal className="w-8 h-8 text-primary" />;
      case "cpu":
        return <Cpu className="w-8 h-8 text-primary" />;
      default:
        return <BookOpen className="w-8 h-8 text-primary" />;
    }
  };

  // Helper to extract all classes in selected semester
  const getSemesterClasses = (semId: string) => {
    const subjects = subjectsData[semId] || [];
    const classesList: { id: string; name: string; subjectCode: string }[] = [];

    subjects.forEach((sub) => {
      sub.classes.forEach((cls) => {
        classesList.push({
          id: cls.id,
          name: cls.name,
          subjectCode: sub.code,
        });
      });
    });

    return classesList;
  };

  const handleSemesterChange = (semId: string) => {
    setSelectedSemester(semId);
    setGlobalClassSelect("all");
  };

  const isSettingsPage = pathname === "/student/settings";

  if (!isMounted) {
    return (
      <RouteGuard allowedRoles={["student"]}>
        <div className="min-h-screen bg-background" />
      </RouteGuard>
    );
  }

  const showSelectionScreen = !activeSemester || !activeClass;
  const subjects = subjectsData[selectedSemester] || [];

  // Filter subjects based on global class select
  const filteredSubjects = globalClassSelect === "all"
    ? subjects
    : subjects.filter((sub) => sub.classes.some((c) => c.id === globalClassSelect));

  const semesterClasses = getSemesterClasses(selectedSemester);

  return (
    <RouteGuard allowedRoles={["student"]}>
      <div className="min-h-screen bg-background flex flex-col w-full relative">
        <main className="w-full flex-1">
          {isSettingsPage ? (
            children
          ) : showSelectionScreen ? (
            <div className="flex flex-col justify-start min-h-[calc(100vh-72px)] p-6 md:p-12 bg-background animate-in fade-in slide-in-from-bottom-6 duration-600 space-y-8">

              {/* Header Title Section */}
              <div className="flex flex-col items-center text-center space-y-3 max-w-xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  Lựa chọn Môn học
                </h1>
              </div>

              {/* Semester Categories Tab Menu - Left Aligned */}
              <div className="flex flex-wrap items-center justify-start gap-2 p-1.5 bg-muted/30 border border-border/30 rounded-2xl max-w-2xl ml-8 mr-auto shadow-sm backdrop-blur-sm">
                {semestersData.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => handleSemesterChange(sem.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 active:scale-95 ${selectedSemester === sem.id
                      ? "bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(234,88,12,0.25)] scale-[1.03]"
                      : "hover:bg-muted text-muted-foreground font-bold hover:text-foreground"
                      }`}
                  >
                    {sem.name}
                  </button>
                ))}
              </div>

              {/* Global Class Dropdown Filter (No Background Box Container) - Aligned to Right */}
              <div className="w-full flex justify-end px-8 animate-in fade-in duration-300 items-center gap-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground shrink-0 hidden sm:inline">
                  Bộ lọc lớp:
                </Label>
                <Select
                  value={globalClassSelect}
                  onValueChange={setGlobalClassSelect}
                >
                  <SelectTrigger className="w-48 h-10 bg-background/50 border-border/60 rounded-xl font-bold shadow-sm focus:ring-primary/20 text-xs">
                    <SelectValue placeholder="-- Tất cả lớp học --" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4} className="rounded-xl border-border/60 bg-card">
                    <SelectItem value="all" className="text-xs font-semibold rounded-lg">
                      -- Tất cả lớp học --
                    </SelectItem>
                    {semesterClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id} className="text-xs font-semibold rounded-lg">
                        {cls.subjectCode} - {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Cards Grid Layout (Vertical Rectangles - Portrait aspect ratio) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-8 mt-2">
                {filteredSubjects.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground font-semibold">
                    Không có môn học nào khớp với bộ lọc lớp này.
                  </div>
                ) : (
                  filteredSubjects.map((subj) => {
                    const defaultClass = subj.classes[0];
                    if (!defaultClass) return null;

                    return (
                      <Card
                        key={subj.id}
                        className="relative overflow-hidden group border border-white/10 dark:border-white/5 hover:border-primary/45 bg-white/5 dark:bg-black/10 backdrop-blur-3xl rounded-[2rem] p-8 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.15)] hover:-translate-y-2.5 flex flex-col items-start justify-between text-left min-h-[365px] aspect-[3/4] max-w-[340px] mx-0 w-full"
                      >
                        {/* Dreamy radial neon glow spots (behind content) */}
                        <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/25 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
                        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-primary/5 rounded-full blur-[35px] group-hover:bg-primary/15 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

                        {/* Top Section: Left-Aligned Subject Info */}
                        <div className="flex flex-col items-start space-y-5 relative z-10 w-full mt-1">

                          <div className="flex flex-col items-start space-y-2.5 w-full">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg w-fit shadow-[0_2px_10px_rgba(234,88,12,0.08)]">
                              {subj.code}
                            </span>

                            <h3 className="text-xl font-black text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2 pr-2 text-left tracking-tight">
                              {subj.name}
                            </h3>

                            <p className="text-xs font-black text-muted-foreground mt-1 bg-white/5 dark:bg-white/5 px-3 py-1 rounded-xl border border-white/10 dark:border-white/5 w-fit shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                              {defaultClass.name}
                            </p>

                            {/* Lecturer & Study Slot Details */}
                            <div className="flex flex-col items-start space-y-1.5 mt-4 text-xs font-bold text-muted-foreground w-full">
                              <span className="text-foreground/80 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                GV: {defaultClass.lecturer}
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/25 w-fit shadow-[0_2px_8px_rgba(234,88,12,0.1)]">
                                {defaultClass.slot}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Button - Arrow Style with Text */}
                        <div className="w-full relative z-10 mt-6 mb-1 flex justify-end">
                          <Button
                            onClick={() => handleConfirmCardSelection(subj.id, defaultClass.id)}
                            className="h-11 rounded-full px-5 flex items-center gap-2 shadow-[0_4px_14px_rgba(234,88,12,0.3)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.55)] bg-primary text-primary-foreground hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 group/btn"
                          >
                            <span className="text-xs font-black uppercase tracking-wider">Dashboard</span>
                            <ArrowRight className="w-4.5 h-4.5 group-hover/btn:translate-x-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>

            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </RouteGuard>
  );
}
