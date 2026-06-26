"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";
import {
  Star,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Smile,
  MessageSquare,
  Award,
  ShieldCheck,
  ChevronRight,
  Info,
  Save,
  Send,
  Lock,
  RefreshCw,
} from "lucide-react";

// Mock student profile data based on contribution.ts
interface TeamMember {
  id: string;
  name: string;
  role: string;
  commits: number;
  PRs: number;
  tasks: number;
  isSelf?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: "SV000",
    name: "Lê Hoàng Hải",
    role: "Member (Tôi)",
    commits: 35,
    PRs: 8,
    tasks: 7,
    isSelf: true,
  },
  {
    id: "SV001",
    name: "Nguyễn Văn A",
    role: "Leader",
    commits: 45,
    PRs: 12,
    tasks: 8,
  },
  {
    id: "SV002",
    name: "Trần Thị B",
    role: "Member",
    commits: 32,
    PRs: 5,
    tasks: 7,
  },
  {
    id: "SV003",
    name: "Lê Văn C",
    role: "Member",
    commits: 28,
    PRs: 4,
    tasks: 6,
  },
  {
    id: "SV004",
    name: "Phạm Minh D",
    role: "Member",
    commits: 8,
    PRs: 1,
    tasks: 3,
  },
];

interface RatingState {
  codeQuality: number;
  deadlines: number;
  teamwork: number;
  contributionShare: number;
  comment: string;
  isSaved: boolean;
}

export default function PeerAssessmentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember>(teamMembers[0]);
  const [assessments, setAssessments] = useState<Record<string, RatingState>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAssessments = localStorage.getItem("saga-peer-assessments");
    const savedSubmitted = localStorage.getItem("saga-assessments-submitted") === "true";

    // Initialize blank assessments for each member
    const initialAssessments: Record<string, RatingState> = {};
    teamMembers.forEach((m) => {
      initialAssessments[m.id] = {
        codeQuality: 0,
        deadlines: 0,
        teamwork: 0,
        contributionShare: 20, // Default to equal share
        comment: "",
        isSaved: false,
      };
    });

    if (savedAssessments) {
      try {
        const parsed = JSON.parse(savedAssessments);
        // Merge with initial blank states
        setAssessments({ ...initialAssessments, ...parsed });
      } catch (e) {
        setAssessments(initialAssessments);
      }
    } else {
      setAssessments(initialAssessments);
    }

    setIsSubmitted(savedSubmitted);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRatingChange = (metric: "codeQuality" | "deadlines" | "teamwork", value: number) => {
    if (isSubmitted) return;
    setAssessments((prev) => ({
      ...prev,
      [selectedMember.id]: {
        ...prev[selectedMember.id],
        [metric]: value,
      },
    }));
  };

  const handleShareChange = (value: number) => {
    if (isSubmitted) return;
    setAssessments((prev) => ({
      ...prev,
      [selectedMember.id]: {
        ...prev[selectedMember.id],
        contributionShare: value,
      },
    }));
  };

  const handleCommentChange = (value: string) => {
    if (isSubmitted) return;
    setAssessments((prev) => ({
      ...prev,
      [selectedMember.id]: {
        ...prev[selectedMember.id],
        comment: value,
      },
    }));
  };

  const handleSaveMemberAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;

    const current = assessments[selectedMember.id];
    if (current.codeQuality === 0 || current.deadlines === 0 || current.teamwork === 0) {
      toast.error("Vui lòng đánh giá đủ 3 tiêu chí điểm số trước khi lưu!");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const updatedAssessments = {
        ...assessments,
        [selectedMember.id]: {
          ...current,
          isSaved: true,
        },
      };
      setAssessments(updatedAssessments);
      localStorage.setItem("saga-peer-assessments", JSON.stringify(updatedAssessments));
      toast.success(`Đã lưu đánh giá cho thành viên: ${selectedMember.name}`);
    }, 800);
  };

  const handleFinalSubmit = () => {
    if (isSubmitted) return;

    // Verify all members have been assessed and saved
    const unsaved = teamMembers.filter((m) => !assessments[m.id]?.isSaved);
    if (unsaved.length > 0) {
      toast.error(
        `Vui lòng hoàn tất và lưu đánh giá cho ${unsaved.length} thành viên chưa đánh giá!`
      );
      return;
    }

    // Verify contribution shares add up to exactly 100%
    const totalShare = teamMembers.reduce(
      (sum, m) => sum + (assessments[m.id]?.contributionShare || 0),
      0
    );

    if (totalShare !== 100) {
      toast.error(
        `Tổng tỷ lệ đóng góp (Contribution Share) của cả nhóm hiện là ${totalShare}%. Vui lòng điều chỉnh để tổng tỷ lệ của cả 5 thành viên bằng đúng 100%!`
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      localStorage.setItem("saga-assessments-submitted", "true");
      toast.success("Gửi bảng tự đánh giá & đánh giá chéo thành công!");
    }, 1500);
  };

  const handleReset = () => {
    if (confirm("Bạn có chắc chắn muốn làm mới toàn bộ bảng đánh giá chéo này không?")) {
      localStorage.removeItem("saga-peer-assessments");
      localStorage.removeItem("saga-assessments-submitted");
      setIsSubmitted(false);

      const initialAssessments: Record<string, RatingState> = {};
      teamMembers.forEach((m) => {
        initialAssessments[m.id] = {
          codeQuality: 0,
          deadlines: 0,
          teamwork: 0,
          contributionShare: 20,
          comment: "",
          isSaved: false,
        };
      });
      setAssessments(initialAssessments);
      setSelectedMember(teamMembers[0]);
      toast.info("Đã thiết lập lại toàn bộ bảng đánh giá.");
    }
  };

  // Helper calculation details
  const totalCompleted = teamMembers.filter((m) => assessments[m.id]?.isSaved).length;
  const currentTotalShare = teamMembers.reduce(
    (sum, m) => sum + (assessments[m.id]?.contributionShare || 0),
    0
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16 bg-background text-foreground">
      <PageHeader
        title="Tự đánh giá & Đánh giá chéo"
        description="Đánh giá đóng góp cá nhân và đánh giá hiệu quả làm việc của các thành viên trong nhóm PBL-07 cho đợt báo cáo Sprint 4."
      />

      {/* CONFIDENTIAL ALERT BANNER */}
      <Card className="border border-orange-100 dark:border-orange-950/30 bg-gradient-to-r from-orange-50/40 to-orange-100/10 dark:from-orange-950/20 dark:to-orange-900/10 rounded-3xl p-5 shadow-sm">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl shadow-sm shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="space-y-1">
            <h5 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
              Cam kết bảo mật thông tin đánh giá chéo
            </h5>
            <p className="text-muted-foreground text-xs font-medium leading-relaxed">
              Mọi dữ liệu điểm số, tỷ lệ đóng góp (%) và góp ý dành cho các thành viên khác đều được hệ thống
              <strong> mã hóa bảo mật hoàn toàn</strong>. Các thành viên được đánh giá sẽ không thể xem phản hồi
              cụ thể của bạn; thông tin này chỉ được gửi trực tiếp đến Giảng viên hướng dẫn để làm căn cứ chấm điểm cá nhân.
            </p>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="h-96 animate-pulse bg-muted border border-border lg:col-span-1" />
          <Card className="h-96 animate-pulse bg-muted border border-border lg:col-span-2" />
        </div>
      ) : isSubmitted ? (
        /* GORGEOUS COMPLETION SCREEN */
        <Card className="border border-emerald-100 dark:border-emerald-950/30 shadow-md rounded-3xl bg-card p-8 max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-100/50 animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-foreground animate-in slide-in-from-top-3 duration-500">Đã gửi bảng đánh giá thành công!</h3>
            <p className="text-muted-foreground text-sm font-medium">
              Bạn đã hoàn tất việc tự đánh giá và đánh giá chéo cho cả 5 thành viên của nhóm **PBL-07**. Dữ liệu đã được khóa và lưu trữ bảo mật trên máy chủ học vụ SAGA.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-border text-left space-y-3">
            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tóm tắt kết quả phân chia đóng góp nhóm</h5>
            <div className="space-y-2.5">
              {teamMembers.map((m) => (
                <div key={m.id} className="flex justify-between items-center text-sm font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    {m.name} {m.isSelf && "(Tôi)"}
                  </span>
                  <span className="bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-3 py-0.5 rounded-full text-xs font-bold">
                    {assessments[m.id]?.contributionShare}% đóng góp
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground"
            >
              Làm lại đánh giá
            </Button>
          </div>
        </Card>
      ) : (
        /* ACTIVE FORM EVALUATION VIEW */
        <div className="grid gap-6 lg:grid-cols-3 items-start animate-in fade-in duration-300">
          
          {/* LEFT COLUMN: LIST OF MEMBERS */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <div>
                  <h4 className="font-extrabold text-foreground text-sm">Danh sách thành viên</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">Sprint 4 · PBL-07</p>
                </div>
                <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Đã lưu {totalCompleted}/{teamMembers.length}
                </span>
              </div>

              {/* Members navigation list */}
              <div className="space-y-2">
                {teamMembers.map((m) => {
                  const saved = assessments[m.id]?.isSaved;
                  const isSelected = selectedMember.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-orange-50/50 dark:bg-orange-950/20 border-orange-500 shadow-sm text-orange-950 dark:text-orange-300 font-bold"
                          : "bg-background dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-foreground hover:border-slate-300 dark:hover:border-slate-700 font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                            m.isSelf
                              ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                              : isSelected
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                              : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold mt-0.5">{m.role}</p>
                        </div>
                      </div>
                      
                      {/* Completion check icon or right chevron */}
                      {saved ? (
                        <span className="text-emerald-500 dark:text-emerald-400" title="Đã lưu đánh giá">
                          <CheckCircle2 size={16} />
                        </span>
                      ) : (
                        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* PROGRESS STATUS & SUBMIT BUTTON */}
              <div className="border-t border-border pt-4 space-y-4">
                
                {/* Total share tracking */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Tổng % đóng góp cả nhóm:</span>
                    <span className={currentTotalShare === 100 ? "text-emerald-600 dark:text-emerald-400 font-black" : "text-orange-500"}>
                      {currentTotalShare}/100%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentTotalShare === 100 ? "bg-emerald-500 dark:bg-emerald-450" : "bg-orange-500"
                      }`}
                      style={{ width: `${Math.min(currentTotalShare, 100)}%` }}
                    />
                  </div>
                  {currentTotalShare !== 100 && (
                    <p className="text-[9px] text-muted-foreground font-bold leading-normal">
                      * Vui lòng điều chỉnh tỷ lệ đóng góp của từng người để tổng bằng đúng 100%.
                    </p>
                  )}
                </div>

                {/* Final Submit Button */}
                <Button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || totalCompleted !== teamMembers.length || currentTotalShare !== 100}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Đang xử lý gửi...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Gửi tất cả đánh giá nhóm
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: DETAILED ASSESSMENT FORM */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border shadow-sm rounded-3xl bg-card overflow-hidden !pt-0">
              {/* Dynamic Brand bar header */}
              <div className={`h-2 w-full ${selectedMember.isSelf ? "bg-orange-500" : "bg-slate-800 dark:bg-slate-900"}`} />
              
              <div className="p-6 space-y-6">
                
                {/* MEMBER PROFILE BANNER */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-border gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                      {selectedMember.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-base flex items-center gap-1.5">
                        {selectedMember.name}
                        {selectedMember.isSelf && (
                          <span className="bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                            Tự đánh giá
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold mt-0.5">{selectedMember.role} · Nhóm PBL-07</p>
                    </div>
                  </div>
                  
                  {/* Commits & tasks visual stats widget */}
                  <div className="flex gap-4 text-center">
                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border shadow-sm">
                      <span className="block text-xs font-black text-foreground">{selectedMember.commits}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Commits</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border shadow-sm">
                      <span className="block text-xs font-black text-foreground">{selectedMember.PRs}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">PRs</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-border shadow-sm">
                      <span className="block text-xs font-black text-foreground">{selectedMember.tasks}</span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Tasks</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveMemberAssessment} className="space-y-6">
                  
                  {/* METRIC 1: CODE QUALITY */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <Label className="text-foreground text-xs font-bold">
                        1. Chất lượng code & Kỹ thuật đóng góp
                      </Label>
                      <span className="text-[10px] text-muted-foreground font-bold">Tiêu chí đóng góp Git/Code</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Mức độ sạch sẽ của code, tuân thủ tiêu chuẩn code chung, ít bug, xử lý vấn đề kỹ thuật hiệu quả và tham gia đóng góp mã nguồn (commits, PRs).
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const score = assessments[selectedMember.id]?.codeQuality || 0;
                        const active = star <= score;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange("codeQuality", star)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              active
                                ? "bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-900/50 text-orange-500 dark:text-orange-400 scale-[1.05]"
                                : "bg-background dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* METRIC 2: DEADLINES */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <Label className="text-foreground text-xs font-bold">
                        2. Độ chủ động & Tiến độ hoàn thành Task
                      </Label>
                      <span className="text-[10px] text-muted-foreground font-bold">Tiêu chí quản lý công việc</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Hoàn thành đúng hạn các tasks được giao trên Jira, tự giác cập nhật công việc, chủ động nhận thêm việc và có trách nhiệm với mục tiêu của Sprint.
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const score = assessments[selectedMember.id]?.deadlines || 0;
                        const active = star <= score;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange("deadlines", star)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              active
                                ? "bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-900/50 text-orange-500 dark:text-orange-400 scale-[1.05]"
                                : "bg-background dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* METRIC 3: TEAMWORK */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <Label className="text-foreground text-xs font-bold">
                        3. Giao tiếp, Thái độ & Tương tác đồng đội
                      </Label>
                      <span className="text-[10px] text-muted-foreground font-bold">Tiêu chí cộng tác/Teamwork</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Tích cực họp nhóm, thảo luận phương án, sẵn sàng giúp đỡ thành viên khác gặp khó khăn, thái độ hòa đồng và tôn trọng ý kiến đồng đội.
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const score = assessments[selectedMember.id]?.teamwork || 0;
                        const active = star <= score;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange("teamwork", star)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              active
                                ? "bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-900/50 text-orange-500 dark:text-orange-400 scale-[1.05]"
                                : "bg-background dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-600"
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CONTRIBUTION SHARE SLIDER */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex justify-between items-baseline">
                      <Label className="text-foreground text-xs font-bold">
                        4. Tỷ lệ đóng góp thực tế (%)
                      </Label>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-black bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full">
                        {assessments[selectedMember.id]?.contributionShare || 20}%
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      Phần trăm khối lượng công sức và đóng góp tổng thể của thành viên này cho thành quả Sprint 4.
                      (Mặc định là 20% mỗi người cho nhóm 5 người. Đóng góp nhiều hơn có thể tăng %, ít hơn thì giảm %).
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        disabled={isSubmitted}
                        value={assessments[selectedMember.id]?.contributionShare || 20}
                        onChange={(e) => handleShareChange(parseInt(e.target.value))}
                        className="w-full accent-orange-500 h-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs font-bold text-muted-foreground w-12 text-right">Max: 60%</span>
                    </div>
                  </div>

                  {/* FEEDBACK FEED TEXTAREA */}
                  <div className="space-y-2">
                    <Label htmlFor="assess-comment" className="text-foreground text-xs font-bold flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-muted-foreground" />
                      Ý kiến đóng góp & Góp ý xây dựng
                    </Label>
                    <textarea
                      id="assess-comment"
                      rows={3}
                      disabled={isSubmitted}
                      placeholder={
                        selectedMember.isSelf
                          ? "Ghi lại những khó khăn bạn gặp phải, bài học rút ra hoặc tự nhận xét quá trình làm việc của bản thân..."
                          : `Nhận xét điểm mạnh, điểm yếu hoặc những điều cần cải thiện của ${selectedMember.name}... (Ý kiến này được bảo mật)`
                      }
                      className="w-full p-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-2xl text-xs font-medium leading-relaxed resize-none shadow-inner text-foreground placeholder:text-muted-foreground"
                      value={assessments[selectedMember.id]?.comment || ""}
                      onChange={(e) => handleCommentChange(e.target.value)}
                    />
                  </div>

                  {/* Action Saving Buttons */}
                  {!isSubmitted && (
                    <div className="flex gap-3 justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-10 px-5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            Lưu đánh giá thành viên
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>

              </div>
            </Card>

            {/* INFO TIPS ALERT */}
            <Card className="border border-border bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-5 space-y-2">
              <h5 className="font-extrabold text-foreground text-xs flex items-center gap-1.5">
                <Info size={14} className="text-orange-500" />
                Hướng dẫn phân phối contribution % hiệu quả:
              </h5>
              <ul className="list-disc list-inside text-muted-foreground text-[10px] font-medium space-y-1.5 pl-1 leading-normal">
                <li>Đối với nhóm 5 người, điểm trung bình đóng góp bằng nhau là <strong>20% mỗi người</strong>.</li>
                <li>Nếu một thành viên làm vượt trội (ví dụ làm thay task của người khác), có thể phân phối 25% - 30% cho họ.</li>
                <li>Ngược lại, nếu một thành viên ít đóng góp hoặc không tương tác, có thể giảm xuống 5% - 10% cho họ.</li>
                <li><strong>Bắt buộc</strong>: Tổng tỷ lệ đóng góp của cả 5 thành viên phải cộng lại bằng <strong>đúng 100%</strong> thì hệ thống mới cho phép gửi bảng đánh giá chéo.</li>
              </ul>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
