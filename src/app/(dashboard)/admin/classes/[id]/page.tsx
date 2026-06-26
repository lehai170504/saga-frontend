"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Search, Plus, Download, MoreHorizontal,
  Edit, Trash2, Users, UsersRound, FolderKanban, Mail,
  GraduationCap, Sparkles, RefreshCw, Save
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/shared/Skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MetricCard } from "@/components/shared/MetricCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data
const mockClassDetails = {
  id: "1",
  className: "SE102.M21",
  subject: "Công nghệ phần mềm",
  lecturer: "Dr. Nguyen Van A",
  semester: "Học kỳ 1 - 2023-2024",
  status: "Đang diễn ra",
  totalStudents: 45,
  totalGroups: 9,
  totalProjects: 9,
};

const mockStudents = Array.from({ length: 15 }).map((_, i) => ({
  id: `sv${i + 1}`,
  studentId: `SE180${i.toString().padStart(3, '0')}`,
  name: `Sinh viên ${i + 1}`,
  email: `sv${i + 1}@student.edu.vn`,
  status: i % 5 === 0 ? "Vắng nhiều" : "Bình thường",
  avatar: `https://i.pravatar.cc/150?u=sv${i}`
}));

const mockGroups = Array.from({ length: 9 }).map((_, i) => ({
  id: `g${i + 1}`,
  name: `Nhóm ${i + 1}`,
  members: Math.floor(Math.random() * 2) + 4, // 4-5 members
  leader: `Sinh viên ${i * 5 + 1}`,
  topic: i % 2 === 0 ? "Quản lý thư viện" : "Bán hàng trực tuyến"
}));

const mockProjects = Array.from({ length: 9 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Đồ án ${i + 1}: ${i % 2 === 0 ? "Quản lý thư viện" : "Bán hàng trực tuyến"}`,
  group: `Nhóm ${i + 1}`,
  status: i % 3 === 0 ? "Hoàn thành" : "Đang thực hiện",
  progress: i % 3 === 0 ? 100 : Math.floor(Math.random() * 60) + 40
}));

export default function ClassDetailsPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState(mockStudents);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentFormData, setStudentFormData] = useState({ studentId: "", name: "", email: "", status: "Bình thường" });

  const [isSyncingFAP, setIsSyncingFAP] = useState(false);

  const openAddStudent = () => {
    setEditingStudentId(null);
    setStudentFormData({ studentId: "", name: "", email: "", status: "Bình thường" });
    setIsStudentModalOpen(true);
  };

  const openEditStudent = (student: { id: string; studentId: string; name: string; email: string; status: string }) => {
    setEditingStudentId(student.id);
    setStudentFormData({ studentId: student.studentId, name: student.name, email: student.email, status: student.status });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentFormData.name || !studentFormData.studentId) {
      toast.error("Vui lòng nhập đủ thông tin!");
      return;
    }
    if (editingStudentId) {
      setStudents(students.map(s => s.id === editingStudentId ? { ...s, ...studentFormData } : s));
      toast.success("Cập nhật sinh viên thành công!");
    } else {
      setStudents([...students, { id: Date.now().toString(), avatar: "https://i.pravatar.cc/150", ...studentFormData }]);
      toast.success("Thêm sinh viên thành công!");
    }
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success("Đã xóa sinh viên khỏi lớp!");
  };

  const handleSimulateAction = (message: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Đang xử lý...',
        success: message,
        error: 'Có lỗi xảy ra',
      }
    );
  };

  const handleSyncFAP = () => {
    setIsSyncingFAP(true);
    toast.loading("Đang kết nối hệ thống FAP...", { id: "sync-fap" });
    setTimeout(() => {
      setIsSyncingFAP(false);
      toast.success("Đã đồng bộ danh sách lớp mới nhất từ FAP!", { id: "sync-fap" });
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/80 transition-all"
            onClick={() => router.push('/admin/classes')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium backdrop-blur-md">
            <Sparkles size={16} className="animate-pulse" />
            <span>Workspace Quản trị</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-5 w-64 rounded-md" />
          </div>
        ) : (
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60 flex items-center gap-3">
              Lớp {mockClassDetails.className}
              <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-md font-bold align-middle uppercase tracking-wider shadow-sm">
                {mockClassDetails.status}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
              <GraduationCap className="w-4 h-4" />
              {mockClassDetails.subject} • Giảng viên: {mockClassDetails.lecturer} • {mockClassDetails.semester}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl bg-background shadow-sm border-border" onClick={() => handleSimulateAction("Đã xuất dữ liệu lớp thành công!")}>
            <Download className="w-4 h-4 mr-2" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Tổng sinh viên", value: mockClassDetails.totalStudents, icon: <Users className="w-4 h-4" /> },
          { label: "Số lượng nhóm", value: mockClassDetails.totalGroups, icon: <UsersRound className="w-4 h-4" /> },
          { label: "Số lượng dự án", value: mockClassDetails.totalProjects, icon: <FolderKanban className="w-4 h-4" /> }
        ].map((stat, i) => (
          <MetricCard
            key={i}
            title={stat.label}
            value={isLoading ? "-" : stat.value.toString()}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full sm:w-[500px] grid-cols-4 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="settings" className="font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Cài đặt
          </TabsTrigger>
          <TabsTrigger value="students" className="font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Sinh viên
          </TabsTrigger>
          <TabsTrigger value="groups" className="font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Nhóm
          </TabsTrigger>
          <TabsTrigger value="projects" className="font-bold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
            Dự án
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="settings" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Cài đặt chung của Lớp</CardTitle>
                  <CardDescription>Quản lý các thông tin cốt lõi của lớp học (Chỉ dành cho Admin).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Mã Lớp</Label>
                      <Input value={mockClassDetails.className} disabled className="bg-muted/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Môn học</Label>
                      <Input value={mockClassDetails.subject} disabled className="bg-muted/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Học kỳ</Label>
                      <Input value={mockClassDetails.semester} disabled className="bg-muted/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phân công Giảng viên</Label>
                      <Select defaultValue="gv1">
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Chọn giảng viên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gv1">Dr. Nguyen Van A</SelectItem>
                          <SelectItem value="gv2">Dr. Tran Thi B</SelectItem>
                          <SelectItem value="gv3">Prof. Le Minh C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Trạng thái lớp</Label>
                      <Select defaultValue="active">
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Đang diễn ra</SelectItem>
                          <SelectItem value="ended">Đã kết thúc</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Button className="rounded-xl font-bold bg-primary" onClick={() => toast.success("Đã lưu cài đặt lớp học!")}>
                      <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sinh viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl bg-background border-border focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl bg-background shadow-sm border-border text-primary font-semibold hover:bg-primary/5 hover:text-primary"
                    onClick={handleSyncFAP}
                    disabled={isSyncingFAP}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSyncingFAP ? 'animate-spin' : ''}`} />
                    Đồng bộ từ FAP
                  </Button>
                  <Button className="rounded-xl font-bold shadow-sm" onClick={openAddStudent}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm thủ công
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="w-[80px]">Avatar</TableHead>
                      <TableHead>Mã SV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/30 transition-colors border-border">
                        <TableCell>
                          <Avatar className="w-9 h-9 border border-border/50">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-muted-foreground">{student.studentId}</TableCell>
                        <TableCell className="font-bold text-foreground">{student.name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${student.status === "Bình thường"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}>
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                                <span className="sr-only">Mở menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem className="cursor-pointer rounded-md flex items-center hover:bg-muted focus:bg-muted" onClick={() => toast.success(`Đã gửi email đến ${student.name}`)}>
                                <Mail className="mr-2 h-4 w-4" /> Gửi email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer rounded-md flex items-center hover:bg-muted focus:bg-muted" onClick={() => openEditStudent(student)}>
                                <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem className="cursor-pointer rounded-md text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center" onClick={() => handleDeleteStudent(student.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa khỏi lớp
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-foreground">Danh sách Nhóm (Chỉ xem)</h2>
                <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
                  Việc chia nhóm do Giảng viên phụ trách
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockGroups.map((group) => (
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
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-foreground">Danh sách Dự án (Chỉ xem)</h2>
                <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-lg">
                  Nội dung dự án do Giảng viên quản lý
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockProjects.map((project) => (
                  <div key={project.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-primary text-xl leading-tight">{project.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground">Thực hiện bởi: <span className="text-foreground font-bold">{project.group}</span></p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md font-bold text-xs whitespace-nowrap shrink-0 ${project.status === "Hoàn thành"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="space-y-2 mt-auto pt-4 border-t border-border/30">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Tiến độ hoàn thành</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-in-out ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Student Modal */}
      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              {editingStudentId ? "Sửa thông tin sinh viên" : "Thêm sinh viên thủ công"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chỉ dùng chức năng này khi FAP bị lỗi hoặc không thể tự động đồng bộ.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Mã SV</Label>
              <Input
                className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
                value={studentFormData.studentId}
                onChange={(e) => setStudentFormData({ ...studentFormData, studentId: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Họ và tên</Label>
              <Input
                className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
                value={studentFormData.name}
                onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Email</Label>
              <Input
                className="col-span-3 rounded-xl focus-visible:ring-primary bg-background border-input"
                value={studentFormData.email}
                onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveStudent} className="rounded-xl font-bold">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
