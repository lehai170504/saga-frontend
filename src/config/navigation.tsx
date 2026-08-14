import React from "react";
import {
  BarChart3,
  Network,
  Users,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Link2,
  Settings2,
  Settings,
  UserCheck,
  GitCommit,
  Activity,
  FolderKanban,
} from "lucide-react";

export type NavItemType = {
  href: string;
  icon: React.ReactNode;
  label: string;
  action?: (e: React.MouseEvent) => void;
  hideChevron?: boolean;
  exact?: boolean;
  matchPaths?: string[];
};

export type NavGroupType = {
  title: string;
  items: NavItemType[];
};

export const getNavigationConfig = (
  role: string,
  courseId: string | null,
  className?: string | null
): NavGroupType[] => {
  switch (role) {
    case "ADMIN":
      return [
        {
          title: "Tổng quan",
          items: [
            { href: "/admin", icon: <BarChart3 size={18} />, label: "Dashboard", exact: true },
            { href: "/admin/course-progress", icon: <Activity size={18} />, label: "Tiến độ Khóa học" },
          ],
        },
        {
          title: "Quản lý Đào tạo",
          items: [
            { href: "/admin/education", icon: <BookOpen size={18} />, label: "Dữ liệu Đào tạo", matchPaths: ["/admin/education", "/admin/courses"] },
          ],
        },
        {
          title: "Người dùng & Nhóm",
          items: [
            { href: "/admin/users", icon: <Users size={18} />, label: "Người dùng" },
            { href: "/admin/teams", icon: <Network size={18} />, label: "Nhóm & Dự án", matchPaths: ["/admin/teams", "/admin/projects"] },
          ],
        },
        {
          title: "Hệ thống",
          items: [
            { href: "/admin/settings", icon: <Settings2 size={18} />, label: "Cài đặt & Hệ thống" },
          ],
        },
      ];

    case "LECTURER":
      if (courseId) {
        return [
          {
            title: className ? `Đang xem: Khóa học ${className}` : "Đang xem: Khóa học...",
            items: [
              { href: "/lecturer", icon: <ArrowLeft size={18} />, label: "Chọn khóa học khác", hideChevron: true, exact: true },
            ],
          },
          {
            title: "Workspace",
            items: [
              { href: `/lecturer/${courseId}`, icon: <BarChart3 size={18} />, label: "Tổng quan Lớp", exact: true },
            ],
          },
          {
            title: "Quản lý Lớp học",
            items: [
              { href: `/lecturer/${courseId}/students`, icon: <Users size={18} />, label: "Sinh viên & Dự án" },
              { href: `/lecturer/${courseId}/grades`, icon: <GraduationCap size={18} />, label: "Bảng điểm" },
            ],
          },
          {
            title: "Công cụ Đánh giá",
            items: [
              { href: `/lecturer/${courseId}/peer-reviews`, icon: <UserCheck size={18} />, label: "Đánh giá chéo" },
              { href: `/lecturer/${courseId}/evaluation-config`, icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
            ],
          },
        ];
      }
      return [
        {
          title: "Tổng quan",
          items: [
            { href: "/lecturer", icon: <BookOpen size={18} />, label: "Danh sách khóa học", exact: true },
          ],
        },
      ];

    case "STUDENT":
      if (courseId) {
        return [
          {
            title: className ? `Đang xem: Khóa học ${className}` : "Đang xem: Khóa học...",
            items: [
              { href: "/student", icon: <ArrowLeft size={18} />, label: "Chọn khóa học khác", hideChevron: true, exact: true },
            ],
          },
          {
            title: "Cá nhân & Nhóm",
            items: [
              { href: `/student/${courseId}/projects`, icon: <BarChart3 size={18} />, label: "Tổng quan", exact: true },
              { href: `/student/${courseId}/stats`, icon: <Activity size={18} />, label: "Thống kê dự án", exact: true },
              { href: `/student/${courseId}/sprints`, icon: <UserCheck size={18} />, label: "Đánh giá chéo", exact: true },
              { href: `/student/${courseId}/jira`, icon: <FolderKanban size={18} />, label: "Tiến độ công việc", exact: true },
              { href: `/student/${courseId}/commits`, icon: <GitCommit size={18} />, label: "Commit", exact: true },
              { href: `/student/${courseId}/config`, icon: <Settings size={18} />, label: "Cấu hình", exact: true },
            ],
          },
        ];
      }
      return [
        {
          title: "Điều hướng",
          items: [
            { href: "/student", icon: <BookOpen size={18} />, label: "Lựa chọn khóa học", exact: true },
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
