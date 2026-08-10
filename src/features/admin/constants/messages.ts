export const ADMIN_MESSAGES = {
  WEIGHT_REQUEST: {
    SUCCESS: "Quyết định yêu cầu thành công!",
    ERROR: "Có lỗi xảy ra khi xử lý yêu cầu",
    REQUEST_SUCCESS: "Yêu cầu thay đổi tỷ trọng thành công!",
    REQUEST_ERROR: "Có lỗi xảy ra khi yêu cầu thay đổi tỷ trọng",
  },
  PROJECT: {
    CREATE_SUCCESS: "Tạo dự án thành công",
    CREATE_ERROR: "Tạo dự án thất bại",
    UPDATE_SUCCESS: "Cập nhật dự án thành công",
    UPDATE_ERROR: "Cập nhật dự án thất bại",
  },
  RUBRIC: {
    CREATE_SUCCESS: "Thêm tiêu chí thành công!",
    CREATE_ERROR: "Có lỗi xảy ra khi thêm tiêu chí",
    UPDATE_SUCCESS: "Cập nhật tiêu chí thành công!",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật tiêu chí",
    DELETE_SUCCESS: "Xóa tiêu chí thành công!",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa tiêu chí",
  },
  USER: {
    TOGGLE_STATUS_SUCCESS: "Cập nhật trạng thái thành công!",
    TOGGLE_STATUS_ERROR: "Có lỗi xảy ra khi cập nhật trạng thái.",
    IMPORT_SUCCESS: "Import danh sách người dùng thành công!",
    IMPORT_ERROR: "Có lỗi xảy ra khi import danh sách",
    IMPORT_REQUIRE_FILE: "Vui lòng chọn file Excel để import.",
  },
  CLASS: {
    CREATE_SUCCESS: "Tạo lớp học thành công",
    CREATE_ERROR: "Có lỗi xảy ra khi tạo lớp",
    UPDATE_SUCCESS: "Cập nhật lớp học thành công",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật",
    DELETE_SUCCESS: "Xóa lớp học thành công",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa",
  }
} as const;
