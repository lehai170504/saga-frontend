"use client";

import React from "react";
import Link from "next/link";
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { CourseStudent } from "@/features/courses/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface StudentTableRowProps {
  student: CourseStudent;
  index: number;
  courseId: string;
}

export function StudentTableRow({ student, index, courseId }: StudentTableRowProps) {
  const { user: currentUser } = useAuth();
  const role = student.team?.teamMembers.find((m) => m.studentId === student.studentId)?.roleInTeam;

  const avatarSrc =
    (student as any).avatarUrl ||
    (student as any).avatar ||
    (student as any).picture ||
    (student as any).photoUrl ||
    (currentUser &&
    (currentUser.localProfileId === student.studentId ||
      currentUser.email === student.email ||
      currentUser.fullName === student.fullName)
      ? currentUser.avatarUrl || currentUser.avatar
      : "") ||
    "";

  return (
    <TableRow key={student.studentId} className="hover:bg-muted/30 transition-colors group">
      <TableCell className="text-center font-medium text-muted-foreground w-12">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border shadow-sm">
            <AvatarImage src={avatarSrc} alt={student.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {student.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-foreground group-hover:text-primary transition-colors">
              {student.fullName}
            </span>
            <span className="text-xs text-muted-foreground">{student.email}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md text-xs border border-border/50">
          {student.studentCode}
        </span>
      </TableCell>
      <TableCell>
        {role === "LEADER" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-sm dark:text-amber-500">
            <Crown size={12} className="text-amber-600 dark:text-amber-500" />
            Nhóm trưởng
          </span>
        ) : role === "MEMBER" ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border shadow-sm">
            Thành viên
          </span>
        ) : (
          <span className="text-muted-foreground text-xs italic">-</span>
        )}
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 hover:bg-primary/10 font-semibold rounded-lg"
          asChild
        >
          <Link href={`/lecturer/${courseId}/students/${student.studentId}`}>Chi tiết</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
