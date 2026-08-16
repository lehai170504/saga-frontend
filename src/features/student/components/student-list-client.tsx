"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FolderKanban } from "lucide-react";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { CourseStudent } from "@/features/courses/types";
import { ImportGroupingDialog } from "@/features/lecturer/components/import-grouping-dialog";
import { isCourseEnded } from "@/lib/course-utils";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// Subcomponents
import { StudentListSummaryCards } from "./student-list/student-list-summary-cards";
import { StudentsTableTab } from "./student-list/students-table-tab";
import { ProjectsGridTab, TeamGroupItem } from "./student-list/projects-grid-tab";

export function StudentListClient({ courseId }: { courseId: string }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "projects">("students");

  const { data: studentsData, isLoading: isLoadingStudents } = useCourseStudents(courseId);
  const { data: courseData } = useCourse(courseId);
  const className = courseData?.clazz?.name || courseData?.courseCode || courseId;
  const isEnded = isCourseEnded(courseData?.semester?.endDate);

  const allStudentsWithTeam = useMemo(
    () => studentsData?.studentsWithTeam.content || [],
    [studentsData]
  );
  const allStudentsWithoutTeam = useMemo(
    () => studentsData?.studentsWithoutTeam.content || [],
    [studentsData]
  );

  const totalStudents = allStudentsWithTeam.length + allStudentsWithoutTeam.length;

  const filteredStudentsWithTeam = useMemo(
    () =>
      allStudentsWithTeam.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allStudentsWithTeam, searchTerm]
  );

  const filteredStudentsWithoutTeam = useMemo(
    () =>
      allStudentsWithoutTeam.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allStudentsWithoutTeam, searchTerm]
  );

  // Group students by team (For Table display)
  const sortedGroupedTeams = useMemo(() => {
    const groupedByTeam: Record<string, CourseStudent[]> = {};
    filteredStudentsWithTeam.forEach((s) => {
      const teamName = s.team?.teamName || "Khác";
      if (!groupedByTeam[teamName]) {
        groupedByTeam[teamName] = [];
      }
      groupedByTeam[teamName].push(s);
    });

    return Object.entries(groupedByTeam).sort((a, b) => {
      if (a[0] === "Khác") return 1;
      if (b[0] === "Khác") return -1;
      return a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: "base" });
    });
  }, [filteredStudentsWithTeam]);

  // Extract team cards list (For Projects tab grid)
  const teams = useMemo(() => {
    const teamsMap = new Map<string, TeamGroupItem>();

    allStudentsWithTeam.forEach((student) => {
      if (student.team) {
        if (!teamsMap.has(student.team.teamId)) {
          teamsMap.set(student.team.teamId, {
            id: student.team.teamId,
            name: student.team.teamName,
            project: student.team.projectName || "Chưa có tên dự án",
            members: [],
            leader: "Chưa có Leader",
          });
        }
        const teamObj = teamsMap.get(student.team.teamId)!;
        teamObj.members.push(student);

        const role = student.team.teamMembers.find((m) => m.studentId === student.studentId)?.roleInTeam;
        if (role === "LEADER") {
          teamObj.leader = student.fullName;
        }
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [allStudentsWithTeam]);

  const totalTeams = teams.length;
  const teamsWithProjects = teams.filter((t) => t.project !== "Chưa có tên dự án").length;
  const teamsWithoutProjects = totalTeams - teamsWithProjects;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          workspace={`Khóa ${courseData?.subject?.subjectCode || ""}`}
          title={`Danh sách sinh viên - Lớp ${className}`}
          description="Quản lý toàn bộ sinh viên, theo dõi trạng thái phân nhóm và cảnh báo."
        />
        <div className="flex gap-2">
          <ImportGroupingDialog
            courseId={courseId}
            courseClassName={className}
<<<<<<< HEAD
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["courses", courseId, "students"] });
            }}
=======
            onSuccess={() => window.location.reload()}
            disabled={isEnded}
>>>>>>> c577a12c44b58ec012275a20192ddcf332967b08
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "students" | "projects")} className="w-full">
        {/* Animated Summary Cards */}
        <StudentListSummaryCards
          activeTab={activeTab}
          isLoadingStudents={isLoadingStudents}
          totalStudents={totalStudents}
          studentsWithTeamCount={allStudentsWithTeam.length}
          studentsWithoutTeamCount={allStudentsWithoutTeam.length}
          totalTeams={totalTeams}
          teamsWithProjectsCount={teamsWithProjects}
          teamsWithoutProjectsCount={teamsWithoutProjects}
        />

        {/* Tab Controls */}
        <div className="flex justify-start mb-4">
          <TabsList className="inline-flex w-fit bg-muted/50 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="students"
              className="relative rounded-lg font-bold h-10 px-4 text-sm text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
            >
              {activeTab === "students" && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Danh sách Sinh viên
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="relative rounded-lg font-bold h-10 px-4 text-sm text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
            >
              {activeTab === "projects" && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center">
                <FolderKanban className="w-4 h-4 mr-2" /> Dự án & Nhóm ({teams.length})
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Students Table Tab Content */}
        <TabsContent value="students" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StudentsTableTab
            courseId={courseId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoadingStudents={isLoadingStudents}
            sortedGroupedTeams={sortedGroupedTeams}
            filteredStudentsWithTeam={filteredStudentsWithTeam}
            filteredStudentsWithoutTeam={filteredStudentsWithoutTeam}
          />
        </TabsContent>

        {/* Projects Grid Tab Content */}
        <TabsContent value="projects" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectsGridTab courseId={courseId} isLoadingStudents={isLoadingStudents} teams={teams} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
