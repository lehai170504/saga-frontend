"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,

  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Search, Users, UserX, UserCheck, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { CourseStudent } from "@/features/courses/types";
import { ImportGroupingDialog } from "@/features/lecturer/components/import-grouping-dialog";
import { motion, AnimatePresence } from "framer-motion";

export function StudentListClient({ courseId }: { courseId: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "projects">("students");

  const { data: studentsData, isLoading: isLoadingStudents } = useCourseStudents(courseId);
  const { data: courseData } = useCourse(courseId);
  const className = courseData?.clazz?.name || courseData?.courseCode || courseId;

  const allStudentsWithTeam = studentsData?.studentsWithTeam.content || [];
  const allStudentsWithoutTeam = studentsData?.studentsWithoutTeam.content || [];
  
  const totalStudents = allStudentsWithTeam.length + allStudentsWithoutTeam.length;

  const filteredStudentsWithTeam = allStudentsWithTeam.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudentsWithoutTeam = allStudentsWithoutTeam.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nhóm học sinh theo team (Dùng cho Table)
  const groupedByTeam: Record<string, CourseStudent[]> = {};
  filteredStudentsWithTeam.forEach(s => {
    const teamName = s.team?.teamName || "Khác";
    if (!groupedByTeam[teamName]) {
      groupedByTeam[teamName] = [];
    }
    groupedByTeam[teamName].push(s);
  });

  const sortedGroupedTeams = Object.entries(groupedByTeam).sort((a, b) => {
    if (a[0] === "Khác") return 1;
    if (b[0] === "Khác") return -1;
    return a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' });
  });

  // Bóc tách danh sách team (Dùng cho Cột phải)
  const teamsMap = new Map<string, {
    id: string;
    name: string;
    project: string;
    members: CourseStudent[];
    leader: string;
  }>();

  allStudentsWithTeam.forEach(student => {
    if (student.team) {
      if (!teamsMap.has(student.team.teamId)) {
        teamsMap.set(student.team.teamId, {
          id: student.team.teamId,
          name: student.team.teamName,
          project: student.team.projectName || "Chưa có tên dự án",
          members: [],
          leader: "Chưa có Leader"
        });
      }
      const teamObj = teamsMap.get(student.team.teamId)!;
      teamObj.members.push(student);

      const role = student.team.teamMembers.find(m => m.studentId === student.studentId)?.roleInTeam;
      if (role === 'LEADER') {
        teamObj.leader = student.fullName;
      }
    }
  });

  const teams = Array.from(teamsMap.values()).sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  const totalTeams = teams.length;
  const teamsWithProjects = teams.filter(t => t.project !== "Chưa có tên dự án").length;
  const teamsWithoutProjects = totalTeams - teamsWithProjects;

  const renderStudentRow = (student: CourseStudent, index: number) => {
    const role = student.team?.teamMembers.find(m => m.studentId === student.studentId)?.roleInTeam;

    return (
      <TableRow key={student.studentId} className="hover:bg-muted/30 transition-colors group">
        <TableCell className="text-center font-medium text-muted-foreground w-12">{index + 1}</TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {student.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-foreground group-hover:text-primary transition-colors">{student.fullName}</span>
              <span className="text-xs text-muted-foreground">{student.email}</span>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md text-xs border border-border/50">
            {student.studentCode}
          </span>
        </TableCell>
        <TableCell>
          {role === 'LEADER' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm dark:text-amber-500">
              <Crown size={12} className="text-amber-600 dark:text-amber-500" />
              Nhóm trưởng
            </span>
          ) : role === 'MEMBER' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border shadow-sm">
              Thành viên
            </span>
          ) : (
            <span className="text-muted-foreground text-xs italic">-</span>
          )}
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 font-semibold rounded-lg" asChild>
            <Link href={`/lecturer/${courseId}/students/${student.studentId}`}>Chi tiết</Link>
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          workspace={`Khóa ${courseData?.subject?.subjectCode || ''}`}
          title={`Danh sách sinh viên - Lớp ${className}`}
          description="Quản lý toàn bộ sinh viên, theo dõi trạng thái phân nhóm và cảnh báo."
        />
        <div className="flex gap-2">
          <ImportGroupingDialog courseId={courseId} courseClassName={className} onSuccess={() => window.location.reload()} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        {/* Animated Summary Cards */}
        <div className="mb-6 relative min-h-[110px]">
          <AnimatePresence mode="wait">
            {activeTab === "students" ? (
              <motion.div
                key="students-stats"
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng Sinh Viên</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : totalStudents}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                      <UserCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Đã có Nhóm</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : allStudentsWithTeam.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
                      <UserX size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chưa có Nhóm</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : allStudentsWithoutTeam.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="projects-stats"
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <FolderKanban size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng số nhóm</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : totalTeams}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                      <UserCheck size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Đã có đề tài</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : teamsWithProjects}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
                      <Search size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chưa có đề tài</p>
                      <p className="text-3xl font-bold text-foreground">
                        {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : teamsWithoutProjects}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
              <span className="relative z-10 flex items-center"><Users className="w-4 h-4 mr-2" /> Danh sách Sinh viên</span>
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
              <span className="relative z-10 flex items-center"><FolderKanban className="w-4 h-4 mr-2" /> Dự án & Nhóm ({teams.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[2rem] shadow-lg border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden h-full">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border/50 bg-muted/10 flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sinh viên, mã số, email..."
                    className="pl-9 bg-background border-border/50 focus-visible:border-primary rounded-xl h-10 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full">
                <Table>
                  <TableHeader className="bg-muted/90 sticky top-0 z-10 backdrop-blur-md shadow-sm">
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="w-[60px] text-center text-xs font-bold uppercase tracking-wider">STT</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Sinh viên</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Mã SV</TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider">Vai trò</TableHead>
                      <TableHead className="w-[100px] text-right text-xs font-bold uppercase tracking-wider">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingStudents ? (
                      // Skeleton Loader
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className="border-border/50">
                          <TableCell><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="space-y-1.5">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto rounded-md" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredStudentsWithTeam.length > 0 || filteredStudentsWithoutTeam.length > 0 ? (
                      <>
                        {sortedGroupedTeams.map(([teamName, students]) => (
                          <React.Fragment key={`team-${teamName}`}>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-border/50">
                              <TableCell colSpan={6} className="py-3">
                                <div className="flex items-center gap-3 pl-2">
                                  <span className="w-1.5 h-6 bg-primary rounded-full shadow-sm"></span>
                                  <span className="font-extrabold text-foreground text-sm uppercase tracking-wide">
                                    {teamName.toLowerCase().includes("group") ? teamName.replace(/group/i, "Nhóm ") : (teamName === "Khác" ? "Chưa vào nhóm" : teamName)}
                                  </span>
                                  <span className="text-primary text-xs font-bold px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                    {students.length} thành viên
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            {students.map((student, index) => renderStudentRow(student, index))}
                          </React.Fragment>
                        ))}

                        {filteredStudentsWithoutTeam.length > 0 && (
                          <React.Fragment key="group-none">
                            <TableRow className="bg-destructive/5 hover:bg-destructive/5 border-border/50">
                              <TableCell colSpan={6} className="py-3">
                                <div className="flex items-center gap-3 pl-2">
                                  <span className="w-1.5 h-6 bg-warning rounded-full shadow-sm"></span>
                                  <span className="font-extrabold text-foreground text-sm uppercase tracking-wide">
                                    Chưa có nhóm
                                  </span>
                                  <span className="text-warning text-xs font-bold px-2 py-0.5 bg-warning/10 rounded-full border border-warning/20">
                                    {filteredStudentsWithoutTeam.length} sinh viên
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                            {filteredStudentsWithoutTeam.map((student, index) => renderStudentRow(student, index))}
                          </React.Fragment>
                        )}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center border-border/50">
                          <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <UserX size={32} className="opacity-20" />
                            <p>Không tìm thấy sinh viên nào phù hợp với bộ lọc.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingStudents ? (
              // Skeleton for projects
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-[2rem] h-[220px] shadow-sm border-border bg-card">
                  <div className="p-6">
                    <Skeleton className="h-4 w-16 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-6" />
                    <Skeleton className="h-4 w-24 mb-6" />
                    <div className="flex -space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))
            ) : teams.length > 0 ? (
              teams.map((project) => (
                <Link key={project.id} href={`/lecturer/${courseId}/projects/${project.id}`} className="group block shrink-0 h-full">
                  <Card className="rounded-[2rem] shadow-sm border-border/50 hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col bg-card/60 hover:bg-card/90 backdrop-blur-sm h-full">
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80 mb-1">{project.name}</div>
                          <h4 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">{project.project}</h4>
                        </div>
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <FolderKanban size={20} />
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground font-medium">
                          <Users size={16} />
                          <span className="text-sm">{project.members.length} thành viên</span>
                        </div>
                        <div className="flex -space-x-3 overflow-hidden mb-5">
                          {project.members.slice(0, 5).map((member) => (
                            <Avatar key={member.studentId} className="inline-block border-2 border-background w-10 h-10 transition-transform duration-300 group-hover:translate-x-1">
                              <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                                {member.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 5 && (
                            <Avatar className="inline-block border-2 border-background w-10 h-10 transition-transform duration-300 group-hover:translate-x-1">
                              <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                                +{project.members.length - 5}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Trưởng nhóm: </span>
                            <span className="font-bold text-foreground truncate max-w-[120px] inline-block align-bottom">{project.leader}</span>
                          </div>
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/50 rounded-[2rem] bg-muted/20">
                <Users size={48} className="text-muted-foreground/30 mb-4" />
                <p className="text-lg font-bold text-muted-foreground">Chưa có nhóm nào</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Hiện tại lớp học này chưa có sinh viên nào được phân nhóm, hoặc chưa có danh sách sinh viên.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
