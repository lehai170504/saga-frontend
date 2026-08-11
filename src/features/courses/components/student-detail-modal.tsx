"use client";

import { useCourseStudent } from "../hooks/useCourseStudents";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Mail, User, ShieldCheck, UserX, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentDetailModalProps {
  courseId: string;
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailModal({ courseId, studentId, isOpen, onClose }: StudentDetailModalProps) {
  const { data: student, isLoading } = useCourseStudent(courseId, studentId as string, {
    enabled: isOpen && !!studentId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[2rem]">
        <div className="p-6 bg-gradient-to-b from-primary/10 to-background">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Chi tiết Sinh viên
            </DialogTitle>
            <DialogDescription className="hidden">
              Thông tin chi tiết của sinh viên
            </DialogDescription>
          </DialogHeader>

          {isLoading || !student ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {student.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{student.fullName}</h3>
                  <div className="text-muted-foreground font-medium text-sm mt-0.5">{student.studentCode}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-background/60 rounded-2xl border border-border/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</div>
                    <div className="font-medium truncate text-sm">{student.email || "Chưa cập nhật"}</div>
                  </div>
                </div>

                <div className="p-3 bg-background/60 rounded-2xl border border-border/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Trạng thái</div>
                      <div className="font-medium text-sm">Tài khoản</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`rounded-xl px-2 py-0.5 text-xs ${student.accountStatus === "ACTIVE" ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10" : "border-rose-500/30 text-rose-600 bg-rose-500/10"}`}>
                    {student.accountStatus}
                  </Badge>
                </div>

                <div className="p-3 bg-background/60 rounded-2xl border border-border/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${student.team ? "bg-primary/10" : "bg-muted"}`}>
                      {student.team ? <Users className="w-4 h-4 text-primary" /> : <UserX className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nhóm</div>
                      <div className="font-medium text-sm">{student.team ? student.team.teamName : "Chưa có nhóm"}</div>
                    </div>
                  </div>
                  {student.team && (
                    <Badge variant="outline" className="rounded-xl border-primary/20 text-primary bg-primary/5">
                      {student.team.roleInTeam}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
