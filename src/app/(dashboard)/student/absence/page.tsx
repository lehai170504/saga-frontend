"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";
import {
  CalendarX,
  Clock,
  FileText,
  AlertTriangle,
  Upload,
  History,
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ReportItem {
  id: string;
  type: "absence" | "delay";
  dateCreated: string;
  status: "pending" | "approved" | "rejected";
  title: string;
  description: string;
  details: {
    targetDate?: string;
    session?: string;
    reasonCategory?: string;
    evidenceFile?: string;
    jiraTask?: string;
    newDeadline?: string;
    mitigationPlan?: string;
  };
}

const mockJiraTasks = [
  { id: "PBL-114", title: "PBL-114: Setup Database Schema & Seed Data" },
  { id: "PBL-118", title: "PBL-118: Implement UI Components for Dashboard" },
  { id: "PBL-120", title: "PBL-120: Integrate GitHub OAuth Authentication" },
  { id: "PBL-125", title: "PBL-125: Write Integration Tests for API Gateway" },
];

const initialHistory: ReportItem[] = [
  {
    id: "REP001",
    type: "absence",
    dateCreated: "22-06-2026 09:15",
    status: "approved",
    title: "Báo cáo vắng mặt ngày 22-06-2026",
    description: "Vắng ca sáng do trùng lịch thi học kỳ môn Giải tích II tại khu A.",
    details: {
      targetDate: "2026-06-22",
      session: "Sáng (07:30 - 11:30)",
      reasonCategory: "Trùng lịch thi học vụ",
      evidenceFile: "Giay_bao_thi_hocky_2.pdf",
    },
  },
  {
    id: "REP002",
    type: "delay",
    dateCreated: "18-06-2026 14:30",
    status: "approved",
    title: "Giải trình trễ hạn Task PBL-112",
    description: "Cổng API Gateway gặp lỗi phân quyền phân nhóm nên chưa thể hoàn thành tích hợp đúng hạn.",
    details: {
      jiraTask: "PBL-112: Tích hợp API Gateway",
      reasonCategory: "Khó khăn kỹ thuật phát sinh",
      newDeadline: "2026-06-21",
      mitigationPlan: "Đã liên hệ với team DevOps để sửa lỗi CORS và phân quyền JWT.",
    },
  },
  {
    id: "REP003",
    type: "absence",
    dateCreated: "10-06-2026 08:00",
    status: "rejected",
    title: "Báo cáo vắng mặt ngày 10-06-2026",
    description: "Xin vắng buổi họp nhóm do mệt mỏi sau chuyến đi thực tế.",
    details: {
      targetDate: "2026-06-10",
      session: "Chiều (13:30 - 17:30)",
      reasonCategory: "Lý do cá nhân",
      evidenceFile: "",
    },
  },
];

export default function AbsenceDelayReporting() {
  const [activeTab, setActiveTab] = useState<"absence" | "delay">("absence");
  const [history, setHistory] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State - Absence
  const [absenceDate, setAbsenceDate] = useState("");
  const [absenceSession, setAbsenceSession] = useState("Sáng (07:30 - 11:30)");
  const [absenceCategory, setAbsenceCategory] = useState("Lý do sức khỏe");
  const [absenceEvidence, setAbsenceEvidence] = useState("");
  const [absenceDetail, setAbsenceDetail] = useState("");

  // Form State - Delay
  const [delayTask, setDelayTask] = useState(mockJiraTasks[0].title);
  const [delayCategory, setDelayCategory] = useState("Khó khăn kỹ thuật phát sinh");
  const [delayNewDeadline, setDelayNewDeadline] = useState("");
  const [delayPlan, setDelayPlan] = useState("");
  const [delayDetail, setDelayDetail] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("saga-student-reports");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory(initialHistory);
      }
    } else {
      setHistory(initialHistory);
      localStorage.setItem("saga-student-reports", JSON.stringify(initialHistory));
    }
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const saveToStorage = (updatedHistory: ReportItem[]) => {
    setHistory(updatedHistory);
    localStorage.setItem("saga-student-reports", JSON.stringify(updatedHistory));
  };

  const handleAbsenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceDate) {
      toast.error("Vui lòng chọn ngày vắng mặt!");
      return;
    }
    if (!absenceDetail.trim()) {
      toast.error("Vui lòng nhập chi tiết lý do vắng mặt!");
      return;
    }

    const newReport: ReportItem = {
      id: `REP${Math.floor(100 + Math.random() * 900)}`,
      type: "absence",
      dateCreated: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      title: `Báo cáo vắng mặt ngày ${absenceDate.split("-").reverse().join("-")}`,
      description: absenceDetail,
      details: {
        targetDate: absenceDate,
        session: absenceSession,
        reasonCategory: absenceCategory,
        evidenceFile: absenceEvidence || "Không có minh chứng đính kèm",
      },
    };

    const updated = [newReport, ...history];
    saveToStorage(updated);
    toast.success("Gửi báo cáo vắng mặt thành công! Đang chờ giảng viên duyệt.");

    // Reset Form
    setAbsenceDate("");
    setAbsenceDetail("");
    setAbsenceEvidence("");
  };

  const handleDelaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayNewDeadline) {
      toast.error("Vui lòng chọn hạn hoàn thành dự kiến mới!");
      return;
    }
    if (!delayDetail.trim()) {
      toast.error("Vui lòng giải trình rõ lý do chậm trễ tiến độ!");
      return;
    }
    if (!delayPlan.trim()) {
      toast.error("Vui lòng nêu rõ kế hoạch khắc phục chậm trễ!");
      return;
    }

    const newReport: ReportItem = {
      id: `REP${Math.floor(100 + Math.random() * 900)}`,
      type: "delay",
      dateCreated: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      title: `Giải trình trễ hạn task ${delayTask.split(":")[0]}`,
      description: delayDetail,
      details: {
        jiraTask: delayTask,
        reasonCategory: delayCategory,
        newDeadline: delayNewDeadline,
        mitigationPlan: delayPlan,
      },
    };

    const updated = [newReport, ...history];
    saveToStorage(updated);
    toast.success("Gửi giải trình chậm tiến độ thành công! Đang chờ giảng viên duyệt.");

    // Reset Form
    setDelayNewDeadline("");
    setDelayPlan("");
    setDelayDetail("");
  };

  const handleDeleteReport = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn rút báo cáo này không?")) {
      const updated = history.filter((h) => h.id !== id);
      saveToStorage(updated);
      toast.info("Đã rút báo cáo thành công.");
    }
  };

  const renderStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <CheckCircle size={10} />
            Đã đồng ý
          </span>
        );
      case "rejected":
        return (
          <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <XCircle size={10} />
            Từ chối
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <Clock size={10} />
            Chờ duyệt
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16 bg-background text-foreground">
      <PageHeader
        title="Báo cáo vắng mặt & Chậm trễ"
        description="Gửi báo cáo nghỉ học, xin phép vắng mặt trong buổi họp nhóm, hoặc giải trình nguyên nhân chậm trễ tiến độ Jira Task."
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* LEFT COLUMN: REPORT SUBMISSION FORM */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border shadow-sm rounded-3xl bg-card overflow-hidden !pt-0">
            {/* Header Brand Bar */}
            <div className="h-2 w-full bg-orange-500" />
            
            <div className="p-6 space-y-6">
              
              {/* Form Navigation Tabs */}
              <div className="flex gap-2 p-1.5 bg-slate-100/60 dark:bg-slate-950 rounded-2xl border border-border">
                <button
                  onClick={() => setActiveTab("absence")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "absence"
                      ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarX size={15} />
                  Báo cáo vắng mặt
                </button>
                <button
                  onClick={() => setActiveTab("delay")}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "delay"
                      ? "bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock size={15} />
                  Giải trình trễ hạn Task
                </button>
              </div>

              {/* TAB 1: ABSENCE REPORT FORM */}
              {activeTab === "absence" ? (
                <form onSubmit={handleAbsenceSubmit} className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid gap-4 sm:grid-cols-2">
                    
                    {/* Absence Date */}
                    <div className="space-y-1.5">
                      <Label htmlFor="abs-date" className="text-muted-foreground text-xs font-bold">
                        Ngày vắng mặt
                      </Label>
                      <div className="relative">
                        <Input
                          id="abs-date"
                          type="date"
                          required
                          value={absenceDate}
                          onChange={(e) => setAbsenceDate(e.target.value)}
                          className="h-11 bg-background border border-border rounded-xl text-xs font-medium cursor-pointer text-foreground"
                        />
                      </div>
                    </div>

                    {/* Session Select */}
                    <div className="space-y-1.5">
                      <Label htmlFor="abs-session" className="text-muted-foreground text-xs font-bold">
                        Ca học/Buổi vắng
                      </Label>
                      <select
                        id="abs-session"
                        value={absenceSession}
                        onChange={(e) => setAbsenceSession(e.target.value)}
                        className="w-full h-11 bg-background border border-border rounded-xl px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm cursor-pointer text-foreground"
                      >
                        <option value="Sáng (07:30 - 11:30)">Sáng (07:30 - 11:30)</option>
                        <option value="Chiều (13:30 - 17:30)">Chiều (13:30 - 17:30)</option>
                        <option value="Tối (18:00 - 21:00)">Tối (18:00 - 21:00)</option>
                        <option value="Cả ngày">Cả ngày (Sáng & Chiều)</option>
                      </select>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="abs-category" className="text-muted-foreground text-xs font-bold">
                        Lý do chính
                      </Label>
                      <select
                        id="abs-category"
                        value={absenceCategory}
                        onChange={(e) => setAbsenceCategory(e.target.value)}
                        className="w-full h-11 bg-background border border-border rounded-xl px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm cursor-pointer text-foreground"
                      >
                        <option value="Lý do sức khỏe">Lý do sức khỏe (ốm đau, đi khám bệnh)</option>
                        <option value="Trùng lịch thi học vụ">Trùng lịch thi học kỳ/lịch thi đột xuất của trường</option>
                        <option value="Việc cá nhân/Gia đình">Lý do khẩn cấp từ gia đình</option>
                        <option value="Đại diện Trường/Khoa đi hoạt động">Đại diện tham gia các hoạt động ngoại khóa của Khoa/Trường</option>
                        <option value="Khác">Lý do khác (Chi tiết ghi ở bên dưới)</option>
                      </select>
                    </div>

                    {/* Evidence Input (Mockup File) */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="abs-evidence" className="text-muted-foreground text-xs font-bold">
                        Tên tệp minh chứng đính kèm (Ví dụ: Giay_kham_suc_khoe.jpg, Giay_xac_nhan.pdf)
                      </Label>
                      <div className="relative">
                        <Input
                          id="abs-evidence"
                          placeholder="Nhập tên tệp minh chứng học vụ hoặc y tế (nếu có)..."
                          value={absenceEvidence}
                          onChange={(e) => setAbsenceEvidence(e.target.value)}
                          className="h-11 pl-10 bg-background border border-border rounded-xl text-xs font-medium text-foreground"
                        />
                        <Upload className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      </div>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                        * Khuyến khích đính kèm minh chứng để Giảng viên dễ dàng phê duyệt báo cáo vắng.
                      </p>
                    </div>

                    {/* Detailed Reason Textarea */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="abs-detail" className="text-muted-foreground text-xs font-bold flex items-center gap-1.5">
                        <FileText size={14} className="text-muted-foreground" />
                        Mô tả lý do chi tiết & Tin nhắn gửi giảng viên
                      </Label>
                      <textarea
                        id="abs-detail"
                        rows={4}
                        required
                        placeholder="Nêu cụ thể lý do vắng mặt, kế hoạch tự học bù hoặc liên hệ nhóm trưởng để bàn giao lại phần việc phụ trách..."
                        value={absenceDetail}
                        onChange={(e) => setAbsenceDetail(e.target.value)}
                        className="w-full p-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-2xl text-xs font-medium leading-relaxed resize-none shadow-inner text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="h-11 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                    >
                      <Send size={13} />
                      Gửi báo cáo vắng mặt
                    </Button>
                  </div>
                </form>
              ) : (
                /* TAB 2: DELAY REPORT FORM */
                <form onSubmit={handleDelaySubmit} className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* Task Select Dropdown */}
                    <div className="space-y-1.5">
                      <Label htmlFor="del-task" className="text-muted-foreground text-xs font-bold">
                        Chọn Task Jira cần giải trình
                      </Label>
                      <select
                        id="del-task"
                        value={delayTask}
                        onChange={(e) => setDelayTask(e.target.value)}
                        className="w-full h-11 bg-background border border-border rounded-xl px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm cursor-pointer text-foreground"
                      >
                        {mockJiraTasks.map((task) => (
                          <option key={task.id} value={task.title}>
                            {task.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delay New Proposed Deadline */}
                    <div className="space-y-1.5">
                      <Label htmlFor="del-deadline" className="text-muted-foreground text-xs font-bold">
                        Hạn hoàn thành mới đề xuất
                      </Label>
                      <Input
                        id="del-deadline"
                        type="date"
                        required
                        value={delayNewDeadline}
                        onChange={(e) => setDelayNewDeadline(e.target.value)}
                        className="h-11 bg-background border border-border rounded-xl text-xs font-medium cursor-pointer text-foreground"
                      />
                    </div>

                    {/* Reason Category Select */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="del-category" className="text-muted-foreground text-xs font-bold">
                        Nguyên nhân chính gây trễ tiến độ
                      </Label>
                      <select
                        id="del-category"
                        value={delayCategory}
                        onChange={(e) => setDelayCategory(e.target.value)}
                        className="w-full h-11 bg-background border border-border rounded-xl px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm cursor-pointer text-foreground"
                      >
                        <option value="Khó khăn kỹ thuật phát sinh">Khó khăn kỹ thuật phát sinh ngoài dự kiến (Lỗi thư viện, môi trường)</option>
                        <option value="Chưa nhận được phản hồi/dữ liệu">Đang đợi tài liệu/API từ thành viên khác hoặc đối tác</option>
                        <option value="Thay đổi yêu cầu nghiệp vụ">Thay đổi spec/yêu cầu từ Khách hàng hoặc Thầy cô hướng dẫn</option>
                        <option value="Lý do sức khỏe cá nhân">Lý do sức khỏe cá nhân (cần nghỉ ngơi vài ngày)</option>
                        <option value="Khác">Lý do khác (Chi tiết ghi ở bên dưới)</option>
                      </select>
                    </div>

                    {/* Mitigation Plan Textarea */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="del-plan" className="text-muted-foreground text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle size={14} className="text-muted-foreground" />
                        Kế hoạch khắc phục chậm trễ (Mitigation Plan)
                      </Label>
                      <textarea
                        id="del-plan"
                        rows={2}
                        required
                        placeholder="Nêu rõ phương án bù tiến độ, ví dụ: Nhờ bạn khác hỗ trợ code, OT cuối tuần để kịp tiến độ Sprint..."
                        value={delayPlan}
                        onChange={(e) => setDelayPlan(e.target.value)}
                        className="w-full p-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-2xl text-xs font-medium leading-relaxed resize-none shadow-inner text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Detailed Reason Textarea */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="del-detail" className="text-muted-foreground text-xs font-bold flex items-center gap-1.5">
                        <FileText size={14} className="text-muted-foreground" />
                        Giải trình nguyên nhân chi tiết
                      </Label>
                      <textarea
                        id="del-detail"
                        rows={3}
                        required
                        placeholder="Giải thích chi tiết các khó khăn gặp phải và tiến độ hiện tại của task này..."
                        value={delayDetail}
                        onChange={(e) => setDelayDetail(e.target.value)}
                        className="w-full p-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-2xl text-xs font-medium leading-relaxed resize-none shadow-inner text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      className="h-11 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
                    >
                      <Send size={13} />
                      Gửi giải trình trễ hạn
                    </Button>
                  </div>
                </form>
              )}

            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: HISTORY & STATUS VIEW */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-border shadow-sm rounded-3xl bg-card p-5 space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h4 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                  <History size={16} className="text-orange-500" />
                  Lịch sử gửi báo cáo
                </h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">
                  Tất cả các đợt Sprint
                </p>
              </div>
              <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {history.length} báo cáo
              </span>
            </div>

            {/* List entries */}
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <CalendarX size={36} className="mx-auto text-slate-300 dark:text-slate-800 mb-2" />
                  <p className="text-xs font-bold">Chưa gửi báo cáo nào</p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-900 bg-background dark:bg-slate-950 flex flex-col gap-3 transition-all hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        item.type === "absence"
                          ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400"
                      }`}>
                        {item.type === "absence" ? "Vắng mặt" : "Trễ tiến độ"}
                      </span>
                      {renderStatusBadge(item.status)}
                    </div>

                    <div className="space-y-1">
                      <h5 className="font-extrabold text-xs text-foreground leading-tight">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Metadata details list */}
                    <div className="bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl text-[10px] font-semibold text-muted-foreground space-y-1">
                      {item.details.session && (
                        <div>Ca học: <span className="text-foreground">{item.details.session}</span></div>
                      )}
                      {item.details.jiraTask && (
                        <div className="truncate">Jira: <span className="text-foreground">{item.details.jiraTask}</span></div>
                      )}
                      {item.details.newDeadline && (
                        <div>Hạn mới: <span className="text-foreground">{item.details.newDeadline.split("-").reverse().join("-")}</span></div>
                      )}
                      {item.details.reasonCategory && (
                        <div>Lý do: <span className="text-foreground">{item.details.reasonCategory}</span></div>
                      )}
                      {item.details.evidenceFile && item.details.evidenceFile !== "Không có minh chứng đính kèm" && (
                        <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
                          <FileText size={10} />
                          {item.details.evidenceFile}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-900/60">
                      <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Calendar size={10} />
                        {item.dateCreated}
                      </span>
                      {item.status === "pending" && (
                        <button
                          onClick={() => handleDeleteReport(item.id)}
                          className="text-[9px] text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          Rút báo cáo
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Notification alert banner */}
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 border border-border rounded-2xl space-y-1.5">
              <h5 className="font-extrabold text-foreground text-xs flex items-center gap-1">
                <AlertCircle size={14} className="text-orange-500" />
                Lưu ý quan trọng:
              </h5>
              <p className="text-muted-foreground text-[10px] font-medium leading-relaxed">
                Mọi thông tin xin phép hoặc giải trình trễ hạn sẽ được gửi trực tiếp đến Giảng viên hướng dẫn để xem xét điều chỉnh tham số Continuous Grading phù hợp, giúp bạn tránh bị trừ điểm đóng góp cá nhân (Contribution score) không đáng có.
              </p>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
