"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateRubricDialog } from "./update-rubric-dialog";
import { DeleteRubricAlert } from "./delete-rubric-alert";
import { RubricCriteria } from "../../api/rubricApi";

interface RubricActionsProps {
  rubric: RubricCriteria;
}

export function RubricActions({ rubric }: RubricActionsProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full data-[state=open]:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] rounded-2xl p-2 shadow-lg">
          <DropdownMenuItem
            onClick={() => setShowUpdate(true)}
            className="rounded-xl cursor-pointer hover:bg-muted font-medium"
          >
            <Edit className="mr-2 h-4 w-4" /> Sửa tiêu chí
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Xóa tiêu chí
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateRubricDialog
        open={showUpdate}
        onOpenChange={setShowUpdate}
        rubric={rubric}
      />
      <DeleteRubricAlert
        open={showDelete}
        onOpenChange={setShowDelete}
        rubric={rubric}
      />
    </>
  );
}
