"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, Network, Calendar, Database } from "lucide-react";
import { ClientGuard } from "@/features/auth/components/client-guard";

import { CourseCards } from "@/features/courses/components/course-cards";
import { SemesterCards } from "@/features/semesters/components/semester-cards";
import { SubjectCards } from "@/features/subjects/components/subject-cards";
import { ClassCards } from "@/features/classes/components/class-cards";

export default function EducationDataPage() {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <ClientGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <PageHeader
          title="Quản lý Dữ liệu Đào tạo"
          description="Quản lý tập trung Khóa học (Lớp PBL), Học kỳ, Lớp học và Môn học."
        />

        <div className="bg-gradient-to-br from-primary/5 via-background to-transparent border border-border/50 rounded-[2rem] p-6 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Master Data</p>
            <h3 className="text-xl font-bold text-foreground">Dữ liệu Danh mục</h3>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-card border border-border/50 rounded-[2rem] w-full p-2 grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto lg:h-14">
            <TabsTrigger value="courses" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <GraduationCap className="w-4 h-4 mr-2" />
              Khóa học (PBL)
            </TabsTrigger>
            <TabsTrigger value="semesters" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Calendar className="w-4 h-4 mr-2" />
              Học kỳ
            </TabsTrigger>
            <TabsTrigger value="classes" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <Network className="w-4 h-4 mr-2" />
              Lớp học
            </TabsTrigger>
            <TabsTrigger value="subjects" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">
              <BookOpen className="w-4 h-4 mr-2" />
              Môn học
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <CourseCards />
            </div>
          </TabsContent>

          <TabsContent value="semesters" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <SemesterCards />
            </div>
          </TabsContent>

          <TabsContent value="classes" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <ClassCards />
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="focus-visible:outline-none">
            <div className="bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm">
              <SubjectCards />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientGuard>
  );
}
