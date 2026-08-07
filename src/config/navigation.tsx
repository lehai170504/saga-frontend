import React from "react";
import {
  BarChart3,
  Network,
  Calendar,
  Users,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Logs,
  Link2,
  Settings2,
  UserCheck,
  GitCommit,
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
          ],
        },
        {
          title: "Quản lý Cốt lõi",
          items: [
            { href: "/admin/users", icon: <Users size={18} />, label: "Người dùng" },
          ],
        },
        {
          title: "Dữ liệu Danh mục",
          items: [
            { href: "/master-data/subjects", icon: <BookOpen size={18} />, label: "Môn học" },
            { href: "/master-data/classes", icon: <Network size={18} />, label: "Lớp học" },
            { href: "/master-data/semesters", icon: <Calendar size={18} />, label: "Học kỳ" },
            { href: "/master-data/courses", icon: <GraduationCap size={18} />, label: "Khóa học (Lớp PBL)", matchPaths: ["/admin/courses"] },
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
      if (courseId) {
        return [
          {
            title: className ? `Đang xem: Khóa học ${className}` : "Đang xem: Khóa học...",
            items: [
              { href: "/lecturer", icon: <ArrowLeft size={18} />, label: "Chọn khóa học khác", hideChevron: true, exact: true },
            ],
          },
          {
            title: "Quản lý Khóa học",
            items: [
              { href: `/lecturer/${courseId}`, icon: <BarChart3 size={18} />, label: "Tổng quan khóa", exact: true },
              { href: `/lecturer/${courseId}/students`, icon: <Users size={18} />, label: "Sinh viên" },
              { href: `/lecturer/${courseId}/projects`, icon: <Network size={18} />, label: "Quản lý nhóm" },
            ],
          },
          {
            title: "Đánh giá & Điểm số",
            items: [
              { href: `/lecturer/${courseId}/evaluation-config`, icon: <Settings2 size={18} />, label: "Cấu hình Đánh giá" },
              { href: `/lecturer/${courseId}/grades`, icon: <GraduationCap size={18} />, label: "Bảng điểm tổng hợp" },
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
              { href: `/student/${courseId}`, icon: <BarChart3 size={18} />, label: "Tổng quan nhóm", exact: true },
              { href: `/student/${courseId}/projects`, icon: <Network size={18} />, label: "Thông tin Nhóm", exact: true },
              { href: `/student/${courseId}/sprints`, icon: <UserCheck size={18} />, label: "Đánh giá chéo", exact: true },
              { href: `/student/${courseId}/timeline`, icon: <Calendar size={18} />, label: "Timeline", exact: true },
              { href: `/student/${courseId}/commits`, icon: <GitCommit size={18} />, label: "Commit", exact: true },
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
