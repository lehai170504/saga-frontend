"use client";

import React, { useState } from "react";
import { useProjectTasks } from "../hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, User } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useProjectSprints } from "../hooks/useTeamSprints";
import { useTaskDetail } from "../hooks/useTasks";

interface ProjectTaskListProps {
  projectId: string;
  sprintId?: string;
  members?: { id: string; name: string; role?: string }[];
}

export function ProjectTaskList({ projectId, sprintId: initialSprintId, members = [] }: ProjectTaskListProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState<string>(initialSprintId || "all");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: sprintsData } = useProjectSprints(projectId);
  const sprints = sprintsData?.sprints || [];
  
  const { data: tasksData, isLoading } = useProjectTasks(projectId, {
    sprintId: selectedSprintId === "all" ? undefined : selectedSprintId,
    assigneeId: selectedAssigneeId === "all" ? undefined : selectedAssigneeId,
    keyword: keyword || undefined,
    size: 50,
  });

  const { data: taskDetail, isLoading: isLoadingDetail } = useTaskDetail(
    projectId,
    selectedTaskId || ""
  );

  const tasks = tasksData?.content || [];

  const getStatusColor = (status: string) => {
    if (!status) return "bg-muted text-muted-foreground border-border";
    const s = status.toLowerCase();
    if (s.includes("done") || s.includes("completed") || s.includes("resolved") || s.includes("closed") || s.includes("hoàn thành")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
    if (s.includes("progress") || s.includes("doing") || s.includes("đang làm") || s.includes("active")) {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
    if (s.includes("review") || s.includes("test")) {
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
    if (s.includes("block") || s.includes("bug") || s.includes("cancel") || s.includes("fail")) {
      return "bg-destructive/10 text-destructive border-destructive/20";
    }
    // Default (To Do, Backlog, etc)
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  };

  return (
    <Card className="rounded-[2rem] border-border bg-card/40 backdrop-blur-xl shadow-lg">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            Danh sách Công việc (Tasks)
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 h-9 font-medium">
                <SelectValue placeholder="Tất cả Sprints" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-medium">Tất cả Sprints</SelectItem>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.sprintId} value={sprint.sprintId} className="font-medium">
                    {sprint.sprintName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {members.length > 0 && (
              <Select value={selectedAssigneeId} onValueChange={setSelectedAssigneeId}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 h-9 font-medium">
                  <SelectValue placeholder="Người phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-medium">Tất cả thành viên</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="font-medium">
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Tìm kiếm task..."
                className="pl-9 bg-background/50 border-border/50 h-9"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Mã (Key)</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Point</TableHead>
                <TableHead>Người phụ trách</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Không tìm thấy công việc nào.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow 
                    key={task.taskId} 
                    className="group hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedTaskId(task.taskId)}
                  >
                    <TableCell className="pl-6 font-medium whitespace-nowrap text-muted-foreground">
                      {task.externalKey}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground max-w-[300px] truncate" title={task.title}>
                        {task.title}
                      </div>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap max-w-[300px]">
                          {task.labels.map(label => (
                            <span key={label} className="text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary whitespace-nowrap">
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold whitespace-nowrap ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-muted text-xs font-bold">
                        {task.storyPoint ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border shadow-sm">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {task.assignee.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium hidden md:inline-block truncate max-w-[120px]">
                            {task.assignee.fullName}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="flex items-center justify-center h-7 w-7 rounded-full border border-dashed bg-muted/30">
                            <User size={12} />
                          </div>
                          <span className="text-sm hidden md:inline-block">Unassigned</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Sheet open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto px-4 sm:px-6">
          {isLoadingDetail ? (
            <div className="flex flex-col space-y-6 pt-6">
              <Skeleton className="w-1/3 h-8" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-32" />
            </div>
          ) : taskDetail ? (
            <>
              <SheetHeader className="mb-6 pt-6">
                <SheetTitle className="text-2xl font-bold flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-bold border-primary text-primary bg-primary/10">
                      {taskDetail.externalKey}
                    </Badge>
                    <Badge variant="outline" className={`font-bold ${getStatusColor(taskDetail.status)}`}>
                      {taskDetail.status}
                    </Badge>
                  </div>
                  <span className="leading-tight">{taskDetail.title}</span>
                </SheetTitle>
                <SheetDescription className="font-medium">
                  Priority: {taskDetail.priority} | Story Points: {taskDetail.storyPoint ?? "-"}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div className="p-4 border border-border rounded-xl bg-muted/30">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Người phụ trách</h4>
                  {taskDetail.assignee ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarFallback className="font-bold bg-primary/10 text-primary">
                          {taskDetail.assignee.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-foreground">{taskDetail.assignee.fullName}</div>
                        <div className="text-xs font-medium text-muted-foreground">{taskDetail.assignee.studentCode}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-muted-foreground">Chưa phân công</div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Mô tả</h4>
                  {taskDetail.description ? (
                    <div className="text-sm whitespace-pre-wrap text-foreground bg-muted/20 p-4 rounded-xl border border-border/50">
                      {taskDetail.description}
                    </div>
                  ) : (
                    <div className="text-sm italic text-muted-foreground">Không có mô tả</div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Labels & Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {taskDetail.labels.map(label => (
                      <Badge key={label} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        {label}
                      </Badge>
                    ))}
                    {taskDetail.components.map(comp => (
                      <Badge key={comp.id} variant="outline" className="border-primary/50 text-foreground">
                        {comp.name}
                      </Badge>
                    ))}
                    {taskDetail.labels.length === 0 && taskDetail.components.length === 0 && (
                      <span className="text-sm italic text-muted-foreground">Không có</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Không tìm thấy thông tin công việc.
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
