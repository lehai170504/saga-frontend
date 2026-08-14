"use client";

import React, { useState } from "react";
import { useProjectTasks } from "../hooks/useTasks";
import { useTaskTraceability } from "../hooks/useTraceability";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, User, CircleDot } from "lucide-react";
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

function TaskTraceabilityDetails({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { data: traceability, isLoading } = useTaskTraceability(projectId, taskId);

  if (isLoading) {
    return <Skeleton className="h-32 w-full mt-4 rounded-xl" />;
  }

  const githubIssues = traceability?.githubIssues || [];

  if (!traceability || githubIssues.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 pt-6 border-t border-border/50">
      <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <CircleDot size={16} /> Liên kết GitHub
      </h4>
      
      {githubIssues.length > 0 && (
        <div className="space-y-2">
          {githubIssues.map((issue) => (
            <div key={issue.issueId} className="flex items-center justify-between p-3 border border-border bg-card/50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <CircleDot size={16} className={issue.state?.toLowerCase() === 'closed' ? 'text-purple-500' : 'text-emerald-500'} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground leading-tight">{issue.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] font-mono py-0 h-4 bg-background">#{issue.number ?? issue.githubIssueId ?? 0}</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{issue.state}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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

  const getStatusIndicatorColor = (status: string) => {
    if (!status) return "bg-slate-500";
    const s = status.toLowerCase();
    if (s.includes("done") || s.includes("completed") || s.includes("resolved") || s.includes("closed") || s.includes("hoàn thành")) {
      return "bg-emerald-500";
    }
    if (s.includes("progress") || s.includes("doing") || s.includes("đang làm") || s.includes("active")) {
      return "bg-blue-500";
    }
    if (s.includes("review") || s.includes("test")) {
      return "bg-purple-500";
    }
    if (s.includes("block") || s.includes("bug") || s.includes("cancel") || s.includes("fail")) {
      return "bg-destructive";
    }
    return "bg-slate-500";
  };

  const getColumnColor = (status: string) => {
    if (!status) return "border-t-slate-500 bg-slate-500/5";
    const s = status.toLowerCase();
    if (s.includes("done") || s.includes("completed") || s.includes("resolved") || s.includes("closed") || s.includes("hoàn thành")) {
      return "border-t-emerald-500 bg-emerald-500/5";
    }
    if (s.includes("progress") || s.includes("doing") || s.includes("đang làm") || s.includes("active")) {
      return "border-t-blue-500 bg-blue-500/5";
    }
    if (s.includes("review") || s.includes("test")) {
      return "border-t-purple-500 bg-purple-500/5";
    }
    if (s.includes("block") || s.includes("bug") || s.includes("cancel") || s.includes("fail")) {
      return "border-t-destructive bg-destructive/5";
    }
    return "border-t-slate-500 bg-slate-500/5";
  };

  const groupedTasks = React.useMemo(() => {
    const groups: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      const status = task.status || "To Do";
      if (!groups[status]) groups[status] = [];
      groups[status].push(task);
    });
    
    const orderScore = (status: string) => {
      const s = status.toLowerCase().replace(/_/g, " ");
      if (s.includes("to do") || s.includes("todo") || s.includes("backlog") || s.includes("open") || s.includes("mới")) return 1;
      if (s.includes("progress") || s.includes("doing") || s.includes("active")) return 2;
      if (s.includes("review") || s.includes("test")) return 3;
      if (s.includes("done") || s.includes("completed") || s.includes("closed") || s.includes("hoàn thành")) return 4;
      return 5;
    };

    return Object.entries(groups).sort((a, b) => orderScore(a[0]) - orderScore(b[0]));
  }, [tasks]);

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
      <CardContent className="p-6 overflow-x-auto min-h-[500px]">
        {isLoading ? (
          <div className="flex gap-4 w-full">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 min-w-[260px] bg-muted/20 rounded-2xl p-3 border border-border/50 gap-4">
                <Skeleton className="h-8 w-1/2 rounded-lg" />
                <Skeleton className="h-32 w-full rounded-xl mt-4" />
                <Skeleton className="h-32 w-full rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
            Không tìm thấy công việc nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="flex gap-4 items-start pb-4 w-full min-w-max md:min-w-0 h-full">
            {groupedTasks.map(([status, groupTasks]) => (
              <div key={status} className={`flex flex-col flex-1 min-w-[280px] md:min-w-[250px] max-w-[350px] rounded-2xl p-3 border border-border/50 border-t-4 shadow-sm ${getColumnColor(status)}`}>
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusIndicatorColor(status)}`} />
                    <h3 className="font-bold text-sm uppercase text-foreground">{status}</h3>
                  </div>
                  <Badge variant="secondary" className="font-bold bg-background shadow-sm text-muted-foreground">
                    {groupTasks.length}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-3">
                  {groupTasks.map(task => (
                    <Card 
                      key={task.id} 
                      className="rounded-xl border-border/50 bg-background hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-muted-foreground uppercase">{task.externalKey}</span>
                          {task.storyPoint !== undefined && task.storyPoint !== null && (
                            <div className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-muted text-[10px] font-bold">
                              {task.storyPoint}
                            </div>
                          )}
                        </div>
                        <p className="font-semibold text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                          {task.title}
                        </p>
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.labels.map(label => (
                              <span key={label} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-bold">
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="pt-3 flex items-center justify-between border-t border-border/50 mt-2">
                          {task.assignee ? (
                            <Avatar className="h-6 w-6 border shadow-sm" title={task.assignee.fullName}>
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                {task.assignee.fullName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="flex items-center justify-center h-6 w-6 rounded-full border border-dashed bg-muted/30" title="Chưa phân công">
                              <User size={10} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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

                <TaskTraceabilityDetails projectId={projectId} taskId={taskDetail.id} />
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
