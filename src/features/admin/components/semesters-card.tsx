import React from "react";
import { CalendarDays, CalendarRange, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/DataState";
import { Card, CardContent } from "@/components/ui/card";

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "ended";
};

interface SemestersGridProps {
  data: Semester[];
  onEdit?: (semester: Semester) => void;
  onDelete?: (id: string) => void;
}

export function SemestersGrid({ data, onEdit, onDelete }: SemestersGridProps) {
  if (data.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="py-12">
          <EmptyState message="Chưa có học kỳ nào. Vui lòng thêm mới." />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "upcoming": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "ended": return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Đang diễn ra";
      case "upcoming": return "Sắp tới";
      case "ended": return "Đã kết thúc";
      default: return status;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((semester) => (
        <Card key={semester.id} className="rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          {/* Status Indicator Bar */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${semester.status === 'active' ? 'bg-emerald-500' : semester.status === 'upcoming' ? 'bg-blue-500' : 'bg-zinc-400'}`} />

          <CardContent className="p-6 pt-7">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-foreground text-lg leading-tight">{semester.name}</h3>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 px-2 py-0.5 rounded border inline-block ${getStatusColor(semester.status)}`}>
                    {getStatusLabel(semester.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-8 w-8"
                  onClick={() => onEdit?.(semester)}
                  title="Sửa học kỳ"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                  onClick={() => onDelete?.(semester.id)}
                  title="Xóa học kỳ"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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
