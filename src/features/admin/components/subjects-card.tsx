import React from "react";
import { BookMarked, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";
import { Card, CardContent } from "@/components/ui/card";

export type Subject = {
  id: string;
  code: string;
  name: string;
};

interface SubjectsGridProps {
  data: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
}

export function SubjectsGrid({ data, onEdit, onDelete }: SubjectsGridProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="py-12">
          <EmptyState message="Chưa có môn học nào được tạo." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((subject) => (
        <Card key={subject.id} className="rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight uppercase">{subject.code}</h3>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    Mã môn
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-8 w-8"
                  onClick={() => onEdit(subject)}
                  title="Sửa môn học"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                  onClick={() => onDelete(subject.id)}
                  title="Xóa môn học"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border/50 flex-1 flex flex-col justify-center">
              <p className="text-xs font-medium text-muted-foreground mb-1">Tên môn học</p>
              <p className="font-semibold text-foreground line-clamp-2">{subject.name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
