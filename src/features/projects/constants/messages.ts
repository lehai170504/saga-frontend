export const PROJECT_MESSAGES = {
  CREATE: {
    SUCCESS: "Tạo dự án thành công!",
    ERROR: "Có lỗi xảy ra khi tạo dự án",
  },
  UPDATE: {
    SUCCESS: "Cập nhật thông tin dự án thành công!",
    ERROR: "Có lỗi xảy ra khi cập nhật thông tin dự án",
  },
} as const;

export const TASK_MESSAGES = {
  CREATE: {
    SUCCESS: "Tạo Jira task thành công!",
    ERROR: "Có lỗi xảy ra khi tạo Jira task",
  },
  UPDATE: {
    SUCCESS: "Cập nhật task thành công!",
    ERROR: "Có lỗi xảy ra khi cập nhật task",
  },
  UPDATE_ESTIMATION: {
    SUCCESS: "Cập nhật điểm công việc (Story Point) thành công!",
    ERROR: "Có lỗi xảy ra khi cập nhật điểm",
  },
  UPDATE_ASSIGNEE: {
    SUCCESS: "Cập nhật người thực hiện thành công!",
    ERROR: "Có lỗi xảy ra khi đổi người thực hiện",
    NOT_FOUND: "Thành viên này chưa được thêm vào trang Jira (Jira Site) của dự án.",
  },
  UPDATE_PRIORITY: {
    SUCCESS: "Cập nhật độ ưu tiên thành công!",
    ERROR: "Có lỗi xảy ra khi đổi độ ưu tiên",
  },
  DELETE: {
    SUCCESS: "Xóa task thành công!",
    ERROR: "Có lỗi xảy ra khi xóa task",
  },
  TRANSITION: {
    SUCCESS: "Cập nhật trạng thái công việc thành công!",
    ERROR: "Có lỗi xảy ra khi cập nhật trạng thái",
  },
} as const;

export const SPRINT_MESSAGES = {
  CREATE: {
    SUCCESS: "Tạo Sprint thành công!",
    ERROR: "Có lỗi xảy ra khi tạo Sprint",
  },
  START: {
    SUCCESS: "Bắt đầu Sprint thành công!",
    ERROR: "Có lỗi xảy ra khi bắt đầu Sprint",
  },
  CLOSE: {
    SUCCESS: "Đóng Sprint thành công!",
    ERROR: "Có lỗi xảy ra khi đóng Sprint",
  },
  UPDATE: {
    SUCCESS: "Cập nhật Sprint thành công!",
    ERROR: "Có lỗi xảy ra khi cập nhật Sprint",
  },
  DELETE: {
    SUCCESS: "Xóa Sprint thành công!",
    ERROR: "Có lỗi xảy ra khi xóa Sprint",
  },
  PEER_REVIEW: {
    SUCCESS: "Đăng tải đánh giá chéo thành công!",
    ERROR: "Có lỗi xảy ra khi gửi đánh giá chéo",
  },
  ERRORS: {
    JIRA_NOT_ACTIVE: "Tích hợp Jira của dự án chưa được kích hoạt hoặc chưa được cấu hình.",
    JIRA_INVALID: "Mã định danh dự án Jira không hợp lệ.",
    JIRA_REVOKED: "Quyền truy cập Jira của bạn đã hết hạn hoặc bị hủy bỏ. Vui lòng kết nối lại Jira.",
  }
} as const;
