"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Download,
  Users, UsersRound, FolderKanban,
  Sparkles,
  BookOpen, Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/shared/Skeleton";
import { toast } from "sonner";
import { MetricCard } from "@/components/shared/MetricCard";
import { CourseSettingsTab } from "@/features/admin/components/course-details/course-settings-tab";
import { CourseStudentsTab } from "@/features/admin/components/course-details/course-students-tab";
import { CourseGroupsTab, Group } from "@/features/admin/components/course-details/course-groups-tab";
import { CourseProjectsTab, Project } from "@/features/admin/components/course-details/course-projects-tab";
import { CourseStudentModal } from "@/features/admin/components/course-details/course-student-modal";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";



export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: courseId } = React.use(params);

  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);

  const [searchQuery, setSearchQuery] = useState("");
  const { data: studentsResponse, isLoading: isLoadingStudents } = useCourseStudents(courseId, {
    keyword: searchQuery,
    page: 0,
    size: 50
  });

  const students = React.useMemo(() => {
    if (!studentsResponse) return [];

    const withTeam = studentsResponse.studentsWithTeam.content.map((s, index) => ({
      id: s.studentId || (s as { id?: string }).id || `with-${index}`,
      studentId: s.studentCode,
      name: s.fullName,
      email: s.email,
      status: "Bình thường",
      avatar: `https://i.pravatar.cc/150?u=${s.studentId}`,
      teamName: s.team?.teamName
    }));

    const withoutTeam = studentsResponse.studentsWithoutTeam.content.map((s, index) => ({
      id: s.studentId || (s as { id?: string }).id || `without-${index}`,
      studentId: s.studentCode,
      name: s.fullName,
      email: s.email,
      status: "Bình thường",
      avatar: `https://i.pravatar.cc/150?u=${s.studentId}`,
      teamName: undefined
    }));

    const allStudents = [...withTeam, ...withoutTeam];

    // Loại bỏ các phần tử trùng lặp id (do backend trả về trùng trong withTeam/withoutTeam)
    const uniqueStudentsMap = new Map();
    allStudents.forEach(student => {
      if (!uniqueStudentsMap.has(student.id)) {
        uniqueStudentsMap.set(student.id, student);
      }
    });

    return Array.from(uniqueStudentsMap.values());
  }, [studentsResponse]);

  const dynamicGroups = React.useMemo(() => {
    if (!studentsResponse) return [];

    const teamMap = new Map<string, Group>();

    studentsResponse.studentsWithTeam.content.forEach(s => {
      if (!s.team) return;
      if (!teamMap.has(s.team.teamId)) {
        teamMap.set(s.team.teamId, {
          id: s.team.teamId,
          name: s.team.teamName,
          members: (s.team.teamMembers || []).length,
          leader: (s.team.teamMembers || []).find(m => m.roleInTeam === 'LEADER')?.fullName || "Chưa có Leader",
          topic: s.team.projectName || "Chưa có đề tài",
        });
      }
    });

    return Array.from(teamMap.values());
  }, [studentsResponse]);

  const dynamicProjects = React.useMemo(() => {
    if (!studentsResponse) return [];

    const projectMap = new Map<string, Project>();

    studentsResponse.studentsWithTeam.content.forEach(s => {
      if (!s.team || !s.team.projectId) return;
      if (!projectMap.has(s.team.projectId)) {
        projectMap.set(s.team.projectId, {
          id: s.team.projectId,
          name: s.team.projectName,
          group: s.team.teamName,
          teamId: s.team.teamId,
          status: "Đang thực hiện",
          progress: 50,
          githubRepos: [`saga-frontend-${s.team.teamId}`, `saga-backend-${s.team.teamId}`],
          jiraBoard: `Jira Board ${s.team.teamName}`
        });
      }
    });

    return Array.from(projectMap.values());
  }, [studentsResponse]);

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
    toast.info("Chức năng thêm/sửa sinh viên qua form đang được phát triển.");
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = () => {
    toast.info("Chức năng xóa sinh viên đang được phát triển.");
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

  const isLoading = isLoadingCourse || isLoadingStudents;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80 transition-all"
            onClick={() => router.push('/master-data/courses')}
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
        {isLoadingCourse ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-5 w-64 rounded-md" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Lớp {course?.clazz?.classCode || course?.name}
              </h1>
              <span className="inline-flex items-center text-[11px] px-3 py-1 bg-success/15 text-success border border-success/20 rounded-full font-bold uppercase tracking-wider shadow-sm">
                ĐANG DIỄN RA
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-medium text-muted-foreground mt-1">
              <span className="flex items-center gap-1.5 text-foreground">
                <BookOpen size={15} className="opacity-70" />
                {course?.subject?.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-border shrink-0" />
              <span className="flex items-center gap-1.5">
                Giảng viên: <strong className="text-foreground">{course?.instructor?.fullName}</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-border shrink-0" />
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="opacity-70" />
                {course?.semester?.name}
              </span>
            </div>
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
          { label: "Tổng sinh viên", value: students.length, icon: <Users className="w-4 h-4" /> },
          { label: "Số lượng nhóm", value: dynamicGroups.length, icon: <UsersRound className="w-4 h-4" /> },
          { label: "Số lượng dự án", value: dynamicProjects.length, icon: <FolderKanban className="w-4 h-4" /> }
        ].map((stat, i) => (
          <MetricCard
            key={i}
            title={stat.label}
            value={isLoadingCourse ? "-" : stat.value.toString()}
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
              <CourseSettingsTab classDetails={{
                className: course?.clazz?.classCode || "",
                subject: course?.subject?.name || "",
                semester: course?.semester?.name || "",
                codeWeight: course?.codeContributionWeight,
                docWeight: course?.documentContributionWeight,
                designWeight: course?.designContributionWeight,
                instructorId: course?.instructor?.id,
              }} />
            </TabsContent>

            <TabsContent value="students" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <CourseStudentsTab
                students={students}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddStudent={openAddStudent}
                onEditStudent={openEditStudent}
                onDeleteStudent={handleDeleteStudent}
                courseId={courseId}
                courseName={course?.clazz?.classCode || course?.name || ""}
              />
            </TabsContent>

            <TabsContent value="groups" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <CourseGroupsTab groups={dynamicGroups} courseId={courseId} />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <CourseProjectsTab projects={dynamicProjects} courseId={courseId} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Student Modal */}
      <CourseStudentModal
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
