import React from "react";
import {
  BarChart3,
  Network,
  Activity,
  Calendar,
  Users,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Share2,
  Logs,
  Link2,
  Inbox,
  UserCheck,
  CalendarX,
  Settings2,
  Database,
  FolderKanban,
  GitBranch,
  ClipboardList,
} from "lucide-react";

export type NavItemType = {
  href: string;
  icon: React.ReactNode;
  label: string;
  action?: (e: React.MouseEvent) => void;
  hideChevron?: boolean;
  exact?: boolean;
};

export type NavGroupType = {
  title: string;
  items: NavItemType[];
};

export const getNavigationConfig = (
  role: string,
  classId: string | null,
  handlers?: {
    onStudentSwitchClass?: (e?: React.MouseEvent) => void;
  }
): NavGroupType[] => {
  switch (role) {
    case "ADMIN":
      return [
        {
          title: "Tổng quan",
          items: [
            { href: "/admin", icon: <BarChart3 size={18} />, label: "Dashboard", exact: true },
          ],
        },
        {
          title: "Quản lý Cốt lõi",
          items: [
            { href: "/admin/users", icon: <Users size={18} />, label: "Người dùng" },
            { href: "/admin/academic-data", icon: <Database size={18} />, label: "Dữ liệu Học vụ" },
            { href: "/admin/classes", icon: <Network size={18} />, label: "Lớp PBL" },
          ],
        },
        {
          title: "Dữ liệu Danh mục",
          items: [
            { href: "/master-data/subjects", icon: <BookOpen size={18} />, label: "Môn học" },
            { href: "/master-data/classes", icon: <Network size={18} />, label: "Lớp học" },
            { href: "/master-data/semesters", icon: <Calendar size={18} />, label: "Học kỳ" },
            { href: "/master-data/courses", icon: <GraduationCap size={18} />, label: "Khóa học" },
          ],
        },
        {
          title: "Hệ thống",
          items: [
            { href: "/admin/evaluation-config", icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
            { href: "/admin/system-logs", icon: <Logs size={18} />, label: "Nhật ký hệ thống" },
            { href: "/admin/guide", icon: <BookOpen size={18} />, label: "Hướng dẫn" },
          ],
        },
      ];

    case "LECTURER":
      if (classId) {
        return [
          {
            title: `Đang xem: LỚP ${classId.toUpperCase()}`,
            items: [
              { href: "/lecturer", icon: <ArrowLeft size={18} />, label: "Chọn lớp khác", hideChevron: true, exact: true },
            ],
          },
          {
            title: "Quản lý Lớp học",
            items: [
              { href: `/lecturer/${classId}`, icon: <BarChart3 size={18} />, label: "Tổng quan lớp", exact: true },
              { href: `/lecturer/${classId}/students`, icon: <Users size={18} />, label: "Sinh viên" },
              { href: `/lecturer/${classId}/projects`, icon: <Network size={18} />, label: "Quản lý nhóm" },
            ],
          },
          {
            title: "Đánh giá & Điểm số",
            items: [
              { href: `/lecturer/${classId}/evaluation-config`, icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
              { href: `/lecturer/${classId}/grades`, icon: <GraduationCap size={18} />, label: "Bảng điểm tổng hợp" },
            ],
          },
        ];
      }
      return [
        {
          title: "Tổng quan",
          items: [
            { href: "/lecturer", icon: <BookOpen size={18} />, label: "Danh sách lớp học", exact: true },
          ],
        },
      ];

    case "STUDENT":
      if (classId) {
        return [
          {
            title: `Đang xem: LỚP ${classId.toUpperCase()}`,
            items: [
              { href: "/student", icon: <ArrowLeft size={18} />, label: "Chọn lớp khác", hideChevron: true, exact: true },
            ],
          },
          {
            title: "Cá nhân & Nhóm",
            items: [
              { href: `/student/${classId}`, icon: <BarChart3 size={18} />, label: "Tổng quan nhóm", exact: true },
              { href: `/student/${classId}/projects`, icon: <Network size={18} />, label: "Danh sách nhóm", exact: true },
              { href: `/student/${classId}/projects/create`, icon: <FolderKanban size={18} />, label: "Cấu hình Project" },
              { href: `/student/${classId}/commits`, icon: <GitBranch size={18} />, label: "Lịch sử Commits" },
              { href: `/student/${classId}/kanban`, icon: <ClipboardList size={18} />, label: "Bảng Kanban (Jira)" },
              { href: `/student/${classId}/burndown`, icon: <Calendar size={18} />, label: "Tiến độ Task" },
              { href: `/student/${classId}/contribution`, icon: <Users size={18} />, label: "Đóng góp cá nhân" },
              { href: `/student/${classId}/audit-logs`, icon: <Logs size={18} />, label: "Nhật ký hoạt động" },
            ],
          },
          {
            title: "Tương tác",
            items: [
              { href: `/student/${classId}/assessment`, icon: <UserCheck size={18} />, label: "Đánh giá chéo" },
              { href: `/student/${classId}/feedback`, icon: <Inbox size={18} />, label: "Nhận xét" },
              { href: `/student/${classId}/absence`, icon: <CalendarX size={18} />, label: "Báo cáo vắng" },
            ],
          },
          {
            title: "AI & Phân tích Đồ thị",
            items: [
              { href: `/student/${classId}/interaction-graph`, icon: <Share2 size={18} />, label: "Mạng tương tác" },
              { href: `/student/${classId}/heatmap`, icon: <Activity size={18} />, label: "Biểu đồ nhiệt" },
            ],
          },
        ];
      }
      return [
        {
          title: "Điều hướng",
          items: [
            { href: "/student", icon: <BookOpen size={18} />, label: "Lựa chọn lớp học", exact: true },
          ],
        },
        {
          title: "Cài đặt",
          items: [
            { href: "/student/settings", icon: <Link2 size={18} />, label: "Kết nối tài khoản" },
          ],
        },
      ];

    default:
      return [];
  }
};
