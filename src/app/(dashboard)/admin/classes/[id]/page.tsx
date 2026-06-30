"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Search, Plus, Download, MoreHorizontal,
  Edit, Trash2, Users, UsersRound, FolderKanban, Mail,
  GraduationCap, Sparkles, Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MetricCard } from "@/components/shared/MetricCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassSettingsTab } from "@/features/admin/components/class-details/class-settings-tab";
import { ClassStudentsTab } from "@/features/admin/components/class-details/class-students-tab";
import { ClassGroupsTab } from "@/features/admin/components/class-details/class-groups-tab";
import { ClassProjectsTab } from "@/features/admin/components/class-details/class-projects-tab";
import { ClassStudentModal } from "@/features/admin/components/class-details/class-student-modal";
// Custom SVG Icons


// Mock Data
const mockClassDetails = {
  id: "1",
  className: "SE102.M21",
  subject: "Công nghệ phần mềm",
  lecturer: "Dr. Nguyen Van A",
  semester: "Học kỳ 1 - 2023-2024",
  status: "Đang diễn ra",
  totalStudents: 45,
  totalGroups: 9,
  totalProjects: 9,
};

const mockStudents = Array.from({ length: 15 }).map((_, i) => ({
  id: `sv${i + 1}`,
  studentId: `SE180${i.toString().padStart(3, '0')}`,
  name: `Sinh viên ${i + 1}`,
  email: `sv${i + 1}@student.edu.vn`,
  status: i % 5 === 0 ? "Vắng nhiều" : "Bình thường",
  avatar: `https://i.pravatar.cc/150?u=sv${i}`
}));

const mockGroups = Array.from({ length: 9 }).map((_, i) => ({
  id: `g${i + 1}`,
  name: `Nhóm ${i + 1}`,
  members: Math.floor(Math.random() * 2) + 4, // 4-5 members
  leader: `Sinh viên ${i * 5 + 1}`,
  topic: i % 2 === 0 ? "Quản lý thư viện" : "Bán hàng trực tuyến"
}));

const mockProjects = Array.from({ length: 9 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Dự án môn học ${i + 1}: ${i % 2 === 0 ? "Quản lý thư viện" : "Bán hàng trực tuyến"}`,
  group: `Nhóm ${i + 1}`,
  status: i % 3 === 0 ? "Hoàn thành" : "Đang thực hiện",
  progress: i % 3 === 0 ? 100 : Math.floor(Math.random() * 60) + 40,
  githubRepos: [
    `saga-frontend-p${i + 1}`,
    ...(i % 2 === 0 ? [`saga-backend-p${i + 1}`] : [])
  ],
  jiraBoard: `Jira Board Nhóm ${i + 1}`
}));

export default function ClassDetailsPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState(mockStudents);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentFormData, setStudentFormData] = useState({ studentId: "", name: "", email: "", status: "Bình thường" });

  const openAddStudent = () => {
    setEditingStudentId(null);
    setStudentFormData({ studentId: "", name: "", email: "", status: "Bình thường" });
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student: { id: string; studentId: string; name: string; email: string; status: string }) => {
    setEditingStudentId(student.id);
    setStudentFormData({ studentId: student.studentId, name: student.name, email: student.email, status: student.status });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentFormData.name || !studentFormData.studentId) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }
    if (editingStudentId) {
      setStudents(students.map(s => s.id === editingStudentId ? { ...s, ...studentFormData } : s));
      toast.success("Cập nhật sinh viên thành công!");
    } else {
      setStudents([...students, { id: Date.now().toString(), avatar: "https://i.pravatar.cc/150", ...studentFormData }]);
      toast.success("Thêm sinh viên thành công!");
    }
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success("Đã xóa sinh viên khỏi lớp!");
  };

  const handleSimulateAction = (message: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Đang xử lý...',
        success: message,
        error: 'Có lỗi xảy ra',
      }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80 transition-all"
            onClick={() => router.push('/admin/classes')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium backdrop-blur-md">
            <Sparkles size={16} className="animate-pulse" />
            <span>Workspace Quản trị</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-5 w-64 rounded-md" />
          </div>
        ) : (
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-3">
              Lớp {mockClassDetails.className}
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md font-bold align-middle uppercase tracking-wider shadow-sm">
                {mockClassDetails.status}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
              <GraduationCap className="w-4 h-4" />
              {mockClassDetails.subject} • Giảng viên: {mockClassDetails.lecturer} • {mockClassDetails.semester}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl bg-background shadow-sm border-border" onClick={() => handleSimulateAction("Đã xuất dữ liệu lớp thành công!")}>
            <Download className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Tổng sinh viên", value: mockClassDetails.totalStudents, icon: <Users className="w-4 h-4" /> },
          { label: "Số lượng nhóm", value: mockClassDetails.totalGroups, icon: <UsersRound className="w-4 h-4" /> },
          { label: "Số lượng dự án", value: mockClassDetails.totalProjects, icon: <FolderKanban className="w-4 h-4" /> }
        ].map((stat, i) => (
          <MetricCard
            key={i}
            title={stat.label}
            value={isLoading ? "-" : stat.value.toString()}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full sm:w-[500px] grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="settings" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Cài đặt
          </TabsTrigger>
          <TabsTrigger value="students" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Sinh viên
          </TabsTrigger>
          <TabsTrigger value="groups" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Nhóm
          </TabsTrigger>
          <TabsTrigger value="projects" className="font-bold rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Dự án
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="settings" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <ClassSettingsTab classDetails={mockClassDetails} />
            </TabsContent>

            <TabsContent value="students" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <ClassStudentsTab
                students={students}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddStudent={openAddStudent}
                onEditStudent={openEditStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>

            <TabsContent value="groups" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <ClassGroupsTab groups={mockGroups} />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <ClassProjectsTab projects={mockProjects} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Student Modal */}
      <ClassStudentModal
        isOpen={isStudentModalOpen}
        onOpenChange={setIsStudentModalOpen}
        editingStudentId={editingStudentId}
        studentFormData={studentFormData}
        setStudentFormData={setStudentFormData}
        onSave={handleSaveStudent}
      />
    </div>
  );
}
