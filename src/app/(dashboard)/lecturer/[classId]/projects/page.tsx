"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderKanban, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const MOCK_PROJECTS = [
  { id: 1, name: "Nhóm 1", project: "Hệ thống quản lý thư viện", members: 5, leader: "Nguyễn Văn A" },
  { id: 2, name: "Nhóm 2", project: "App đặt đồ ăn online", members: 4, leader: "Lê Văn C" },
  { id: 3, name: "Nhóm 3", project: "Website học trực tuyến", members: 5, leader: "Trần Thị B" },
];

export default function ProjectsManagementPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = React.use(params);
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={`Quản lý nhóm dự án - Lớp ${classId}`}
          description="Quản lý thông tin các nhóm, đề tài và thành viên."
        />
        <Button className="gap-2 rounded-xl">
          <Plus size={16} />
          Tạo nhóm ngẫu nhiên
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <Link key={project.id} href={`/lecturer/${classId}/projects/${project.id}`} className="group block h-full">
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
                    <span className="text-sm">{project.members} thành viên</span>
                  </div>
                  <div className="flex -space-x-3 overflow-hidden mb-6">
                    {[...Array(project.members)].map((_, i) => (
                      <Avatar key={i} className="inline-block border-2 border-background w-9 h-9 transition-transform duration-300 group-hover:translate-x-1">
                        <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                          U{i+1}
                        </AvatarFallback>
                      </Avatar>
                    ))}
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
        ))}
      </div>
    </div>
  );
}
