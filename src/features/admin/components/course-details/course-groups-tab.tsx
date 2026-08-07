import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Group {
  id: string;
  name: string;
  members: number;
  leader: string;
  topic: string;
}

interface CourseGroupsTabProps {
  groups: Group[];
  courseId: string;
}

export function CourseGroupsTab({ groups, courseId }: CourseGroupsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-foreground">Danh sách Nhóm (Chỉ xem)</h2>
        <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-xl">
          Việc chia nhóm do Giảng viên phụ trách
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="p-5 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full group">

            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground leading-tight">{group.name}</h3>
                <p className="text-xs text-muted-foreground font-medium mt-1">{group.members} thành viên</p>
              </div>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md uppercase">
                Team
              </span>
            </div>

            {/* Topic */}
            <div className="flex-1 mb-4">
              <p className="text-[13px] text-muted-foreground font-bold mb-1 uppercase tracking-wider">Đề tài</p>
              <p className="text-sm text-foreground font-medium line-clamp-2" title={group.topic}>
                {group.topic}
              </p>
            </div>

            {/* Footer with Leader & Action */}
            <div className="pt-4 border-t border-border/50 flex flex-col gap-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(group.members, 4) }).map((_, i) => (
                    <Avatar key={i} className="inline-block border-2 border-card w-7 h-7">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${group.id}${i}`} />
                      <AvatarFallback className="bg-primary/10 text-[10px] text-primary font-bold">SV</AvatarFallback>
                    </Avatar>
                  ))}
                  {group.members > 4 && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-card z-10 text-muted-foreground">
                      +{group.members - 4}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end max-w-[50%]">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Trưởng nhóm</span>
                  <span className="text-xs font-semibold text-foreground truncate w-full text-right" title={group.leader}>
                    {group.leader}
                  </span>
                </div>
              </div>

              <Link href={`/admin/courses/${courseId}/teams/${group.id}`} className="w-full">
                <Button variant="ghost" size="sm" className="w-full rounded-xl bg-muted/40 hover:bg-primary hover:text-primary-foreground font-semibold transition-all h-9 text-sm text-foreground">
                  Chi tiết & Đánh giá
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
