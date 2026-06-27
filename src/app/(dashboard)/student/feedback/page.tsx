"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";
import {
  Inbox,
  Search,
  CheckCircle,
  MessageSquare,
  Star,
  ChevronLeft,
  Send,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Check,
  CornerDownRight,
} from "lucide-react";

interface ReplyMessage {
  sender: "instructor" | "student";
  senderName: string;
  date: string;
  content: string;
}

interface InstructorFeedback {
  id: string;
  sprint: string;
  instructorName: string;
  instructorRole: string;
  title: string;
  date: string;
  read: boolean;
  scores: {
    codeQuality: number;
    deadlines: number;
    teamwork: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  replies: ReplyMessage[];
}

const initialFeedbackData: InstructorFeedback[] = [
  {
    id: "FB001",
    sprint: "Sprint 4",
    instructorName: "TS. Nguyễn Văn Giảng",
    instructorRole: "Giảng viên Hướng dẫn PBL-07",
    title: "Nhận xét chi tiết Sprint 4 - Tiến độ & Chất lượng Code",
    date: "26-06-2026 10:30",
    read: false,
    scores: {
      codeQuality: 4,
      deadlines: 5,
      teamwork: 4,
    },
    strengths: [
      "Tích cực hoàn thành 7/7 tasks trên Jira đúng hạn, không có task nào bị trễ hạn chót.",
      "Mã nguồn sạch sẽ, cấu trúc thư mục rõ ràng, viết helper functions có tính tái sử dụng cao.",
      "Tham gia đầy đủ và tích cực đóng góp ý kiến trong các buổi họp nhóm hàng ngày (daily standup).",
    ],
    improvements: [
      "Cần chú ý viết commit messages rõ nghĩa hơn (tránh đặt tên chung chung kiểu 'fix bug', 'update code').",
      "Một số Pull Requests chưa có phần mô tả chi tiết (description) các thay đổi chính.",
    ],
    recommendations: [
      "Áp dụng quy chuẩn Conventional Commits cho các commit từ Sprint tiếp theo.",
      "Viết mô tả ngắn từ 3-4 dòng tóm tắt thay đổi đối với mỗi Pull Request trước khi gửi cho Leader review.",
    ],
    replies: [],
  },
  {
    id: "FB002",
    sprint: "Sprint 3",
    instructorName: "TS. Nguyễn Văn Giảng",
    instructorRole: "Giảng viên Hướng dẫn PBL-07",
    title: "Đánh giá Sprint 3 - Thiết kế Cơ sở dữ liệu & APIs",
    date: "12-06-2026 15:45",
    read: true,
    scores: {
      codeQuality: 3,
      deadlines: 4,
      teamwork: 5,
    },
    strengths: [
      "Thiết kế CSDL logic, chuẩn hóa dữ liệu tốt, hạn chế tối đa dư thừa.",
      "Hỗ trợ nhiệt tình các thành viên khác trong việc cài đặt và cấu hình môi trường Docker.",
    ],
    improvements: [
      "Một số API endpoints phản hồi hơi chậm khi thực hiện truy vấn các bảng lớn. Cần tối ưu hóa câu lệnh SQL.",
    ],
    recommendations: [
      "Bổ sung index cho các khóa ngoại và các trường thường dùng để tìm kiếm như `student_id`, `class_id`.",
      "Đo lường chi tiết thời gian phản hồi (latency) của API bằng Postman trước khi deploy lên staging.",
    ],
    replies: [
      {
        sender: "student",
        senderName: "Lê Hoàng Hải (Sinh viên)",
        date: "13-06-2026 09:00",
        content: "Dạ thưa thầy, nhóm em đã bổ sung chỉ mục (indexing) cho các bảng chính theo góp ý. Hiện tại tốc độ phản hồi của API đã giảm từ 800ms xuống còn khoảng 45ms. Em xin chân thành cảm ơn thầy ạ!",
      },
    ],
  },
  {
    id: "FB003",
    sprint: "Sprint 2",
    instructorName: "ThS. Trần Thị Trợ Giảng",
    instructorRole: "Giảng viên Phụ tá PBL-07",
    title: "Nhận xét Sprint 2 - Prototype & Thiết kế UI/UX",
    date: "29-05-2026 09:15",
    read: true,
    scores: {
      codeQuality: 4,
      deadlines: 4,
      teamwork: 4,
    },
    strengths: [
      "Figma Prototype tương tác mượt mà, bao quát đầy đủ các luồng nghiệp vụ chính của hệ thống.",
      "Lựa chọn bảng màu hiện đại, tối giản và có tính tương phản tốt đối với người dùng.",
    ],
    improvements: [
      "Font chữ ở một số màn hình nhỏ như Cài đặt hơi bé, có thể gây khó đọc trên các màn hình độ phân giải HD.",
    ],
    recommendations: [
      "Tăng kích thước font chữ nhỏ nhất lên tối thiểu 12px.",
      "Kiểm tra lại độ tương phản màu chữ xám phụ so với màu nền tối (Dark mode).",
    ],
    replies: [],
  },
];

export default function InstructorFeedbackInbox() {
  const [feedbacks, setFeedbacks] = useState<InstructorFeedback[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "sprint4" | "sprint3">("all");
  const [replyText, setReplyText] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("saga-instructor-feedbacks");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeedbacks(JSON.parse(saved));
      } catch {
        setFeedbacks(initialFeedbackData);
      }
    } else {
      setFeedbacks(initialFeedbackData);
      localStorage.setItem("saga-instructor-feedbacks", JSON.stringify(initialFeedbackData));
    }
    
    // Default select first item
    const defaultData = saved ? JSON.parse(saved) : initialFeedbackData;
    if (defaultData && defaultData.length > 0) {
      setSelectedId(defaultData[0].id);
    }
    
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const saveToStorage = (updatedList: InstructorFeedback[]) => {
    setFeedbacks(updatedList);
    localStorage.setItem("saga-instructor-feedbacks", JSON.stringify(updatedList));
  };

  const handleSelectFeedback = (id: string) => {
    setSelectedId(id);
    setMobileView("detail");

    // Mark as read automatically when clicking
    const updated = feedbacks.map((f) => {
      if (f.id === id && !f.read) {
        return { ...f, read: true };
      }
      return f;
    });
    saveToStorage(updated);
  };

  const handleAcknowledge = () => {
    toast.success("Đã xác nhận đã đọc phản hồi của giảng viên!");
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Vui lòng nhập nội dung câu hỏi phản hồi!");
      return;
    }

    const updated = feedbacks.map((f) => {
      if (f.id === selectedId) {
        const newReply: ReplyMessage = {
          sender: "student",
          senderName: "Lê Hoàng Hải (Sinh viên)",
          date: new Date().toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) + " " + new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: replyText,
        };
        return {
          ...f,
          replies: [...f.replies, newReply],
        };
      }
      return f;
    });

    saveToStorage(updated);
    setReplyText("");
    toast.success("Gửi câu hỏi làm rõ đến giảng viên thành công (Mockup)!");
  };

  // Filtering and Searching
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sprint.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "unread") return matchesSearch && !f.read;
    if (filterTab === "sprint4") return matchesSearch && f.sprint === "Sprint 4";
    if (filterTab === "sprint3") return matchesSearch && f.sprint === "Sprint 3";
    return matchesSearch;
  });

  const selectedFeedback = feedbacks.find((f) => f.id === selectedId);
  const unreadCount = feedbacks.filter((f) => !f.read).length;

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            className={`${
              s <= score
                ? "text-orange-500 fill-orange-500"
                : "text-slate-200 dark:text-slate-800"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16 bg-background text-foreground">
      <PageHeader
        title="Hộp thư nhận xét từ Giảng viên"
        description="Đọc nhận xét chi tiết, góp ý chuyên môn và điểm thành phần đánh giá liên tục do giảng viên chấm."
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="h-[600px] animate-pulse bg-muted lg:col-span-1 rounded-3xl" />
          <Card className="h-[600px] animate-pulse bg-muted lg:col-span-2 rounded-3xl" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* LEFT PANEL: LIST VIEW */}
          <div
            className={`lg:col-span-1 space-y-4 ${
              mobileView === "detail" ? "hidden lg:block" : "block"
            }`}
          >
            <Card className="border border-border shadow-sm rounded-3xl bg-card overflow-hidden">
              <div className="p-5 border-b border-border space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-extrabold text-foreground text-sm flex items-center gap-1.5">
                      Danh sách phản hồi
                      {unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          {unreadCount} mới
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm giảng viên, nội dung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-background border border-border rounded-xl text-xs font-medium"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setFilterTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      filterTab === "all"
                        ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterTab("unread")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      filterTab === "unread"
                        ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    Chưa đọc
                  </button>
                  <button
                    onClick={() => setFilterTab("sprint4")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      filterTab === "sprint4"
                        ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sprint 4
                  </button>
                  <button
                    onClick={() => setFilterTab("sprint3")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      filterTab === "sprint3"
                        ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sprint 3
                  </button>
                </div>
              </div>

              <CardContent className="p-3 divide-y divide-border/60">
                {filteredFeedbacks.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Inbox size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold">Không tìm thấy nhận xét nào</p>
                  </div>
                ) : (
                  filteredFeedbacks.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectFeedback(item.id)}
                        className={`w-full p-3.5 text-left rounded-2xl flex flex-col gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-50/50 dark:bg-orange-950/20 font-bold shadow-inner"
                            : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                            {item.sprint}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {item.date.split(" ")[0]}
                          </span>
                        </div>
                        
                        <div className="min-w-0">
                          <h5 className={`text-xs truncate ${!item.read ? "font-black text-foreground" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                            {item.title}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${!item.read ? "bg-orange-500" : "bg-transparent"}`} />
                            <p className="text-[10px] text-muted-foreground truncate font-bold">
                              {item.instructorName}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: DETAIL VIEW */}
          <div
            className={`lg:col-span-2 ${
              mobileView === "list" ? "hidden lg:block" : "block"
            }`}
          >
            {selectedFeedback ? (
              <Card className="border border-border shadow-sm rounded-3xl bg-card overflow-hidden !pt-0">
                <div className="h-2 w-full bg-orange-500" />
                
                <div className="p-6 space-y-6">
                  {/* MOBILE BACK BUTTON */}
                  <button
                    onClick={() => setMobileView("list")}
                    className="flex lg:hidden items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold cursor-pointer mb-2"
                  >
                    <ChevronLeft size={16} /> Quay lại danh sách
                  </button>

                  {/* HEADER */}
                  <div className="space-y-3 pb-5 border-b border-border">
                    <div className="flex justify-between items-center">
                      <span className="bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-black">
                        {selectedFeedback.sprint}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                        <Calendar size={13} />
                        {selectedFeedback.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-foreground leading-normal">
                      {selectedFeedback.title}
                    </h3>

                    {/* SENDER CARD */}
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-border">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {selectedFeedback.instructorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-foreground text-xs flex items-center gap-1">
                          {selectedFeedback.instructorName}
                          <ShieldCheck size={13} className="text-emerald-500" />
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-semibold">
                          {selectedFeedback.instructorRole}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DETAIL SCORES FROM INSTRUCTOR */}
                  <div className="space-y-3">
                    <h5 className="font-extrabold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                      Điểm thành phần & Đánh giá tiêu chí
                    </h5>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-border flex flex-col justify-between h-20 shadow-inner">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          Chất lượng Code
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-black text-foreground">
                            {selectedFeedback.scores.codeQuality}/5
                          </span>
                          {renderStars(selectedFeedback.scores.codeQuality)}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-border flex flex-col justify-between h-20 shadow-inner">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          Task & Đúng Hạn
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-black text-foreground">
                            {selectedFeedback.scores.deadlines}/5
                          </span>
                          {renderStars(selectedFeedback.scores.deadlines)}
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-border flex flex-col justify-between h-20 shadow-inner">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                          Hợp tác Nhóm
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-black text-foreground">
                            {selectedFeedback.scores.teamwork}/5
                          </span>
                          {renderStars(selectedFeedback.scores.teamwork)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FEEDBACK CONTENTS */}
                  <div className="space-y-5">
                    
                    {/* Strengths */}
                    <div className="space-y-2 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 border border-emerald-100/30 rounded-2xl">
                      <h5 className="font-extrabold text-emerald-800 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                        <Check size={14} className="bg-emerald-100 dark:bg-emerald-900/30 p-0.5 rounded-full" />
                        Điểm mạnh chính (Strengths)
                      </h5>
                      <ul className="list-disc list-inside text-muted-foreground text-xs font-medium space-y-1.5 pl-1 leading-relaxed">
                        {selectedFeedback.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="space-y-2 bg-orange-50/20 dark:bg-orange-950/10 p-4 border border-orange-100/30 rounded-2xl">
                      <h5 className="font-extrabold text-orange-800 dark:text-orange-400 text-xs flex items-center gap-1.5">
                        <AlertCircle size={14} className="bg-orange-100 dark:bg-orange-900/30 p-0.5 rounded-full" />
                        Điểm cần khắc phục (Improvements)
                      </h5>
                      <ul className="list-disc list-inside text-muted-foreground text-xs font-medium space-y-1.5 pl-1 leading-relaxed">
                        {selectedFeedback.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2 bg-blue-50/20 dark:bg-blue-950/10 p-4 border border-blue-100/30 rounded-2xl">
                      <h5 className="font-extrabold text-blue-800 dark:text-blue-400 text-xs flex items-center gap-1.5">
                        <MessageSquare size={14} className="bg-blue-100 dark:bg-blue-900/30 p-0.5 rounded-full" />
                        Hành động đề xuất (Recommendations)
                      </h5>
                      <ul className="list-disc list-inside text-muted-foreground text-xs font-medium space-y-1.5 pl-1 leading-relaxed">
                        {selectedFeedback.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ACKNOWLEDGE ACTIONS */}
                  <div className="pt-2 border-t border-border flex justify-end">
                    <Button
                      onClick={() => handleAcknowledge()}
                      className="h-10 px-5 bg-slate-900 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle size={14} />
                      Xác nhận đã đọc & hiểu ý kiến
                    </Button>
                  </div>

                  {/* DISCUSSION & Q&A REPLIES */}
                  <div className="pt-5 border-t border-border space-y-4">
                    <h5 className="font-extrabold text-foreground text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare size={14} />
                      Thảo luận làm rõ ý kiến nhận xét
                    </h5>

                    {/* List replies */}
                    {selectedFeedback.replies.length > 0 && (
                      <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-border">
                        {selectedFeedback.replies.map((rep, idx) => (
                          <div key={idx} className="flex gap-2 items-start text-xs leading-relaxed">
                            <CornerDownRight size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <div className="flex gap-2 items-center text-[10px] font-bold">
                                <span className="text-foreground">{rep.senderName}</span>
                                <span className="text-muted-foreground font-semibold">{rep.date}</span>
                              </div>
                              <p className="text-muted-foreground font-medium">{rep.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post reply Form */}
                    <form onSubmit={handleSendReply} className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="reply-input" className="text-muted-foreground text-[11px] font-bold">
                          Đặt câu hỏi hoặc phản hồi thêm cho giảng viên về đánh giá này
                        </Label>
                        <textarea
                          id="reply-input"
                          rows={2}
                          placeholder="Ví dụ: Dạ em xin phép hỏi thầy rõ hơn về tiêu chuẩn commit message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-3.5 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 rounded-2xl text-xs font-medium leading-relaxed resize-none shadow-inner text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/10"
                        >
                          <Send size={12} />
                          Gửi câu hỏi làm rõ
                        </Button>
                      </div>
                    </form>

                  </div>

                </div>
              </Card>
            ) : (
              <Card className="h-96 flex flex-col justify-center items-center text-muted-foreground border border-dashed border-border rounded-3xl bg-card">
                <Inbox size={48} className="text-slate-300 dark:text-slate-800 mb-3" />
                <p className="text-xs font-bold">Vui lòng chọn một nhận xét ở cột bên trái để xem chi tiết</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
