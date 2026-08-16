"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Code, FileText, CheckCircle2, Search, ChevronDown, ChevronUp, Beaker } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ContributionMember } from "@/features/lecturer/types/contribution";

const truncateDecimal = (val: number | undefined | null, decimals: number = 2): string => {
  if (val === undefined || val === null || isNaN(val)) {
    return (0).toFixed(decimals);
  }
  const strVal = String(val);
  const parts = strVal.split('.');
  if (parts.length === 1) {
    return val.toFixed(decimals);
  }
  const integerPart = parts[0];
  const decimalPart = parts[1].substring(0, decimals).padEnd(decimals, '0');
  return `${integerPart}.${decimalPart}`;
};

export interface SprintBreakdownItem {
  sprintName: string;
  taskScore: number;
  retrospectiveMultiplier: number;
  adjustedTaskScore: number;
  sliceScore?: number;
  sliceContributionPercentage?: number;
  contributionPercentage?: number;
}

export interface MemberEvaluationItem {
  studentId: string;
  fullName: string;
  studentCode: string;
  finalContributionPercentage: number;
  peerReviewScore: number;
  taskContributionScore: number;
  taskContributionPercentage: number;
  sliceScore?: number;
  sliceContributionPercentage?: number;
  evidenceCount?: number;
  codeContributionPercentage: number;
  codeContributionScore: number;
  testContributionPercentage?: number;
  testContributionScore?: number;
  documentContributionPercentage: number;
  documentContributionScore: number;
  researchContributionPercentage?: number;
  researchContributionScore?: number;
  designContributionPercentage?: number;
  designContributionScore?: number;
  warnings?: Array<{ severity: string; code: string; message: string }>;
  sprintBreakdowns?: SprintBreakdownItem[];
  avatarUrl?: string;
  avatar?: string;
  email?: string;
}

interface MemberContributionCardProps {
  member: ContributionMember;
  isExpanded: boolean;
  onToggleExpand: (studentId: string) => void;
}

export function MemberContributionCard({
  member,
  isExpanded,
  onToggleExpand,
}: MemberContributionCardProps) {
  const { user: currentUser } = useAuth();
  const avatarSrc =
    member.avatarUrl ||
    member.avatar ||
    ((member as unknown as Record<string, unknown>)?.picture as string) ||
    ((member as unknown as Record<string, unknown>)?.photoUrl as string) ||
    (currentUser &&
      (currentUser.localProfileId === member.studentId ||
        currentUser.email === member.email ||
        currentUser.fullName === member.fullName)
      ? currentUser.avatarUrl || currentUser.avatar
      : "") ||
    "";

  const warnings = member.warnings || [];
  const hasWarnings = warnings.length > 0;

  return (
    <div className="glass-panel rounded-[2rem] border border-border/50 bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Card Header */}
      <div className="p-6 bg-muted/20 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-background shadow-md">
            <AvatarImage src={avatarSrc} alt={member.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
              {member.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-base font-extrabold text-foreground">{member.fullName}</h4>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">MSSV: {member.studentCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 self-end sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75">
              % Trước Peer
            </p>
            <span className="text-sm font-black text-muted-foreground">
              {truncateDecimal(member.sliceContributionPercentage)}%
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/75">
              % Đóng góp cuối
            </p>
            <span
              className={`text-lg font-black ${member.finalContributionPercentage < 50 ? "text-destructive" : "text-primary"
                }`}
            >
              {truncateDecimal(member.finalContributionPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-6">
        {/* Warning Section (If Any) */}
        {hasWarnings && (
          <div className="space-y-2">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs font-semibold ${w.severity?.toUpperCase() === "HIGH" || w.severity?.toUpperCase() === "CRITICAL"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500"
                  }`}
              >
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide text-[9px] mr-1.5 px-1.5 py-0.5 rounded bg-current/10">
                    {w.code}
                  </span>
                  <span>{w.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-muted/10 p-4 rounded-2xl border border-border/30">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Điểm Slice Thô</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-extrabold text-foreground">{truncateDecimal(member.sliceScore)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Điểm Task</span>
            <p className="text-sm font-extrabold text-foreground">{truncateDecimal(member.sliceScore ?? member.taskContributionScore)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">% Trước Peer</span>
            <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {truncateDecimal(member.sliceContributionPercentage ?? member.taskContributionPercentage)}%
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">% Cuối (Đã Peer)</span>
            <p className="text-sm font-extrabold text-primary">
              {truncateDecimal(member.finalContributionPercentage ?? member.taskContributionPercentage)}%
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Số minh chứng</span>
            <p className="text-sm font-extrabold text-foreground">{member.evidenceCount || 0}</p>
          </div>
        </div>

        {/* Component Slicing Contribution Percentages */}
        <div className="space-y-3">
          <h5 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-primary" />
            Chi tiết 4 tiêu chí (Radar)
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Code Contribution */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Code size={13} className="text-blue-500" /> Code
                </span>
                <span className="text-xs font-black text-blue-500">{truncateDecimal(member.codeContributionPercentage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(member.codeContributionPercentage || 0, 100)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Điểm: {truncateDecimal(member.codeContributionScore)}</p>
            </div>

            {/* Test Contribution */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Beaker size={13} className="text-emerald-500" /> Test
                </span>
                <span className="text-xs font-black text-emerald-500">{truncateDecimal(member.testContributionPercentage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(member.testContributionPercentage || 0, 100)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Điểm: {truncateDecimal(member.testContributionScore)}</p>
            </div>

            {/* Test Contribution */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  Kiểm thử (Test)
                </span>
                <span className="text-xs font-black text-emerald-500">{truncateDecimal(member.testContributionPercentage ?? 0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(member.testContributionPercentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Điểm hoạt động: {truncateDecimal(member.testContributionScore ?? 0)}
              </p>
            </div>

            {/* Document Contribution */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <FileText size={13} className="text-amber-500" /> Document
                </span>
                <span className="text-xs font-black text-amber-500">{truncateDecimal(member.documentContributionPercentage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(member.documentContributionPercentage || 0, 100)}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">Điểm: {truncateDecimal(member.documentContributionScore)}</p>
            </div>

            {/* Research Contribution */}
            <div className="p-4 rounded-2xl border border-border/30 bg-muted/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Search size={13} className="text-purple-500" />
                  Nghiên cứu (Research)
                </span>
                <span className="text-xs font-black text-purple-500">{truncateDecimal(member.researchContributionPercentage ?? member.designContributionPercentage ?? 0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(member.researchContributionPercentage || member.designContributionPercentage || 0, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                Điểm hoạt động: {truncateDecimal(member.researchContributionScore ?? member.designContributionScore ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Toggle for Sprint Breakdowns */}
        {member.sprintBreakdowns && member.sprintBreakdowns.length > 0 && (
          <div className="border-t border-border/40 pt-4">
            <Button
              type="button"
              onClick={() => onToggleExpand(member.studentId)}
              variant="ghost"
              className="w-full justify-between h-9 px-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold transition-all cursor-pointer"
            >
              <span>Xem chi tiết điểm từng Sprint ({member.sprintBreakdowns.length})</span>
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>

            {isExpanded && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-border/30 bg-muted/5 divide-y divide-border/30 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-6 p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 bg-muted/20">
                  <div className="col-span-2">Sprint</div>
                  <div className="text-center">Điểm Task</div>
                  <div className="text-center">% Trước Peer</div>
                  <div className="text-center">Hệ số Retro</div>
                  <div className="text-center">% Đóng góp cuối</div>
                </div>
                {member.sprintBreakdowns.map((s, sIdx) => (
                  <div key={sIdx} className="grid grid-cols-6 p-3.5 text-xs items-center font-semibold text-foreground">
                    <div className="col-span-2 truncate font-bold text-foreground/90">{s.sprintName}</div>
                    <div className="text-center">{truncateDecimal(s.sliceScore ?? s.taskScore)}</div>
                    <div className="text-center text-blue-600 dark:text-blue-400 font-bold">
                      {truncateDecimal(s.sliceContributionPercentage ?? s.contributionPercentage ?? 0)}%
                    </div>
                    <div className="text-center">x{truncateDecimal(s.retrospectiveMultiplier)}</div>
                    <div className="text-center font-bold text-primary">
                      {truncateDecimal(s.contributionPercentage ?? s.adjustedTaskScore)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
