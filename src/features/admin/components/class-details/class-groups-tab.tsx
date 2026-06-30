import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Group {
  id: string;
  name: string;
  members: number;
  leader: string;
  topic: string;
}

interface ClassGroupsTabProps {
  groups: Group[];
}

export function ClassGroupsTab({ groups }: ClassGroupsTabProps) {
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
          <div key={group.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-xl text-foreground">{group.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{group.members} thành viên</p>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-foreground mb-2">Đề tài:</p>
              <div className="p-3 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground border border-border/50">
                {group.topic}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
              <div className="flex -space-x-2 overflow-hidden">
                {Array.from({ length: Math.min(group.members, 4) }).map((_, i) => (
                  <Avatar key={i} className="inline-block border-2 border-background w-8 h-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${group.id}${i}`} />
                    <AvatarFallback className="bg-primary/10 text-xs text-primary font-bold">SV</AvatarFallback>
                  </Avatar>
                ))}
                {group.members > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-background z-10 text-muted-foreground">
                    +{group.members - 4}
                  </div>
                )}
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-md">
                Trưởng nhóm: {group.leader}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
