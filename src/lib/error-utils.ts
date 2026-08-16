import { AxiosError } from "axios";
import { ApiError } from "./axios";

/**
 * Maps backend error objects / English error strings to clean, user-friendly Vietnamese error messages.
 */
export function getVietnameseErrorMessage(err: unknown, fallbackMessage: string): string {
  if (!err) return fallbackMessage;

  let rawMessage = "";
  let status = 0;

  if (err instanceof ApiError) {
    rawMessage = err.message || "";
    status = err.status || 0;
  } else if (err instanceof AxiosError) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    rawMessage = (data?.message as string) || (data?.error as string) || err.message || "";
    status = err.response?.status || 0;
  } else if (err instanceof Error) {
    rawMessage = err.message || "";
  } else if (typeof err === "string") {
    rawMessage = err;
  } else if (typeof err === "object" && err !== null && "message" in err) {
    rawMessage = String((err as { message: unknown }).message);
  }

  // HTTP status code based fallbacks
  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }
  if (status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }
  if (status === 404 && (!rawMessage || rawMessage.toLowerCase().includes("not found"))) {
    return "Không tìm thấy dữ liệu yêu cầu hoặc tài nguyên không tồn tại.";
  }
  if (status === 500 && (!rawMessage || rawMessage.toLowerCase().includes("internal server error"))) {
    return "Lỗi hệ thống máy chủ. Vui lòng thử lại sau.";
  }
  if (status === 503 || (rawMessage && rawMessage.toLowerCase().includes("ai_agent_unavailable"))) {
    return "Dịch vụ Trợ lý AI hiện đang tạm ngưng kết nối (503 Service Unavailable). Vui lòng thử lại sau ít phút.";
  }

  if (!rawMessage) return fallbackMessage;

  // If the message ALREADY contains Vietnamese characters, return it directly
  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(rawMessage)) {
    return rawMessage;
  }

  const msgLower = rawMessage.toLowerCase();

  // Common English Backend Error patterns -> Vietnamese translations
  if (msgLower.includes("access is denied") || msgLower.includes("forbidden") || msgLower.includes("unauthorized")) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }
  if (msgLower.includes("bad credentials") || msgLower.includes("invalid password") || msgLower.includes("invalid credentials")) {
    return "Tên đăng nhập hoặc mật khẩu không chính xác.";
  }
  if (msgLower.includes("user already exists") || msgLower.includes("email already exists")) {
    return "Tài khoản hoặc Email này đã tồn tại trong hệ thống.";
  }
  if (msgLower.includes("team not found")) {
    return "Không tìm thấy thông tin nhóm.";
  }
  if (msgLower.includes("project not found")) {
    return "Không tìm thấy thông tin dự án.";
  }
  if (msgLower.includes("sprint not found")) {
    return "Không tìm thấy thông tin Sprint.";
  }
  if (msgLower.includes("task not found")) {
    return "Không tìm thấy thông tin công việc.";
  }
  if (msgLower.includes("user is already in a team") || msgLower.includes("already in team")) {
    return "Thành viên này đã tham gia vào một nhóm khác.";
  }
  if (msgLower.includes("jira integration") || msgLower.includes("jira site")) {
    return "Lỗi kết nối tích hợp Jira. Vui lòng kiểm tra lại cấu hình Jira.";
  }
  if (msgLower.includes("github repository") || msgLower.includes("github integration")) {
    return "Lỗi kết nối tích hợp GitHub. Vui lòng kiểm tra lại cấu hình GitHub.";
  }
  if (msgLower.includes("cannot be null") || msgLower.includes("is required") || msgLower.includes("must not be empty")) {
    return "Vui lòng nhập đầy đủ các thông tin bắt buộc.";
  }
  if (msgLower.includes("network error") || msgLower.includes("failed to fetch")) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền internet.";
  }
  if (msgLower.includes("internal server error")) {
    return "Lỗi hệ thống máy chủ. Vui lòng thử lại sau.";
  }
  if (msgLower.includes("already exists") || msgLower.includes("duplicate")) {
    return "Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.";
  }
  if (msgLower.includes("validation failed") || msgLower.includes("invalid") || msgLower.includes("must be") || msgLower.includes("should be")) {
    return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
  }
  if (msgLower.includes("expired") || msgLower.includes("timeout")) {
    return "Phiên làm việc đã hết hạn hoặc quá hạn kết nối. Vui lòng thử lại.";
  }
  if (msgLower.includes("too large") || msgLower.includes("exceeds")) {
    return "Dữ liệu tải lên quá lớn. Vui lòng giảm kích thước.";
  }
  if (msgLower.includes("not enough permission") || msgLower.includes("permission denied")) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  // Fallback to provided Vietnamese message if rawMessage is purely English or unrecognized
  return fallbackMessage;
}
