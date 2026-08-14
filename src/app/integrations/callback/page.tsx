"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ExternalLink, LogOut } from "lucide-react";
import { consumeIntegrationCallback } from "@/features/integrations/api/personalIntegrationApi";
import { toast } from "sonner";

function IntegrationCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Đang hoàn tất kết nối tích hợp...");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const resultId = searchParams.get("resultId");

    if (!resultId) {
      requestAnimationFrame(() => setMessage("Thiếu mã kết quả callback (resultId)."));
      requestAnimationFrame(() => setErrorDetails("Yêu cầu không hợp lệ hoặc đã bị lỗi."));
      return;
    }

    hasRun.current = true;

    // Clear resultId from address bar immediately
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    consumeIntegrationCallback(resultId)
      .then((result: { success?: boolean; flow?: string; message?: string; jiraAuthorization?: unknown; gitHubInstallation?: unknown; identityConnection?: unknown; }) => {
        if (!result || typeof result !== "object") {
          throw new Error("Dữ liệu trả về không đúng định dạng.");
        }

        console.log("OAuth Callback Result Payload:", result);

        // Check if response is wrapped in the unified OAuth response envelope
        let actualResult = result;
        if ("success" in result && "flow" in result) {
          if (result.success === false) {
            throw new Error(result.message || "Lỗi xử lý liên kết từ phía máy chủ.");
          }
          if (result.jiraAuthorization) {
            actualResult = result.jiraAuthorization;
          } else if (result.gitHubInstallation) {
            actualResult = result.gitHubInstallation;
          } else if (result.identityConnection) {
            actualResult = result.identityConnection;
          }
        }

        // Store the extracted inner payload to sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("integration_callback_result", JSON.stringify(actualResult));
        }

        // Handle integration result type based on the extracted payload
        if ("sites" in actualResult && "projectId" in actualResult) {
          // Project Jira
          toast.success("Xác thực Jira thành công! Vui lòng chọn Site.");
          router.replace("/integrations/jira/select-site");
        } else if (
          "installationId" in actualResult &&
          "repositories" in actualResult &&
          "projectId" in actualResult
        ) {
          // Project GitHub
          toast.success("Xác thực GitHub thành công! Vui lòng chọn Repositories.");
          router.replace("/integrations/github/select-repositories");
        } else if ("provider" in actualResult && "status" in actualResult) {
          // Personal Jira/GitHub
          toast.success(`Kết nối tài khoản ${actualResult.provider} cá nhân thành công!`);
          const redirectBack = typeof window !== "undefined" ? sessionStorage.getItem("integration_redirect_back") : null;
          router.replace(redirectBack || "/student/settings");
        } else {
          throw new Error("Phản hồi không xác định từ máy chủ.");
        }
      })
      .catch((error: { status?: number; message?: string }) => {
        console.error("Callback error", error);
        if (error?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          router.replace("/auth/login");
          return;
        }

        if (error?.status === 403) {
          setMessage("Quyền truy cập không hợp lệ.");
          setErrorDetails("Phiên đăng nhập hoặc mã CSRF không hợp lệ. Vui lòng thử lại.");
          return;
        }

        const errMsg = error?.message || "";
        if (
          errMsg.toLowerCase().includes("already linked") ||
          errMsg.toLowerCase().includes("provider identity")
        ) {
          setMessage("Tài khoản đã được liên kết bởi Sinh viên khác");
          setErrorDetails(
            "Tài khoản GitHub/Jira này hiện đang được liên kết với một sinh viên khác trong hệ thống. Trình duyệt của bạn đang nhớ phiên đăng nhập cũ."
          );
          return;
        }

        setMessage("Lỗi kết nối tích hợp.");
        setErrorDetails(
          errMsg || "Kết quả kết nối đã hết hạn, đã được sử dụng hoặc không hợp lệ."
        );
      });
  }, [router, searchParams]);

  const isAlreadyLinkedError =
    errorDetails?.toLowerCase().includes("liên kết với một sinh viên khác") ||
    errorDetails?.toLowerCase().includes("already linked");

  const handleGoBack = () => {
    const redirectBack = typeof window !== "undefined" ? sessionStorage.getItem("integration_redirect_back") : null;
    router.replace(redirectBack || "/student/settings");
  };

  return (
    <div className="relative z-10 max-w-md w-full rounded-[2rem] border border-border/50 bg-card/45 backdrop-blur-xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
      {errorDetails ? (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 p-3">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">{message}</h2>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{errorDetails}</p>
          </div>

          {isAlreadyLinkedError && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2 text-xs">
              <p className="font-bold text-amber-600 dark:text-amber-400">💡 Hướng dẫn khắc phục:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground font-medium">
                <li>Bấm nút <strong>Đăng xuất GitHub</strong> bên dưới để xóa session cũ.</li>
                <li>Đăng nhập lại bằng tài khoản GitHub <strong>cá nhân của bạn</strong>.</li>
                <li>Thực hiện lại thao tác liên kết.</li>
              </ol>
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            {isAlreadyLinkedError && (
              <a
                href="https://github.com/logout"
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <LogOut size={16} />
                <span>Đăng xuất GitHub (Mở tab mới)</span>
                <ExternalLink size={14} className="opacity-80" />
              </a>
            )}

            <button
              onClick={handleGoBack}
              className={`w-full h-11 rounded-xl font-bold transition-all shadow-sm active:scale-[0.98] ${
                isAlreadyLinkedError
                  ? "bg-muted hover:bg-muted/80 text-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              Quay lại Cài đặt
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-4">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">{message}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Vui lòng không đóng trình duyệt hoặc tải lại trang.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegrationCallbackPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="relative z-10 max-w-md w-full rounded-[2rem] border border-border/50 bg-card/45 backdrop-blur-xl shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide animate-pulse">Đang tải...</p>
        </div>
      }>
        <IntegrationCallbackContent />
      </Suspense>
    </div>
  );
}
