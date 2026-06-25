"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderKanban } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        <Button className="gap-2">
          <Plus size={16} />
          Tạo nhóm ngẫu nhiên
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <Card key={project.id} className="rounded-2xl shadow-sm border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold text-primary mb-1">{project.name}</div>
                  <CardTitle className="text-lg line-clamp-2">{project.project}</CardTitle>
                </div>
                <div className="p-2 bg-accent rounded-lg text-muted-foreground">
                  <FolderKanban size={20} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mt-4 mb-4">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-sm">{project.members} thành viên</span>
              </div>
              <div className="flex -space-x-2 overflow-hidden mb-6">
                {[...Array(project.members)].map((_, i) => (
                  <Avatar key={i} className="inline-block border-2 border-background w-8 h-8">
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                      U{i+1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">Trưởng nhóm: </span>
                  <span className="font-medium">{project.leader}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8">Chi tiết</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
