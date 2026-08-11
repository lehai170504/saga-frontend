"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderKanban, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useCourseStudents } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsManagementPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = React.use(params);
  const { data: studentsData, isLoading: isLoadingStudents } = useCourseStudents(courseId);
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId);

  const courseName = courseData?.clazz?.name || courseId;

  const studentsWithTeam = studentsData?.studentsWithTeam?.content || [];

  // Bóc tách danh sách team từ students
  const teamsMap = new Map<string, {
    id: string;
    name: string;
    project: string;
    members: (typeof studentsWithTeam)[0][];
    leader: string;
  }>();

  studentsWithTeam.forEach(student => {
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

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý nhóm dự án - Lớp ${courseName}`}
          description="Quản lý thông tin các nhóm, đề tài và thành viên."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingStudents || isLoadingCourse ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="rounded-[2rem] h-[250px] shadow-sm border-border bg-card">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="flex -space-x-3 mb-6">
                  <Skeleton className="w-9 h-9 rounded-full border-2 border-background" />
                  <Skeleton className="w-9 h-9 rounded-full border-2 border-background" />
                  <Skeleton className="w-9 h-9 rounded-full border-2 border-background" />
                </div>
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))
        ) : teams.length > 0 ? (
          teams.map((project) => (
            <Link key={project.id} href={`/lecturer/${courseId}/projects/${project.id}`} className="group block h-full">
              <Card className="rounded-[2rem] shadow-sm border-border hover:shadow-md hover:border-primary/40 transition-all duration-300 h-full flex flex-col bg-card hover:bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">{project.name}</div>
                      <CardTitle className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors">{project.project}</CardTitle>
                    </div>
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <FolderKanban size={20} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mt-2 mb-4 text-muted-foreground font-medium">
                      <Users size={16} />
                      <span className="text-sm">{project.members.length} thành viên</span>
                    </div>
                    <div className="flex -space-x-3 overflow-hidden mb-6">
                      {project.members.slice(0, 5).map((member) => (
                        <Avatar key={member.studentId} className="inline-block border-2 border-background w-9 h-9 transition-transform duration-300 group-hover:translate-x-1">
                          <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                            {member.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 5 && (
                        <Avatar className="inline-block border-2 border-background w-9 h-9 transition-transform duration-300 group-hover:translate-x-1">
                          <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                            +{project.members.length - 5}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Trưởng nhóm: </span>
                      <span className="font-bold text-foreground">{project.leader}</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/50 text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-[2rem] bg-muted/30">
            <Users size={48} className="text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-bold text-foreground">Chưa có nhóm nào</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Hiện tại lớp học này chưa có sinh viên nào được phân nhóm, hoặc chưa có danh sách sinh viên.</p>
          </div>
        )}
      </div>
    </div>
  );
}
