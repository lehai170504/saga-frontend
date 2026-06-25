import React from "react";
import { BookOpen, Trash2, Edit, User, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";
import { Card, CardContent } from "@/components/ui/card";

export type ClassRoom = {
  id: string;
  className: string;
  subject: string;
  lecturer: string;
};

interface ClassesGridProps {
  data: ClassRoom[];
  onEdit: (cls: ClassRoom) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (cls: ClassRoom) => void;
}

export function ClassesGrid({ data, onEdit, onDelete, onViewDetails }: ClassesGridProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="py-12">
          <EmptyState message="Chưa có lớp học nào được tạo." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((cls) => (
        <Card 
          key={cls.id} 
          className="rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer"
          onClick={() => onViewDetails?.(cls)}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Presentation className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">{cls.className}</h3>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    Lớp học
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); onEdit(cls); }}
                  title="Sửa lớp học"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                  onClick={(e) => { e.stopPropagation(); onDelete(cls.id); }}
                  title="Xóa lớp học"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border/50 flex-1 flex flex-col justify-center">
              <div className="flex items-start gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Môn học</p>
                  <p className="font-semibold text-foreground truncate">{cls.subject}</p>
                </div>
              </div>
              
              <div className="h-px w-full bg-border/50" />
              
              <div className="flex items-start gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Giảng viên</p>
                  <p className="font-semibold text-foreground truncate">{cls.lecturer}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
