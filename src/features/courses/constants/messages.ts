export const COURSE_MESSAGES = {
  IMPORT: {
    SUCCESS: "Import danh sách sinh viên thành công!",
    SUCCESS_DETAILS: (created: number, reused: number) => `Import thành công! Đã thêm mới ${created} sinh viên, sử dụng lại ${reused} hồ sơ.`,
    ERROR_GENERIC: "Đã có lỗi xảy ra khi import danh sách sinh viên.",
    REQUIRE_FILE: "Vui lòng chọn file Excel để import",
    DOWNLOAD_TEMPLATE_ERROR: "Không thể tải file mẫu. Vui lòng thử lại sau.",
  },
  EXPORT: {
    SUCCESS: "Xuất file báo cáo thành công",
    ERROR: "Xuất file báo cáo thất bại",
  },
  CREATE: {
    SUCCESS: "Tạo khóa học thành công!",
    ERROR: "Có lỗi xảy ra khi tạo khóa học.",
  },
  UPDATE: {
    SUCCESS: "Cập nhật khóa học thành công!",
    ERROR: "Cập nhật khóa học thất bại!",
  },
  DELETE: {
    SUCCESS: "Đã xóa khóa học thành công!",
    ERROR: "Có lỗi xảy ra khi xóa khóa học.",
  },
  COMMON: {
    FEATURE_IN_DEVELOPMENT: "Tính năng đang được phát triển, vui lòng thử lại sau!",
  },
} as const;
