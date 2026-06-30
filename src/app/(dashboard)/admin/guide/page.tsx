"use client";

import React from "react";
import {
  BookOpen, FileText, Users, Calendar, HelpCircle,
  Network, ShieldCheck, ArrowRight, Settings, CheckCircle2,
  AlertTriangle, Server
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function AdminGuidePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
      <PageHeader
        title="Hướng dẫn Quản trị viên"
        description="Tài liệu vận hành hệ thống SAGA toàn diện dành riêng cho Admin."
        workspace="Workspace Quản trị"
      >
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-medium px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
          <CheckCircle2 className="w-4 h-4" /> Phiên bản 1.2
        </div>
      </PageHeader>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <TabsList className="bg-card/40 backdrop-blur-xl border border-border/50 p-1.5 rounded-2xl h-auto min-w-max">
            <TabsTrigger value="overview" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Tổng quan Hệ thống</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="academic" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Dữ liệu Học vụ</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="classes" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <div className="flex items-center gap-2">
                <Network size={16} />
                <span>Quản lý Lớp PBL</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Phân quyền Người dùng</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="faq" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} />
                <span>Xử lý Sự cố (FAQ)</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. Tổng quan */}
        <TabsContent value="overview" className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Kiến trúc Vận hành SAGA</CardTitle>
                  <CardDescription>Luồng dữ liệu cốt lõi và vai trò của Admin.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                SAGA (Student Academic Graph Analytics) là hệ thống đánh giá tự động và trực quan hóa hoạt động học tập dựa trên đồ thị (Graph) và dữ liệu chéo từ <strong>GitHub, Jira</strong> cùng dữ liệu học vụ do Admin quản lý.
              </p>

              <div className="mt-6 space-y-4">
                <h3 className="font-bold text-foreground">Quy trình luân chuyển dữ liệu (Data Pipeline)</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center flex flex-col items-center justify-center gap-2 h-full">
                    <Server className="w-6 h-6 text-orange-500" />
                    <span className="text-xs font-bold uppercase">1. Dữ liệu Đầu vào</span>
                    <span className="text-[11px] text-muted-foreground">Nhập thủ công</span>
                  </div>
                  <div className="hidden md:flex justify-center text-muted-foreground"><ArrowRight /></div>
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center flex flex-col items-center justify-center gap-2 h-full">
                    <Settings className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-bold uppercase">2. Xử lý Backend</span>
                    <span className="text-[11px] text-muted-foreground">Phân tích & Ánh xạ</span>
                  </div>
                  <div className="hidden md:flex justify-center text-muted-foreground"><ArrowRight /></div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center flex flex-col items-center justify-center gap-2 h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full"></div>
                    <Network className="w-6 h-6 text-primary relative z-10" />
                    <span className="text-xs font-bold text-primary uppercase relative z-10">3. SAGA Graph</span>
                    <span className="text-[11px] text-primary/80 relative z-10">Phân tích Tương tác</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Dữ liệu Học vụ */}
        <TabsContent value="academic" className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                  <Calendar size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Quản lý Cấu trúc Học vụ</CardTitle>
                  <CardDescription>Hướng dẫn thao tác tạo và quản lý dữ liệu nền tảng.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-foreground">Dữ liệu cần quản lý bao gồm:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      <span><strong>Kỳ học (Semesters):</strong> Thiết lập học kỳ hiện tại và thời gian.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      <span><strong>Môn học (Courses):</strong> Các môn học đang vận hành trong kỳ.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      <span><strong>Danh sách Lớp (Classes & Rosters):</strong> Phân công sinh viên và Giảng viên thủ công.</span>
                    </li>
                  </ul>
                </div>
                <div className="p-5 bg-background rounded-2xl border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">Quy trình Cập nhật Dữ liệu</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Cập nhật thủ công</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống hiện tại hoạt động độc lập và yêu cầu Admin tự quản lý dữ liệu. Khi có lớp mới hoặc sinh viên chuyển lớp, Admin cần vào trang <strong>Dữ liệu Học vụ</strong> để thêm mới hoặc cập nhật thông tin tương ứng.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-200 dark:border-blue-900">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Mẹo: Hãy đảm bảo email của sinh viên và giảng viên chính xác để hệ thống phân quyền đúng.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Quản lý Lớp */}
        <TabsContent value="classes" className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                  <Network size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Xử lý Lớp & Mạng Tương tác</CardTitle>
                  <CardDescription>Cơ chế hoạt động của Đồ thị (Graph) và phân quyền Giảng viên.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 mb-4">
                <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">Đồ thị Mạng tương tác (Interaction Graph) hoạt động như thế nào?</h4>
                <p className="text-sm text-blue-600/80 dark:text-blue-300">
                  Mỗi khi một sinh viên push code, tạo Pull Request trên GitHub, hoặc chuyển trạng thái task trên Jira, hệ thống sẽ ánh xạ hành động đó thành <strong>Cạnh (Edge)</strong> nối giữa sinh viên đó và các thành viên khác trong Node Mạng tương tác. Admin không cần can thiệp quá trình này, nhưng cần hướng dẫn sinh viên liên kết đúng tài khoản.
                </p>
              </div>

              <h3 className="font-bold text-foreground">Xử lý khi sai Giảng viên phụ trách</h3>
              <p className="text-muted-foreground text-sm">
                Nếu có sự thay đổi về Giảng viên phụ trách, Admin có thể vào mục <strong>Quản lý Lớp PBL</strong>, tìm lớp tương ứng, bấm vào <strong>Chỉnh sửa</strong> và gán lại Email của Giảng viên mới <Badge variant="secondary">Cập nhật thủ công</Badge>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Người dùng */}
        <TabsContent value="users" className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                  <Users size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Ma trận Phân quyền Người dùng</CardTitle>
                  <CardDescription>Bảng mô tả chi tiết quyền hạn của từng Role.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-4 bg-muted/50 p-4 border-b border-border text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <div>Vai trò (Role)</div>
                  <div className="text-center">Xem Đồ thị</div>
                  <div className="text-center">Đánh giá Thành viên</div>
                  <div className="text-center">Quản trị Hệ thống</div>
                </div>
                <div className="grid grid-cols-4 p-4 border-b border-border/50 items-center hover:bg-muted/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" /> Admin
                  </div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
                </div>
                <div className="grid grid-cols-4 p-4 border-b border-border/50 items-center hover:bg-muted/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> Giảng viên
                  </div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
                  <div className="text-center text-muted-foreground">-</div>
                </div>
                <div className="grid grid-cols-4 p-4 items-center hover:bg-muted/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <Users size={16} className="text-amber-500" /> Sinh viên
                  </div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto text-emerald-500/50" /> <span className="text-[10px] text-muted-foreground block">(Nhóm của mình)</span></div>
                  <div className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto text-emerald-500/50" /> <span className="text-[10px] text-muted-foreground block">(Chấm chéo)</span></div>
                  <div className="text-center text-muted-foreground">-</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. FAQ */}
        <TabsContent value="faq" className="mt-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <Card className="rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Troubleshooting (Xử lý sự cố)</CardTitle>
                  <CardDescription>Các kịch bản thực tế khi vận hành SAGA.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1" className="border-border px-1">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary transition-colors text-base py-4">Sinh viên khiếu nại biểu đồ nhiệt (Heatmap) không hiển thị hoạt động?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    <strong>Nguyên nhân:</strong> Sinh viên chưa liên kết tài khoản GitHub/Jira đúng với Email trường, hoặc chưa commit vào nhánh mặc định của Repository.<br />
                    <strong>Cách giải quyết:</strong> Hướng dẫn sinh viên vào menu <span className="font-semibold text-foreground">Kết nối tài khoản</span> để kiểm tra trạng thái liên kết (Link Status). Sau khi liên kết đúng, hệ thống sẽ tự động truy xuất lại dữ liệu trong lần chạy Cronjob tiếp theo (hoặc khoảng 30 phút).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border-border px-1">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary transition-colors text-base py-4">Giảng viên không thấy danh sách lớp được phân công?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    <strong>Nguyên nhân:</strong> Quá trình tạo lớp bị thiếu thông tin giảng viên, hoặc giảng viên đăng nhập bằng email không khớp với dữ liệu đã tạo.<br />
                    <strong>Cách giải quyết:</strong> Admin vào mục <span className="font-semibold text-foreground">Quản lý Lớp PBL</span>, tìm lớp bị thiếu và cập nhật lại thông tin bằng email chính xác của giảng viên.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border-border px-1">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary transition-colors text-base py-4">Hệ thống báo &quot;Lỗi rate limit API từ GitHub&quot;, tôi cần làm gì?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    Trường hợp này xảy ra khi hệ thống xử lý lượng lớn dữ liệu commit/PR cùng một lúc. Bạn không cần can thiệp thủ công; Background Worker của SAGA được thiết kế để tự động backoff và thử lại sau 15-30 phút. Bạn có thể theo dõi tiến trình trong mục <span className="font-semibold text-foreground">Nhật ký Hệ thống</span>.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border-border px-1">
                  <AccordionTrigger className="text-foreground font-semibold hover:text-primary transition-colors text-base py-4">Cách khắc phục khi trang dữ liệu học vụ tải chậm?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    Trường hợp trang tải chậm hoặc treo thường do khối lượng dữ liệu truy xuất lớn. Vui lòng làm mới (F5) trang. Nếu vấn đề vẫn tiếp diễn, bạn có thể kiểm tra tab <strong>Network</strong> hoặc liên hệ với bộ phận kỹ thuật để tối ưu hóa truy vấn cơ sở dữ liệu.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
