import React from "react";
import { CalendarDays, Trash2, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";
import { Card, CardContent } from "@/components/ui/card";

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

interface SemestersGridProps {
  data: Semester[];
  onDelete: (id: string) => void;
}

export function SemestersGrid({ data, onDelete }: SemestersGridProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="py-12">
          <EmptyState message="Chưa có học kỳ nào được cấu hình." />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((semester) => (
        <Card key={semester.id} className="rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-all group overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">{semester.name}</h3>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                    Học kỳ chính
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mt-1 -mr-1"
                onClick={() => onDelete(semester.id)}
                title="Xóa học kỳ"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 space-y-3 border border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <CalendarRange className="w-4 h-4" /> Bắt đầu
                </span>
                <span className="font-bold text-foreground bg-background px-2 py-0.5 rounded-md border border-border/50">{semester.startDate}</span>
              </div>
              <div className="h-px w-full bg-border/50" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2 font-medium">
                  <CalendarRange className="w-4 h-4" /> Kết thúc
                </span>
                <span className="font-bold text-foreground bg-background px-2 py-0.5 rounded-md border border-border/50">{semester.endDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
