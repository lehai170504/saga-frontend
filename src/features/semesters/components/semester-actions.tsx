"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Semester } from "../types";
import { UpdateSemesterDialog } from "./update-semester-dialog";
import { DeleteSemesterAlert } from "./delete-semester-alert";

interface SemesterActionsProps {
  semester: Semester;
}

export function SemesterActions({ semester }: SemesterActionsProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted/50">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => setShowEdit(true)} className="cursor-pointer rounded-lg">
            <Pencil className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDelete(true)} className="cursor-pointer rounded-lg text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateSemesterDialog
        semester={semester}
        open={showEdit}
        onOpenChange={setShowEdit}
      />
      <DeleteSemesterAlert
        semester={semester}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
}
