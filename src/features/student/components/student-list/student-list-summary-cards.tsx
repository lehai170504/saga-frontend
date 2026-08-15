"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, FolderKanban, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudentListSummaryCardsProps {
  activeTab: "students" | "projects";
  isLoadingStudents: boolean;
  totalStudents: number;
  studentsWithTeamCount: number;
  studentsWithoutTeamCount: number;
  totalTeams: number;
  teamsWithProjectsCount: number;
  teamsWithoutProjectsCount: number;
}

export function StudentListSummaryCards({
  activeTab,
  isLoadingStudents,
  totalStudents,
  studentsWithTeamCount,
  studentsWithoutTeamCount,
  totalTeams,
  teamsWithProjectsCount,
  teamsWithoutProjectsCount,
}: StudentListSummaryCardsProps) {
  return (
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
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : totalStudents}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Đã có Nhóm</p>
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : studentsWithTeamCount}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <UserX size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chưa có Nhóm</p>
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : studentsWithoutTeamCount}
                  </div>
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
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : totalTeams}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Đã có đề tài</p>
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : teamsWithProjectsCount}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Search size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Chưa có đề tài</p>
                  <div className="text-3xl font-bold text-foreground">
                    {isLoadingStudents ? <Skeleton className="h-8 w-16 mt-1" /> : teamsWithoutProjectsCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
