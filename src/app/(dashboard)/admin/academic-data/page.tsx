"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, ShieldAlert, Upload, Plus, BookOpen, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SemestersGrid, Semester } from "@/features/admin/components/semesters-card";
import { SubjectsGrid, Subject } from "@/features/admin/components/subjects-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialSemesters: Semester[] = [
  { id: "1", name: "Spring 2026", startDate: "2026-01-05", endDate: "2026-04-20", status: "ended" },
  { id: "2", name: "Summer 2026", startDate: "2026-05-05", endDate: "2026-08-20", status: "active" },
  { id: "3", name: "Fall 2026", startDate: "2026-09-05", endDate: "2026-12-20", status: "upcoming" },
];

const initialSubjects: Subject[] = [
  { id: "1", code: "SWE301", name: "Công nghệ phần mềm" },
  { id: "2", code: "PRN211", name: "Lập trình C# nâng cao" },
  { id: "3", code: "PRO192", name: "Lập trình hướng đối tượng" },
  { id: "4", code: "DBI202", name: "Hệ cơ sở dữ liệu" },
  { id: "5", code: "SWT301", name: "Kiểm thử phần mềm" },
  { id: "6", code: "SWP391", name: "Dự án phát triển phần mềm" },
];

export default function AcademicDataPage() {
  const [activeTab, setActiveTab] = useState("semesters");

  // Shared States
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("10 phút trước");
  const [isOverrideMode, setIsOverrideMode] = useState(false);

  // Semesters States
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null);
  const [semesterFormData, setSemesterFormData] = useState({ name: "", startDate: "", endDate: "", status: "upcoming" as "active" | "ended" | "upcoming" });

  // Subjects States
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectFormData, setSubjectFormData] = useState({ code: "", name: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleForceSync = () => {
    setIsSyncing(true);
    const target = activeTab === "semesters" ? "học kỳ" : "môn học";
    toast.loading(`Đang kết nối FAP để đồng bộ ${target}...`, { id: "sync-data" });

    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync("Vừa xong");
      toast.success(`Đã đồng bộ dữ liệu ${target} mới nhất từ hệ thống!`, { id: "sync-data" });
    }, 2000);
  };

  const handleOverrideToggle = (checked: boolean) => {
    if (checked) {
      toast.warning("Đã bật chế độ Khắc phục sự cố. Hãy cẩn thận khi nhập liệu thủ công!", { duration: 5000 });
    } else {
      toast.info("Đã tắt chế độ Khắc phục sự cố.");
    }
    setIsOverrideMode(checked);
  };

  // ================= SEMESTERS MANUAL OPS =================
  const openCreateSemesterModal = () => {
    setEditingSemesterId(null);
    setSemesterFormData({ name: "", startDate: "", endDate: "", status: "upcoming" });
    setIsSemesterModalOpen(true);
  };

  const openEditSemesterModal = (semester: Semester) => {
    setEditingSemesterId(semester.id);
    setSemesterFormData({
      name: semester.name,
      startDate: semester.startDate,
      endDate: semester.endDate,
      status: semester.status
    });
    setIsSemesterModalOpen(true);
  };

  const handleSaveSemester = () => {
    if (!semesterFormData.name || !semesterFormData.startDate || !semesterFormData.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin học kỳ!");
      return;
    }
    if (editingSemesterId) {
      setSemesters(semesters.map(s => s.id === editingSemesterId ? { ...s, ...semesterFormData, isManual: true } : s));
      toast.success("Cập nhật học kỳ thành công!");
    } else {
      const newSemester: Semester = { id: Date.now().toString(), ...semesterFormData, isManual: true };
      setSemesters([...semesters, newSemester]);
      toast.success("Đã thêm học kỳ mới thành công!");
    }
    setIsSemesterModalOpen(false);
  };

  const handleDeleteSemester = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id));
    toast.success("Đã xóa học kỳ thành công!");
  };

  // ================= SUBJECTS MANUAL OPS =================
  const handleImportCSV = () => {
    toast.loading("Đang import dữ liệu từ file CSV...", { id: "import-csv" });
    setTimeout(() => {
      toast.success("Import thành công 40 môn học (Thủ công)!", { id: "import-csv" });
    }, 2000);
  };

  const openCreateSubjectModal = () => {
    setEditingSubjectId(null);
    setSubjectFormData({ code: "", name: "" });
    setIsSubjectModalOpen(true);
  };

  const openEditSubjectModal = (subject: Subject) => {
    setEditingSubjectId(subject.id);
    setSubjectFormData({ code: subject.code, name: subject.name });
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (!subjectFormData.code || !subjectFormData.name) {
      toast.error("Vui lòng điền đầy đủ thông tin môn học!");
      return;
    }
    if (editingSubjectId) {
      setSubjects(subjects.map(s => s.id === editingSubjectId ? { ...s, ...subjectFormData, isManual: true } : s));
      toast.success("Cập nhật môn học thành công!");
    } else {
      const newSubject: Subject = { id: Date.now().toString(), ...subjectFormData, isManual: true };
      setSubjects([...subjects, newSubject]);
      toast.success("Đã thêm môn học mới thành công!");
    }
    setIsSubjectModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success("Đã xóa môn học thành công!");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <PageHeader
        title="Quản lý Dữ liệu Học vụ"
        description="Quản lý đồng bộ Master Data (Học kỳ & Môn học) từ hệ thống FAP."
        workspace="Workspace Quản trị"
      >
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="flex items-center justify-end gap-4 w-full">
            <div className="text-sm text-muted-foreground flex flex-col items-end">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Đã bật tự động đồng bộ
              </span>
              <span className="text-xs mt-1">Cập nhật lần cuối: {lastSync}</span>
            </div>

            <Button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm min-w-[160px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Đang đồng bộ..." : "Ép đồng bộ ngay"}
            </Button>
          </div>

          {/* Override Mode Toggle Bar */}
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50 gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className={`w-5 h-5 ${isOverrideMode ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-bold text-foreground">Chế độ Khắc phục sự cố</p>
                <p className="text-xs text-muted-foreground">Bật để thêm sửa xóa thủ công khi FAP lỗi.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isOverrideMode && (
                <>
                  {activeTab === "subjects" && (
                    <Button variant="outline" size="sm" onClick={handleImportCSV} className="hidden sm:flex h-8 text-xs font-bold bg-background">
                      <Upload className="w-3 h-3 mr-1" /> Import CSV
                    </Button>
                  )}
                  <Button size="sm" onClick={activeTab === "semesters" ? openCreateSemesterModal : openCreateSubjectModal} className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus className="w-3 h-3 mr-1" /> Tạo thủ công
                  </Button>
                </>
              )}
              <Switch checked={isOverrideMode} onCheckedChange={handleOverrideToggle} />
            </div>
          </div>
        </div>
      </PageHeader>

      <Tabs defaultValue="semesters" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] h-12 rounded-xl bg-muted/50 p-1 mb-6">
          <TabsTrigger value="semesters" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full">
            <CalendarDays className="w-4 h-4 mr-2" /> Học kỳ
          </TabsTrigger>
          <TabsTrigger value="subjects" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full">
            <BookOpen className="w-4 h-4 mr-2" /> Môn học
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semesters" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SemestersGrid
              data={semesters}
              isOverrideMode={isOverrideMode}
              onEdit={openEditSemesterModal}
              onDelete={handleDeleteSemester}
            />
          )}
        </TabsContent>

        <TabsContent value="subjects" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SubjectsGrid
              data={subjects}
              isOverrideMode={isOverrideMode}
              onEdit={openEditSubjectModal}
              onDelete={handleDeleteSubject}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Manual Semester Modal */}
      <Dialog open={isSemesterModalOpen} onOpenChange={setIsSemesterModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingSemesterId ? "Sửa học kỳ (Thủ công)" : "Thêm học kỳ (Thủ công)"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chỉ nên sử dụng khi hệ thống đồng bộ FAP gặp sự cố.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sem-name" className="text-right font-medium text-foreground">Tên</Label>
              <Input
                id="sem-name"
                placeholder="VD: Fall 2026"
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                value={semesterFormData.name}
                onChange={(e) => setSemesterFormData({ ...semesterFormData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sem-start" className="text-right font-medium text-foreground">Bắt đầu</Label>
              <Input
                id="sem-start"
                type="date"
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                value={semesterFormData.startDate}
                onChange={(e) => setSemesterFormData({ ...semesterFormData, startDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sem-end" className="text-right font-medium text-foreground">Kết thúc</Label>
              <Input
                id="sem-end"
                type="date"
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                value={semesterFormData.endDate}
                onChange={(e) => setSemesterFormData({ ...semesterFormData, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveSemester} className="rounded-xl font-bold">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Subject Modal */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingSubjectId ? "Sửa môn học (Thủ công)" : "Thêm môn học (Thủ công)"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chỉ nên sử dụng khi hệ thống đồng bộ FAP gặp sự cố.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sub-code" className="text-right font-medium text-foreground">Mã môn</Label>
              <Input
                id="sub-code"
                placeholder="VD: SWE301"
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input uppercase"
                value={subjectFormData.code}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sub-name" className="text-right font-medium text-foreground">Tên môn</Label>
              <Input
                id="sub-name"
                placeholder="Nhập tên môn học..."
                className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input"
                value={subjectFormData.name}
                onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveSubject} className="rounded-xl font-bold">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
