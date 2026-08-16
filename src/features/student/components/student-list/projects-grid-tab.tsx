"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban, Users, ArrowRight } from "lucide-react";
import { CourseStudent } from "@/features/courses/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

type MemberWithAvatar = CourseStudent & { avatarUrl?: string; avatar?: string; picture?: string; photoUrl?: string; email?: string };

export interface TeamGroupItem {
  id: string;
  name: string;
  project: string;
  members: CourseStudent[];
  leader: string;
}

interface ProjectsGridTabProps {
  courseId: string;
  isLoadingStudents: boolean;
  teams: TeamGroupItem[];
}

export function ProjectsGridTab({ courseId, isLoadingStudents, teams }: ProjectsGridTabProps) {
  const { user: currentUser } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoadingStudents ? (
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
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80 mb-1">
                      {project.name}
                    </div>
                    <h4 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                      {project.project}
                    </h4>
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
                    {project.members.slice(0, 5).map((member) => {
                      const m = member as MemberWithAvatar;
                      const avatarSrc =
                        m.avatarUrl ||
                        m.avatar ||
                        m.picture ||
                        m.photoUrl ||
                        (currentUser &&
                          (currentUser.localProfileId === m.studentId ||
                            currentUser.email === m.email ||
                            currentUser.fullName === m.fullName)
                          ? currentUser.avatarUrl || currentUser.avatar
                          : "") ||
                        "";
                      return (
                        <Avatar
                          key={member.studentId}
                          className="inline-block border-2 border-background w-10 h-10 transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <AvatarImage src={avatarSrc} alt={member.fullName} />
                          <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                            {member.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
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
                      <span className="font-bold text-foreground truncate max-w-[120px] inline-block align-bottom">
                        {project.leader}
                      </span>
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
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Hiện tại lớp học này chưa có sinh viên nào được phân nhóm, hoặc chưa có danh sách sinh viên.
          </p>
        </div>
      )}
    </div>
  );
}
