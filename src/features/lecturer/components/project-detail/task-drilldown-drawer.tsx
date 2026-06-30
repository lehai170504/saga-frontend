"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitCommit, ShieldCheck, Search, PenLine, Check, X, AlertCircle, Link, ExternalLink } from "lucide-react";

interface TaskItem {
  id: string;
  name: string;
  sp: number;
  proofText: string;
  proofType: 'commit' | 'link';
  proofLink?: string;
}

interface DrilldownData {
  title: string;
  tasks: TaskItem[];
}

interface TaskDrilldownDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrilldownData | null;
}

export function TaskDrilldownDrawer({ isOpen, onOpenChange, data }: TaskDrilldownDrawerProps) {
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [overrideSp, setOverrideSp] = React.useState<string>("");

  if (!data) return null;

  const handleEditClick = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setOverrideSp(task.sp.toString());
  };

  const handleSaveOverride = (taskId: string) => {
    // In a real app, dispatch an API call to override the SP
    console.log(`Overriding Task ${taskId} with SP: ${overrideSp}`);
    setEditingTaskId(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto px-4 sm:px-6">
        <SheetHeader className="mb-6 pt-6">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <Search className="text-primary w-6 h-6 shrink-0" />
            <span className="truncate">Chi tiết Khối lượng</span>
          </SheetTitle>
          <SheetDescription className="font-medium text-base break-words">
            {data.title}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Danh sách Task từ Jira</div>

          {data.tasks.map((task, idx) => (
            <div key={idx} className={`p-4 border ${editingTaskId === task.id ? 'border-amber-400 bg-amber-50/10 dark:bg-amber-900/10 shadow-md' : 'border-border bg-card'} rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden relative group`}>

              <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                <Badge variant="outline" className="font-bold border-primary text-primary bg-primary/10 whitespace-nowrap">
                  {task.id}
                </Badge>

                {/* SP Display or Override Input */}
                {editingTaskId === task.id ? (
                  <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-300">
                    <Input
                      value={overrideSp}
                      onChange={(e) => setOverrideSp(e.target.value)}
                      className="h-6 w-14 text-center font-black text-amber-700 dark:text-amber-400 px-1 py-0 text-xs border-amber-400 bg-white dark:bg-black"
                      type="number"
                      step="0.5"
                    />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 mr-1">SP</span>
                    <Button size="icon" variant="ghost" className="h-5 w-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full" onClick={() => handleSaveOverride(task.id)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5 bg-zinc-400 hover:bg-zinc-500 text-white rounded-full" onClick={() => setEditingTaskId(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group/edit">
                    <div className="text-sm font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md whitespace-nowrap">
                      {task.sp} Story Points
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-100 hover:bg-amber-200 text-amber-600 rounded-full"
                      onClick={() => handleEditClick(task)}
                      title="Ghi đè SP (Manual Override)"
                    >
                      <PenLine className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="font-bold text-foreground text-lg mb-2 break-words leading-tight">{task.name}</div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 p-2.5 rounded-lg mt-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  {task.proofType === 'commit' ? <GitCommit className="w-4 h-4 shrink-0" /> : <Link className="w-4 h-4 shrink-0" />}
                  <span className="shrink-0">{task.proofType === 'commit' ? 'Hash (PoW):' : 'Bằng chứng:'}</span>
                </div>

                {task.proofLink ? (
                  <a
                    href={task.proofLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-mono font-bold px-2 py-0.5 rounded break-all border border-border/50 shadow-sm flex items-center gap-1 transition-all ${task.proofType === 'commit'
                      ? 'text-foreground bg-background hover:bg-muted hover:text-indigo-600'
                      : 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/30 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50'
                      }`}
                  >
                    {task.proofText}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className={`font-mono font-bold px-2 py-0.5 rounded break-all ${task.proofText.includes('Late') ? 'text-destructive bg-destructive/10' : 'text-foreground bg-background border border-border/50 shadow-sm'}`}>
                    {task.proofText}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/50 rounded-2xl">
            <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" /> Governance by Exception
            </h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Bạn có quyền <strong>Ghi đè (Override)</strong> điểm Story Points của sinh viên nếu phát hiện AI đánh giá sai lệch khối lượng thực tế, hoặc mã nguồn GitHub không phản ánh đúng chất lượng.
            </p>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" /> Minh bạch (AI Verified)
            </h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Toàn bộ Task trong danh sách này đã được hệ thống AI đối chiếu với Commit Hash (dành cho Code) hoặc Link Bằng chứng (dành cho Design/Docs) để xác thực.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
