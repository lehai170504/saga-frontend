"use client";

import React from "react";
import { Users, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TeamMemberItem {
  studentId: string;
  fullName: string;
  studentCode: string;
  roleInTeam: string;
  email?: string;
}

interface TeamMembersListProps {
  sortedMembers: TeamMemberItem[];
}

export function TeamMembersList({ sortedMembers }: TeamMembersListProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-extrabold tracking-widest uppercase text-muted-foreground ml-2 flex items-center gap-2">
        <Users size={16} />
        Thành viên trong nhóm ({sortedMembers.length})
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedMembers.map((member) => {
          const isLeader = member.roleInTeam === "LEADER";
          return (
            <div
              key={member.studentId}
              className={`glass-panel rounded-3xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                isLeader ? "border-primary/30 bg-primary/[0.03]" : "hover:border-border/80"
              }`}
            >
              <Avatar
                className={`h-12 w-12 border-2 ${
                  isLeader ? "border-primary shadow-[0_0_12px_rgba(234,88,12,0.3)]" : "border-background shadow-md"
                }`}
              >
                <AvatarFallback
                  className={`font-bold text-sm ${
                    isLeader
                      ? "bg-gradient-to-br from-primary to-orange-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {member.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold truncate text-foreground leading-tight">{member.fullName}</h4>
                  {isLeader && (
                    <div className="bg-primary/10 p-1 rounded-full shrink-0 animate-pulse">
                      <Crown size={12} className="fill-primary text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isLeader
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted/50 text-muted-foreground border-border/40"
                    }`}
                  >
                    {isLeader ? "Trưởng nhóm" : "Thành viên"}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold truncate">{member.studentCode}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
